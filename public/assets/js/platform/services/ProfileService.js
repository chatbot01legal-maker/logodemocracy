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
  function _normalizeProfileResponse(result) {
    if (result && result.profile) {
      return result.profile;
    }

    return result || {};
  }

  async function getProfile() {

    var mode = LDIdentityProvider.getMode();

    // Usuario autenticado:
    // ApiClient añadirá automáticamente el token.
    if (mode === 'authenticated') {

      var result = await ApiClient.get(
        PROFILE_SERVICE,
        PROFILE_ENDPOINT
      );

      return _normalizeProfileResponse(result);

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

      var result = await ApiClient.get(
        PROFILE_SERVICE,
        PROFILE_ENDPOINT,
        {
          sessionId: sessionId
        }
      );

      return _normalizeProfileResponse(result);


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


  /**
   * Obtiene los campos personales del usuario autenticado.
   * Solo funciona con sesión activa.
   *
   * @returns {Promise<object>} { user: { email, name, display_name, bio, ... } }
   */
  async function getUserInfo() {

    var result = await ApiClient.get(
      PROFILE_SERVICE,
      '/user-info'
    );

    return result && result.user ? result.user : {};

  }


  /**
   * Actualiza campos personales del usuario autenticado.
   *
   * @param {object} data - { display_name?, bio?, education_level?, avatar_id?, interests? }
   * @returns {Promise<object>} user actualizado
   */
  async function updateUserInfo(data) {

    var result = await ApiClient.put(
      PROFILE_SERVICE,
      '/user-info',
      data
    );

    return result && result.user ? result.user : {};

  }


  // --- Exponer API pública ---

  return {

    getProfile: getProfile,

    updateProfile: updateProfile,

    getUserInfo: getUserInfo,

    updateUserInfo: updateUserInfo

  };


})();
