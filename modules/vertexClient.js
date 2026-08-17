const { VertexAI } = require("@google-cloud/vertexai");

let vertex = null;

function getVertex() {
  if (vertex) return vertex;

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
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const fs = require('fs');
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
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
 */
async function askVertex(prompt, model = "gemini-2.5-flash", timeoutMs = 50000, generationConfig = null, stage = "unknown") {
  console.log(`[SOPHIA-VERTEX] CALL stage=${stage} model=${model}`);

  const client = getVertex();
  const gm = client.getGenerativeModel({ model });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`Vertex AI Timeout excedido (${timeoutMs}ms)`)),
      timeoutMs
    )
  );

  const requestPayload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  if (generationConfig) {
    requestPayload.generationConfig = generationConfig;
  }

  // 1. Iniciar reloj inmediatamente antes de la llamada
  const startTime = Date.now();
  const requestPromise = gm.generateContent(requestPayload);

  try {
    const response = await Promise.race([requestPromise, timeoutPromise]);

    // 2. Validación y extracción integradas en el bloque try para manejo unificado de errores
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

    const textResponse = parts.find(p => typeof p.text === "string")?.text;

    if (!textResponse) {
      throw new Error("[SOPHIA-VERTEX] No se encontró texto en parts");
    }

    // 3. DEBUG TEMPORAL PARA METADATOS
    const hasRootUsage = !!response?.usageMetadata;
    const hasResponseUsage = !!response?.response?.usageMetadata;
    const has0Usage = !!response?.[0]?.usageMetadata;
    console.log(`[SOPHIA-VERTEX] DEBUG_USAGE stage=${stage} hasRoot=${hasRootUsage} hasResponse=${hasResponseUsage} has0=${has0Usage}`);

    // Telemetría compacta
    const rawData = response?.response || response?.[0] || response || {};
    const usage = rawData?.usageMetadata || {};
    
    const inTokens = usage.promptTokenCount ?? "n/a";
    const outTokens = usage.candidatesTokenCount ?? "n/a";
    const thoughtsTokens = usage.thoughtsTokenCount ?? "n/a";
    const totalTokens = usage.totalTokenCount ?? "n/a";
    const responseModel = rawData?.modelVersion || model;

    const duration = Date.now() - startTime;

    console.log(`[SOPHIA-VERTEX] Texto extraído OK stage=${stage}`);
    console.log(`[SOPHIA-VERTEX] OK stage=${stage} duration=${duration}ms`);
    console.log(`[SOPHIA-VERTEX] METRICS stage=${stage} input=${inTokens} output=${outTokens} thoughts=${thoughtsTokens} total=${totalTokens} model=${responseModel}`);

    return textResponse;
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[SOPHIA-VERTEX] ERROR stage=${stage} duration=${duration}ms message=${err.message}`);
    throw err;
  }
}

/**
 * Llama a Gemini CON BÚSQUEDA REAL DE GOOGLE activada (grounding).
 */
async function askVertexWithSearch(prompt, model = "gemini-2.5-flash", timeoutMs = 50000, stage = "unknown") {
  console.log(`[SOPHIA-VERTEX] CALL stage=${stage} model=${model}`);

  const client = getVertex();
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

  // 1. Iniciar reloj
  const startTime = Date.now();
  const requestPromise = gm.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    tools: [googleSearchTool]
  });

  try {
    const response = await Promise.race([requestPromise, timeoutPromise]);

    // 2. Extracción dentro del try
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

    // 3. DEBUG TEMPORAL PARA METADATOS
    const hasRootUsage = !!response?.usageMetadata;
    const hasResponseUsage = !!response?.response?.usageMetadata;
    const has0Usage = !!response?.[0]?.usageMetadata;
    console.log(`[SOPHIA-VERTEX] DEBUG_USAGE stage=${stage} hasRoot=${hasRootUsage} hasResponse=${hasResponseUsage} has0=${has0Usage}`);

    // Telemetría compacta
    const rawData = response?.response || response?.[0] || response || {};
    const usage = rawData?.usageMetadata || {};
    
    const inTokens = usage.promptTokenCount ?? "n/a";
    const outTokens = usage.candidatesTokenCount ?? "n/a";
    const thoughtsTokens = usage.thoughtsTokenCount ?? "n/a";
    const totalTokens = usage.totalTokenCount ?? "n/a";
    const responseModel = rawData?.modelVersion || model;

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

    const duration = Date.now() - startTime;

    console.log(`[SOPHIA-VERTEX] Texto extraído OK stage=${stage} fuentes_encontradas=${sources.length}`);
    console.log(`[SOPHIA-VERTEX] OK stage=${stage} duration=${duration}ms sources_found=${sources.length}`);
    console.log(`[SOPHIA-VERTEX] METRICS stage=${stage} input=${inTokens} output=${outTokens} thoughts=${thoughtsTokens} total=${totalTokens} model=${responseModel}`);

    return { text: textResponse, sources };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[SOPHIA-VERTEX] ERROR stage=${stage} duration=${duration}ms message=${err.message}`);
    throw err;
  }
}

module.exports = { getVertex, askVertex, askVertexWithSearch };
