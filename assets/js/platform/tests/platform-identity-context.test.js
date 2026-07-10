// assets/js/platform/tests/platform-identity-context.test.js
(function() {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  TestRunner.test('CognitiveRuntime expone identity en contexto', function() {
    var context = CognitiveRuntime.getUserContext();
    assert('identity' in context, 'Debe existir identity en el contexto');
  });

  TestRunner.test('Contexto identity contiene estructura inicial valida', function() {
    return CognitiveRuntime.initialize()
      .then(function() {
        var context = CognitiveRuntime.getUserContext();
        assert(context.identity !== undefined, 'Identity debe existir después de inicializar');
        assert(typeof context.identity === 'object', 'Identity debe ser un objeto');
      });
  });

})();
