const { GoogleGenAI } = require("@google/genai");

let vertex = null;

/**
 * Inicializa el cliente Google GenAI sobre Vertex AI.
 *
 * Mantiene el nombre getVertex() para preservar
 * el contrato existente con el resto de LogoDemocracy.
 */
function getVertex() {
  if (vertex) return vertex;

  const rawLocation = process.env.GOOGLE_CLOUD_LOCATION;

  const project =
    process.env.GOOGLE_CLOUD_PROJECT ||
    "logodemocracy-ai-2026";

  const location =
    rawLocation === "logodemocracy-ai-2026"
      ? "us-central1"
      : (rawLocation || "us-central1");

  const config = {
    vertexai: true,
    project,
    location
  };

  /*
   * Conservamos la compatibilidad con las variables
   * que ya utilizaba el cliente anterior.
   *
   * @google/genai utiliza ADC automáticamente si no
   * se proporcionan credenciales explícitas.
   */
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const b64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

      const credentials = JSON.parse(
        Buffer.from(b64, "base64").toString("utf8")
      );

      config.credentials = credentials;

      console.log(
        "[SOPHIA-GENAI] Usando GOOGLE_APPLICATION_CREDENTIALS_JSON"
      );
    } catch (error) {
      console.error(
        "[SOPHIA-GENAI] Error leyendo GOOGLE_APPLICATION_CREDENTIALS_JSON:",
        error.message
      );

      throw error;
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const fs = require("fs");

      const keyPath =
        process.env.GOOGLE_APPLICATION_CREDENTIALS;

      const credentials = JSON.parse(
        fs.readFileSync(keyPath, "utf8")
      );

      config.credentials = credentials;

      console.log(
        `[SOPHIA-GENAI] Usando credenciales desde ${keyPath}`
      );
    } catch (error) {
      console.error(
        "[SOPHIA-GENAI] Error leyendo GOOGLE_APPLICATION_CREDENTIALS:",
        error.message
      );

      throw error;
    }
  } else {
    console.log(
      "[SOPHIA-GENAI] Usando Application Default Credentials (ADC)"
    );
  }

  console.log(
    `[SOPHIA-GENAI] Inicializando Vertex AI project=${project} location=${location}`
  );

  vertex = new GoogleGenAI(config);

  return vertex;
}

/**
 * Llama a Gemini vía Vertex AI.
 *
 * Mantiene exactamente la firma pública del cliente anterior.
 */
async function askVertex(
  prompt,
  model = "gemini-2.5-flash",
  timeoutMs = 50000,
  generationConfig = null,
  stage = "unknown"
) {
  console.log(
    `[SOPHIA-GENAI] CALL stage=${stage} model=${model}`
  );

  const client = getVertex();

  const requestConfig = generationConfig
    ? { ...generationConfig }
    : undefined;

  const requestPromise = client.models.generateContent({
    model,
    contents: prompt,
    config: requestConfig
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Vertex AI Timeout excedido (${timeoutMs}ms)`
          )
        ),
      timeoutMs
    )
  );

  const startTime = Date.now();

  try {
    const response = await Promise.race([
      requestPromise,
      timeoutPromise
    ]);

    /*
     * @google/genai expone directamente:
     *
     * response.text
     * response.candidates
     * response.usageMetadata
     * response.modelVersion
     */
    const candidates = response?.candidates;

    if (!candidates || !candidates.length) {
      throw new Error(
        "[SOPHIA-GENAI] No hay candidates en la respuesta"
      );
    }

    const textResponse = response?.text;

    if (!textResponse) {
      throw new Error(
        "[SOPHIA-GENAI] No se encontró texto en la respuesta"
      );
    }

    /*
     * Telemetría.
     */
    const usage = response?.usageMetadata || {};

    const inTokens =
      usage.promptTokenCount ?? "n/a";

    const outTokens =
      usage.candidatesTokenCount ?? "n/a";

    const thoughtsTokens =
      usage.thoughtsTokenCount ?? "n/a";

    const totalTokens =
      usage.totalTokenCount ?? "n/a";

    const responseModel =
      response?.modelVersion || model;

    const duration =
      Date.now() - startTime;

    console.log(
      `[SOPHIA-GENAI] Texto extraído OK stage=${stage}`
    );

    console.log(
      `[SOPHIA-GENAI] OK stage=${stage} duration=${duration}ms`
    );

    console.log(
      `[SOPHIA-GENAI] METRICS stage=${stage}` +
      ` input=${inTokens}` +
      ` output=${outTokens}` +
      ` thoughts=${thoughtsTokens}` +
      ` total=${totalTokens}` +
      ` model=${responseModel}`
    );

    return textResponse;

  } catch (err) {
    const duration =
      Date.now() - startTime;

    console.error(
      `[SOPHIA-GENAI] ERROR stage=${stage}` +
      ` duration=${duration}ms` +
      ` message=${err.message}`
    );

    throw err;
  }
}

/**
 * Llama a Gemini CON BÚSQUEDA REAL DE GOOGLE activada.
 *
 * Mantiene exactamente la firma y el formato de retorno
 * del cliente anterior:
 *
 * {
 *   text,
 *   sources
 * }
 */
async function askVertexWithSearch(
  prompt,
  model = "gemini-2.5-flash",
  timeoutMs = 50000,
  stage = "unknown"
) {
  console.log(
    `[SOPHIA-GENAI] CALL stage=${stage} model=${model} search=true`
  );

  const client = getVertex();

  const googleSearchTool = {
    googleSearch: {}
  };

  const requestPromise =
    client.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [googleSearchTool]
      }
    });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Vertex AI Timeout excedido (${timeoutMs}ms)`
          )
        ),
      timeoutMs
    )
  );

  const startTime = Date.now();

  try {
    const response = await Promise.race([
      requestPromise,
      timeoutPromise
    ]);

    const candidates =
      response?.candidates;

    if (!candidates || !candidates.length) {
      throw new Error(
        "[SOPHIA-GENAI] No hay candidates en la respuesta (búsqueda)"
      );
    }

    const candidate =
      candidates[0];

    const textResponse =
      response?.text;

    if (!textResponse) {
      throw new Error(
        "[SOPHIA-GENAI] No se encontró texto en la respuesta (búsqueda)"
      );
    }

    /*
     * Grounding metadata.
     *
     * Conservamos exactamente el objetivo del cliente anterior:
     * extraer las URLs y títulos encontrados por Google Search.
     */
    const groundingMetadata =
      candidate?.groundingMetadata;

    const sources = [];

    if (
      groundingMetadata?.groundingChunks
    ) {
      groundingMetadata.groundingChunks.forEach(
        chunk => {
          if (chunk?.web?.uri) {
            sources.push({
              uri: chunk.web.uri,
              title:
                chunk.web.title ||
                chunk.web.uri
            });
          }
        }
      );
    }

    /*
     * Telemetría.
     */
    const usage =
      response?.usageMetadata || {};

    const inTokens =
      usage.promptTokenCount ?? "n/a";

    const outTokens =
      usage.candidatesTokenCount ?? "n/a";

    const thoughtsTokens =
      usage.thoughtsTokenCount ?? "n/a";

    const totalTokens =
      usage.totalTokenCount ?? "n/a";

    const responseModel =
      response?.modelVersion || model;

    const duration =
      Date.now() - startTime;

    console.log(
      `[SOPHIA-GENAI] Texto extraído OK` +
      ` stage=${stage}` +
      ` fuentes_encontradas=${sources.length}`
    );

    console.log(
      `[SOPHIA-GENAI] OK stage=${stage}` +
      ` duration=${duration}ms` +
      ` sources_found=${sources.length}`
    );

    console.log(
      `[SOPHIA-GENAI] METRICS stage=${stage}` +
      ` input=${inTokens}` +
      ` output=${outTokens}` +
      ` thoughts=${thoughtsTokens}` +
      ` total=${totalTokens}` +
      ` model=${responseModel}`
    );

    return {
      text: textResponse,
      sources
    };

  } catch (err) {
    const duration =
      Date.now() - startTime;

    console.error(
      `[SOPHIA-GENAI] ERROR stage=${stage}` +
      ` duration=${duration}ms` +
      ` message=${err.message}`
    );

    throw err;
  }
}

module.exports = {
  getVertex,
  askVertex,
  askVertexWithSearch
};
