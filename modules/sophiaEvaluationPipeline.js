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
  console.log(`✅ Evaluación local completada. Evidencias: ${localResult.evidencias?.length || 0}`);

  // ─── PIPELINE STEPS 2 & 3: Ejecución en Paralelo ────────
  console.log("🔍 PIPELINE STEPS 2 & 3: Iniciando Revisión Semántica y Auditoría Factual en paralelo...");
  
  const semanticTask = (async () => {
    let evidenciasOriginales = localResult.evidencias || [];
    const activacionesRutaInf = [];

    // Extraer activaciones RUTA-INF para Semantic Review sin modificar localResult
    if (localResult.fases && Array.isArray(localResult.fases)) {
      localResult.fases.forEach(fase => {
        if (fase.infracciones && Array.isArray(fase.infracciones)) {
          fase.infracciones.forEach(inf => {
            if (inf.saltos && Array.isArray(inf.saltos) && inf.saltos.length > 0) {
              inf.saltos.forEach(salto => {
                activacionesRutaInf.push({
                  atomo: null,
                  criterio: "RUTA-INF - Ruta Inferencial (Dato→Interpretación→Causalidad→Generalización→Propuesta)",
                  fragmento: text ? text.substring(0, 1500) : "Fragmento no disponible",
                  perfil: localResult.perfil_documental || localResult.perfil || "No especificado",
                  fase: "fase2",
                  indicador_activado: typeof salto === 'string' ? salto : JSON.stringify(salto),
                  severidad_base: inf.penalizacion || inf.puntaje || inf.severidad_base || 0
                });
              });
            }
          });
        }
      });
    }

    const totalActivaciones = [...evidenciasOriginales, ...activacionesRutaInf];

    console.log(`🔍 Semantic Review: evidencias originales: ${evidenciasOriginales.length}`);
    console.log(`🔍 Semantic Review: activaciones RUTA-INF agregadas: ${activacionesRutaInf.length}`);
    console.log(`🔍 Semantic Review: total de activaciones: ${totalActivaciones.length}`);

    if (totalActivaciones.length > 0) {
      try {
        const review = await procesarPenalizaciones(totalActivaciones, text);
        const falsosPositivos = review.filter(e => e.revision_semantica?.falso_positivo === true);
        console.log(`✅ Revisión Semántica completada. ${falsosPositivos.length} falsos positivos detectados.`);
        return review;
      } catch (semanticError) {
        console.error("❌ Error en Revisión Semántica:", semanticError);
        return [];
      }
    } else {
      console.log("⏩ No hay penalizaciones para revisar.");
      return [];
    }
  })();

  const factualTask = (async () => {
    try {
      const rawClaims = await extractClaims(text);
      const normalizedClaims = await normalizeClaims(rawClaims);
      const verificables = normalizedClaims.filter(c => c.verificable);
      const noAplicables = normalizedClaims.filter(c => !c.verificable);
      
      const confiabilidad = await verifyClaims(verificables);
      confiabilidad.claims_no_aplicables = noAplicables;
      console.log(`✅ Verificación factual completada. Verificados: ${confiabilidad.claims_verificados?.length || 0}`);
      return confiabilidad;
    } catch (factualError) {
      console.error("❌ Error en verificación factual:", factualError);
      return {
        error: "La verificación factual no está disponible en este momento.",
        claims_verificados: [],
        claims_refutados: [],
        claims_en_conflicto: [],
        claims_evidencia_insuficiente: [],
        claims_no_aplicables: []
      };
    }
  })();

  // Esperamos que ambas tareas concurrentes terminen
  const [semanticReview, confiabilidadFactual] = await Promise.all([semanticTask, factualTask]);

  // ─── PIPELINE STEP 4: Gemini Review (Interpretación) ────
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
    
    local: localResult,
    semantic_review: semanticReview,
    confiabilidad_factual: confiabilidadFactual,
    gemini_review: geminiReview,
    
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
