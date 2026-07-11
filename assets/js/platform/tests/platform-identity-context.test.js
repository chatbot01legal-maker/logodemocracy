(function() {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  TestRunner.test('IdentityProvider propaga identidad hacia CognitiveRuntime', function() {
    // 1. Preparamos datos simulados
    var mockToken = 'mock-jwt-token';
    var mockUser = { id: 'u123', name: 'Rodrigo' };

    // 2. Ejecutamos la mutación
    IdentityProvider.setAuthenticated(mockToken, mockUser);

    // 3. Verificamos la propagación a través de CognitiveRuntime
    var context = CognitiveRuntime.getUserContext();

    assert(context.identity.name === 'Rodrigo', 'El nombre en context debe ser Rodrigo');
    assert(context.identity.mode === 'authenticated', 'El modo debe ser authenticated');

    // 4. Limpiamos
    IdentityProvider.clear();
  });
})();
