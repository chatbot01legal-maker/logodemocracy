const { GoogleGenAI } = require("@google/genai");
const db = require("./database");
const {
  canUseAI
} = require("./aiUsageGuard");

let vertex = null;


/* ============================================================
   CONFIGURACIÓN DE COSTOS
============================================================ */

function getCostRates() {
  const inputRate =
    Number(
      process.env.GEMINI_INPUT_USD_PER_1M_TOKENS || "0.30"
    );

  const outputRate =
    Number(
      process.env.GEMINI_OUTPUT_USD_PER_1M_TOKENS || "2.50"
    );

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
   TELEMETRÍA
============================================================ */

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
      timestamp:
        new Date(),

      module:
        "LogoDemocracy",

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
        recordedAt:
          new Date(),

        telemetryVersion:
          "1.0"
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
    console.error(
      `[AI-USAGE] ERROR guardando consumo:` +
      ` ${error.message}`
    );
  }
}


/* ============================================================
   CLIENTE VERTEX
============================================================ */

function getVertex() {
  if (vertex)
    return vertex;

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error(
      "[SOPHIA-GENAI] Falta GEMINI_API_KEY en el entorno. " +
      "Configurá la API key de Google AI Studio."
    );

    throw new Error(
      "GEMINI_API_KEY no está configurada. " +
      "Agregá la variable en el .env o en el panel del hosting."
    );
  }

  console.log(
    "[SOPHIA-GENAI] Inicializando cliente Gemini (Google AI Studio) con API key"
  );

  vertex =
    new GoogleGenAI({ apiKey });

  return vertex;
}


/* ============================================================
   CONTROL GLOBAL DE PRESUPUESTO
============================================================ */

/**
 * Verifica el límite ANTES de cualquier llamada a Gemini.
 *
 * Si el límite fue alcanzado:
 *
 *   - NO se inicializa Vertex
 *   - NO se ejecuta generateContent()
 *   - NO se consume IA
 */
async function enforceAILimit(stage) {
  const status =
    await canUseAI();

  if (status.allowed)
    return status;

  const error =
    new Error(
      "AI_DAILY_LIMIT_REACHED"
    );

  error.code =
    "AI_DAILY_LIMIT_REACHED";

  error.stage =
    stage;

  error.limitUsd =
    status.limitUsd;

  error.usedUsd =
    status.usedUsd;

  error.remainingUsd =
    status.remainingUsd;

  error.date =
    status.date;

  console.warn(
    `[AI-GUARD] BLOQUEADO` +
    ` stage=${stage}` +
    ` used_usd=${status.usedUsd}` +
    ` limit_usd=${status.limitUsd}` +
    ` date=${status.date}`
  );

  throw error;
}


/* ============================================================
   ASK VERTEX
============================================================ */

async function askVertex(
  prompt,
  model = "gemini-flash-lite-latest",
  timeoutMs = 50000,
  generationConfig = null,
  stage = "unknown"
) {

  /*
   * ==========================================================
   * LÍMITE DIARIO — ANTES DE GEMINI
   * ==========================================================
   */
  await enforceAILimit(stage);

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
              `Google AI Studio Timeout excedido (${timeoutMs}ms)`
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

async function askVertexWithSearch(
  prompt,
  model = "gemini-flash-lite-latest",
  timeoutMs = 50000,
  stage = "unknown"
) {

  /*
   * ==========================================================
   * LÍMITE DIARIO — ANTES DE GEMINI
   * ==========================================================
   */
  await enforceAILimit(stage);

  console.log(
    `[SOPHIA-GENAI] CALL stage=${stage} model=${model} search=true`
  );

  const client =
    getVertex();

  const googleSearchTool = {
    googleSearch: {}
  };

  /*
   * ==========================================================
   * TIMEOUT NATIVO + CANCELACIÓN REAL DEL SDK
   * ==========================================================
   *
   * @google/genai soporta:
   *   - httpOptions.timeout
   *   - abortSignal
   *
   * Promise.race() NO cancela la petición subyacente.
   * El SDK sí puede hacerlo mediante AbortSignal.
   */
  const abortController =
    new AbortController();

  const requestPromise =
    client.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [
          googleSearchTool
        ],
        httpOptions: {
          timeout: timeoutMs
        },
        abortSignal:
          abortController.signal
      }
    });

  const startTime =
    Date.now();

  try {

    const response =
      await requestPromise;

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
