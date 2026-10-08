// assets/js/apiClient.js
// Cliente HTTP puro para el Rey Filósofo.
// No contiene lógica de negocio, solo comunicación con el backend.

var ApiClient = (function() {
  'use strict';

  /**
   * Envía un payload al endpoint de proceso.
   * @param {Object} payload - Debe incluir sessionId y content.
   * @returns {Promise<Object>} - Respuesta JSON del backend.
   */
  async function process(payload) {
    var sessionId = payload.sessionId;
    var content = payload.content;
    var providerModule = payload.provider_module || CONFIG.DEFAULT_PROVIDER;
    var userResponse = payload.user_response;
    var metadata = payload.metadata;

    if (!sessionId) {
      throw new Error('sessionId es obligatorio.');
    }
    if (!content || !content.trim()) {
      throw new Error('content no puede estar vacío.');
    }

    var body = {
      sessionId: sessionId,
      provider_module: providerModule,
      content: content.trim()
    };

    if (userResponse !== undefined) body.user_response = userResponse;
    if (metadata !== undefined) body.metadata = metadata;

    var response = await fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      var errorMsg = 'Error al comunicarse con el servidor.';
      try {
        var errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (_) { /* ignore */ }
      throw new Error(errorMsg);
    }

    return await response.json();
  }

  return {
    process: process
  };
})();
