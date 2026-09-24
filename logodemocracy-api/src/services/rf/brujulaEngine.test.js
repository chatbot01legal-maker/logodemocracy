// logodemocracy-api/src/services/rf/brujulaEngine.test.js
//
// Pruebas obligatorias del Microtest "brujula" (A.11 del contrato).

'use strict';

const assert = require('assert');
const brujulaEngine = require('./brujulaEngine');

const IND = ['ejemplo', 'principio', 'analogia', 'secuencia'];

const EXPECTED_56_FIRM_KEYS = [
  'ejemplo:5', 'principio:5', 'analogia:5', 'secuencia:5',
  'ejemplo:4|principio:1', 'ejemplo:4|analogia:1', 'ejemplo:4|secuencia:1',
  'principio:4|ejemplo:1', 'principio:4|analogia:1', 'principio:4|secuencia:1',
  'analogia:4|ejemplo:1', 'analogia:4|principio:1', 'analogia:4|secuencia:1',
  'secuencia:4|ejemplo:1', 'secuencia:4|principio:1', 'secuencia:4|analogia:1',
  'ejemplo:3|principio:2', 'ejemplo:3|analogia:2', 'ejemplo:3|secuencia:2',
  'principio:3|ejemplo:2', 'principio:3|analogia:2', 'principio:3|secuencia:2',
  'analogia:3|ejemplo:2', 'analogia:3|principio:2', 'analogia:3|secuencia:2',
  'secuencia:3|ejemplo:2', 'secuencia:3|principio:2', 'secuencia:3|analogia:2',
  'ejemplo:3|analogia:1|principio:1', 'ejemplo:3|principio:1|secuencia:1', 'ejemplo:3|analogia:1|secuencia:1',
  'principio:3|analogia:1|ejemplo:1', 'principio:3|ejemplo:1|secuencia:1', 'principio:3|analogia:1|secuencia:1',
  'analogia:3|ejemplo:1|principio:1', 'analogia:3|ejemplo:1|secuencia:1', 'analogia:3|principio:1|secuencia:1',
  'secuencia:3|ejemplo:1|principio:1', 'secuencia:3|analogia:1|ejemplo:1', 'secuencia:3|analogia:1|principio:1',
  'ejemplo:2|principio:2|analogia:1', 'ejemplo:2|principio:2|secuencia:1',
  'analogia:2|ejemplo:2|principio:1', 'analogia:2|ejemplo:2|secuencia:1',
  'ejemplo:2|secuencia:2|principio:1', 'ejemplo:2|secuencia:2|analogia:1',
  'analogia:2|principio:2|ejemplo:1', 'analogia:2|principio:2|secuencia:1',
  'principio:2|secuencia:2|ejemplo:1', 'principio:2|secuencia:2|analogia:1',
  'analogia:2|secuencia:2|ejemplo:1', 'analogia:2|secuencia:2|principio:1',
  'ejemplo:2|analogia:1|principio:1|secuencia:1',
  'principio:2|analogia:1|ejemplo:1|secuencia:1',
  'analogia:2|ejemplo:1|principio:1|secuencia:1',
  'secuencia:2|analogia:1|ejemplo:1|principio:1'
];

const FORBIDDEN_TERMS = [
  'demuestra', 'siempre', 'nunca', 'es usted', 'su personalidad',
  'característica estable', 'rasgo', 'tipo de persona', 'diagnóstico',
  'definitivamente', 'en todos los casos', 'usted es', 'de forma estable'
];

const BRUJULA_FORBIDDEN_TERMS = [
  'estilo cognitivo', 'modo de pensar', 'forma de ser'
];

const GENERAL_HEDGES = ['podría', 'puede que', 'sugiere', 'tiende a', 'en algunos casos'];
const DISPERSION_QUALIFIERS = ['en algunos casos', 'en ciertas situaciones', 'de manera puntual'];

function buildAll56Cases() {
  const seen = new Map();

  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      for (let c = 0; c < 4; c++) {
        for (let d = 0; d < 4; d++) {
          for (let e = 0; e < 4; e++) {
            const indicators = [IND[a], IND[b], IND[c], IND[d], IND[e]];
            const counts = {};
            indicators.forEach((i) => { counts[i] = (counts[i] || 0) + 1; });
            const key = Object.keys(counts)
              .sort((x, y) => {
                if (counts[y] !== counts[x]) return counts[y] - counts[x];
                return x < y ? -1 : (x > y ? 1 : 0);
              })
              .map((k) => k + ':' + counts[k])
              .join('|');
            if (!seen.has(key)) {
              seen.set(key, indicators);
            }
          }
        }
      }
    }
  }

  return Array.from(seen.entries()).map(([firm_key, indicators]) => ({
    expected_firm_key: firm_key,
    indicators
  }));
}

function countSentences(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.]+\./g);
  return matches ? matches.length : 0;
}

function containsAny(haystackLower, needles) {
  return needles.filter((n) => haystackLower.indexOf(n.toLowerCase()) !== -1);
}

function verifyB9RiskPairs() {
  const groups = [
    {
      label: 'Riesgo B.9 #1 — mismo primario (ejemplo:4), distinto secundario',
      cases: [
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'principio'],
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'analogia'],
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'secuencia']
      ]
    },
    {
      label: 'Riesgo B.9 #2 — mismo primario (ejemplo:3), distinto secundario recurrente',
      cases: [
        ['ejemplo', 'ejemplo', 'ejemplo', 'principio', 'principio'],
        ['ejemplo', 'ejemplo', 'ejemplo', 'analogia', 'analogia']
      ]
    },
    {
      label: 'Riesgo B.9 #3 — mismo conjunto de indicadores {analogia,ejemplo,principio}, distinto primario/singleton',
      cases: [
        ['principio', 'principio', 'analogia', 'analogia', 'ejemplo'],
        ['analogia', 'analogia', 'ejemplo', 'ejemplo', 'principio']
      ]
    }
  ];

  let allDistinct = true;
  const report = [];

  groups.forEach((group) => {
    const profiles = group.cases.map((indicators) => brujulaEngine.buildProfile(indicators));
    const triples = profiles.map((p) => p.interpretation.dominante + '||' + p.interpretation.relacion + '||' + p.interpretation.implicacion);
    const uniqueTriples = new Set(triples);
    const groupOk = uniqueTriples.size === triples.length;
    if (!groupOk) allDistinct = false;
    report.push({
      label: group.label,
      firm_keys: profiles.map((p) => p.firm_key),
      pairwise_distinct: groupOk
    });
  });

  return { allDistinct, report };
}

function diagnosePerFieldUniqueness(cases) {
  const byShape = {};
  cases.forEach((testCase) => {
    const profile = brujulaEngine.buildProfile(testCase.indicators);
    byShape[profile.shape] = byShape[profile.shape] || [];
    byShape[profile.shape].push(profile);
  });

  const report = {};
  Object.keys(byShape).forEach((shape) => {
    const arr = byShape[shape];
    const domSet = new Set(arr.map((p) => p.interpretation.dominante));
    const relSet = new Set(arr.map((p) => p.interpretation.relacion));
    const impSet = new Set(arr.map((p) => p.interpretation.implicacion));
    const tripleSet = new Set(arr.map((p) => p.interpretation.dominante + '||' + p.interpretation.relacion + '||' + p.interpretation.implicacion));
    report[shape] = {
      n: arr.length,
      dominante_unicos: domSet.size,
      relacion_unicos: relSet.size,
      implicacion_unicos: impSet.size,
      triple_unicos: tripleSet.size
    };
  });
  return report;
}

function verifyRuleVersionsAllDistinct(cases) {
  const versions = new Map();
  let allDistinct = true;
  const collisions = [];
  cases.forEach((testCase) => {
    const profile = brujulaEngine.buildProfile(testCase.indicators);
    if (versions.has(profile.rule_version)) {
      allDistinct = false;
      collisions.push([versions.get(profile.rule_version), profile.firm_key]);
    } else {
      versions.set(profile.rule_version, profile.firm_key);
    }
  });
  return { allDistinct, total: versions.size, collisions };
}

function run() {
  const cases = buildAll56Cases();

  const discoveredKeys = cases.map((c) => c.expected_firm_key).sort();
  const expectedKeysSorted = EXPECTED_56_FIRM_KEYS.slice().sort();
  const missing = expectedKeysSorted.filter((k) => discoveredKeys.indexOf(k) === -1);
  const unexpected = discoveredKeys.filter((k) => expectedKeysSorted.indexOf(k) === -1);
  const matchesB4Literal = missing.length === 0 && unexpected.length === 0;

  const results = {
    total: cases.length,
    passed: 0,
    failed: 0,
    failures: []
  };

  const seenFirmKeys = new Set();
  const seenPatronByShape = new Map();
  const seenTripleByFirm = new Map();
  const byShapeExample = {};
  let exampleE5 = null;

  cases.forEach((testCase) => {
    const label = testCase.expected_firm_key;
    try {
      const run1 = brujulaEngine.buildProfile(testCase.indicators);
      const run2 = brujulaEngine.buildProfile(testCase.indicators.slice());
      assert.deepStrictEqual(run1, run2, 'determinismo: dos ejecuciones difieren');

      const profile = run1;
      const interp = profile.interpretation;

      assert.strictEqual(profile.firm_key, testCase.expected_firm_key, 'firm_key no coincide');
      assert.strictEqual(seenFirmKeys.has(profile.firm_key), false, 'firm_key duplicada: ' + profile.firm_key);
      seenFirmKeys.add(profile.firm_key);

      const VALID_SHAPES = ['5', '4-1', '3-2', '3-1-1', '2-2-1', '2-1-1-1'];
      assert.ok(VALID_SHAPES.indexOf(profile.shape) !== -1, 'shape inválido: ' + profile.shape);
      const countsFromKey = profile.firm_key.split('|').map((p) => parseInt(p.split(':')[1], 10));
      assert.strictEqual(profile.shape, countsFromKey.join('-'), 'shape no coincide con la partición de firm_key');

      ['patron', 'dominante', 'relacion', 'implicacion'].forEach((field) => {
        assert.ok(interp[field] && interp[field].trim().length > 0, 'campo vacío: ' + field);
      });

      assert.strictEqual(countSentences(interp.patron), 1, 'patron no tiene 1 oración');
      const domSentences = countSentences(interp.dominante);
      assert.ok(domSentences >= 1 && domSentences <= 2, 'dominante fuera de 1-2 oraciones: ' + domSentences);
      assert.strictEqual(countSentences(interp.relacion), 1, 'relacion no tiene 1 oración');
      const impSentences = countSentences(interp.implicacion);
      assert.ok(impSentences >= 1 && impSentences <= 2, 'implicacion fuera de 1-2 oraciones: ' + impSentences);
      const total = countSentences(interp.patron) + domSentences + countSentences(interp.relacion) + impSentences;
      assert.ok(total >= 4 && total <= 6, 'total de oraciones fuera de 4-6: ' + total);

      const fullTextLower = (interp.patron + ' ' + interp.dominante + ' ' + interp.relacion + ' ' + interp.implicacion).toLowerCase();
      const forbiddenFound = containsAny(fullTextLower, FORBIDDEN_TERMS.map((t) => t.toLowerCase()));
      assert.strictEqual(forbiddenFound.length, 0, 'términos prohibidos encontrados: ' + forbiddenFound.join(', '));
      const brujulaForbiddenFound = containsAny(fullTextLower, BRUJULA_FORBIDDEN_TERMS.map((t) => t.toLowerCase()));
      assert.strictEqual(brujulaForbiddenFound.length, 0, 'términos prohibidos de brujula encontrados: ' + brujulaForbiddenFound.join(', '));

      const impLower = interp.implicacion.toLowerCase();
      const hasGeneralHedge = GENERAL_HEDGES.some((h) => impLower.indexOf(h) !== -1);
      assert.ok(hasGeneralHedge, 'implicacion sin hedge general de hipótesis');
      if (profile.shape === '2-1-1-1') {
        const hasDispersionQualifier = DISPERSION_QUALIFIERS.some((h) => impLower.indexOf(h) !== -1);
        assert.ok(hasDispersionQualifier, 'implicacion de 2-1-1-1 sin calificador de baja dominancia');
      }

      const labelsIn = (text) => Object.keys(brujulaEngine.LABELS).filter((ind) => text.indexOf(brujulaEngine.LABELS[ind]) !== -1);

      const patronLabels = labelsIn(interp.patron);
      assert.strictEqual(patronLabels.length, 0, 'patron contiene nombres de indicador (debe ser shape-level puro): ' + patronLabels.join(', '));

      const dominanteLabels = labelsIn(interp.dominante);
      const relacionLabels = labelsIn(interp.relacion);
      const implicacionLabels = labelsIn(interp.implicacion);

      assert.ok(dominanteLabels.length >= 1, 'dominante no nombra ningún indicador');
      assert.strictEqual(implicacionLabels.length, 0, 'implicacion contiene nombres de indicador: ' + implicacionLabels.join(', '));

      const overlap = relacionLabels.filter((ind) => dominanteLabels.indexOf(ind) !== -1);
      assert.strictEqual(overlap.length, 0, 'relacion repite en dominante: ' + overlap.join(', '));

      const RELACION_MAY_NAME = { '4-1': true, '3-1-1': true, '2-1-1-1': true };
      if (RELACION_MAY_NAME[profile.shape]) {
        assert.ok(relacionLabels.length >= 1, 'relacion de shape ' + profile.shape + ' debería distinguir el/los secundario(s) por nombre y no lo hace');
      } else {
        assert.strictEqual(relacionLabels.length, 0, 'relacion de shape ' + profile.shape + ' no debería nombrar indicadores y lo hace: ' + relacionLabels.join(', '));
      }

      if (!seenPatronByShape.has(profile.shape)) seenPatronByShape.set(profile.shape, new Set());
      seenPatronByShape.get(profile.shape).add(interp.patron);

      const triple = interp.dominante + '||' + interp.relacion + '||' + interp.implicacion;
      assert.strictEqual(seenTripleByFirm.has(triple), false, 'textos (dominante+relacion+implicacion) repetidos con firma: ' + seenTripleByFirm.get(triple));
      seenTripleByFirm.set(triple, profile.firm_key);

      assert.strictEqual(profile.shape_algorithm_version, 1);
      assert.strictEqual(profile.contract_version, '1.0.2');

      assert.match(profile.rule_version, /^[0-9a-f]{64}$/, 'rule_version no es un SHA-256 hex válido');

      ['indicators', 'firm_key', 'shape', 'shape_algorithm_version', 'contract_version', 'rule_version', 'interpretation'].forEach((f) => {
        assert.ok(Object.prototype.hasOwnProperty.call(profile, f), 'falta campo de trazabilidad: ' + f);
      });

      if (!byShapeExample[profile.shape]) byShapeExample[profile.shape] = { firm_key: profile.firm_key, profile: profile };
      if (profile.firm_key === 'ejemplo:5') exampleE5 = profile;

      results.passed += 1;
    } catch (err) {
      results.failed += 1;
      results.failures.push({ firm_key: label, error: err.message });
    }
  });

  const coverageOk = results.total === 56;

  const allPatronTexts = new Map();
  let crossShapeCollision = null;
  seenPatronByShape.forEach((set, shape) => {
    set.forEach((text) => {
      if (allPatronTexts.has(text) && allPatronTexts.get(text) !== shape) {
        crossShapeCollision = { text, shapes: [allPatronTexts.get(text), shape] };
      }
      allPatronTexts.set(text, shape);
    });
  });

  console.log('========================================================');
  console.log('brujulaEngine — resultado de los 56 casos de prueba (A.11)');
  console.log('========================================================');
  console.log('Total de firmas generadas:', results.total, coverageOk ? '(56 esperadas: OK)' : '(¡ERROR! se esperaban 56)');
  console.log('Pasaron:', results.passed);
  console.log('Fallaron:', results.failed);
  console.log('Colisión de patron entre shapes distintos:', crossShapeCollision ? JSON.stringify(crossShapeCollision) : 'ninguna (OK)');

  if (results.failures.length > 0) {
    console.log('--------------------------------------------------------');
    console.log('Detalle de fallos:');
    results.failures.forEach((f) => console.log('  -', f.firm_key, '->', f.error));
  }

  const fieldReport = diagnosePerFieldUniqueness(cases);
  const rv = verifyRuleVersionsAllDistinct(cases);
  const b9 = verifyB9RiskPairs();

  console.log('========================================================');
  console.log('ROLLUP:', JSON.stringify({
    coverage_56: coverageOk,
    matches_b4_literal_list: matchesB4Literal,
    all_passed: results.failed === 0,
    passed: results.passed,
    failed: results.failed,
    cross_shape_patron_collision: !!crossShapeCollision,
    b9_risk_pairs_distinct: b9.allDistinct,
    rule_version_all_distinct: rv.allDistinct
  }));

  if (!coverageOk || !matchesB4Literal || !rv.allDistinct || results.failed > 0) {
    process.exitCode = 1;
  }
}

run();
