// assets/js/platform/identity/IdentityProvider.js
// Servicio global de identidad de LogoDemocracy.
// Mantiene el estado de autenticación y sesión de la plataforma.
// Actúa como fachada entre los módulos y los componentes de identidad.

var LDIdentityProvider = (function() {
  'use strict';

  // --- Estado interno ---
  var _token = null;
  var _sessionId = null;
  var _initialized = false;

  // --- Inicialización ---

  /**
   * Inicializa el proveedor de identidad.
   * Carga token, sessionId y usuario desde el almacenamiento.
   * Se ejecuta automáticamente al cargar el módulo.
   */
  function _init() {
    if (_initialized) return;

    // 1. Cargar token y sessionId desde almacenamiento
    _token = IdentityStorage.getToken();
    _sessionId = IdentityStorage.getSessionId();

    // 2. Si no hay sessionId, generar uno nuevo y guardarlo
    if (!_sessionId) {
      _sessionId = IdentityStorage.generateSessionId();
      IdentityStorage.saveSessionId(_sessionId);
    }

    // 3. Si hay token, cargar el usuario desde almacenamiento
    if (_token) {
      var user = IdentityStorage.getUser();
      if (user) {
        CurrentUser.set(user);
      } else {
        // Token sin usuario: inconsistencia, limpiar token
        _token = null;
        IdentityStorage.clearToken();
      }
    }

    _initialized = true;

    // 4. Emitir evento de identidad lista
    EventBus.emit('identity:ready', {
      mode: getMode(),
      sessionId: _sessionId
    });
  }

  // --- Getters públicos ---

  /**
   * Obtiene el token JWT actual.
   * @returns {string|null}
   */
  function getToken() {
    return _token;
  }

  /**
   * Obtiene el identificador de sesión anónima.
   * @returns {string}
   */
  function getSessionId() {
    return _sessionId;
  }

  /**
   * Obtiene el modo actual de identidad.
   * @returns {string} 'authenticated' o 'guest'
   */
  function getMode() {
    return _token && CurrentUser.exists() ? 'authenticated' : 'guest';
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns {boolean}
   */
  function isAuthenticated() {
    return getMode() === 'authenticated';
  }

  /**
   * Obtiene el usuario actual (delega en CurrentUser).
   * @returns {object|null}
   */
  function getUser() {
    return CurrentUser.get();
  }

  /**
   * Obtiene el ID del usuario actual.
   * @returns {string|null}
   */
  function getUserId() {
    return CurrentUser.getId();
  }

  /**
   * Obtiene el nombre del usuario actual.
   * @returns {string|null}
   */
  function getUserName() {
    return CurrentUser.getName();
  }

  // --- Mutaciones ---

  /**
   * Establece una sesión autenticada.
   * @param {string} token - JWT de autenticación.
   * @param {object} user - Datos del usuario.
   */
  function setAuthenticated(token, user) {
    if (!token || !user) {
      throw new Error('IdentityProvider.setAuthenticated: token y user son obligatorios');
    }

    _token = token;
    IdentityStorage.saveToken(token);
    CurrentUser.set(user);
    IdentityStorage.saveUser(user);

    // Emitir evento de cambio de autenticación
    EventBus.emit('auth:changed', {
      token: _token,
      user: CurrentUser.get(),
      mode: 'authenticated'
    });
  }

  /**
   * Cierra la sesión actual (autenticada o invitada).
   * Limpia token, usuario y emite evento.
   */
  function clear() {
    _token = null;
    IdentityStorage.clearToken();
    CurrentUser.clear();
    IdentityStorage.clearUser();

    // Emitir evento de cambio a modo invitado
    EventBus.emit('auth:changed', {
      token: null,
      user: null,
      mode: 'guest'
    });
  }

  /**
   * Renueva el sessionId (reinicia la sesión anónima).
   * @returns {string} Nuevo sessionId.
   */
  function refreshSession() {
    // Si está autenticado, no se debe cambiar el sessionId
    // porque está vinculado al perfil del usuario.
    if (isAuthenticated()) {
      // Opcional: emitir advertencia o simplemente no hacer nada
      return _sessionId;
    }

    _sessionId = IdentityStorage.resetSession();
    return _sessionId;
  }

  // --- Inicialización automática ---
  _init();

  // --- Exponer API pública ---
  return {
    getToken: getToken,
    getSessionId: getSessionId,
    getMode: getMode,
    isAuthenticated: isAuthenticated,
    getUser: getUser,
    getUserId: getUserId,
    getUserName: getUserName,
    setAuthenticated: setAuthenticated,
    clear: clear,
    refreshSession: refreshSession
  };

})();

window.LDIdentityProvider = LDIdentityProvider;
