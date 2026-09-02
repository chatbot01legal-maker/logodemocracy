const db = require("./database");

/*
 * ============================================================
 * LOGODEMOCRACY — AI USAGE GUARD
 * ============================================================
 *
 * LÍMITE DIARIO GLOBAL:
 *
 *   US$8 por día
 *
 * Compartido por:
 *   - SOPHIA
 *   - LOGOS
 *   - Rey Filósofo
 *
 * El guard:
 *
 *   1. Consulta el consumo acumulado del día.
 *   2. Autoriza o bloquea ANTES de llamar a Gemini.
 *   3. Registra el consumo REAL después de la respuesta.
 *
 * ============================================================
 */

const DAILY_LIMIT_USD = Number(
  process.env.AI_DAILY_LIMIT_USD || "8"
);

const COST_PER_MILLION_INPUT_USD = Number(
  process.env.AI_COST_INPUT_PER_MILLION_USD || "0.30"
);

const COST_PER_MILLION_OUTPUT_USD = Number(
  process.env.AI_COST_OUTPUT_PER_MILLION_USD || "2.50"
);


/* ============================================================
   COSTO
============================================================ */

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


/* ============================================================
   AUTORIZACIÓN
============================================================ */

/**
 * Comprueba si existe presupuesto diario disponible.
 *
 * IMPORTANTE:
 *
 * Esta función se ejecuta ANTES de realizar la llamada
 * real a Gemini.
 *
 * No registra consumo.
 */
async function canUseAI() {
  const usage =
    await db.getDailyAIUsage();

  const currentCost =
    Number(usage.totalCostUsd || 0);

  const remaining =
    Math.max(
      0,
      DAILY_LIMIT_USD - currentCost
    );

  const allowed =
    currentCost < DAILY_LIMIT_USD;

  return {
    allowed,

    limitUsd:
      DAILY_LIMIT_USD,

    usedUsd:
      currentCost,

    remainingUsd:
      remaining,

    date:
      usage.date,

    calls:
      Number(usage.calls || 0),

    totalTokens:
      Number(usage.totalTokens || 0)
  };
}


/* ============================================================
   REGISTRO
============================================================ */

/**
 * Registra una llamada REAL a Gemini.
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
  const costUsd =
    calculateEstimatedCost({
      promptTokens,
      outputTokens
    });

  const record = {
    module,
    stage,
    model,

    userId,
    sessionId,

    promptTokens:
      Number(promptTokens) || 0,

    outputTokens:
      Number(outputTokens) || 0,

    thoughtsTokens:
      Number(thoughtsTokens) || 0,

    totalTokens:
      Number(totalTokens) || 0,

    estimatedCostUsd:
      costUsd,

    durationMs:
      durationMs === null
        ? null
        : Number(durationMs),

    success:
      Boolean(success),

    error:
      error || null,

    timestamp:
      new Date()
  };

  await db.saveAIUsage(record);

  return record;
}


/* ============================================================
   ESTADO PÚBLICO
============================================================ */

async function getAIUsageStatus() {
  const usage =
    await db.getDailyAIUsage();

  const usedUsd =
    Number(usage.totalCostUsd || 0);

  return {
    date:
      usage.date,

    limitUsd:
      DAILY_LIMIT_USD,

    usedUsd,

    remainingUsd:
      Math.max(
        0,
        DAILY_LIMIT_USD - usedUsd
      ),

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
