const { askVertex } = require('./vertexClient');

async function getPhilosopherConsultation(text, sophiaContext = null) {
  console.log('[REY-FILOSOFO] Iniciando getPhilosopherConsultation');
  
  if (!text || typeof text !== 'string') {
    throw new Error("El texto de la consulta es nulo o inválido.");
  }
  if (text.trim().length < 5) {
    throw new Error("Consulta demasiado corta.");
  }

  let llmResponse = null;
  let warning = null;

  try {
    console.log('[REY-FILOSOFO-LLM] Solicitando orientación deliberativa a Vertex AI');
    
    const prompt = `Actúa como el Rey Filósofo, un tutor de ética y deliberación pública.
Contexto del análisis previo (SOPHIA): ${sophiaContext ? JSON.stringify(sophiaContext) : 'Ninguno'}
Consulta del usuario: ${text}
Por favor, responde con orientación constructiva para mejorar la calidad retórica y lógica de su argumento.`;

llmResponse = await askVertex(prompt);
console.log("──────── LLM RESPONSE ────────");
console.dir(llmResponse, { depth: 5 });
console.log("──────────────────────────────");
  } catch (error) {
    console.warn(`[REY-FILOSOFO-LLM] Error en conexión: ${error.message}`);
    warning = "llm unavailable";
  }

  return {
    advice: llmResponse,
    warning,
    timestamp: new Date().toISOString(),
    engine: "REY-FILOSOFO-VERTEX"
  };
}

/**
 * Wrapper de compatibilidad para la ruta /api/reyfilosofo/chat
 * Soporta desestructuración directa de argumentos o recepción del objeto del body.
 */
async function getTutorReply(param1, param2 = null) {
  console.log('[REY-FILOSOFO] Mapeando llamada entrante en getTutorReply');
  let text = param1;
  let sophiaContext = param2;

  // Si la ruta pasa un objeto de configuración o el req.body directamente
  if (param1 && typeof param1 === 'object') {
    text = param1.text || param1.message || param1.prompt;
    sophiaContext = param1.sophiaContext || null;
  }

  return await getPhilosopherConsultation(text, sophiaContext);
}

module.exports = { 
  getPhilosopherConsultation,
  getTutorReply 
};
