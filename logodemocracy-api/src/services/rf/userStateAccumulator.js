/**
 * Motor 1 — Acumulador de evidencia del usuario (Contrato A v1.0.4)
 * 
 * Lógica pura determinista para acumular evidencia de los Microtests.
 * No interpreta, solo agrega y calcula estadísticas descriptivas poblacionales.
 */

const CONTRACT_VERSION = '1.0.4';

/**
 * Valida que un timestamp cumpla con un formato ISO 8601 válido y completo.
 * @param {string} timestamp
 * @returns {boolean}
 */
function isValidISO8601(timestamp) {
  if (typeof timestamp !== 'string') return false;
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/;
  if (!isoRegex.test(timestamp)) return false;
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

/**
 * Crea un estado acumulado vacío para un usuario.
 * @param {string} userRef Identificador del usuario.
 * @returns {Object} Estado inicial vacío.
 */
function createEmptyState(userRef) {
  if (!userRef || typeof userRef !== 'string' || userRef.trim() === '') {
    throw new Error('userRef es obligatorio y debe ser un string no vacío.');
  }
  return {
    contract_version: CONTRACT_VERSION,
    user_ref: userRef,
    last_updated: null,
    dimensions: {}
  };
}

/**
 * Valida la estructura del objeto de estado acumulado.
 * @param {Object} state
 */
function validateState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new Error('El estado proporcionado es inválido. Debe ser un objeto válido.');
  }
  if (!state.user_ref || typeof state.user_ref !== 'string' || state.user_ref.trim() === '') {
    throw new Error('El estado no posee un user_ref válido.');
  }
  if (!state.dimensions || typeof state.dimensions !== 'object' || Array.isArray(state.dimensions)) {
    throw new Error('El estado no posee un objeto dimensions válido.');
  }
}

/**
 * Calcula las estadísticas descriptivas (promedio y desviación estándar poblacional) sobre el historial.
 * @param {Array<Object>} history Historial de intentos de una dimensión.
 * @returns {Object} Objeto con indicator_means e indicator_stddev.
 */
function computeAggregates(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return {
      indicator_means: {},
      indicator_stddev: {}
    };
  }

  const indicatorKeys = new Set();
  history.forEach(attempt => {
    if (attempt.indicator_counts && typeof attempt.indicator_counts === 'object') {
      Object.keys(attempt.indicator_counts).forEach(key => indicatorKeys.add(key));
    }
  });

  const N = history.length;
  const indicator_means = {};
  const indicator_stddev = {};

  indicatorKeys.forEach(key => {
    const values = history.map(attempt => (attempt.indicator_counts && attempt.indicator_counts[key]) || 0);

    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / N;
    indicator_means[key] = Math.round((mean + Number.EPSILON) * 100) / 100;

    const varianceSum = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = varianceSum / N;
    const stddev = Math.sqrt(variance);
    indicator_stddev[key] = Math.round((stddev + Number.EPSILON) * 100) / 100;
  });

  return {
    indicator_means,
    indicator_stddev
  };
}

/**
 * Valida la estructura y coherencia de un intento (R7 relajado v1.0.4).
 * @param {Object} attempt Objeto del intento.
 */
function validateAttempt(attempt) {
  if (!attempt || typeof attempt !== 'object' || Array.isArray(attempt)) {
    throw new Error('El intento debe ser un objeto.');
  }

  const requiredFields = [
    'attempt_id',
    'test_id',
    'instrument_version',
    'rule_version',
    'timestamp',
    'indicator_sequence',
    'indicator_counts',
    'signature',
    'firm_key',
    'dimension_id',
    'dimension_name'
  ];

  for (const field of requiredFields) {
    if (attempt[field] === undefined || attempt[field] === null) {
      throw new Error(`Falta el campo obligatorio del intento: ${field}`);
    }
  }

  if (typeof attempt.attempt_id !== 'string') {
    throw new Error('attempt_id debe ser un string.');
  }

  if (!isValidISO8601(attempt.timestamp)) {
    throw new Error('timestamp debe ser una fecha ISO 8601 válida.');
  }

  if (!Array.isArray(attempt.indicator_sequence) || attempt.indicator_sequence.length !== 5 || !attempt.indicator_sequence.every(s => typeof s === 'string')) {
    throw new Error('indicator_sequence debe ser un arreglo de exactamente 5 strings.');
  }

  if (typeof attempt.indicator_counts !== 'object' || Array.isArray(attempt.indicator_counts) || attempt.indicator_counts === null) {
    throw new Error('indicator_counts debe ser un objeto.');
  }

  const seqCounts = {};
  attempt.indicator_sequence.forEach(ind => {
    seqCounts[ind] = (seqCounts[ind] || 0) + 1;
  });

  const countKeys = Object.keys(attempt.indicator_counts);
  let totalSum = 0;
  
  for (const key of countKeys) {
    const val = attempt.indicator_counts[key];
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 0 || !Number.isFinite(val)) {
      throw new Error(`Los valores de indicator_counts deben ser enteros finitos >= 0. Clave '${key}' invalida: ${val}`);
    }
    totalSum += val;

    // Validación de relajación R7
    if (!seqCounts[key] && val > 0) {
      throw new Error(`R7 Violación: Clave '${key}' no está en la secuencia pero tiene valor > 0.`);
    }
    if (seqCounts[key] && val !== seqCounts[key]) {
      throw new Error(`R7 Violación: El conteo para '${key}' (${val}) no coincide con la frecuencia en indicator_sequence (${seqCounts[key]}).`);
    }
  }

  if (totalSum !== 5) {
    throw new Error(`La suma de los valores de indicator_counts debe ser igual a 5. Obtenido: ${totalSum}`);
  }

  // Verificar que TODAS las claves de la secuencia existan en el objeto indicator_counts
  for (const key of Object.keys(seqCounts)) {
    if (!(key in attempt.indicator_counts)) {
      throw new Error(`R7 Violación: Clave '${key}' de indicator_sequence falta en indicator_counts.`);
    }
  }

  if (!Array.isArray(attempt.signature) || attempt.signature.length !== 4 || !attempt.signature.every(n => typeof n === 'number' && Number.isFinite(n))) {
    throw new Error('signature debe ser un arreglo de exactamente 4 números.');
  }
}

/**
 * Acumula un intento en el estado del usuario de forma inmutable y pura.
 * @param {Object} state Estado acumulado previo.
 * @param {Object} attempt Intento a registrar.
 * @returns {Object} Nuevo estado acumulado actualizado.
 */
function accumulate(state, attempt) {
  validateState(state);
  validateAttempt(attempt);

  const dimId = attempt.dimension_id;
  const existingDim = state.dimensions && state.dimensions[dimId];
  const attemptTime = new Date(attempt.timestamp).getTime();

  if (existingDim && existingDim.history && existingDim.history.length > 0) {
    const lastAttempt = existingDim.history[existingDim.history.length - 1];

    if (attemptTime < new Date(lastAttempt.timestamp).getTime()) {
      throw new Error(`R6 Violación: El timestamp del intento (${attempt.timestamp}) es estrictamente anterior al del último intento registrado en la dimensión (${lastAttempt.timestamp}).`);
    }

    const existingKeys = Object.keys(existingDim.history[0].indicator_counts).sort();
    const attemptKeys = Object.keys(attempt.indicator_counts).sort();
    if (existingKeys.length !== attemptKeys.length || !existingKeys.every((k, i) => k === attemptKeys[i])) {
      throw new Error(`R10 Violación: Los indicadores del intento no coinciden con los de la dimensión '${dimId}'.`);
    }
  }

  const previousLastUpdated = state.last_updated ? new Date(state.last_updated).getTime() : -Infinity;
  const newLastUpdated = attemptTime > previousLastUpdated ? attempt.timestamp : state.last_updated;

  const attemptSnapshot = {
    attempt_id: attempt.attempt_id,
    test_id: attempt.test_id,
    instrument_version: attempt.instrument_version,
    rule_version: attempt.rule_version,
    timestamp: attempt.timestamp,
    indicator_sequence: [...attempt.indicator_sequence],
    indicator_counts: { ...attempt.indicator_counts },
    signature: [...attempt.signature],
    firm_key: attempt.firm_key
  };

  const existingHistory = existingDim ? existingDim.history : [];
  const newHistory = [...existingHistory, attemptSnapshot];

  const aggregates = computeAggregates(newHistory);
  const latestAttempt = { ...attemptSnapshot };

  const newDimensionState = {
    dimension_id: attempt.dimension_id,
    dimension_name: attempt.dimension_name,
    attempts_count: newHistory.length,
    latest_attempt: latestAttempt,
    aggregates,
    history: newHistory
  };

  return {
    contract_version: CONTRACT_VERSION,
    user_ref: state.user_ref,
    last_updated: newLastUpdated,
    dimensions: {
      ...state.dimensions,
      [dimId]: newDimensionState
    }
  };
}

module.exports = {
  CONTRACT_VERSION,
  createEmptyState,
  computeAggregates,
  accumulate
};
