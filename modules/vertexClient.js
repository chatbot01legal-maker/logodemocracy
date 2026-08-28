const { GoogleGenAI } = require("@google/genai");
const db = require("./database");

let vertex = null;

/**
 * ============================================================
 * VERTEX CLIENT — LOGODEMOCRACY
 * ============================================================
 *
 * Contrato público preservado:
 *
 *   getVertex()
 *   askVertex(prompt, model, timeoutMs, generationConfig, stage)
 *   askVertexWithSearch(prompt, model, timeoutMs, stage)
 *
 * Funcionalidades preservadas:
 *
 *   - GoogleGenAI sobre Vertex AI
 *   - ADC
 *   - GOOGLE_APPLICATION_CREDENTIALS_JSON
 *   - GOOGLE_APPLICATION_CREDENTIALS
 *   - timeout
 *   - generationConfig
 *   - Google Search grounding
 *   - extracción de sources
 *   - response.text
 *   - telemetría por consola
 *
 * Nueva funcionalidad:
 *
 *   - registro de cada llamada REAL a Gemini en:
 *       MongoDB → ai_usage
 *
 *   - almacenamiento de:
 *       timestamp
 *       model
 *       stage
 *       inputTokens
 *       outputTokens
 *       thoughtsTokens
 *       totalTokens
 *       estimatedCostUsd
 *
 * IMPORTANTE:
 * Este archivo registra consumo.
 * El bloqueo por límite diario puede ser aplicado
 * posteriormente sobre esta misma infraestructura sin
 * modificar el contrato de las funciones públicas.
 * ============================================================
 */


/* ============================================================
   CONFIGURACIÓN DE COSTOS
============================================================ */

/**
 * Las tarifas NO se inventan dentro del código.
 *
 * Si están configuradas, se calcula:
 *
 *   estimatedCostUsd
 *
 * mediante:
 *
 *   input tokens  × INPUT_USD_PER_1M
 *   output tokens × OUTPUT_USD_PER_1M
 *
 * Si no están configuradas, el costo queda en 0.
 *
 * Esto permite implementar posteriormente el límite diario
 * sin introducir una tarifa incorrecta en producción.
 */

function getCostRates() {
  const inputRate =
    Number(process.env.GEMINI_INPUT_USD_PER_1M_TOKENS);

  const outputRate =
    Number(process.env.GEMINI_OUTPUT_USD_PER_1M_TOKENS);

  return {
    inputRate:
      Number.isFinite(inputRate) && inputRate >= 0
        ? inputRate
        : 0,

    outputRate:
      Number.isFinite(outputRate) && outputRate >= 0
        ? outputRate
        : 0
  };
}


/**
 * Calcula el costo estimado de una llamada.
 *
 * Nunca lanza una excepción.
 *
 * Si no existen tarifas configuradas,
 * devuelve 0.
 */
function calculateEstimatedCostUsd(
  inputTokens,
  outputTokens
) {
  const {
    inputRate,
    outputRate
  } = getCostRates();

  const input =
    Number(inputTokens) || 0;

  const output =
    Number(outputTokens) || 0;

  return (
    (input / 1000000) * inputRate +
    (output / 1000000) * outputRate
  );
}


/* ============================================================
   TELEMETRÍA DE USO
============================================================ */

/**
 * Registra una llamada REAL a Gemini.
 *
 * IMPORTANTE:
 *
 * Esta función nunca debe romper una respuesta válida
 * de Gemini.
 *
 * Si MongoDB falla, solamente se registra el error en
 * consola y la respuesta continúa normalmente.
 */
async function logAIUsage({
  stage,
  model,
  modelVersion,
  inputTokens,
  outputTokens,
  thoughtsTokens,
  totalTokens,
  durationMs,
  searchEnabled = false
}) {
  try {
    const normalizedInputTokens =
      Number(inputTokens) || 0;

    const normalizedOutputTokens =
      Number(outputTokens) || 0;

    const normalizedThoughtsTokens =
      Number(thoughtsTokens) || 0;

    const normalizedTotalTokens =
      Number(totalTokens) || 0;

    const estimatedCostUsd =
      calculateEstimatedCostUsd(
        normalizedInputTokens,
        normalizedOutputTokens
      );

    const record = {
      timestamp: new Date(),

      module: "LogoDemocracy",

      stage:
        stage || "unknown",

      model:
        model || "unknown",

      modelVersion:
        modelVersion || model || "unknown",

      inputTokens:
        normalizedInputTokens,

      outputTokens:
        normalizedOutputTokens,

      thoughtsTokens:
        normalizedThoughtsTokens,

      totalTokens:
        normalizedTotalTokens,

      estimatedCostUsd,

      durationMs:
        Number(durationMs) || 0,

      searchEnabled:
        Boolean(searchEnabled),

      metadata: {
        recordedAt: new Date(),
        telemetryVersion: "1.0"
      }
    };

    await db.saveAIUsage(record);

    console.log(
      `[AI-USAGE] SAVED` +
      ` stage=${record.stage}` +
      ` model=${record.modelVersion}` +
      ` input=${record.inputTokens}` +
      ` output=${record.outputTokens}` +
      ` thoughts=${record.thoughtsTokens}` +
      ` total=${record.totalTokens}` +
      ` cost_usd=${record.estimatedCostUsd}`
    );

  } catch (error) {
    /**
     * La telemetría nunca debe derribar el pipeline.
     */
    console.error(
      `[AI-USAGE] ERROR guardando consumo:` +
      ` ${error.message}`
    );
  }
}


/* ============================================================
   CLIENTE VERTEX
============================================================ */

/**
 * Inicializa el cliente Google GenAI sobre Vertex AI.
 *
 * Mantiene el nombre getVertex() para preservar
 * el contrato existente con el resto de LogoDemocracy.
 */
function getVertex() {
  if (vertex) return vertex;

  const rawLocation =
    process.env.GOOGLE_CLOUD_LOCATION;

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
  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  ) {
    try {
      const b64 =
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

      const credentials =
        JSON.parse(
          Buffer.from(
            b64,
            "base64"
          ).toString("utf8")
        );

      config.credentials =
        credentials;

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

  } else if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {

    try {
      const fs =
        require("fs");

      const keyPath =
        process.env.GOOGLE_APPLICATION_CREDENTIALS;

      const credentials =
        JSON.parse(
          fs.readFileSync(
            keyPath,
            "utf8"
          )
        );

      config.credentials =
        credentials;

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

  vertex =
    new GoogleGenAI(config);

  return vertex;
}


/* ============================================================
   ASK VERTEX
============================================================ */

/**
 * Llama a Gemini vía Vertex AI.
 *
 * CONTRATO PRESERVADO:
 *
 * askVertex(
 *   prompt,
 *   model,
 *   timeoutMs,
 *   generationConfig,
 *   stage
 * )
 *
 * RETORNO PRESERVADO:
 *
 *   string
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

  const client =
    getVertex();

  const requestConfig =
    generationConfig
      ? { ...generationConfig }
      : undefined;

  const requestPromise =
    client.models.generateContent({
      model,
      contents: prompt,
      config: requestConfig
    });

  const timeoutPromise =
    new Promise((_, reject) =>
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

  const startTime =
    Date.now();

  try {

    const response =
      await Promise.race([
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
    const candidates =
      response?.candidates;

    if (
      !candidates ||
      !candidates.length
    ) {
      throw new Error(
        "[SOPHIA-GENAI] No hay candidates en la respuesta"
      );
    }

    const textResponse =
      response?.text;

    if (!textResponse) {
      throw new Error(
        "[SOPHIA-GENAI] No se encontró texto en la respuesta"
      );
    }

    /*
     * Telemetría.
     */
    const usage =
      response?.usageMetadata || {};

    const inTokens =
      usage.promptTokenCount ?? 0;

    const outTokens =
      usage.candidatesTokenCount ?? 0;

    const thoughtsTokens =
      usage.thoughtsTokenCount ?? 0;

    const totalTokens =
      usage.totalTokenCount ?? 0;

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

    /*
     * Registrar consumo REAL.
     *
     * No usamos await de manera bloqueante para la respuesta.
     *
     * Si MongoDB falla, logAIUsage() absorbe el error.
     */
    await logAIUsage({
      stage,
      model,
      modelVersion:
        responseModel,
      inputTokens:
        inTokens,
      outputTokens:
        outTokens,
      thoughtsTokens:
        thoughtsTokens,
      totalTokens:
        totalTokens,
      durationMs:
        duration,
      searchEnabled:
        false
    });

    /*
     * CONTRATO ORIGINAL:
     * askVertex devuelve solamente el texto.
     */
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


/* ============================================================
   ASK VERTEX WITH GOOGLE SEARCH
============================================================ */

/**
 * Llama a Gemini CON BÚSQUEDA REAL DE GOOGLE activada.
 *
 * CONTRATO PRESERVADO:
 *
 * askVertexWithSearch(
 *   prompt,
 *   model,
 *   timeoutMs,
 *   stage
 * )
 *
 * RETORNO PRESERVADO:
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

  const client =
    getVertex();

  const googleSearchTool = {
    googleSearch: {}
  };

  const requestPromise =
    client.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [
          googleSearchTool
        ]
      }
    });

  const timeoutPromise =
    new Promise((_, reject) =>
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

  const startTime =
    Date.now();

  try {

    const response =
      await Promise.race([
        requestPromise,
        timeoutPromise
      ]);

    const candidates =
      response?.candidates;

    if (
      !candidates ||
      !candidates.length
    ) {
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
     * Conservamos exactamente el objetivo
     * del cliente anterior:
     *
     * extraer URLs y títulos encontrados
     * por Google Search.
     */
    const groundingMetadata =
      candidate?.groundingMetadata;

    const sources = [];

    if (
      groundingMetadata?.groundingChunks
    ) {

      groundingMetadata
        .groundingChunks
        .forEach(
          chunk => {

            if (
              chunk?.web?.uri
            ) {

              sources.push({
                uri:
                  chunk.web.uri,

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
      usage.promptTokenCount ?? 0;

    const outTokens =
      usage.candidatesTokenCount ?? 0;

    const thoughtsTokens =
      usage.thoughtsTokenCount ?? 0;

    const totalTokens =
      usage.totalTokenCount ?? 0;

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

    /*
     * Registrar consumo REAL.
     */
    await logAIUsage({
      stage,
      model,
      modelVersion:
        responseModel,
      inputTokens:
        inTokens,
      outputTokens:
        outTokens,
      thoughtsTokens:
        thoughtsTokens,
      totalTokens:
        totalTokens,
      durationMs:
        duration,
      searchEnabled:
        true
    });

    /*
     * CONTRATO ORIGINAL:
     *
     * {
     *   text,
     *   sources
     * }
     */
    return {
      text:
        textResponse,

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


/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getVertex,
  askVertex,
  askVertexWithSearch
};
