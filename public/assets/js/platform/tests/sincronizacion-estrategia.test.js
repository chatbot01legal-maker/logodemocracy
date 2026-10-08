// assets/js/platform/tests/sincronizacion-estrategia.test.js
(function() {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  TestRunner.test('Sincronizacion: getUserContext().strategy coincide con estrategia activa', function() {
    return CognitiveRuntime.initialize()
      .then(function() {
        return CognitiveRuntime.getCurrentStrategy();
      })
      .then(function(strategy) {
        var context = CognitiveRuntime.getUserContext();
        assert(context.strategy === strategy, 'La estrategia en el contexto debe ser idéntica a la estrategia activa');
      });
  });
})();
