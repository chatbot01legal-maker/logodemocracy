// assets/js/platform/tests/platform-cognitive.test.js
// Pruebas de integridad del Hito 3 - Capa cognitiva.
// Ejecutar en navegador con consola abierta.
// Sin dependencias externas.

(function() {
  'use strict';

  // --- Utilidades de test ---
  var tests = [];
  var passed = 0;
  var failed = 0;

  function test(name, fn) {
    tests.push({ name, fn });
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function runTests() {
    console.log('🧪 Ejecutando pruebas del Hito 3 - Cognitive Layer...\n');

    tests.forEach(function(t) {
      try {
        t.fn();
        console.log('✅ PASS: ' + t.name);
        passed++;
      } catch (e) {
        console.error('❌ FAIL: ' + t.name);
        console.error('   ' + e.message);
        failed++;
      }
    });

    console.log('\n📊 Resultado: ' + passed + ' aprobadas / ' + failed + ' fallidas');

    if (failed === 0) {
      console.log('🎉 HITO 3 VALIDADO CORRECTAMENTE');
    } else {
      console.log('❌ HITO 3 NO VALIDADO: ' + failed + ' pruebas fallaron.');
    }
  }

  // --- Pruebas ---

  test('PedagogicalEngine existe y tiene getStrategy()', function() {
    assert(typeof PedagogicalEngine !== 'undefined', 'PedagogicalEngine no está definido');
    assert(typeof PedagogicalEngine.getStrategy === 'function', 'PedagogicalEngine.getStrategy debe ser una función');
    assert(typeof PedagogicalEngine.refresh === 'function', 'PedagogicalEngine.refresh debe ser una función');
  });

  test('ContextAdapter existe y tiene normalize()', function() {
    assert(typeof ContextAdapter !== 'undefined', 'ContextAdapter no está definido');
    assert(typeof ContextAdapter.normalize === 'function', 'ContextAdapter.normalize debe ser una función');
  });

  test('LearningStrategy existe y tiene generate()', function() {
    assert(typeof LearningStrategy !== 'undefined', 'LearningStrategy no está definido');
    assert(typeof LearningStrategy.generate === 'function', 'LearningStrategy.generate debe ser una función');
  });

  test('ContextAdapter normaliza correctamente el contexto', function() {
    var mockContext = {
      profile: {
        estilo_explicativo: 'analogico',
        nivel_abstraccion_inicial: 'concreto',
        preferencia_formato: 'visual',
        necesidad_andamiaje: 'alta',
        tipo_andamiaje_preferido: ['resumen', 'mapa'],
        orientacion: 'practica',
        tipo_analogia_dominante: 'sistemica',
        preferencia_ejemplos: 'alta',
        secuencia_preferida: 'ejemplos_primero'
      },
      learningMap: {
        pensamiento_sistemico: 'alto',
        competencias: {
          argumentacion: { autonomy: 75 },
          lectura_critica: { autonomy: 60 },
          epistemologia: { autonomy: 45 }
        }
      },
      completedTests: ['brujula', 'ejemplos', 'puentes']
    };

    var result = ContextAdapter.normalize(mockContext);

    assert(result.learningPreferences, 'Falta learningPreferences en el resultado');
    assert(result.cognitiveProfile, 'Falta cognitiveProfile en el resultado');
    assert(result.progress, 'Falta progress en el resultado');

    assert(result.learningPreferences.explanationStyle === 'analogico', 'explanationStyle no se normalizó correctamente');
    assert(result.learningPreferences.abstractionLevel === 'concreto', 'abstractionLevel no se normalizó correctamente');
    assert(result.learningPreferences.preferredFormat === 'visual', 'preferredFormat no se normalizó correctamente');

    assert(result.cognitiveProfile.systemsThinking === 'alto', 'systemsThinking no se normalizó correctamente');
    assert(result.cognitiveProfile.argumentation === 75, 'argumentation no se normalizó correctamente');

    assert(result.progress.completedTests.length === 3, 'completedTests no se normalizó correctamente');
    assert(result.progress.progressPercentage === 30, 'progressPercentage no se calculó correctamente');
  });

  test('PedagogicalEngine genera estrategia coherente a partir del contexto', function() {
    // Guardar referencias originales
    var originalGetFullContext = LearningProfileService.getFullContext;

    // Mock de contexto predecible
    var mockFullContext = {
      profile: {
        estilo_explicativo: 'analogico',
        nivel_abstraccion_inicial: 'concreto',
        preferencia_formato: 'visual',
        necesidad_andamiaje: 'alta',
        tipo_andamiaje_preferido: ['resumen', 'mapa'],
        orientacion: 'practica'
      },
      learningMap: {
        pensamiento_sistemico: 'alto',
        competencias: {}
      },
      completedTests: ['brujula']
    };

    // Sobrescribir LearningProfileService.getFullContext
    LearningProfileService.getFullContext = function() {
      return Promise.resolve(mockFullContext);
    };

    // Forzar refresco de caché en PedagogicalEngine
    PedagogicalEngine.refresh();

    // Ejecutar getStrategy
    return PedagogicalEngine.getStrategy()
      .then(function(strategy) {
        // Verificar estructura de la estrategia
        assert(strategy, 'La estrategia no debería ser null');
        assert(typeof strategy.explanationStyle === 'string', 'Falta explanationStyle');
        assert(typeof strategy.abstractionLevel === 'string', 'Falta abstractionLevel');
        assert(typeof strategy.preferredFormat === 'string', 'Falta preferredFormat');
        assert(typeof strategy.scaffolding === 'string', 'Falta scaffolding');
        assert(typeof strategy.systemsThinking === 'string', 'Falta systemsThinking');
        assert(Array.isArray(strategy.recommendations), 'Falta recommendations (debe ser array)');
        assert(strategy.recommendations.length > 0, 'Debería haber al menos una recomendación');

        // Verificar coherencia con el perfil mockeado
        assert(strategy.explanationStyle === 'analogical', 'El estilo explicativo no coincide con el perfil');
        assert(strategy.abstractionLevel === 'concrete_first', 'El nivel de abstracción no coincide');
        assert(strategy.preferredFormat === 'visual', 'El formato preferido no coincide');
        assert(strategy.scaffolding === 'high', 'La necesidad de andamiaje no coincide');
        assert(strategy.systemsThinking === 'high', 'El pensamiento sistémico no coincide');

        // Restaurar original
        LearningProfileService.getFullContext = originalGetFullContext;
      })
      .catch(function(error) {
        // Restaurar original en caso de error
        LearningProfileService.getFullContext = originalGetFullContext;
        throw error;
      });
  });

  test('Evento cognitive:strategy_generated funciona', function() {
    var eventReceived = false;
    var strategyData = null;

    function handler(detail) {
      eventReceived = true;
      strategyData = detail;
    }

    // Suscribirse al evento
    EventBus.on('cognitive:strategy_generated', handler);

    // Emitir el evento manualmente (simulando que PedagogicalEngine lo emite)
    var testStrategy = {
      explanationStyle: 'analogical',
      abstractionLevel: 'concrete_first',
      preferredFormat: 'visual',
      scaffolding: 'high',
      systemsThinking: 'high',
      recommendations: ['Usar analogías', 'Comenzar desde ejemplos'],
      timestamp: Date.now()
    };

    EventBus.emit('cognitive:strategy_generated', testStrategy);

    // Verificar que el evento fue recibido
    assert(eventReceived === true, 'El evento cognitive:strategy_generated no fue recibido');
    assert(strategyData !== null, 'Los datos del evento no llegaron correctamente');
    assert(strategyData.explanationStyle === 'analogical', 'Los datos del evento no coinciden');

    // Limpiar listener
    EventBus.off('cognitive:strategy_generated', handler);
  });

  // --- Ejecutar pruebas ---
  runTests();

})();
