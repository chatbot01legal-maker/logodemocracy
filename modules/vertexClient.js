const { VertexAI } = require("@google-cloud/vertexai");

let vertex = null;

function getVertex() {
  if (vertex) return vertex;

  // Corrección determinista: intercepta el cruce de variables de entorno
  const rawLocation = process.env.GOOGLE_CLOUD_LOCATION;
  const project = process.env.GOOGLE_CLOUD_PROJECT || 
                 (rawLocation === "logodemocracy-ai-2026" ? "logodemocracy-ai-2026" : "logodemocracy-ai-2026");
  const location = (rawLocation === "logodemocracy-ai-2026") ? "us-central1" : (rawLocation || "us-central1");

let credentials = null;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {

  const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  credentials = JSON.parse(
    Buffer.from(b64, 'base64').toString('utf8')
  );

}
else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {

  const fs = require('fs');

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  console.log(
    `[SOPHIA-VERTEX] Cargando credencial desde archivo: ${keyPath}`
  );

  credentials = JSON.parse(
    fs.readFileSync(keyPath, 'utf8')
  );
}


const config = {
  project,
  location
};

if (credentials) {
  config.googleAuthOptions = {
    credentials
  };
}

  vertex = new VertexAI(config);
  return vertex;
}

/**
 * Llama a Gemini vía Vertex AI
 * @param {string} prompt
 * @param {string} model
 * @param {number} timeoutMs
 */
async function askVertex(prompt, model = "gemini-2.5-flash", timeoutMs = 50000) {
  console.log(`[SOPHIA-VERTEX] Preparando llamada a Vertex (${model}) con timeout de ${timeoutMs}ms`);

  const client = getVertex();
  const gm = client.getGenerativeModel({ model });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Vertex AI Timeout excedido (${timeoutMs}ms)`)),
      timeoutMs
    )
  );

  const requestPromise = gm.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  let response;
  try {
    response = await Promise.race([requestPromise, timeoutPromise]);
    console.log("🔍 RAW RESPONSE VERTEX:");
console.dir(response, { depth: 10 });
  } catch (err) {
    console.error(`[SOPHIA-VERTEX] Error en llamada:`, err.message);
    throw err;
  }
const candidates =
  response?.response?.candidates ||
  response?.candidates ||
  response?.[0]?.candidates;

if (!candidates || !candidates.length) {
  throw new Error("[SOPHIA-VERTEX] No hay candidates en la respuesta");
}

const parts = candidates[0]?.content?.parts;

if (!parts || !parts.length) {
  throw new Error("[SOPHIA-VERTEX] No hay parts en la respuesta");
}

const textResponse =
  parts.find(p => typeof p.text === "string")?.text;

if (!textResponse) {
  throw new Error("[SOPHIA-VERTEX] No se encontró texto en parts");
}

console.log(`[SOPHIA-VERTEX] Texto extraído OK`);
return textResponse;
  
}

/**
 * Llama a Gemini CON BÚSQUEDA REAL DE GOOGLE activada (grounding).
 * A diferencia de askVertex(), esta función le permite a Gemini buscar
 * información actual en Google antes de responder, y devuelve también
 * las fuentes reales que encontró — no solo el texto.
 *
 * Usada por modules/evidencePipeline.js para verificar afirmaciones
 * contra el mundo real, en vez de contra el conocimiento entrenado de Gemini.
 *
 * @param {string} prompt
 * @param {string} model
 * @param {number} timeoutMs
 * @returns {Promise<{text: string, sources: Array<{uri: string, title: string}>}>}
 */
async function askVertexWithSearch(prompt, model = "gemini-2.5-flash", timeoutMs = 50000) {
  console.log(`[SOPHIA-VERTEX] Preparando llamada CON BÚSQUEDA REAL a Vertex (${model}) con timeout de ${timeoutMs}ms`);

  const client = getVertex();

  // La búsqueda con Google requiere el namespace "preview" del SDK.
  const gm = client.getGenerativeModel({ model });

  const googleSearchTool = {
    googleSearch: {}
  };

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Vertex AI Timeout excedido (${timeoutMs}ms)`)),
      timeoutMs
    )
  );

  const requestPromise = gm.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    tools: [googleSearchTool]
  });

  let response;
  try {
    response = await Promise.race([requestPromise, timeoutPromise]);
    console.log("🔍 RAW RESPONSE VERTEX (con búsqueda):");
    console.dir(response, { depth: 10 });
  } catch (err) {
    console.error(`[SOPHIA-VERTEX] Error en llamada con búsqueda:`, err.message);
    console.error(`[SOPHIA-VERTEX] Si el error persiste mencionando "tool" o "google_search" no reconocido, es señal de que hay que migrar a la librería nueva @google/genai — avisar para revisar.`);
    throw err;
  }

  const candidates =
    response?.response?.candidates ||
    response?.candidates ||
    response?.[0]?.candidates;

  if (!candidates || !candidates.length) {
    throw new Error("[SOPHIA-VERTEX] No hay candidates en la respuesta (búsqueda)");
  }

  const candidate = candidates[0];
  const parts = candidate?.content?.parts;

  if (!parts || !parts.length) {
    throw new Error("[SOPHIA-VERTEX] No hay parts en la respuesta (búsqueda)");
  }

  const textResponse = parts.find(p => typeof p.text === "string")?.text;

  if (!textResponse) {
    throw new Error("[SOPHIA-VERTEX] No se encontró texto en parts (búsqueda)");
  }

  // Extraer las fuentes reales que Vertex usó para fundamentar la respuesta.
  // Si Google cambia la forma de este objeto, esto puede quedar vacío sin
  // romper el resto — por eso todo el acceso es defensivo (?.).
  const groundingMetadata = candidate?.groundingMetadata;
  const sources = [];
  if (groundingMetadata?.groundingChunks) {
    groundingMetadata.groundingChunks.forEach(chunk => {
      if (chunk?.web?.uri) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || chunk.web.uri
        });
      }
    });
  }

  console.log(`[SOPHIA-VERTEX] Texto extraído OK (con búsqueda). Fuentes reales encontradas: ${sources.length}`);
  return { text: textResponse, sources };
}

module.exports = { getVertex, askVertex, askVertexWithSearch };
