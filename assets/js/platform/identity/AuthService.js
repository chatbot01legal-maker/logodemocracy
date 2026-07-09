// assets/js/platform/identity/AuthService.js
// Servicio de autenticación de LogoDemocracy.
// Responsable de la comunicación con los endpoints de autenticación del backend.
// Delega la gestión del estado de identidad en IdentityProvider.

var AuthService = (function() {
  'use strict';

  // --- Configuración ---
  var AUTH_BASE = CoreConfig.SERVICES.auth;

  // --- Funciones auxiliares privadas ---

  /**
   * Realiza una petición POST al endpoint de autenticación.
   * @param {string} endpoint - Ruta relativa al servicio de autenticación.
   * @param {object} body - Cuerpo de la petición.
   * @returns {Promise<object>} Datos de la respuesta.
   */
  async function _request(endpoint, body) {
    var url = AUTH_BASE + endpoint;

    var response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    var data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la autenticación');
    }

    return data;
  }

  /**
   * Realiza una petición GET autenticada.
   * @param {string} endpoint - Ruta relativa al servicio de autenticación.
   * @param {string} token - Token JWT.
   * @returns {Promise<object>} Datos de la respuesta.
   */
  async function _requestAuth(endpoint, token) {
    var url = AUTH_BASE + endpoint;

    var response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    var data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la solicitud autenticada');
    }

    return data;
  }

  // --- API pública ---

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email - Correo electrónico.
   * @param {string} password - Contraseña.
   * @returns {Promise<{ token: string, user: object }>}
   */
  async function login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }

    var data = await _request('/login', { email, password });
    // data = { token, user }

    // Actualizar el estado global de identidad
    IdentityProvider.setAuthenticated(data.token, data.user);

    return data;
  }

  /**
   * Registra un nuevo usuario.
   * @param {string} name - Nombre completo.
   * @param {string} email - Correo electrónico.
   * @param {string} password - Contraseña.
   * @param {string} [sessionId] - Identificador de sesión anónima para migrar progreso.
   * @returns {Promise<{ token: string, user: object }>}
   */
  async function register(name, email, password, sessionId) {
    if (!name || !email || !password) {
      throw new Error('Nombre, email y contraseña son obligatorios');
    }

    var payload = { name, email, password };
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    var data = await _request('/register', payload);
    // data = { token, user }

    IdentityProvider.setAuthenticated(data.token, data.user);

    return data;
  }

  /**
   * Cierra la sesión actual.
   * Limpia el estado de autenticación local.
   * No realiza llamadas al backend (preparado para futuro endpoint de logout).
   */
  function logout() {
    // Limpiar estado de identidad
    IdentityProvider.clear();

    // Futuro: si el backend implementa /logout, aquí se llamaría:
    // await _request('/logout', {});
    // pero por ahora solo se limpia localmente.
  }

  /**
   * Obtiene la información del usuario autenticado desde el backend.
   * Útil para refrescar los datos del perfil.
   * @returns {Promise<object>} Datos del usuario.
   */
  async function whoAmI() {
    var token = IdentityProvider.getToken();

    if (!token) {
      throw new Error('No hay sesión activa');
    }

    var data = await _requestAuth('/me', token);
    // data = { user }

    if (data.user) {
      // Actualizar CurrentUser e IdentityStorage
      CurrentUser.set(data.user);
      IdentityStorage.saveUser(data.user);
    }

    return data.user;
  }

  /**
   * Renueva el token de acceso (stub para futura implementación).
   * @returns {Promise<string>} Nuevo token.
   */
  async function refreshToken() {
    // Pendiente: implementar cuando el backend soporte refresh tokens.
    // Por ahora, lanzar un error indicando que no está implementado.
    throw new Error('refreshToken no está implementado aún');
  }

  // --- Exponer API pública ---
  return {
    login: login,
    register: register,
    logout: logout,
    whoAmI: whoAmI,
    refreshToken: refreshToken
  };

})();
