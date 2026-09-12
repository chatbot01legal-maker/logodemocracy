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
  async function save(testId, answers, variables, attempt) {
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
      variables: variables,
      attempt: attempt || null
    });

    // Enviar al backend
    var result = await ApiClient.post(SERVICE, SAVE_ENDPOINT, payload);

    // Si el guardado fue exitoso, invocar LearningProfileService.refresh()
    if (result && (result.success === true || result.status === 'success')) {
      // Determinar el identificador de usuario/sesión a pasar a LearningProfileService.refresh
      // Puede ser userId para usuarios autenticados o sessionId para invitados.
      let userIdentifier = payload.userId || payload.sessionId;

      // Obtener datos de actualización de perfil de la respuesta del backend.
      // Proporcionar un objeto por defecto si el backend no envía 'profileUpdateData'.
      let profileUpdateData = result.profileUpdateData || {
        source: 'microtest',
        testId: testId,
        status: 'completed',
        variables: variables // Incluir variables para más contexto
      };

      if (typeof LearningProfileService !== 'undefined' && LearningProfileService.refresh) {
        console.log(`MicrotestService: Guardado exitoso de microtest '${testId}'. Invocando LearningProfileService.refresh para '${userIdentifier}'.`);
        await LearningProfileService.refresh(userIdentifier, profileUpdateData);
      } else {
        console.warn("MicrotestService: LearningProfileService no disponible o método refresh ausente. No se pudo actualizar el perfil de aprendizaje.");
      }
    } else {
      console.error("MicrotestService: El guardado del microtest no fue exitoso o la respuesta del backend fue inválida:", result);
      // Opcionalmente, aquí se podría relanzar el error o manejarlo de otra forma
    }

    // Emitir evento de microtest completado (se emite siempre, independientemente del éxito de la actualización del perfil)
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

    try {
      var result;

      // Usuario autenticado: ApiClient añade el token automáticamente.
      if (mode === 'authenticated') {
        result = await ApiClient.get(SERVICE, LIST_ENDPOINT);
      } else {
        // Usuario invitado: enviar sessionId como query param.
        var sessionId = LDIdentityProvider.getSessionId();

        if (!sessionId) {
          console.warn(
            'MicrotestService.listCompleted: No hay sessionId para usuario invitado. ' +
            'Se devuelve una lista vacía.'
          );

          return {
            completed_tests: []
          };
        }

        result = await ApiClient.get(SERVICE, LIST_ENDPOINT, {
          sessionId: sessionId
        });
      }

      // El backend devuelve { completed_tests: [...] }.
      // Normalizamos la respuesta para que LearningProfileService
      // siempre reciba una estructura válida.
      if (
        !result ||
        !Array.isArray(result.completed_tests)
      ) {
        return {
          completed_tests: []
        };
      }

      return result;

    } catch (error) {
      console.warn(
        'MicrotestService.listCompleted: No fue posible recuperar ' +
        'los microtests completados. Se continuará con lista vacía.',
        error
      );

      return {
        completed_tests: []
      };
    }
  }

  // --- Exponer API pública ---
  return {
    save: save,
    listCompleted: listCompleted
  };

})();
