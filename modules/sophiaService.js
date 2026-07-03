const { evaluateText, getLLMReview } = require('./sophiaCore');

async function analyzeDocument(text) {
  console.log('[SOPHIA] Iniciando analyzeDocument');
  
  if (!text || typeof text !== 'string') {
    throw new Error("El texto es nulo o inválido.");
  }
  if (text.trim().length < 10) {
    throw new Error("Texto demasiado corto (mínimo 10 caracteres).");
  }
  if (text.length > 100000) {
    throw new Error("Texto demasiado largo (máximo 100000 caracteres).");
  }

  // 1. Análisis Determinista Local (Cerebro Core)
  console.log('[SOPHIA-LOCAL] Ejecutando análisis simbólico');
  const local = evaluateText(text);

  let llm = null;
  let warning = null;

  // 2. Análisis LLM con Fallback Tolerante a Fallos
  try {
    console.log('[SOPHIA-LLM] Solicitando revisión deliberativa');
    llm = await getLLMReview(text, local);
  } catch (error) {
    console.warn(`[SOPHIA-LLM] Error en revisión: ${error.message}`);
    warning = "llm unavailable";
  }

  // Extracción dinámica de la versión del protocolo
  const protocolVersion = local.protocol_version || "3.0";

  // 3. Fusión y Respuesta Orquestada
  return {
    local,
    llm,
    warning,
    timestamp: new Date().toISOString(),
    protocol_version: protocolVersion,
    engine: "SOPHIA-HYBRID"
  };
}

module.exports = { analyzeDocument };
