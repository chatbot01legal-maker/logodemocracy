// assets/js/platform/services/MicrotestService.js
// Servicio de gestión de microtests pedagógicos.
// Permite guardar resultados y consultar el listado de microtests completados.
// Dependencias: CoreConfig, ApiClient, LDIdentityProvider, EventBus, CurrentUser.

var MicrotestService = (function() {
  'use strict';

  // --- Configuración ---
  var SERVICE = 'microtests';
  var SAVE_ENDPOINT = '/save';
  var LIST_ENDPOINT = '/list';

  // --- Funciones auxiliares privadas ---

  /**
   * Construye el payload con la identificación adecuada (autenticado o invitado).
   * @param {object} baseData - Datos base a incluir en el payload (testId, answers, variables).
   * @returns {object} Payload completo con identificación.
   */
  function _buildPayload(baseData) {
    var mode = LDIdentityProvider.getMode();
    var payload = { ...baseData };

    if (mode === 'authenticated') {
      // Usuario autenticado: ApiClient añadirá el JWT automáticamente,
      // pero incluimos userId si está disponible por si el backend lo necesita.
      var user = CurrentUser.get();
      if (user && user.id) {
        payload.userId = user.id;
      }
      // No se incluye sessionId cuando está autenticado.
    } else {
      // Usuario invitado: usar sessionId.
      var sessionId = LDIdentityProvider.getSessionId();
      if (!sessionId) {
        throw new Error('MicrotestService: No se pudo obtener sessionId para usuario invitado.');
      }
      payload.sessionId = sessionId;
    }

    return payload;
  }

  // --- API pública ---

  /**
   * Guarda un microtest completado en el perfil del ciudadano.
   * @param {string} testId - Identificador único del microtest.
   * @param {object} answers - Respuestas del usuario al microtest.
   * @param {object} variables - Variables calculadas a partir de las respuestas.
   * @returns {Promise<object>} Respuesta del backend.
   */
  async function save(testId, answers, variables) {
    // Validaciones
    if (!testId) {
      throw new Error('MicrotestService.save: testId es obligatorio.');
    }
    if (!answers || typeof answers !== 'object') {
      throw new Error('MicrotestService.save: answers debe ser un objeto.');
    }
    if (!variables || typeof variables !== 'object') {
      throw new Error('MicrotestService.save: variables debe ser un objeto.');
    }

    // Construir payload con identificación
    var payload = _buildPayload({
      testId: testId,
      answers: answers,
      variables: variables
    });

    // Enviar al backend
    var result = await ApiClient.post(SERVICE, SAVE_ENDPOINT, payload);

    // Emitir evento de microtest completado
    EventBus.emit('microtest:completed', {
      testId: testId,
      variables: variables,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Obtiene la lista de microtests ya completados por el ciudadano actual.
   * @returns {Promise<{ completed_tests: string[] }>}
   */
  async function listCompleted() {
    var mode = LDIdentityProvider.getMode();

    // Usuario autenticado: ApiClient añade el token automáticamente.
    if (mode === 'authenticated') {
      return await ApiClient.get(SERVICE, LIST_ENDPOINT);
    }

    // Usuario invitado: enviar sessionId como query param.
    var sessionId = LDIdentityProvider.getSessionId();
    if (!sessionId) {
      throw new Error('MicrotestService.listCompleted: No se pudo obtener sessionId para usuario invitado.');
    }

    return await ApiClient.get(SERVICE, LIST_ENDPOINT, {
      sessionId: sessionId
    });
  }

  // --- Exponer API pública ---
  return {
    save: save,
    listCompleted: listCompleted
  };

})();
