// assets/js/platform/cognitive/PedagogicalEngine.js
// Motor principal de adaptación pedagógica.
// Orquesta la obtención del contexto, su normalización y la generación de estrategias.
// Dependencias: LearningProfileService, ContextAdapter, LearningStrategy, EventBus.

var PedagogicalEngine = (function() {
  'use strict';

  // --- Estado interno ---
  var _cache = null;

  /**
   * Invalida la caché de la última estrategia generada.
   */
  function _invalidateCache() {
    _cache = null;
  }

  // --- API pública ---

  /**
   * Genera una estrategia pedagógica personalizada para el ciudadano actual.
   * Obtiene el contexto completo desde LearningProfileService, lo normaliza,
   * aplica las reglas pedagógicas y retorna una estrategia enriquecida.
   * @param {boolean} forceRefresh - Si es true, invalida la caché y recarga.
   * @returns {Promise<object>} Estrategia con recomendaciones y campos pedagógicos.
   */
  async function getStrategy(forceRefresh) {
    if (forceRefresh) {
      _invalidateCache();
      // Forzar refresco del contexto en LearningProfileService
      LearningProfileService.refresh();
    }

    // Si existe caché válida, devolverla sin volver a calcular.
    if (_cache) {
      return _cache;
    }

    try {
      // 1. Obtener contexto completo desde LearningProfileService
      var fullContext = await LearningProfileService.getFullContext();

      // 2. Normalizar el contexto
      var normalizedContext = ContextAdapter.normalize(fullContext);

      // 3. Generar estrategia basada en el contexto normalizado
      var strategy = LearningStrategy.generate(normalizedContext);

      // 4. Enriquecer la estrategia con información adicional
      var enrichedStrategy = {
        ...strategy,
        timestamp: Date.now(),
        contextHash: {
          profileCount: Object.keys(fullContext.profile).length,
          learningMapCount: Object.keys(fullContext.learningMap).length,
          completedTests: fullContext.completedTests.length
        }
      };

      // 5. Guardar en caché
      _cache = enrichedStrategy;

      // 6. Emitir evento de estrategia generada
      EventBus.emit('cognitive:strategy_generated', enrichedStrategy);

      return enrichedStrategy;
    } catch (error) {
      // Propagar el error sin ocultarlo
      throw error;
    }
  }

  /**
   * Invalida la caché de estrategia.
   */
  function refresh() {
    _invalidateCache();
    return true;
  }

  // --- Exponer API pública ---
  return {
    getStrategy: getStrategy,
    refresh: refresh
  };

})();

