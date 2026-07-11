// assets/js/platform/identity/IdentityProvider.js
// Servicio global de identidad de LogoDemocracy.
// Mantiene el estado de autenticación y sesión de la plataforma.
// Actúa como fachada entre los módulos y los componentes de identidad.

var LDIdentityProvider = (function() {
  'use strict';

  alert("IdentityProvider: Iniciando evaluación de IIFE");

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
    alert("IdentityProvider [_init]: Entrando a la función");
    if (_initialized) return;

    // 1. Cargar token y sessionId desde almacenamiento
    alert("IdentityProvider [_init]: Antes de IdentityStorage.getToken()");
    _token = IdentityStorage.getToken();
    
    alert("IdentityProvider [_init]: Antes de IdentityStorage.getSessionId()");
    _sessionId = IdentityStorage.getSessionId();

    // 2. Si no hay sessionId, generar uno nuevo y guardarlo
    alert("IdentityProvider [_init]: Evaluando si existe sessionId (" + _sessionId + ")");
    if (!_sessionId) {
      alert("IdentityProvider [_init]: Antes de IdentityStorage.generateSessionId()");
      _sessionId = IdentityStorage.generateSessionId();
      
      alert("IdentityProvider [_init]: Antes de IdentityStorage.saveSessionId()");
      IdentityStorage.saveSessionId(_sessionId);
    }

    // 3. Si hay token, cargar el usuario desde almacenamiento
    alert("IdentityProvider [_init]: Evaluando si existe token (" + _token + ")");
    if (_token) {
      alert("IdentityProvider [_init]: Antes de IdentityStorage.getUser()");
      var user = IdentityStorage.getUser();
      
      alert("IdentityProvider [_init]: Evaluando usuario cargado");
      if (user) {
        alert("IdentityProvider [_init]: Antes de CurrentUser.set(user)");
        CurrentUser.set(user);
      } else {
        // Token sin usuario: inconsistencia, limpiar token
        alert("IdentityProvider [_init]: Token sin usuario. Antes de IdentityStorage.clearToken()");
        _token = null;
        IdentityStorage.clearToken();
      }
    }

    _initialized = true;

    // 4. Emitir evento de identidad lista
    alert("IdentityProvider [_init]: Antes de getMode() / CurrentUser.exists() (para EventBus)");
    var mode = getMode();
    
    alert("IdentityProvider [_init]: Antes de EventBus.emit()");
    EventBus.emit('identity:ready', {
      mode: mode,
      sessionId: _sessionId
    });

    alert("IdentityProvider [_init]: Fin de la función");
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
  alert("IdentityProvider: Antes de llamar a _init() dentro del IIFE");
  _init();
  alert("IdentityProvider: _init() ejecutado exitosamente. Preparando retorno de API pública.");

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

alert("IdentityProvider: IIFE retornó correctamente. Asignando a window.LDIdentityProvider");
window.LDIdentityProvider = LDIdentityProvider;
alert("IdentityProvider: Archivo completamente ejecutado.");
