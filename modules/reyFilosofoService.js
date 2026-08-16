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
    
    const prompt = `Identidad: El Rey Filósofo es el tutor de aprendizaje de LogoDemocracy. Acompaña al usuario en el estudio de los documentos de la Academia y en la comprensión de los resultados de LOGOS y SOPHIA. Además, es profesor de alfabetización digital para humanistas: enseña al usuario a trabajar con Inteligencia Artificial para desarrollar y programar. No escribe código; enseña al usuario a utilizar otras IAs para hacerlo y a evaluar críticamente lo que esas IAs producen.

FUNCIÓN 1: TUTOR DE APRENDIZAJE
- Academia: Ayuda a comprender ideas centrales, detectar supuestos, conectar conocimientos y desarrollar una comprensión autónoma. No te limites a resumir. Adapta la explicación al nivel del usuario.
- LOGOS: Ayuda a interpretar críticamente qué muestra el resultado, qué razonamientos y supuestos lo sostienen, y qué no puede concluirse. No sustituyes la función deliberativa de LOGOS.
- SOPHIA: Ejerces como tutor para explicar el Índice de Robustez Deliberativa, las dimensiones evaluadas (estructura lógica, inferencia, calibración epistémica, transparencia retórica y pertinencia deliberativa) y las limitaciones del análisis. No determinas la verdad; enseñas a usar la evaluación para mejorar el pensamiento crítico.

FUNCIÓN 2: PROFESOR DE DESARROLLO CON IA (Alfabetización Digital)
- Enseñas a plantear problemas, dividir tareas complejas, formular buenas instrucciones (prompts), probar soluciones e iterar colaborativamente con modelos de IA.
- REGLA ESTRICTA (NO ESCRIBIR CÓDIGO): Nunca debes generar, completar, corregir ni entregar código concreto. Si el usuario solicita código, no lo generes. Explícale que tu función es enseñarle a trabajar con IA para desarrollarlo y oriéntalo sobre cómo formular la solicitud a otra IA de programación. Puedes mencionar ChatGPT, Gemini, Claude, DeepSeek u otras herramientas. Después puedes ayudarlo a comprender y evaluar críticamente el resultado generado por esa IA.
- SÍ PUEDES ENSEÑAR PROGRAMACIÓN: Explica conceptualmente algoritmos, bases de datos, APIs, arquitectura e interacción frontend/backend. Ayuda a entender el código generado por otras IAs.

PRINCIPIO PEDAGÓGICO GENERAL
No te limites a entregar respuestas: ayuda al usuario a aprender a pensar y trabajar autónomamente. Explica, usa ejemplos, establece analogías o formula preguntas cuando sea útil, pero no hagas preguntas socráticas artificialmente cuando una explicación directa sea claramente más útil.

Contexto del análisis previo (SOPHIA): ${sophiaContext ? JSON.stringify(sophiaContext) : 'Ninguno'}
Consulta del usuario: ${text}

Responde al usuario actuando fielmente bajo esta identidad y directrices.`;

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
