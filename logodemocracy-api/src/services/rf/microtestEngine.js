// logodemocracy-api/src/services/rf/microtestEngine.js
//
// Motor universal determinista para Microtests de Rey Filósofo.
//
// Toda la lógica específica de cada Microtest vive en su metadata
// y en su catálogo canónico. Este motor solo procesa:
//
//   indicadores observados
//         ↓
//   conteo por indicador
//         ↓
//   distribución (firm_key)
//         ↓
//   shape
//         ↓
//   recuperación de interpretación desde el catálogo
//
// No conoce ningún Microtest en particular. Obtiene de la metadata:
//   - la lista de indicadores válidos
//   - el número de observaciones
//   - la ruta a su catálogo canónico
//   - los campos de interpretación a exponer
//   - las versiones (contract, instrument, rule)
//
// El número de firmas posibles NO está codificado aquí.
// Pertenece al catálogo de cada Microtest.

'use strict';

// ============================================================
// Registro de Microtests
// ------------------------------------------------------------
// Mapa explícito: test_id → ruta al archivo de metadata.
// Cada Microtest declara aquí su metadata. La metadata, a su vez,
// declara dónde vive su catálogo canónico.
//
// Este es el ÚNICO punto que debe tocarse al añadir un Microtest.
// ============================================================

var MICROTEST_REGISTRY = {
  'brujula': './brujula_microtest_1_metadata.json'
};

// ============================================================
// Constante estructural del sistema
// ============================================================

var SHAPE_ALGORITHM_VERSION = 1;

// Particiones posibles de "n" observaciones en partes positivas.
// Se mantiene como tabla explícita por n.
var SHAPES_BY_OBSERVATIONS = {
  5: ['5', '4-1', '3-2', '3-1-1', '2-2-1', '2-1-1-1']
};

// ============================================================
// Carga de configuración por Microtest
// ============================================================

function _loadMicrotestConfig(testId) {
  var metadataPath = MICROTEST_REGISTRY[testId];
  if (!metadataPath) {
    throw new Error(
      'microtestEngine: Microtest no registrado: "' + testId + '".'
    );
  }

  var metadata = require(metadataPath);

  var catalogSource = metadata.canonical_catalog && metadata.canonical_catalog.source;
  if (!catalogSource) {
    throw new Error(
      'microtestEngine: metadata de "' + testId + '" no declara canonical_catalog.source.'
    );
  }

  // La ruta se interpreta relativa al directorio de este módulo.
  var catalogRequirePath = catalogSource.indexOf('./') === 0
    ? catalogSource
    : './' + catalogSource;

  var catalog = require(catalogRequirePath);

  var allowedIndicators = (metadata.indicators || [])
    .map(function (ind) { return ind && ind.id; })
    .filter(Boolean);

  var observations = metadata.structure && metadata.structure.questions;

  if (!observations) {
    throw new Error(
      'microtestEngine: metadata de "' + testId + '" no declara structure.questions.'
    );
  }

  if (!Array.isArray(allowedIndicators) || allowedIndicators.length === 0) {
    throw new Error(
      'microtestEngine: metadata de "' + testId + '" no declara indicadores válidos.'
    );
  }

  return {
    testId: testId,
    metadata: metadata,
    catalog: catalog,
    allowedIndicators: allowedIndicators,
    observations: observations
  };
}

// ============================================================
// Cálculo determinista de firma y shape
// ============================================================

function computeCounts(indicators, allowedIndicators) {
  var counts = {};
  allowedIndicators.forEach(function (ind) { counts[ind] = 0; });
  indicators.forEach(function (ind) { counts[ind] += 1; });
  return counts;
}

function canonicalOrder(counts) {
  return Object.keys(counts)
    .filter(function (ind) { return counts[ind] > 0; })
    .sort(function (a, b) {
      if (counts[b] !== counts[a]) return counts[b] - counts[a];
      return a < b ? -1 : (a > b ? 1 : 0);
    });
}

function buildFirmKey(counts, ordered) {
  return ordered.map(function (ind) {
    return ind + ':' + counts[ind];
  }).join('|');
}

function classifyShape(counts, ordered, observations) {
  var validShapes = SHAPES_BY_OBSERVATIONS[observations];
  if (!validShapes) {
    throw new Error(
      'microtestEngine: no hay shapes definidos para ' + observations + ' observaciones.'
    );
  }
  var sortedCounts = ordered.map(function (ind) { return counts[ind]; });
  var key = sortedCounts.join('-');
  if (validShapes.indexOf(key) === -1) {
    throw new Error(
      'microtestEngine: partición de conteos no reconocida: ' + key
    );
  }
  return key;
}

// ============================================================
// API pública
// ============================================================

function buildProfile(testId, indicators) {
  var config = _loadMicrotestConfig(testId);

  if (!Array.isArray(indicators) || indicators.length !== config.observations) {
    throw new Error(
      'microtestEngine.buildProfile: "' + testId + '" requiere exactamente ' +
      config.observations + ' indicadores (recibido: ' +
      (Array.isArray(indicators) ? indicators.length : typeof indicators) + ').'
    );
  }

  indicators.forEach(function (ind, idx) {
    if (config.allowedIndicators.indexOf(ind) === -1) {
      throw new Error(
        'microtestEngine.buildProfile: indicador inválido en posición ' + idx +
        ': "' + ind + '". Válidos para "' + testId + '": ' +
        config.allowedIndicators.join(', ') + '.'
      );
    }
  });

  var counts = computeCounts(indicators, config.allowedIndicators);
  var ordered = canonicalOrder(counts);
  var firm_key = buildFirmKey(counts, ordered);
  var shape = classifyShape(counts, ordered, config.observations);

  var entry = config.catalog.signatures[firm_key];
  if (!entry) {
    throw new Error(
      'microtestEngine: firma sin entrada en catálogo canónico de "' +
      testId + '": ' + firm_key
    );
  }

  var outputFields = config.metadata.output.interpretation.fields;
  var interpretation = {};
  outputFields.forEach(function (field) {
    interpretation[field] = entry[field];
  });

  return {
    indicators: indicators.slice(),
    firm_key: firm_key,
    shape: shape,
    shape_algorithm_version: SHAPE_ALGORITHM_VERSION,
    contract_version: config.metadata.versions.contract_version,
    instrument_version: config.metadata.versions.instrument_version,
    rule_version: config.metadata.versions.rule_version,
    interpretation: interpretation
  };
}

module.exports = {
  SHAPE_ALGORITHM_VERSION: SHAPE_ALGORITHM_VERSION,
  MICROTEST_REGISTRY: MICROTEST_REGISTRY,
  buildProfile: buildProfile,
  _internal: {
    computeCounts: computeCounts,
    canonicalOrder: canonicalOrder,
    buildFirmKey: buildFirmKey,
    classifyShape: classifyShape
  }
};

