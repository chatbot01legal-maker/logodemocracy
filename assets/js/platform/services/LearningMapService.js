// assets/js/platform/services/LearningMapService.js
// Servicio de mapa de aprendizaje dinámico del ciudadano.
// Permite obtener el estado actual de competencias cognitivas (LearningMap).
// Dependencias: CoreConfig, ApiClient, IdentityProvider.

var LearningMapService = (function() {
  'use strict';

  // --- Configuración ---
  var SERVICE = 'profile';
  var ENDPOINT = '/learning-map';

  // --- API pública ---

  /**
   * Obtiene el mapa de aprendizaje del ciudadano actual.
   * Funciona tanto para usuarios autenticados (usando JWT) como invitados (usando sessionId).
   * @returns {Promise<object>} Objeto con el mapa de competencias y anclajes.
   */
  async function getLearningMap() {
    var mode = IdentityProvider.getMode();

    // Si está autenticado, ApiClient añadirá automáticamente el token
    // y el backend identificará al usuario por req.user.
    if (mode === 'authenticated') {
      return await ApiClient.get(SERVICE, ENDPOINT);
    }

    // Si es invitado, debemos enviar el sessionId como query param.
    var sessionId = IdentityProvider.getSessionId();
    if (!sessionId) {
      throw new Error('LearningMapService: No se pudo obtener sessionId para usuario invitado.');
    }

    return await ApiClient.get(SERVICE, ENDPOINT, {
      sessionId: sessionId
    });
  }

  // --- Exponer API pública ---
  return {
    getLearningMap: getLearningMap
  };

})();
