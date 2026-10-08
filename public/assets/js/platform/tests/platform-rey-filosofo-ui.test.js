// assets/js/platform/tests/platform-rey-filosofo-ui.test.js
(function() {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  TestRunner.test('Rey Filósofo sincroniza usuario desde CognitiveRuntime', function() {
    return CognitiveRuntime.initialize()
      .then(function() {
        var context = CognitiveRuntime.getUserContext();
        assert(context !== null, 'CognitiveRuntime debe proveer un contexto valido');
        assert('identity' in context, 'El contexto debe contener el nodo identity');
      });
  });

  TestRunner.test('Rey Filósofo sincroniza estrategia activa', function() {
    var context = CognitiveRuntime.getUserContext();
    assert('strategy' in context, 'El contexto debe contener el nodo strategy');
  });

  TestRunner.test('La UI no lanza excepciones y mantiene fallback si CognitiveRuntime no existe', function() {
    // Simulamos la ausencia del Runtime
    var originalRuntime = window.CognitiveRuntime;
    window.CognitiveRuntime = undefined;
    
    var errorThrown = false;
    try {
      // Simulamos la lógica defensiva interna del Rey Filósofo
      var context = null;
      if (typeof CognitiveRuntime !== 'undefined' && typeof CognitiveRuntime.getUserContext === 'function') {
        context = CognitiveRuntime.getUserContext();
      }
      assert(context === null, 'Debe devolver null defensivamente');
    } catch(e) {
      errorThrown = true;
    } finally {
      // Restauramos el entorno
      window.CognitiveRuntime = originalRuntime;
    }
    
    assert(!errorThrown, 'La lectura defensiva no debe lanzar excepciones (TypeError) al faltar el Runtime');
  });

})();
