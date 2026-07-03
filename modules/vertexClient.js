const { VertexAI } = require("@google-cloud/vertexai");

let vertex = null;

function getVertex() {
  if (vertex) return vertex;

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

  // Lógica para cargar credenciales desde variable de entorno (Base64)
  let credentials = null;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    credentials = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  }

  console.log(`[SOPHIA-VERTEX] Inicializando Vertex (${project}) en ${location}`);

  // Pasamos las credenciales explícitamente si existen
  const config = { project, location };
  if (credentials) {
    config.googleAuthOptions = { credentials };
  }

  vertex = new VertexAI(config);
  return vertex;
}

// ... resto de tu código igual


module.exports = { getVertex };

/**
 * Llama a Gemini vía Vertex AI
 * @param {string} prompt
 * @param {string} model
 * @param {number} timeoutMs
 */
async function askVertex(prompt, model = "gemini-2.5-flash", timeoutMs = 50000) {
  console.log(
    `[SOPHIA-VERTEX] Preparando llamada a Vertex (${model}) con timeout de ${timeoutMs}ms`
  );

  const client = getVertex();
  const gm = client.getGenerativeModel({ model });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Vertex AI Timeout excedido (${timeoutMs}ms)`)),
      timeoutMs
    )
  );

  const requestPromise = gm.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  let response;

  try {
    response = await Promise.race([requestPromise, timeoutPromise]);
  } catch (err) {
    console.error(`[SOPHIA-VERTEX] Error en llamada:`, err.message);
    throw err;
  }

  // -------------------------------
  // VALIDACIÓN ROBUSTA DE RESPUESTA
  // -------------------------------
  const candidate = response?.response?.candidates?.[0];

  if (!candidate) {
    throw new Error(
      "[SOPHIA-VERTEX] Respuesta inválida: no hay candidates"
    );
  }

  const textResponse = candidate?.content?.parts?.find(
    (p) => p.text
  )?.text;

  if (!textResponse) {
    throw new Error(
      "[SOPHIA-VERTEX] El contenido de texto está ausente en la respuesta"
    );
  }

  console.log(`[SOPHIA-VERTEX] Respuesta recibida exitosamente`);

  return textResponse;
}

module.exports = { askVertex };
