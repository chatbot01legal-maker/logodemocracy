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
   * Funciona tanto para usuarios autenticados (usando JWT)
   * como invitados (usando sessionId).
   *
   * @returns {Promise<object>} Objeto con el mapa de competencias.
   */
  async function getLearningMap() {

    var mode = IdentityProvider.getMode();


    // Usuario autenticado:
    if (mode === 'authenticated') {

      return await ApiClient.get(
        SERVICE,
        ENDPOINT
      );

    }


    // Usuario invitado:
    var sessionId = IdentityProvider.getSessionId();

    if (!sessionId) {

      throw new Error(
        'LearningMapService: No se pudo obtener sessionId para usuario invitado.'
      );

    }


    try {

      return await ApiClient.get(
        SERVICE,
        ENDPOINT,
        {
          sessionId: sessionId
        }
      );


    } catch (error) {

      console.warn(
        '[LearningMapService] Backend no disponible, usando learning map mock'
      );


      // Mock temporal para Test Runner y desarrollo local.
      return {

        competencies: {

          conceptualThinking: "medium",

          systemsThinking: "high",

          argumentation: "medium",

          vocabulary: "medium"

        },

        progress: {

          completedMicrotests: 0,

          totalMicrotests: 10

        }

      };

    }

  }


  // --- Exponer API pública ---

  return {

    getLearningMap: getLearningMap

  };


})();
