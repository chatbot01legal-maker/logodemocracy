// assets/js/platform/identity/IdentityStorage.js
// Abstracción de persistencia para la identidad del usuario.
// Encapsula localStorage y prepara una futura migración a IndexedDB
// sin modificar la API pública.

var IdentityStorage = (function() {
  'use strict';

  /**
   * Obtiene un valor del almacenamiento local.
   * @param {string} key - Clave del elemento.
   * @returns {string|null} Valor almacenado o null si no existe o hay error.
   */
  function _get(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  /**
   * Establece un valor en el almacenamiento local.
   * @param {string} key - Clave del elemento.
   * @param {string} value - Valor a almacenar.
   */
  function _set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // Silencioso en caso de error (cuota excedida, etc.)
    }
  }

  /**
   * Elimina un valor del almacenamiento local.
   * @param {string} key - Clave del elemento.
   */
  function _remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (_) {
      // Silencioso
    }
  }

  /**
   * Obtiene un valor JSON del almacenamiento local.
   * @param {string} key - Clave del elemento.
   * @returns {object|null} Objeto parseado o null si no existe o hay error.
   */
  function _getJSON(key) {
    try {
      var raw = _get(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Almacena un objeto como JSON en el almacenamiento local.
   * @param {string} key - Clave del elemento.
   * @param {object} value - Objeto a serializar.
   */
  function _setJSON(key, value) {
    try {
      _set(key, JSON.stringify(value));
    } catch (_) {
      // Silencioso
    }
  }

  // --- Token ---

  /**
   * Obtiene el token JWT almacenado.
   * @returns {string|null}
   */
  function getToken() {
    return _get(CoreConfig.STORAGE_KEYS.TOKEN);
  }

  /**
   * Guarda el token JWT.
   * @param {string} token
   */
  function saveToken(token) {
    _set(CoreConfig.STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Elimina el token JWT.
   */
  function clearToken() {
    _remove(CoreConfig.STORAGE_KEYS.TOKEN);
  }

  // --- Usuario ---

  /**
   * Obtiene el objeto del usuario almacenado.
   * @returns {object|null}
   */
  function getUser() {
    return _getJSON(CoreConfig.STORAGE_KEYS.USER);
  }

  /**
   * Guarda el objeto del usuario.
   * @param {object} user
   */
  function saveUser(user) {
    _setJSON(CoreConfig.STORAGE_KEYS.USER, user);
  }

  /**
   * Elimina los datos del usuario.
   */
  function clearUser() {
    _remove(CoreConfig.STORAGE_KEYS.USER);
  }

  // --- Sesión anónima (sessionId) ---

  /**
   * Obtiene el identificador de sesión anónima.
   * @returns {string|null}
   */
  function getSessionId() {
    return _get(CoreConfig.STORAGE_KEYS.SESSION);
  }

  /**
   * Guarda el identificador de sesión anónima.
   * @param {string} id
   */
  function saveSessionId(id) {
    _set(CoreConfig.STORAGE_KEYS.SESSION, id);
  }

  /**
   * Elimina el identificador de sesión anónima.
   */
  function clearSessionId() {
    _remove(CoreConfig.STORAGE_KEYS.SESSION);
  }

  // --- Utilidades ---

  /**
   * Genera un nuevo identificador de sesión único.
   * Prioriza crypto.randomUUID() con fallback para navegadores antiguos.
   * @returns {string}
   */
  function generateSessionId() {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch (_) {
      // Fallback
    }
    return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Reinicia la sesión anónima: elimina el sessionId actual y genera uno nuevo.
   * @returns {string} Nuevo sessionId.
   */
  function resetSession() {
    clearSessionId();
    var newId = generateSessionId();
    saveSessionId(newId);
    return newId;
  }

  /**
   * Limpia todos los datos de identidad (token y usuario), pero no el sessionId.
   * Esto mantiene al usuario en modo invitado.
   */
  function clearAll() {
    clearToken();
    clearUser();
  }

  // --- API pública ---

  return {
    getToken: getToken,
    saveToken: saveToken,
    clearToken: clearToken,

    getUser: getUser,
    saveUser: saveUser,
    clearUser: clearUser,

    getSessionId: getSessionId,
    saveSessionId: saveSessionId,
    clearSessionId: clearSessionId,

    generateSessionId: generateSessionId,
    resetSession: resetSession,
    clearAll: clearAll
  };

})();
