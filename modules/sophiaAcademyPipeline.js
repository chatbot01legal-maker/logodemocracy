// modules/sophiaAcademyPipeline.js
//
// Orquestador de SOPHIA Academia v1. Consumidor nuevo de SOPHIA v4.0 —
// no modifica ninguno de los módulos que reutiliza, solo los invoca con
// sus contratos actuales, acotando cuánta información se les pasa y
// cuántas veces se llaman.
//
// generateAcademyAnalysis() genera y persiste. getAcademyAnalysis() solo
// lee. Son funciones separadas a propósito: el endpoint read-only importa
// únicamente la segunda, así que no hay ningún camino de código por el
// que un GET pueda disparar Gemini.

const SophiaEngineV4 = require("../assets/js/sophiaEngineV4");
const { extractClaims } = require("./claimExtractor");
const { normalizeClaims } = require("./claimNormalizer");
const { verifyClaims } = require("./evidencePipeline");
const { procesarPenalizaciones } = require("./semanticReview");
const {
  selectAcademySemanticEvidence,
  selectAcademyClaims,
  MAX_ACADEMY_SEMANTIC_REVIEWS,
  MAX_ACADEMY_FACTUAL_CHECKS
} = require("./sophiaAcademySelector");
const { generateAcademyGeminiReview } = require("./sophiaAcademyGeminiReview");
const {
  computeContentHash,
  getCachedAcademyResult,
  getLatestAcademyResultByDocId,
  saveAcademyResult
} = require("./sophiaAcademyCache");

const ACADEMY_PROTOCOL_VERSION = "1.0";

function budgetVacio() {
  return {
    claim_extraction: 0,
    semantic_review: 0,
    factual_verification: 0,
    gemini_review: 0
  };
}

function confiabilidadFactualVacia() {
  return {
    claims_verificados: [],
    claims_refutados: [],
    claims_en_conflicto: [],
    claims_evidencia_insuficiente: []
  };
}

/**
 * Genera (o recupera de caché, si nada cambió) el análisis de Academia
 * para un documento. Es la ÚNICA función del pipeline que puede llamar a
 * Gemini. Nunca la invoca el endpoint de consulta — solo el proceso de
 * auditoría (auditAcademyDocuments.js) o un disparador administrativo
 * equivalente.
 *
 * Presupuesto máximo real por documento:
 *   1 x claim_extraction (siempre, si hay texto — extractClaims trunca
 *     internamente a 8000 caracteres; no se toca ese contrato)
 *   <=5 x semantic_review (0 si no hay evidencias elegibles)
 *   <=5 x factual_verification (0 si no hay claims seleccionados)
 *   1 x gemini_review (interpretación final de Academia)
 * Máximo teórico: 12 llamadas de IA. Si alguna etapa no tiene elementos,
 * esa etapa hace 0 llamadas — nunca se llama "para rellenar".
 *
 * @param {Object} params
 * @param {string} params.docId
 * @param {string} params.text - documento COMPLETO, sin truncar
 * @returns {Promise<Object>} resultado persistido (status: complete|partial|failed)
 */
async function generateAcademyAnalysis({ docId, text }) {
  if (!docId) throw new Error("generateAcademyAnalysis requiere docId");
  if (!text || text.trim().length === 0) throw new Error("generateAcademyAnalysis requiere text no vacío");

  const content_hash = computeContentHash(text);
  const sophia_engine_version = SophiaEngineV4.version || "4.0";

  // ─── Cache hit exacto: nada que hacer, ni siquiera tocar el motor ───
  const cached = await getCachedAcademyResult({
    docId,
    content_hash,
    academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
    sophia_engine_version
  });
  if (cached) {
    return cached.result;
  }

  const evaluated_at = new Date().toISOString();
  const etapas_fallidas = [];
  const budget_used = budgetVacio();

  // ─── 1. Motor determinista (obligatorio, documento completo) ───────
  let localResult = null;
  try {
    localResult = SophiaEngineV4.evaluate(text);
  } catch (err) {
    console.error("[SOPHIA-ACADEMY] Motor determinista falló:", err.message);
    localResult = null;
  }

  if (!localResult) {
    const failedResult = {
      docId,
      content_hash,
      academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
      sophia_engine_version,
      evaluated_at,
      status: "failed",
      etapas_fallidas: ["motor_determinista"],
      local: null,
      semantic_review: [],
      confiabilidad_factual: null,
      gemini_review: null,
      budget_used
    };
    await saveAcademyResult({
      docId, content_hash,
      academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
      sophia_engine_version,
      result: failedResult
    });
    return failedResult;
  }

  // ─── 2. Selección + Semantic Review (<=5) ───────────────────────────
  let semanticReview = [];
  try {
    const evidenciasSeleccionadas = selectAcademySemanticEvidence(
      localResult.evidencias || [],
      MAX_ACADEMY_SEMANTIC_REVIEWS
    );
    if (evidenciasSeleccionadas.length > 0) {
      semanticReview = await procesarPenalizaciones(evidenciasSeleccionadas, text);
      budget_used.semantic_review = evidenciasSeleccionadas.length;
    }
    // Si evidenciasSeleccionadas.length === 0, semantic_review queda en 0:
    // no se llama a procesarPenalizaciones "para rellenar".
  } catch (err) {
    console.error("[SOPHIA-ACADEMY] Semantic Review falló:", err.message);
    etapas_fallidas.push("semantic_review");
  }

  // ─── 3. Claim extraction (1) + normalización (0) + selección (<=5) + Fact Checking (<=5) ───
  let confiabilidadFactual = null;
  try {
    const claimsExtraidos = await extractClaims(text);
    budget_used.claim_extraction = 1;

    const claimsNormalizados = await normalizeClaims(claimsExtraidos);
    const claimsSeleccionados = selectAcademyClaims(claimsNormalizados, MAX_ACADEMY_FACTUAL_CHECKS);

    if (claimsSeleccionados.length > 0) {
      confiabilidadFactual = await verifyClaims(claimsSeleccionados);
      budget_used.factual_verification = claimsSeleccionados.length;
    } else {
      confiabilidadFactual = confiabilidadFactualVacia();
      // 0 claims -> 0 llamadas de Fact Checking, tal como pide la regla 7.
    }
  } catch (err) {
    console.error("[SOPHIA-ACADEMY] Pipeline factual falló:", err.message);
    etapas_fallidas.push("factual_pipeline");
    confiabilidadFactual = null;
  }

  // ─── 4. Interpretación final de Academia (1) ────────────────────────
  let geminiReview = null;
  try {
    geminiReview = await generateAcademyGeminiReview({
      naturaleza_documental: localResult.naturaleza_documental,
      riesgo: localResult.riesgo,
      fases: localResult.fases,
      semanticReview,
      confiabilidadFactual,
      rutasEvaluadas: localResult.rutas_evaluadas
    });
    budget_used.gemini_review = 1;
  } catch (err) {
    console.error("[SOPHIA-ACADEMY] Gemini Review de Academia falló:", err.message);
    etapas_fallidas.push("gemini_review");
  }

  const status = etapas_fallidas.length === 0 ? "complete" : "partial";

  const result = {
    docId,
    content_hash,
    academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
    sophia_engine_version,
    evaluated_at,
    status,
    etapas_fallidas,
    local: localResult,
    semantic_review: semanticReview,
    confiabilidad_factual: confiabilidadFactual,
    gemini_review: geminiReview,
    budget_used
  };

  await saveAcademyResult({
    docId, content_hash,
    academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
    sophia_engine_version,
    result
  });

  return result;
}

/**
 * Consulta READ-ONLY. Nunca genera, nunca llama a Gemini, nunca escribe
 * en la base de datos. Si no hay nada guardado para ese docId, devuelve
 * null (el endpoint HTTP traduce eso a 404).
 *
 * @param {string} docId
 * @returns {Promise<Object|null>} el documento de caché completo (con .result adentro), o null
 */
async function getAcademyAnalysis(docId) {
  if (!docId) return null;
  return await getLatestAcademyResultByDocId(docId);
}

module.exports = {
  generateAcademyAnalysis,
  getAcademyAnalysis,
  ACADEMY_PROTOCOL_VERSION
};
