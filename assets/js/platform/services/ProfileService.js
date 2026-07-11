// assets/js/platform/services/ProfileService.js
// Servicio de perfil pedagógico del ciudadano.
// Permite obtener y gestionar el perfil estable de aprendizaje (PedagogicalProfile).
// Dependencias: CoreConfig, ApiClient, LDIdentityProvider, EventBus (opcional).

var ProfileService = (function() {
  'use strict';

  // --- Configuración ---
  var PROFILE_SERVICE = 'profile';
  var PROFILE_ENDPOINT = '/profile';

  // --- API pública ---

  /**
   * Obtiene el perfil pedagógico del ciudadano actual.
   * Funciona tanto para usuarios autenticados (usando JWT)
   * como invitados (usando sessionId).
   *
   * @returns {Promise<object>} Objeto con el perfil del usuario.
   */
  async function getProfile() {

    var mode = LDIdentityProvider.getMode();

    // Usuario autenticado:
    // ApiClient añadirá automáticamente el token.
    if (mode === 'authenticated') {

      return await ApiClient.get(
        PROFILE_SERVICE,
        PROFILE_ENDPOINT
      );

    }

    // Usuario invitado:
    // Se utiliza sessionId.
    var sessionId = LDIdentityProvider.getSessionId();

    if (!sessionId) {
      throw new Error(
        'ProfileService: No se pudo obtener sessionId para usuario invitado.'
      );
    }


    try {

      return await ApiClient.get(
        PROFILE_SERVICE,
        PROFILE_ENDPOINT,
        {
          sessionId: sessionId
        }
      );


    } catch (error) {

      console.warn(
        '[ProfileService] Backend no disponible, usando perfil mock'
      );


      // Mock temporal para Test Runner y desarrollo local.
      return {

        id: sessionId,

        level: "intermediate",

        explanationStyle: "analogical",

        abstractionLevel: "balanced",

        preferredFormat: "visual",

        scaffolding: "medium",

        systemsThinking: "high",

        recommendations: [
          "Usar analogías",
          "Partir desde ejemplos concretos"
        ]

      };

    }

  }


  /**
   * Actualiza campos específicos del perfil.
   * Stub para futura implementación.
   *
   * @param {object} data - Datos a actualizar.
   * @returns {Promise<object>} Perfil actualizado.
   */
  async function updateProfile(data) {

    throw new Error(
      'ProfileService.updateProfile no está implementado aún.'
    );

  }


  // --- Exponer API pública ---

  return {

    getProfile: getProfile,

    updateProfile: updateProfile

  };


})();
