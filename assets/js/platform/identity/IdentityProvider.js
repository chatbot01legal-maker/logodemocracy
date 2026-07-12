// assets/js/platform/identity/IdentityProvider.js
// Proveedor central de identidad de LogoDemocracy.
// Expone window.LDIdentityProvider (nombre no-nativo, evita colisión con
// la API FedCM del navegador, que reserva el identificador "IdentityProvider").
// Dependencias: EventBus, IdentityStorage, CurrentUser (deben cargarse antes).

(function () {
  'use strict';

  // ─── Guardia anti-doble-carga ───────────────────────
  // Si este archivo se incluye dos veces (duplicado en el HTML, o servido
  // por dos rutas distintas), lo detectamos aquí en vez de fallar en
  // silencio más adelante.
  if (window.LDIdentityProvider) {
    console.error(
      '[LDIdentityProvider] ADVERTENCIA: window.LDIdentityProvider ya existia ' +
      'antes de ejecutar este script. Esto indica que IdentityProvider.js se ' +
      'esta cargando mas de una vez, o que otro archivo ya definio este nombre. ' +
      'Revisa duplicados con: find . -iname "IdentityProvider.js" -not -path "*/node_modules/*"'
    );
  }

  // ─── Dependencias requeridas ─────────────────────────
  if (typeof EventBus === 'undefined') {
    console.error('[LDIdentityProvider] EventBus no esta definido. Se cargo EventBus.js antes que este archivo?');
  }
  if (typeof IdentityStorage === 'undefined') {
    console.error('[LDIdentityProvider] IdentityStorage no esta definido. Se cargo IdentityStorage.js antes que este archivo?');
  }
  if (typeof CurrentUser === 'undefined') {
    console.error('[LDIdentityProvider] CurrentUser no esta definido. Se cargo CurrentUser.js antes que este archivo?');
  }

  var _token = null;
  var _sessionId = null;
  var _initialized = false;

  function _init() {
    if (_initialized) return;

    _token = IdentityStorage.getToken();
    _sessionId = IdentityStorage.getSessionId();

    if (!_sessionId) {
      _sessionId = IdentityStorage.generateSessionId();
      IdentityStorage.saveSessionId(_sessionId);
    }

    if (_token) {
      var user = IdentityStorage.getUser();
      if (user) {
        CurrentUser.set(user);
      } else {
        _token = null;
        IdentityStorage.clearToken();
      }
    }

    _initialized = true;

    EventBus.emit('identity:ready', {
      mode: getMode(),
      sessionId: _sessionId
    });
  }

  function getToken() {
    return _token;
  }

  function getSessionId() {
    return _sessionId;
  }

  function getMode() {
    return _token && CurrentUser.exists() ? 'authenticated' : 'guest';
  }

  function isAuthenticated() {
    return getMode() === 'authenticated';
  }

  function getUser() {
    return CurrentUser.get();
  }

  function getUserId() {
    var user = CurrentUser.get();
    return user ? user.id : null;
  }

  function getUserName() {
    return CurrentUser.getName();
  }

  function setAuthenticated(token, user) {
    if (!token || !user) {
      throw new Error('LDIdentityProvider.setAuthenticated: token y user son obligatorios');
    }

    _token = token;
    IdentityStorage.saveToken(token);

    CurrentUser.set(user);
    IdentityStorage.saveUser(user);

    EventBus.emit('auth:changed', {
      token: _token,
      user: CurrentUser.get(),
      mode: 'authenticated'
    });
  }

  function clear() {
    _token = null;
    IdentityStorage.clearToken();
    CurrentUser.clear();
    IdentityStorage.clearUser();

    EventBus.emit('auth:changed', {
      token: null,
      user: null,
      mode: 'guest'
    });
  }

  function refreshSession() {
    _sessionId = IdentityStorage.resetSession();
    return _sessionId;
  }

  _init();

  var api = {
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

  // Unica forma de exponerlo: SIEMPRE explicito en window, nunca "var" a
  // nivel de archivo suelto. Esto evita cualquier ambiguedad de scope y
  // hace trivial detectar si algo mas esta pisando este mismo nombre.
  window.LDIdentityProvider = api;

  console.log('[LDIdentityProvider] Inicializado correctamente. Modo:', getMode(), '| sessionId:', _sessionId);

})();
    
