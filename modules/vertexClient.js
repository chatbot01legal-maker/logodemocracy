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
  model = "gemini-2.5-flash",
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
  model = "gemini-2.5-flash",
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
