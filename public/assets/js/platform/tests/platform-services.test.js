// assets/js/platform/tests/platform-services.test.js
// Pruebas de integridad de los servicios del Hito 2.
// Ejecutar en navegador.
// Muestra resultados en consola y directamente en pantalla.
// Sin dependencias externas.

(function() {
  'use strict';

  // --- Crear área visual de resultados ---
  var output = document.createElement('pre');
  output.id = 'test-output';
  output.style.padding = '20px';
  output.style.fontSize = '16px';
  output.style.whiteSpace = 'pre-wrap';
  document.body.appendChild(output);

  function print(message) {
    console.log(message);
    output.textContent += message + '\n';
  }

  // --- Utilidades de test ---
  var tests = [];
  var passed = 0;
  var failed = 0;

  function test(name, fn) {
    tests.push({
      name: name,
      fn: fn
    });
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  async function runTests() {

    print('🧪 Ejecutando pruebas del Hito 2 (Platform Services)...');
    print('');

    for (var i = 0; i < tests.length; i++) {

      var current = tests[i];

      try {

        await current.fn();

        print('✅ PASS: ' + current.name);
        passed++;

      } catch (e) {

        print('❌ FAIL: ' + current.name);
        print('   ' + e.message);
        failed++;

      }
    }

    print('');
    print('📊 Resultado: ' + passed + ' aprobadas / ' + failed + ' fallidas');

    if (failed === 0) {
      print('');
      print('🎉 HITO 2 VALIDADO CORRECTAMENTE');
    } else {
      print('');
      print('⚠️ HITO 2 NO VALIDADO');
    }
  }


  // --------------------------------------------------
  // TESTS
  // --------------------------------------------------

  test('ProfileService existe', function() {

    assert(
      typeof ProfileService !== 'undefined',
      'ProfileService no está definido'
    );

    assert(
      typeof ProfileService.getProfile === 'function',
      'ProfileService.getProfile debe ser función'
    );

  });


  test('LearningMapService existe', function() {

    assert(
      typeof LearningMapService !== 'undefined',
      'LearningMapService no está definido'
    );

    assert(
      typeof LearningMapService.getLearningMap === 'function',
      'LearningMapService.getLearningMap debe ser función'
    );

  });


  test('MicrotestService existe', function() {

    assert(
      typeof MicrotestService !== 'undefined',
      'MicrotestService no está definido'
    );

    assert(
      typeof MicrotestService.save === 'function',
      'MicrotestService.save debe ser función'
    );

    assert(
      typeof MicrotestService.listCompleted === 'function',
      'MicrotestService.listCompleted debe ser función'
    );

  });


  test('LearningProfileService existe', function() {

    assert(
      typeof LearningProfileService !== 'undefined',
      'LearningProfileService no está definido'
    );

    assert(
      typeof LearningProfileService.getFullContext === 'function',
      'LearningProfileService.getFullContext debe ser función'
    );

    assert(
      typeof LearningProfileService.refresh === 'function',
      'LearningProfileService.refresh debe ser función'
    );

  });


  test('getFullContext combina correctamente los servicios', async function() {

    var originalProfile = ProfileService.getProfile;
    var originalLearningMap = LearningMapService.getLearningMap;
    var originalCompleted = MicrotestService.listCompleted;


    var profileCalled = false;
    var mapCalled = false;
    var testsCalled = false;


    ProfileService.getProfile = function() {

      profileCalled = true;

      return Promise.resolve({
        estilo_explicativo: 'analogico'
      });

    };


    LearningMapService.getLearningMap = function() {

      mapCalled = true;

      return Promise.resolve({
        pensamiento_sistemico: 'alto'
      });

    };


    MicrotestService.listCompleted = function() {

      testsCalled = true;

      return Promise.resolve({
        completed_tests: [
          'brujula',
          'ejemplos'
        ]
      });

    };


    LearningProfileService.refresh();


    var context =
      await LearningProfileService.getFullContext();


    assert(
      profileCalled,
      'ProfileService no fue llamado'
    );

    assert(
      mapCalled,
      'LearningMapService no fue llamado'
    );

    assert(
      testsCalled,
      'MicrotestService no fue llamado'
    );


    assert(
      context.profile.estilo_explicativo === 'analogico',
      'Perfil incorrecto'
    );


    assert(
      context.learningMap.pensamiento_sistemico === 'alto',
      'LearningMap incorrecto'
    );


    assert(
      Array.isArray(context.completedTests),
      'completedTests debe ser array'
    );


    assert(
      context.completedTests.length === 2,
      'completedTests incorrecto'
    );


    // restaurar
    ProfileService.getProfile = originalProfile;
    LearningMapService.getLearningMap = originalLearningMap;
    MicrotestService.listCompleted = originalCompleted;

  });


  test('refresh limpia la caché correctamente', async function() {

    var calls = 0;


    var originalProfile = ProfileService.getProfile;
    var originalMap = LearningMapService.getLearningMap;
    var originalTests = MicrotestService.listCompleted;


    ProfileService.getProfile = function() {
      calls++;
      return Promise.resolve({});
    };


    LearningMapService.getLearningMap = function() {
      return Promise.resolve({});
    };


    MicrotestService.listCompleted = function() {
      return Promise.resolve({
        completed_tests: []
      });
    };


    LearningProfileService.refresh();

    await LearningProfileService.getFullContext();

    await LearningProfileService.getFullContext();


    assert(
      calls === 1,
      'La caché no funciona correctamente'
    );


    LearningProfileService.refresh();

    await LearningProfileService.getFullContext();


    assert(
      calls === 2,
      'refresh no limpió la caché'
    );


    ProfileService.getProfile = originalProfile;
    LearningMapService.getLearningMap = originalMap;
    MicrotestService.listCompleted = originalTests;

  });


  test('Evento microtest:completed funciona', function() {

    var received = false;


    function handler(data) {

      if (data.testId === 'test-event') {
        received = true;
      }

    }


    EventBus.on(
      'microtest:completed',
      handler
    );


    EventBus.emit(
      'microtest:completed',
      {
        testId: 'test-event',
        timestamp: Date.now()
      }
    );


    assert(
      received,
      'Evento no recibido'
    );


    EventBus.off(
      'microtest:completed',
      handler
    );

  });


  // Ejecutar
  runTests();


})();
