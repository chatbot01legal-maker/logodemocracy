const { VertexAI } = require("@google-cloud/vertexai");

let vertex = null;

function getVertex() {
  if (vertex) return vertex;
  vertex = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: "southamerica-west1"
  });
  return vertex;
}

// Timeout configurable integrado, por defecto 30 segundos
async function askVertex(prompt, model = "gemini-2.5-flash", timeoutMs = 30000) {
  console.log(`[SOPHIA-VERTEX] Preparando llamada a Vertex (${model}) con timeout de ${timeoutMs}ms`);
  const client = getVertex();
  const gm = client.getGenerativeModel({ model });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Vertex AI Timeout excedido (${timeoutMs}ms)`)), timeoutMs)
  );

  const requestPromise = gm.generateContent(prompt);

  const response = await Promise.race([requestPromise, timeoutPromise]);
  
  // Validación estricta de la estructura de respuesta de Vertex
  if (!response || !response.response || !response.response.candidates || response.response.candidates.length === 0) {
     throw new Error("Estructura de respuesta de Vertex inválida o vacía");
  }
  
  const textResponse = response.response.candidates[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
     throw new Error("El contenido del texto en la respuesta de Vertex está ausente");
  }

  console.log(`[SOPHIA-VERTEX] Respuesta recibida exitosamente`);
  return textResponse;
}

module.exports = { askVertex };
