// logodemocracy-api/src/services/rf/brujulaEngine.js
//
// Motor determinista de perfil de aprendizaje — Microtest "brujula".
// Implementa el contrato "Motor determinista de perfil de aprendizaje —
// Rey Filósofo · Beta 1", versión 1.0.0

'use strict';

const BRUJULA_CATALOG = require('./brujula_microtest_1.js');
const BRUJULA_SIGNATURES = BRUJULA_CATALOG.signatures || {};

// ============================================================
// A.3 — CONSTANTES DEL MICROTEST "brujula" (Nivel B, B.1 / B.2)
// ============================================================

const TEST_ID = 'brujula';
const CONTRACT_VERSION = '1.0.0';
const SHAPE_ALGORITHM_VERSION = 1;

const ALLOWED_INDICATORS = ['ejemplo', 'principio', 'analogia', 'secuencia'];

const LABELS = {
  ejemplo: 'buscar un caso concreto para comprender',
  principio: 'identificar la regla o el principio general',
  analogia: 'relacionar con algo ya conocido',
  secuencia: 'reconstruir el proceso paso a paso'
};


// ============================================================
// A.4 — FIRMA Y SHAPES
// ============================================================

function computeCounts(indicators) {
  const counts = {};
  ALLOWED_INDICATORS.forEach((ind) => { counts[ind] = 0; });
  indicators.forEach((ind) => { counts[ind] += 1; });
  return counts;
}

function canonicalOrder(counts) {
  return Object.keys(counts)
    .filter((ind) => counts[ind] > 0)
    .sort((a, b) => {
      if (counts[b] !== counts[a]) return counts[b] - counts[a];
      return a < b ? -1 : (a > b ? 1 : 0);
    });
}

function buildFirmKey(counts, ordered) {
  return ordered.map((ind) => ind + ':' + counts[ind]).join('|');
}

function classifyShape(counts, ordered) {
  const sortedCounts = ordered.map((ind) => counts[ind]);
  const key = sortedCounts.join('-');
  const VALID_SHAPES = ['5', '4-1', '3-2', '3-1-1', '2-2-1', '2-1-1-1'];
  if (VALID_SHAPES.indexOf(key) === -1) {
    throw new Error('brujulaEngine: partición de conteos no reconocida: ' + key);
  }
  return key;
}

// ============================================================
// API PÚBLICA
// ============================================================

function buildProfile(indicators) {
  if (!Array.isArray(indicators) || indicators.length !== 5) {
    throw new Error(
      'brujulaEngine.buildProfile: se requieren exactamente 5 indicadores ' +
      '(recibido: ' + (Array.isArray(indicators) ? indicators.length : typeof indicators) + ').'
    );
  }

  indicators.forEach((ind, idx) => {
    if (ALLOWED_INDICATORS.indexOf(ind) === -1) {
      throw new Error(
        'brujulaEngine.buildProfile: indicador inválido en posición ' + idx +
        ': "' + ind + '". Válidos: ' + ALLOWED_INDICATORS.join(', ') + '.'
      );
    }
  });

  const counts = computeCounts(indicators);
  const ordered = canonicalOrder(counts);
  const firm_key = buildFirmKey(counts, ordered);
  const shape = classifyShape(counts, ordered);
  const catalogEntry = BRUJULA_SIGNATURES[firm_key];

  if (!catalogEntry) {
    throw new Error(
      'brujulaEngine: no existe firma en BRUJULA_SIGNATURES para firm_key: ' + firm_key
    );
  }

  if (
    typeof catalogEntry.descripcion !== 'string' ||
    !catalogEntry.descripcion.trim() ||
    typeof catalogEntry.ejemplo !== 'string' ||
    !catalogEntry.ejemplo.trim()
  ) {
    throw new Error(
      'brujulaEngine: entrada incompleta en BRUJULA_SIGNATURES para firm_key: ' + firm_key
    );
  }

  return {
    indicators: indicators.slice(),
    firm_key: firm_key,
    shape: shape,
    shape_algorithm_version: SHAPE_ALGORITHM_VERSION,
    contract_version: BRUJULA_CATALOG.instrument_version || '1.0.0',
    rule_version: BRUJULA_CATALOG.rule_version || '1.0.0',
    interpretation: {
      descripcion: catalogEntry.descripcion,
      ejemplo: catalogEntry.ejemplo
    }
  };
}

module.exports = {
  TEST_ID,
  CONTRACT_VERSION,
  SHAPE_ALGORITHM_VERSION,
  ALLOWED_INDICATORS,
  LABELS,
  buildProfile,
  _internal: {
    computeCounts,
    canonicalOrder,
    buildFirmKey,
    classifyShape
  }
};
