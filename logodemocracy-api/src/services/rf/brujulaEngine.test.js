// logodemocracy-api/src/services/rf/brujulaEngine.test.js
//
// Pruebas obligatorias del Microtest "brujula" (A.11 del contrato).
// Ejecutar con: node logodemocracy-api/src/services/rf/brujulaEngine.test.js
//
// No usa Jest ni Mocha: solo 'assert' nativo de Node, siguiendo la
// decisión explícita de no instalar dependencias nuevas. Sigue el mismo
// patrón que rfTest.js (require + función run() invocada al final +
// console.log), pero con aserciones reales y un resumen pass/fail, ya que
// rfTest.js no las tenía y aquí se pidió específicamente verificación
// mecánica de los 56 casos.

'use strict';

const assert = require('assert');
const brujulaEngine = require('./brujulaEngine');

const IND = ['ejemplo', 'principio', 'analogia', 'secuencia'];

// Lista literal de las 56 firmas de B.4, transcrita de forma independiente
// (no derivada de canonicalOrder ni de ninguna función bajo prueba). Sirve
// para detectar si la enumeración por descubrimiento (buildAll56Cases)
// alguna vez encuentra menos, más, o firmas distintas de las 56 exactas
// que exige el contrato — en vez de confiar ciegamente en que "salieron
// 56 cosas".
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

// Términos prohibidos, A.7.3.
const FORBIDDEN_TERMS = [
  'demuestra', 'siempre', 'nunca', 'es usted', 'su personalidad',
  'característica estable', 'rasgo', 'tipo de persona', 'diagnóstico',
  'definitivamente', 'en todos los casos', 'usted es', 'de forma estable'
];

// Prohibiciones específicas de brujula, B.5.
const BRUJULA_FORBIDDEN_TERMS = [
  'estilo cognitivo', 'modo de pensar', 'forma de ser'
];

const GENERAL_HEDGES = ['podría', 'puede que', 'sugiere', 'tiende a', 'en algunos casos'];
const DISPERSION_QUALIFIERS = ['en algunos casos', 'en ciertas situaciones', 'de manera puntual'];

// ------------------------------------------------------------------
// Construcción de los 56 casos (B.4), enumerando todas las
// combinaciones de 5 posiciones x 4 indicadores y agrupando por
// multiconjunto de indicadores usados (cada multiconjunto == una firma).
// ------------------------------------------------------------------

function buildAll56Cases() {
  const seen = new Map(); // firm_key -> indicators array de referencia

  // Genera todas las combinaciones-con-repetición de 5 indicadores sobre
  // 4 posibles valores (4^5 = 1024), y se queda con un representante por
  // multiconjunto distinto. El orden real de las 5 preguntas no afecta
  // ni firm_key ni shape (A.4.1 solo cuenta apariciones), así que un
  // representante por multiconjunto basta para cubrir las 56 firmas.
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
  // Aproximación operacional: cuenta puntos que terminan oración (no los
  // usados dentro de "—...—" ni comas). Los textos de este motor usan
  // '.' únicamente como cierre de oración.
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.]+\./g);
  return matches ? matches.length : 0;
}

function containsAny(haystackLower, needles) {
  return needles.filter((n) => haystackLower.indexOf(n.toLowerCase()) !== -1);
}

// ------------------------------------------------------------------
// Verificación explícita y nombrada de los tres puntos de riesgo de B.9.
// La unicidad global (punto 15, dentro del loop principal) ya prueba que
// NINGÚN par de firmas del mismo shape comparte dominante+relacion+
// implicacion — lo cual cubre estos casos implícitamente. Esta función
// los deja, además, verificados uno por uno y por nombre, tal como pide
// la auditoría: no basta con que la comprobación global los cubra sin
// que quede explícito cuáles son.
// ------------------------------------------------------------------

function verifyB9RiskPairs() {
  const groups = [
    {
      label: 'Riesgo B.9 #1 — mismo primario (ejemplo:4), distinto secundario',
      cases: [
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'principio'], // E:4|P:1
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'analogia'],  // E:4|A:1
        ['ejemplo', 'ejemplo', 'ejemplo', 'ejemplo', 'secuencia']  // E:4|S:1
      ]
    },
    {
      label: 'Riesgo B.9 #2 — mismo primario (ejemplo:3), distinto secundario recurrente',
      cases: [
        ['ejemplo', 'ejemplo', 'ejemplo', 'principio', 'principio'], // E:3|P:2
        ['ejemplo', 'ejemplo', 'ejemplo', 'analogia', 'analogia']    // E:3|A:2
      ]
    },
    {
      label: 'Riesgo B.9 #3 — mismo conjunto de indicadores {analogia,ejemplo,principio}, distinto primario/singleton',
      cases: [
        ['principio', 'principio', 'analogia', 'analogia', 'ejemplo'], // P:2|A:2|E:1
        ['analogia', 'analogia', 'ejemplo', 'ejemplo', 'principio']    // A:2|E:2|P:1
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

// ------------------------------------------------------------------
// Diagnóstico de unicidad POR CAMPO dentro de cada shape (no solo por
// triple dominante+relacion+implicacion).
//
// Ruling registrado sobre A.6.2 (contrato v1.0.1): el requisito de
// distinción se satisface por el CONJUNTO de los tres campos, no exige
// unicidad de cada campo por separado. Por eso "dominante" puede
// coincidir entre firmas que comparten indicador primario (4-1, 3-1-1) o
// par principal (2-2-1) — en esos casos "relacion" es quien distingue,
// tal como B.9 punto 1 delega explícitamente ("el relacion debe
// distinguir claramente entre principio y secuencia como secundarios").
// Este diagnóstico se conserva como reporte informativo — no como
// aserción que bloquee — precisamente para que esa situación conocida y
// ya fallada sea visible en cada corrida, no oculta detrás del chequeo
// de la triple (que sí bloquea, ver punto 15 de A.11 más abajo).
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// Runner
// ------------------------------------------------------------------

function run() {
  const cases = buildAll56Cases();

  // Verificación contra la lista literal de B.4 (independiente de la
  // enumeración por descubrimiento): detecta si canonicalOrder tuviera
  // un bug que generara un set distinto de 56 elementos, sin necesidad
  // de que coverageOk (total === 56) lo delate por casualidad de conteo.
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
  const seenPatronByShape = new Map(); // shape -> Set(patron text)
  const seenTripleByFirm = new Map(); // "dominante|relacion|implicacion" -> firm_key (para detectar textos intercambiables)
  const byShapeExample = {};
  let exampleE5 = null;

  cases.forEach((testCase) => {
    const label = testCase.expected_firm_key;
    try {
      // --- Determinismo: dos ejecuciones, mismo output byte a byte ---
      const run1 = brujulaEngine.buildProfile(testCase.indicators);
      const run2 = brujulaEngine.buildProfile(testCase.indicators.slice());
      assert.deepStrictEqual(run1, run2, 'determinismo: dos ejecuciones difieren');

      const profile = run1;
      const interp = profile.interpretation;

      // 1 + 17: firm_key coincide con la especificación canónica
      assert.strictEqual(profile.firm_key, testCase.expected_firm_key, 'firm_key no coincide');
      assert.strictEqual(seenFirmKeys.has(profile.firm_key), false, 'firm_key duplicada: ' + profile.firm_key);
      seenFirmKeys.add(profile.firm_key);

      // 3: shape correcto (validado indirectamente: shape debe ser uno
      // de los 6 válidos y coherente con el patrón de conteos de firm_key)
      const VALID_SHAPES = ['5', '4-1', '3-2', '3-1-1', '2-2-1', '2-1-1-1'];
      assert.ok(VALID_SHAPES.indexOf(profile.shape) !== -1, 'shape inválido: ' + profile.shape);
      const countsFromKey = profile.firm_key.split('|').map((p) => parseInt(p.split(':')[1], 10));
      assert.strictEqual(profile.shape, countsFromKey.join('-'), 'shape no coincide con la partición de firm_key');

      // 4 + 5: los cuatro campos presentes y no vacíos
      ['patron', 'dominante', 'relacion', 'implicacion'].forEach((field) => {
        assert.ok(interp[field] && interp[field].trim().length > 0, 'campo vacío: ' + field);
      });

      // 6: longitud de patron (1 oración)
      assert.strictEqual(countSentences(interp.patron), 1, 'patron no tiene 1 oración');
      // 7: dominante 1-2 oraciones
      const domSentences = countSentences(interp.dominante);
      assert.ok(domSentences >= 1 && domSentences <= 2, 'dominante fuera de 1-2 oraciones: ' + domSentences);
      // 8: relacion 1 oración
      assert.strictEqual(countSentences(interp.relacion), 1, 'relacion no tiene 1 oración');
      // 9: implicacion 1-2 oraciones
      const impSentences = countSentences(interp.implicacion);
      assert.ok(impSentences >= 1 && impSentences <= 2, 'implicacion fuera de 1-2 oraciones: ' + impSentences);
      // 10: total 4-6 oraciones (sin contar el marco)
      const total = countSentences(interp.patron) + domSentences + countSentences(interp.relacion) + impSentences;
      assert.ok(total >= 4 && total <= 6, 'total de oraciones fuera de 4-6: ' + total);

      // 11 + 12 (parcial): términos prohibidos ausentes
      const fullTextLower = (interp.patron + ' ' + interp.dominante + ' ' + interp.relacion + ' ' + interp.implicacion).toLowerCase();
      const forbiddenFound = containsAny(fullTextLower, FORBIDDEN_TERMS.map((t) => t.toLowerCase()));
      assert.strictEqual(forbiddenFound.length, 0, 'términos prohibidos encontrados: ' + forbiddenFound.join(', '));
      const brujulaForbiddenFound = containsAny(fullTextLower, BRUJULA_FORBIDDEN_TERMS.map((t) => t.toLowerCase()));
      assert.strictEqual(brujulaForbiddenFound.length, 0, 'términos prohibidos de brujula encontrados: ' + brujulaForbiddenFound.join(', '));

      // 12: hedges exigidos en implicacion
      const impLower = interp.implicacion.toLowerCase();
      const hasGeneralHedge = GENERAL_HEDGES.some((h) => impLower.indexOf(h) !== -1);
      assert.ok(hasGeneralHedge, 'implicacion sin hedge general de hipótesis');
      if (profile.shape === '2-1-1-1') {
        const hasDispersionQualifier = DISPERSION_QUALIFIERS.some((h) => impLower.indexOf(h) !== -1);
        assert.ok(hasDispersionQualifier, 'implicacion de 2-1-1-1 sin calificador de baja dominancia');
      }

      // 13: patron usa los nombres descriptivos correctos
      const orderedForFirm = brujulaEngine._internal.canonicalOrder(
        brujulaEngine._internal.computeCounts(testCase.indicators)
      );
      orderedForFirm.forEach((ind) => {
        assert.ok(interp.patron.indexOf(brujulaEngine.LABELS[ind]) !== -1, 'patron no contiene el label de ' + ind);
      });

      // 14: firmas de shapes distintos no generan el mismo patron
      if (!seenPatronByShape.has(profile.shape)) seenPatronByShape.set(profile.shape, new Set());
      seenPatronByShape.get(profile.shape).add(interp.patron);

      // 15: firmas distintas del mismo shape no generan textos intercambiables
      const triple = interp.dominante + '||' + interp.relacion + '||' + interp.implicacion;
      assert.strictEqual(seenTripleByFirm.has(triple), false, 'textos (dominante+relacion+implicacion) repetidos con firma: ' + seenTripleByFirm.get(triple));
      seenTripleByFirm.set(triple, profile.firm_key);

      // shape_algorithm_version / contract_version
      assert.strictEqual(profile.shape_algorithm_version, 1);
      assert.strictEqual(profile.contract_version, '1.0.1');

      // 18: rule_version reproducible (ya cubierto por deepStrictEqual de
      // run1 vs run2) + forma de hash válida
      assert.match(profile.rule_version, /^[0-9a-f]{64}$/, 'rule_version no es un SHA-256 hex válido');

      // 19: trazabilidad — deterministic_profile trae los campos exigidos
      // (generated_at se añade en el controller, no aquí — ver diseño)
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

  // 2 (cobertura): las 56 firmas existen
  const coverageOk = results.total === 56;

  // 14 (verificación cruzada): ningún patron se repite entre shapes distintos
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

  console.log('--------------------------------------------------------');
  console.log('Caso de calibración ejemplo:5 (B.6):');
  console.log(JSON.stringify(exampleE5, null, 2));

  console.log('--------------------------------------------------------');
  console.log('Un ejemplo por cada uno de los seis shapes:');
  Object.keys(byShapeExample).sort().forEach((shape) => {
    console.log('  shape', shape, '- firm_key:', byShapeExample[shape].firm_key);
  });

  console.log('--------------------------------------------------------');
  console.log('Verificación contra la lista literal de 56 firm_key de B.4:');
  console.log('  coincide exactamente:', matchesB4Literal ? 'OK' : 'FALLÓ');
  if (!matchesB4Literal) {
    console.log('  faltantes:', missing.join(', ') || '(ninguna)');
    console.log('  inesperadas:', unexpected.join(', ') || '(ninguna)');
  }

  console.log('--------------------------------------------------------');
  console.log('Diagnóstico de unicidad POR CAMPO dentro de cada shape (no solo por triple):');
  const fieldReport = diagnosePerFieldUniqueness(cases);
  Object.keys(fieldReport).sort().forEach((shape) => {
    const r = fieldReport[shape];
    console.log(
      '  shape ' + shape + ' (n=' + r.n + ')  dominante únicos: ' + r.dominante_unicos +
      ' | relacion únicos: ' + r.relacion_unicos +
      ' | implicacion únicos: ' + r.implicacion_unicos +
      ' | triple únicos: ' + r.triple_unicos
    );
  });
  console.log('  Nota (ruling A.6.2 contrato v1.0.1): dominante coincide por diseño entre firmas del mismo');
  console.log('  primario/par en 4-1 (4/12), 3-1-1 (4/12) y 2-2-1 (6/12) — relacion distingue en esos casos');
  console.log('  (B.9 punto 1). La triple SÍ es única en las 56 firmas (verificado en el punto 15 de A.11).');

  console.log('--------------------------------------------------------');
  console.log('Verificación de rule_version únicos entre las 56 firmas:');
  const rv = verifyRuleVersionsAllDistinct(cases);
  console.log('  rule_version distintos:', rv.total, 'de', cases.length, rv.allDistinct ? '(OK, sin colisiones)' : '(¡COLISIÓN DETECTADA!)');
  if (!rv.allDistinct) {
    console.log('  colisiones:', JSON.stringify(rv.collisions));
  }

  console.log('--------------------------------------------------------');
  console.log('Verificación explícita de los tres pares de riesgo (B.9):');
  const b9 = verifyB9RiskPairs();
  b9.report.forEach((g) => {
    console.log('  ' + g.label);
    console.log('    firmas comparadas:', g.firm_keys.join(' | '));
    console.log('    dominante+relacion+implicacion pairwise distintos:', g.pairwise_distinct ? 'OK' : 'FALLÓ');
  });
  try {
    assert.strictEqual(b9.allDistinct, true, 'al menos un par de riesgo B.9 produjo textos intercambiables');
  } catch (err) {
    results.failed += 1;
    results.failures.push({ firm_key: 'verificación B.9', error: err.message });
  }

  console.log('========================================================');
  console.log('ROLLUP:', JSON.stringify({
    coverage_56: coverageOk,
    matches_b4_literal_list: matchesB4Literal,
    all_passed: results.failed === 0,
    passed: results.passed,
    failed: results.failed,
    cross_shape_patron_collision: !!crossShapeCollision,
    b9_risk_pairs_distinct: b9.allDistinct,
    rule_version_all_distinct: rv.allDistinct,
    per_field_uniqueness_by_shape: fieldReport,
    ruling_A62_v101: 'resuelto: A.6.2 se satisface por el conjunto de los tres campos (contrato v1.0.1); dominante puede coincidir dentro de shape cuando relacion distingue (B.9)'
  }));

  if (!coverageOk || !matchesB4Literal || !rv.allDistinct || results.failed > 0) {
    process.exitCode = 1;
  }
}

run();
