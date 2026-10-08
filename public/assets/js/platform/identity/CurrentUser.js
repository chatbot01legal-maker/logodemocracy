// assets/js/platform/identity/CurrentUser.js
// Representa al usuario autenticado actual en memoria.
// Se carga automáticamente desde IdentityStorage al iniciar.
// No gestiona sesiones, tokens ni realiza llamadas HTTP.

var CurrentUser = (function() {
  'use strict';

  // --- Estado interno ---
  var _user = null;

  // --- Carga inicial desde almacenamiento ---

  /**
   * Carga los datos del usuario desde IdentityStorage.
   * Se ejecuta automáticamente al definir el módulo.
   */
  function _loadFromStorage() {
    var stored = IdentityStorage.getUser();
    if (stored) {
      _user = stored;
    }
  }

  // --- API pública ---

  /**
   * Establece el usuario actual.
   * @param {object} user - Objeto con los datos del usuario.
   * @param {string} user.id - Identificador único.
   * @param {string} user.name - Nombre completo.
   * @param {string} user.email - Correo electrónico.
   * @param {string} [user.role] - Rol (citizen, consultant, admin).
   * @param {string} [user.learningProfileId] - ID del perfil pedagógico.
   * @param {object} [user.preferences] - Preferencias del usuario.
   * @param {string} [user.avatar] - URL del avatar.
   * @param {string} [user.locale] - Configuración regional.
   * @param {object} [user.featureFlags] - Banderas de características.
   */
  function set(user) {
    if (user && typeof user === 'object') {
      // Normalizar el objeto: asegurar que tenga los campos mínimos
      _user = {
        id: user.id || user._id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'citizen',
        learningProfileId: user.learningProfileId || null,
        preferences: user.preferences || {},
        avatar: user.avatar || null,
        locale: user.locale || 'es',
        featureFlags: user.featureFlags || {}
      };
    } else {
      _user = null;
    }
  }

  /**
   * Obtiene una copia inmutable del usuario actual.
   * @returns {object|null} Copia congelada del usuario o null si no existe.
   */
  function get() {
    if (!_user) return null;
    // Devolver una copia congelada para evitar mutaciones externas
    return Object.freeze({ ..._user });
  }

  /**
   * Elimina el usuario actual (cierra sesión localmente).
   */
  function clear() {
    _user = null;
  }

  /**
   * Verifica si hay un usuario autenticado.
   * @returns {boolean}
   */
  function exists() {
    return _user !== null;
  }

  /**
   * Obtiene el ID del usuario.
   * @returns {string|null}
   */
  function getId() {
    return _user ? _user.id : null;
  }

  /**
   * Obtiene el nombre del usuario.
   * @returns {string|null}
   */
  function getName() {
    return _user ? _user.name : null;
  }

  /**
   * Obtiene el email del usuario.
   * @returns {string|null}
   */
  function getEmail() {
    return _user ? _user.email : null;
  }

  /**
   * Obtiene el rol del usuario.
   * @returns {string|null}
   */
  function getRole() {
    return _user ? _user.role : null;
  }

  /**
   * Obtiene el ID del perfil pedagógico del usuario.
   * @returns {string|null}
   */
  function getLearningProfileId() {
    return _user ? _user.learningProfileId : null;
  }

  /**
   * Obtiene una preferencia del usuario.
   * @param {string} key - Clave de la preferencia.
   * @param {*} defaultValue - Valor por defecto si no existe.
   * @returns {*} Valor de la preferencia o defaultValue.
   */
  function getPreference(key, defaultValue) {
    if (!_user || !_user.preferences) {
      return defaultValue;
    }
    var value = _user.preferences[key];
    return value !== undefined ? value : defaultValue;
  }

  // --- Inicialización automática ---
  _loadFromStorage();

  // --- Exponer API pública ---
  return {
    set: set,
    get: get,
    clear: clear,
    exists: exists,
    getId: getId,
    getName: getName,
    getEmail: getEmail,
    getRole: getRole,
    getLearningProfileId: getLearningProfileId,
    getPreference: getPreference
  };

})();
