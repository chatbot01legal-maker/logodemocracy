// assets/js/platform/services/LearningProfileService.js
// Servicio orquestador del contexto pedagógico del ciudadano.
// Combina los resultados de ProfileService, LearningMapService y MicrotestService
// en una única fuente de verdad para los módulos cognitivos.
// Dependencias: ProfileService, LearningMapService, MicrotestService, EventBus.

var LearningProfileService = (function() {
  'use strict';

  // --- Caché interna ---
  var _cache = null;

  // --- Funciones auxiliares privadas ---

  /**
   * Normaliza la respuesta de MicrotestService para garantizar que completedTests sea un array.
   * @param {object} microtests - Respuesta del backend.
   * @returns {string[]} Array de IDs de microtests completados.
   */
  function _normalizeCompletedTests(microtests) {
    if (microtests && Array.isArray(microtests.completed_tests)) {
      return microtests.completed_tests;
    }
    return [];
  }

  /**
   * Invalida la caché interna.
   */
  function _invalidateCache() {
    _cache = null;
  }

  // --- API pública ---

  /**
   * Obtiene el contexto completo del ciudadano: perfil, mapa de aprendizaje y microtests completados.
   * Realiza las tres llamadas en paralelo usando Promise.all.
   * Si alguna falla, propaga el error sin devolver datos parciales.
   * @returns {Promise<object>} Objeto con profile, learningMap y completedTests.
   */
  async function getFullContext() {
    // Si existe caché válida, devolverla.
    if (_cache) {
      return _cache;
    }

    try {
      // Ejecutar las tres consultas en paralelo
      var results = await Promise.all([
        ProfileService.getProfile(),
        LearningMapService.getLearningMap(),
        MicrotestService.listCompleted()
      ]);

      // Desestructurar resultados
      var profile = results[0] || {};
      var learningMap = results[1] || {};
      var microtests = results[2] || {};

      // Normalizar lista de microtests completados
      var completedTests = _normalizeCompletedTests(microtests);

      // Construir contexto
      var context = {
        profile: profile,
        learningMap: learningMap,
        completedTests: completedTests,
        timestamp: Date.now()
      };

      // Guardar en caché
      _cache = context;

      // Emitir evento de contexto cargado
      EventBus.emit('profile:loaded', context);

      return context;
    } catch (error) {
      // Propagar el error sin ocultarlo
      throw error;
    }
  }

  /**
   * Invalida la caché interna y fuerza una recarga en la próxima llamada a getFullContext().
   * @returns {boolean} true si se invalidó correctamente.
   */
  function refresh() {
    _invalidateCache();
    return true;
  }

  // --- Futuro: getContextForModule (comentado) ---
  /*
   * Futuro método para obtener solo la información relevante para un módulo específico.
   * Ejemplo: Sophia solo necesita el perfil, no el mapa de aprendizaje completo.
   * @param {string} moduleName - Nombre del módulo cognitivo.
   * @returns {Promise<object>} Contexto filtrado para ese módulo.
   */
  // async function getContextForModule(moduleName) {
  //   var fullContext = await getFullContext();
  //   // Lógica de filtrado según módulo
  //   return fullContext;
  // }

  // --- Exponer API pública ---
  return {
    getFullContext: getFullContext,
    refresh: refresh
  };

})();
