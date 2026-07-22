// modules/sophiaEvaluationPipeline.js
// Pipeline de evaluación SOPHIA v4.0
// Coordina la secuencia cognitiva: Sophia Engine → Semantic Review → Fact Checker → Gemini Review

const SophiaEngineV4 = require("../assets/js/sophiaEngineV4");
const { extractClaims } = require("./claimExtractor");
const { normalizeClaims } = require("./claimNormalizer");
const { verifyClaims } = require("./evidencePipeline");
const { procesarPenalizaciones } = require("./semanticReview");
const { generateGeminiReview } = require("./sophiaGeminiReview");

// ─── Registro de Versiones Cognitivas ─────────────────────
const VERSIONS = {
  protocol: "4.0",
  engine: SophiaEngineV4.version || "4.0",
  semantic_review: "2.0",
  fact_checker: "1.0",
  gemini_review: "1.0"
};

const evaluateText = SophiaEngineV4.evaluate.bind(SophiaEngineV4);
console.log(`🧠 Sophia Engine cargado (v${VERSIONS.engine})`);

/**
 * Evalúa un documento siguiendo el pipeline cognitivo completo de SOPHIA.
 *
 * @param {Object} params - Parámetros de evaluación
 * @param {string} params.text - Texto completo del documento
 * @returns {Object} Informe final de evaluación estructurado por capas
 */
async function evaluate({ text }) {
  console.log("📊 Iniciando Pipeline Cognitivo");
  console.log(`📝 Texto recibido (${text?.length || 0} caracteres)`);

  if (!text || text.trim().length === 0) {
    console.log("❌ Texto vacío");
    throw new Error("Texto requerido");
  }

  // ─── PIPELINE STEP 1: Sophia Engine (Determinista) ──────
  console.log("🔍 PIPELINE STEP 1: Ejecutando evaluación local (Sophia Engine)...");
  const localResult = evaluateText(text);
  if (!localResult) {
    console.log("❌ Error en evaluación local");
    throw new Error("Error al evaluar el texto");
  }
  console.log(`✅ Evaluación local completada. IRD: ${localResult.IRD_global}, evidencias: ${localResult.evidencias?.length || 0}`);

  // ─── PIPELINE STEP 2: Semantic Review (Contexto) ────────
  console.log("🔍 PIPELINE STEP 2: Revisión Semántica de penalizaciones...");
  let semanticReview = [];
  if (localResult.evidencias && localResult.evidencias.length > 0) {
    try {
      semanticReview = await procesarPenalizaciones(localResult.evidencias, text);
      const falsosPositivos = semanticReview.filter(e => e.revision_semantica?.falso_positivo === true);
      console.log(`✅ Revisión Semántica completada. ${falsosPositivos.length} falsos positivos detectados.`);
    } catch (semanticError) {
      console.error("❌ Error en Revisión Semántica:", semanticError);
    }
  } else {
    console.log("⏩ No hay penalizaciones para revisar.");
  }

  // ─── PIPELINE STEP 3: Fact Checker (Factualidad) ────────
  console.log("🔎 PIPELINE STEP 3: Auditoría Factual...");
  let confiabilidadFactual = null;
  try {
    const rawClaims = await extractClaims(text);
    const normalizedClaims = await normalizeClaims(rawClaims);
    const verificables = normalizedClaims.filter(c => c.verificable);
    const noAplicables = normalizedClaims.filter(c => !c.verificable);
    
    confiabilidadFactual = await verifyClaims(verificables);
    confiabilidadFactual.claims_no_aplicables = noAplicables;
    console.log(`✅ Verificación completada. Verificados: ${confiabilidadFactual.claims_verificados?.length || 0}`);
  } catch (factualError) {
    console.error("❌ Error en verificación factual:", factualError);
    confiabilidadFactual = {
      error: "La verificación factual no está disponible en este momento.",
      claims_verificados: [],
      claims_refutados: [],
      claims_en_conflicto: [],
      claims_evidencia_insuficiente: [],
      claims_no_aplicables: []
    };
  }

  // ─── PIPELINE STEP 4: Gemini Review (Interpretación) ────
  // Ejecución garantizada: Siempre evalúa en Capa 4 para asegurar auditoría completa.
  console.log("🤖 PIPELINE STEP 4: Revisión de Gemini...");
  let geminiReview = null;
  try {
    geminiReview = await generateGeminiReview(text, localResult, confiabilidadFactual);
    console.log("✅ Revisión de Gemini completada");
  } catch (llmError) {
    console.error("❌ Error en Gemini review:", llmError);
    geminiReview = { error: "Revisión global no disponible" };
  }

  // ─── PIPELINE STEP 5: Ensamblar informe final ───────────
  console.log("📊 PIPELINE STEP 5: Ensamblando informe final...");
  const finalReport = {
    protocol_version: VERSIONS.protocol,
    evaluated_at: new Date().toISOString(),
    
    // Capas Cognitivas Independientes
    local: localResult,
    semantic_review: semanticReview,
    confiabilidad_factual: confiabilidadFactual,
    gemini_review: geminiReview,
    
    // Trazabilidad y Metadatos
    metadata: {
      module_versions: VERSIONS,
      evidence_density: localResult.evidencias
        ? localResult.evidencias.length / (text.split(/\s+/).length || 1)
        : 0
    }
  };
  
  console.log("🏁 PIPELINE COMPLETE");
  return finalReport;
}

module.exports = { evaluate };
