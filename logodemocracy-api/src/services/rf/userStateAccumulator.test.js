const assert = require('assert');
const {
  createEmptyState,
  computeAggregates,
  accumulate
} = require('./userStateAccumulator');

console.log('Iniciando batería de 19 pruebas para userStateAccumulator (Contrato A v1.0.4)...\n');

// Fixtures con formato real de Brújula (4 claves, incluyendo la de valor 0)
const sampleAttempt1 = {
  attempt_id: 'uuid-1',
  test_id: 'brujula',
  instrument_version: '1.0.0',
  rule_version: '1.0.0',
  timestamp: '2026-09-15T09:00:00Z',
  indicator_sequence: ['ejemplo', 'analogia', 'secuencia', 'analogia', 'ejemplo'],
  indicator_counts: { ejemplo: 2, principio: 0, analogia: 2, secuencia: 1 },
  signature: [2, 0, 2, 1],
  firm_key: 'ejemplo:2|analogia:2|secuencia:1',
  dimension_id: 'entrada_al_contenido',
  dimension_name: 'Entrada al contenido'
};

const sampleAttempt2 = {
  attempt_id: 'uuid-2',
  test_id: 'brujula',
  instrument_version: '1.0.0',
  rule_version: '1.0.0',
  timestamp: '2026-09-22T11:30:00Z',
  indicator_sequence: ['ejemplo', 'ejemplo', 'ejemplo', 'analogia', 'secuencia'],
  indicator_counts: { ejemplo: 3, principio: 0, analogia: 1, secuencia: 1 },
  signature: [3, 0, 1, 1],
  firm_key: 'ejemplo:3|analogia:1|secuencia:1',
  dimension_id: 'entrada_al_contenido',
  dimension_name: 'Entrada al contenido'
};

// 1. createEmptyState correcto. Rechaza userRef inválido.
{
  const state = createEmptyState('user-x');
  assert.deepStrictEqual(state, {
    contract_version: '1.0.4',
    user_ref: 'user-x',
    last_updated: null,
    dimensions: {}
  });
  assert.throws(() => createEmptyState(''), /userRef/);
  console.log('✓ Test 1: createEmptyState OK');
}

// 2. Primer intento
{
  const emptyState = createEmptyState('user-x');
  const state1 = accumulate(emptyState, sampleAttempt1);
  const dim = state1.dimensions.entrada_al_contenido;
  
  assert.strictEqual(dim.history.length, 1);
  assert.strictEqual(dim.attempts_count, 1);
  assert.deepStrictEqual(dim.latest_attempt, dim.history[0]);
  assert.strictEqual(dim.aggregates.indicator_stddev.ejemplo, 0);
  assert.strictEqual(state1.last_updated, '2026-09-15T09:00:00Z');
  console.log('✓ Test 2: Primer intento OK');
}

// 3. Segundo intento (N=2)
{
  const state1 = accumulate(createEmptyState('user-x'), sampleAttempt1);
  const state2 = accumulate(state1, sampleAttempt2);
  const dim = state2.dimensions.entrada_al_contenido;
  
  assert.strictEqual(dim.history.length, 2);
  assert.deepStrictEqual(dim.aggregates.indicator_means, {
    ejemplo: 2.5, principio: 0, analogia: 1.5, secuencia: 1
  });
  assert.deepStrictEqual(dim.aggregates.indicator_stddev, {
    ejemplo: 0.5, principio: 0, analogia: 0.5, secuencia: 0
  });
  console.log('✓ Test 3: Segundo intento y aggregates OK');
}

// 4. Inmutabilidad
{
  const emptyState = createEmptyState('user-x');
  const copyState = JSON.parse(JSON.stringify(emptyState));
  const copyAttempt = JSON.parse(JSON.stringify(sampleAttempt1));
  accumulate(emptyState, sampleAttempt1);
  assert.deepStrictEqual(emptyState, copyState);
  assert.deepStrictEqual(sampleAttempt1, copyAttempt);
  console.log('✓ Test 4: Inmutabilidad OK');
}

// 5. Rechazo de state inválido
{
  assert.throws(() => accumulate(null, sampleAttempt1));
  assert.throws(() => accumulate(undefined, sampleAttempt1));
  assert.throws(() => accumulate({}, sampleAttempt1));
  assert.throws(() => accumulate('estado', sampleAttempt1));
  console.log('✓ Test 5: Rechazo state inválido OK');
}

// 6. Validación de campos obligatorios
{
  const state = createEmptyState('user-x');
  Object.keys(sampleAttempt1).forEach(field => {
    const incomplete = { ...sampleAttempt1 };
    delete incomplete[field];
    assert.throws(() => accumulate(state, incomplete), new RegExp(field));
  });
  console.log('✓ Test 6: Campos obligatorios OK');
}

// 7. Validación de indicator_sequence (5 strings)
{
  const state = createEmptyState('user-x');
  assert.throws(() => accumulate(state, { ...sampleAttempt1, indicator_sequence: ['ejemplo'] }));
  console.log('✓ Test 7: indicator_sequence length OK');
}

// 8. Validación de indicator_counts (enteros finitos >= 0)
{
  const state = createEmptyState('user-x');
  assert.throws(() => accumulate(state, { ...sampleAttempt1, indicator_counts: { ejemplo: -1, principio: 0, analogia: 5, secuencia: 1 } }));
  assert.throws(() => accumulate(state, { ...sampleAttempt1, indicator_counts: { ejemplo: 2.5, principio: 0, analogia: 1.5, secuencia: 1 } }));
  console.log('✓ Test 8: indicator_counts values OK');
}

// 9. Validación de signature
{
  const state = createEmptyState('user-x');
  assert.throws(() => accumulate(state, { ...sampleAttempt1, signature: [2, 0, 2] }));
  console.log('✓ Test 9: signature OK');
}

// 10. Rechazo de clave extra con valor > 0
{
  const state = createEmptyState('user-x');
  const badAttempt = {
    ...sampleAttempt1,
    indicator_counts: { ejemplo: 2, principio: 1, analogia: 1, secuencia: 1 }
  };
  assert.throws(() => accumulate(state, badAttempt), /R7 Violación/);
  console.log('✓ Test 10: Rechazo clave extra con valor > 0 OK');
}

// 11. Aceptación de clave extra con valor 0 (R7 relajado)
{
  const state = createEmptyState('user-x');
  assert.doesNotThrow(() => accumulate(state, sampleAttempt1));
  console.log('✓ Test 11: Aceptación clave extra con valor 0 OK');
}

// 12. Rechazo por frecuencia incorrecta
{
  const state = createEmptyState('user-x');
  const badAttempt = {
    ...sampleAttempt1,
    indicator_counts: { ejemplo: 3, principio: 0, analogia: 1, secuencia: 1 }
  };
  assert.throws(() => accumulate(state, badAttempt), /R7 Violación/);
  console.log('✓ Test 12: Rechazo frecuencia incorrecta OK');
}

// 13. Validación de timestamp ISO 8601
{
  const state = createEmptyState('user-x');
  assert.throws(() => accumulate(state, { ...sampleAttempt1, timestamp: '15/09/2026' }));
  console.log('✓ Test 13: Timestamp ISO 8601 OK');
}

// 14. Determinismo
{
  const state = createEmptyState('user-x');
  const resA = accumulate(state, sampleAttempt1);
  const resB = accumulate(state, sampleAttempt1);
  assert.deepStrictEqual(resA, resB);
  console.log('✓ Test 14: Determinismo OK');
}

// 15. Múltiples test_id por dimensión
{
  const state = accumulate(createEmptyState('user-x'), sampleAttempt1);
  const newState = accumulate(state, { ...sampleAttempt2, test_id: 'otro_test' });
  assert.strictEqual(newState.dimensions.entrada_al_contenido.history.length, 2);
  console.log('✓ Test 15: Múltiples test_id (R5) OK');
}

// 16. Orden temporal no decreciente (R6)
{
  const state = accumulate(createEmptyState('user-x'), sampleAttempt1);
  assert.throws(() => accumulate(state, { ...sampleAttempt2, timestamp: '2026-09-10T00:00:00Z' }), /R6/);
  assert.doesNotThrow(() => accumulate(state, { ...sampleAttempt2, timestamp: '2026-09-15T09:00:00Z' }));
  console.log('✓ Test 16: Orden temporal (R6) OK');
}

// 17. Consistencia de indicadores por dimensión (R10)
{
  const state = accumulate(createEmptyState('user-x'), sampleAttempt1);
  const badAttempt = {
    ...sampleAttempt2,
    indicator_sequence: ['opcion_a', 'opcion_b', 'opcion_a', 'opcion_b', 'opcion_a'],
    indicator_counts: { opcion_a: 3, opcion_b: 2, opcion_c: 0, opcion_d: 0 }
  };
  assert.throws(() => accumulate(state, badAttempt), /R10/);
  console.log('✓ Test 17: Consistencia de indicadores (R10) OK');
}

// 18. last_updated global (R11)
{
  const stateA = accumulate(createEmptyState('user-x'), { ...sampleAttempt1, dimension_id: 'dim_a', timestamp: '2026-09-20T10:00:00Z' });
  const stateB = accumulate(stateA, { ...sampleAttempt1, dimension_id: 'dim_b', timestamp: '2026-09-18T10:00:00Z' });
  assert.strictEqual(stateB.last_updated, '2026-09-20T10:00:00Z');
  console.log('✓ Test 18: last_updated global (R11) OK');
}

// 19. Integración con brujulaEngine
{
  const brujulaEngine = require('./brujulaEngine');
  const state = createEmptyState('user-int');
  const realSeq = ['ejemplo', 'analogia', 'secuencia', 'analogia', 'ejemplo'];

  const profile = brujulaEngine.buildProfile(realSeq);

  // Construir counts asegurando las 4 claves del instrumento
  const counts = { ejemplo: 0, principio: 0, analogia: 0, secuencia: 0 };
  profile.indicators.forEach(ind => counts[ind]++);

  // Construir signature en orden fijo [E, P, A, S]
  const signature = [counts.ejemplo, counts.principio, counts.analogia, counts.secuencia];

  const attempt = {
    attempt_id: 'real-uuid',
    test_id: 'brujula',
    instrument_version: '1.0.0',
    rule_version: profile.rule_version,        // field real
    timestamp: '2026-09-29T14:23:00Z',         // determinista
    indicator_sequence: profile.indicators,
    indicator_counts: counts,
    signature: signature,
    firm_key: profile.firm_key,                // field real (snake_case)
    dimension_id: 'entrada_al_contenido',
    dimension_name: 'Entrada al contenido'
  };

  const finalState = accumulate(state, attempt);
  assert.strictEqual(finalState.dimensions.entrada_al_contenido.history.length, 1);
  assert.deepStrictEqual(finalState.dimensions.entrada_al_contenido.latest_attempt.indicator_counts, counts);
  console.log('✓ Test 19: Integración con brujulaEngine OK');
}

console.log('\n¡La batería de 19 pruebas de userStateAccumulator (v1.0.4) pasó exitosamente!');
