const { askVertex } = require('./vertexService');

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

module.exports = { getPhilosopherConsultation };
