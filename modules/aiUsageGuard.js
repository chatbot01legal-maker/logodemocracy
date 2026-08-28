const db = require("./database");

/*
 * ============================================================
 * LOGODEMOCRACY — AI USAGE GUARD
 * ============================================================
 *
 * Límite interno diario:
 *   US$7 por día
 *
 * El límite es GLOBAL y compartido por:
 *   - SOPHIA
 *   - LOGOS
 *   - Rey Filósofo
 *
 * El cálculo se realiza sobre el consumo registrado por las
 * llamadas reales a Vertex/Gemini.
 *
 * El valor monetario se obtiene mediante un costo configurable
 * por millón de tokens.
 * ============================================================
 */

const DAILY_LIMIT_USD = Number(
  process.env.AI_DAILY_LIMIT_USD || "7"
);

const COST_PER_MILLION_INPUT_USD = Number(
  process.env.AI_COST_INPUT_PER_MILLION_USD || "0.30"
);

const COST_PER_MILLION_OUTPUT_USD = Number(
  process.env.AI_COST_OUTPUT_PER_MILLION_USD || "2.50"
);

function calculateEstimatedCost({
  promptTokens = 0,
  outputTokens = 0
}) {
  const inputCost =
    (Number(promptTokens) / 1_000_000) *
    COST_PER_MILLION_INPUT_USD;

  const outputCost =
    (Number(outputTokens) / 1_000_000) *
    COST_PER_MILLION_OUTPUT_USD;

  return inputCost + outputCost;
}

/**
 * Comprueba si existe presupuesto diario disponible.
 *
 * IMPORTANTE:
 * Esta función NO registra consumo.
 * Solo autoriza o rechaza la llamada.
 */
async function canUseAI() {
  const usage = await db.getDailyAIUsage();

  const currentCost = Number(
    usage.totalCostUsd || 0
  );

  const remaining =
    Math.max(0, DAILY_LIMIT_USD - currentCost);

  return {
    allowed: currentCost < DAILY_LIMIT_USD,
    limitUsd: DAILY_LIMIT_USD,
    usedUsd: currentCost,
    remainingUsd: remaining,
    date: usage.date
  };
}

/**
 * Registra una llamada real a Gemini.
 */
async function registerAIUsage({
  module = "unknown",
  stage = "unknown",
  model = "unknown",
  userId = null,
  sessionId = null,

  promptTokens = 0,
  outputTokens = 0,
  thoughtsTokens = 0,
  totalTokens = 0,

  durationMs = null,
  success = true,
  error = null
}) {
  const costUsd = calculateEstimatedCost({
    promptTokens,
    outputTokens
  });

  const record = {
    module,
    stage,
    model,

    userId,
    sessionId,

    promptTokens: Number(promptTokens) || 0,
    outputTokens: Number(outputTokens) || 0,
    thoughtsTokens: Number(thoughtsTokens) || 0,
    totalTokens: Number(totalTokens) || 0,

    estimatedCostUsd: costUsd,

    durationMs:
      durationMs === null
        ? null
        : Number(durationMs),

    success: Boolean(success),
    error: error || null,

    timestamp: new Date()
  };

  await db.saveAIUsage(record);

  return record;
}

/**
 * Información pública del contador.
 */
async function getAIUsageStatus() {
  const usage = await db.getDailyAIUsage();

  const usedUsd =
    Number(usage.totalCostUsd || 0);

  return {
    date: usage.date,
    limitUsd: DAILY_LIMIT_USD,
    usedUsd,
    remainingUsd:
      Math.max(0, DAILY_LIMIT_USD - usedUsd),
    blocked:
      usedUsd >= DAILY_LIMIT_USD,

    calls:
      Number(usage.calls || 0),

    totalTokens:
      Number(usage.totalTokens || 0)
  };
}

module.exports = {
  DAILY_LIMIT_USD,
  calculateEstimatedCost,
  canUseAI,
  registerAIUsage,
  getAIUsageStatus
};
