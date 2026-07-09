// assets/js/platform/tests/platform-services.test.js
// Pruebas de integridad de los servicios del Hito 2.
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
    console.log('🧪 Ejecutando pruebas del Hito 2 (Platform Services)...\n');

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

    console.log('\n📊 Resumen: ' + passed + ' pasaron, ' + failed + ' fallaron.');

    if (failed === 0) {
      console.log('✅ HITO 2 VALIDADO');
    } else {
      console.log('❌ HITO 2 NO VALIDADO: ' + failed + ' pruebas fallaron.');
    }
  }

  // --- Pruebas ---

  test('ProfileService existe', function() {
    assert(typeof ProfileService !== 'undefined', 'ProfileService no está definido');
    assert(typeof ProfileService.getProfile === 'function', 'ProfileService.getProfile debe ser una función');
  });

  test('LearningMapService existe', function() {
    assert(typeof LearningMapService !== 'undefined', 'LearningMapService no está definido');
    assert(typeof LearningMapService.getLearningMap === 'function', 'LearningMapService.getLearningMap debe ser una función');
  });

  test('MicrotestService existe', function() {
    assert(typeof MicrotestService !== 'undefined', 'MicrotestService no está definido');
    assert(typeof MicrotestService.save === 'function', 'MicrotestService.save debe ser una función');
    assert(typeof MicrotestService.listCompleted === 'function', 'MicrotestService.listCompleted debe ser una función');
  });

  test('LearningProfileService existe', function() {
    assert(typeof LearningProfileService !== 'undefined', 'LearningProfileService no está definido');
    assert(typeof LearningProfileService.getFullContext === 'function', 'LearningProfileService.getFullContext debe ser una función');
    assert(typeof LearningProfileService.refresh === 'function', 'LearningProfileService.refresh debe ser una función');
  });

  test('getFullContext() combina correctamente los servicios', function() {
    // Guardar referencias originales
    var originalProfile = ProfileService.getProfile;
    var originalLearningMap = LearningMapService.getLearningMap;
    var originalListCompleted = MicrotestService.listCompleted;

    // Datos de prueba predecibles
    var mockProfile = { estilo_explicativo: 'analogico', nivel_abstraccion: 'intermedio' };
    var mockLearningMap = { pensamiento_sistemico: 'alto', competencias: { logica: 75 } };
    var mockCompleted = { completed_tests: ['brujula', 'ejemplos'] };

    var profileCalled = false;
    var learningMapCalled = false;
    var listCompletedCalled = false;

    // Sobrescribir temporalmente con mocks
    ProfileService.getProfile = function() {
      profileCalled = true;
      return Promise.resolve(mockProfile);
    };
    LearningMapService.getLearningMap = function() {
      learningMapCalled = true;
      return Promise.resolve(mockLearningMap);
    };
    MicrotestService.listCompleted = function() {
      listCompletedCalled = true;
      return Promise.resolve(mockCompleted);
    };

    // Ejecutar el orquestador
    return LearningProfileService.refresh() // Limpiar caché antes de la prueba
      .then(function() {
        return LearningProfileService.getFullContext();
      })
      .then(function(context) {
        // Verificar que los tres servicios fueron llamados
        assert(profileCalled, 'ProfileService.getProfile no fue llamado');
        assert(learningMapCalled, 'LearningMapService.getLearningMap no fue llamado');
        assert(listCompletedCalled, 'MicrotestService.listCompleted no fue llamado');

        // Verificar que el contexto combina correctamente
        assert(context.profile, 'Falta profile en el contexto');
        assert(context.learningMap, 'Falta learningMap en el contexto');
        assert(context.completedTests, 'Falta completedTests en el contexto');
        assert(context.profile.estilo_explicativo === 'analogico', 'El perfil no contiene los datos esperados');
        assert(context.learningMap.pensamiento_sistemico === 'alto', 'El learningMap no contiene los datos esperados');
        assert(Array.isArray(context.completedTests), 'completedTests debe ser un array');
        assert(context.completedTests.length === 2, 'completedTests debe tener 2 elementos');

        // Restaurar originales
        ProfileService.getProfile = originalProfile;
        LearningMapService.getLearningMap = originalLearningMap;
        MicrotestService.listCompleted = originalListCompleted;
      })
      .catch(function(error) {
        // Restaurar originales incluso en error
        ProfileService.getProfile = originalProfile;
        LearningMapService.getLearningMap = originalLearningMap;
        MicrotestService.listCompleted = originalListCompleted;
        throw error;
      });
  });

  test('refresh() limpia la caché correctamente', function() {
    // Guardar originales
    var originalProfile = ProfileService.getProfile;
    var originalLearningMap = LearningMapService.getLearningMap;
    var originalListCompleted = MicrotestService.listCompleted;

    var profileCalls = 0;
    var learningMapCalls = 0;
    var listCalls = 0;

    var mockProfile = { test: 'profile' };
    var mockLearningMap = { test: 'learningMap' };
    var mockCompleted = { completed_tests: ['test'] };

    // Sobrescribir con mocks que cuentan llamadas
    ProfileService.getProfile = function() {
      profileCalls++;
      return Promise.resolve(mockProfile);
    };
    LearningMapService.getLearningMap = function() {
      learningMapCalls++;
      return Promise.resolve(mockLearningMap);
    };
    MicrotestService.listCompleted = function() {
      listCalls++;
      return Promise.resolve(mockCompleted);
    };

    // 1. Llamar getFullContext -> debe ejecutar los tres (caché vacía)
    return LearningProfileService.refresh() // Asegurar caché vacía
      .then(function() {
        return LearningProfileService.getFullContext();
      })
      .then(function() {
        // Primera llamada: cada servicio debe ser invocado una vez
        assert(profileCalls === 1, 'ProfileService debería llamarse 1 vez en la primera llamada');
        assert(learningMapCalls === 1, 'LearningMapService debería llamarse 1 vez en la primera llamada');
        assert(listCalls === 1, 'MicrotestService debería llamarse 1 vez en la primera llamada');

        // 2. Segunda llamada sin refresh -> debe usar caché, no llamar a los servicios
        return LearningProfileService.getFullContext();
      })
      .then(function() {
        // Los contadores deben seguir siendo 1 (no se llamaron de nuevo)
        assert(profileCalls === 1, 'ProfileService no debería llamarse en la segunda llamada (caché)');
        assert(learningMapCalls === 1, 'LearningMapService no debería llamarse en la segunda llamada (caché)');
        assert(listCalls === 1, 'MicrotestService no debería llamarse en la segunda llamada (caché)');

        // 3. Llamar refresh, luego getFullContext -> debe llamar a los servicios de nuevo
        LearningProfileService.refresh();
        return LearningProfileService.getFullContext();
      })
      .then(function() {
        // Ahora cada servicio debe haberse llamado 2 veces
        assert(profileCalls === 2, 'ProfileService debería llamarse 2 veces después de refresh');
        assert(learningMapCalls === 2, 'LearningMapService debería llamarse 2 veces después de refresh');
        assert(listCalls === 2, 'MicrotestService debería llamarse 2 veces después de refresh');

        // Restaurar originales
        ProfileService.getProfile = originalProfile;
        LearningMapService.getLearningMap = originalLearningMap;
        MicrotestService.listCompleted = originalListCompleted;
      })
      .catch(function(error) {
        // Restaurar originales en caso de error
        ProfileService.getProfile = originalProfile;
        LearningMapService.getLearningMap = originalLearningMap;
        MicrotestService.listCompleted = originalListCompleted;
        throw error;
      });
  });

  test('microtest:completed existe como evento esperado', function() {
    var eventReceived = false;
    var testId = 'test-event-' + Date.now();

    function handler(detail) {
      if (detail && detail.testId === testId) {
        eventReceived = true;
      }
    }

    // Suscribirse al evento
    EventBus.on('microtest:completed', handler);

    // Emitir el evento manualmente (simulando que MicrotestService.save lo emite)
    EventBus.emit('microtest:completed', {
      testId: testId,
      variables: { test: 'value' },
      timestamp: Date.now()
    });

    // Verificar que el evento fue recibido
    assert(eventReceived === true, 'El evento microtest:completed no fue recibido');

    // Limpiar listener
    EventBus.off('microtest:completed', handler);
  });

  // --- Ejecutar pruebas ---
  runTests();

})();
