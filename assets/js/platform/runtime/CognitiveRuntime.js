// assets/js/platform/runtime/CognitiveRuntime.js
// ==========================================================
// Cognitive Runtime Layer - Hito 4, 5.0 & 5.1
// Punto de entrada cognitivo para todos los módulos de la plataforma.
// Orquesta el acceso a la estrategia pedagógica personalizada.
// ==========================================================

var CognitiveRuntime = (function() {
  'use strict';

  // --- Estado interno ---
  var _initialized = false;
  var _currentStrategy = null;
  var _lastUpdate = null;

  // Hito 5.0: Estructura base del contexto cognitivo
  var _userContext = {
    identity: {},
    profile: {},
    learning: {},
    strategy: {},
    module: { id: null, type: null, context: {} }
  };

  // --- Actualización de Identidad (Hito 5.1) ---
  
  /**
   * Actualiza el nodo identity dentro del contexto cognitivo.
   * Consulta al IdentityProvider de forma defensiva.
   */
  function updateIdentity() {

  var identity = {};

  if (typeof IdentityProvider !== 'undefined') {

    identity.mode =
      typeof IdentityProvider.getMode === 'function'
        ? IdentityProvider.getMode()
        : 'unknown';


    if (typeof IdentityProvider.getUser === 'function') {

      var currentUser = IdentityProvider.getUser();

      if (currentUser) {

        identity.user = currentUser;

        // Exponer nombre directamente en identity
        if (currentUser.name) {
          identity.name = currentUser.name;
        }

      }
    }

  }

  _userContext.identity = identity || {};

  }

  // --- Inicialización ---

  /**
   * Inicializa el runtime cognitivo.
   * Escucha eventos relevantes y prepara la primera estrategia.
   * @returns {Promise<boolean>} true si la inicialización fue exitosa.
   */
  async function initialize() {

    if (_initialized) {

      EventBus.emit('runtime:ready', {
        timestamp: Date.now(),
        strategy: _currentStrategy
      });

      return true;
    }

    try {
      // Hito 5.1: Cargar identidad inicial
      updateIdentity();

      // Escuchar cuando el perfil se cargue para refrescar la estrategia
      EventBus.on('profile:loaded', function() {
        refreshStrategy();
      });
// Hito 5.4: Sincronización reactiva de identidad
EventBus.on('auth:changed', function(data) {

  console.log('[CognitiveRuntime] auth:changed recibido:', data);

  updateIdentity();

  console.log('[CognitiveRuntime] nueva identity:', _userContext.identity);

  EventBus.emit('runtime:identity_updated', {
    identity: _userContext.identity,
    timestamp: Date.now()
  });

});
      // Escuchar cuando se genere una nueva estrategia para actualizar caché
      EventBus.on('cognitive:strategy_generated', function(strategy) {
        _currentStrategy = strategy;
        _userContext.strategy = strategy;
        _lastUpdate = Date.now();
      });

      // Cargar estrategia inicial
      await refreshStrategy();

      _initialized = true;

      // Emitir evento de runtime listo
      EventBus.emit('runtime:ready', {
        timestamp: Date.now(),
        strategy: _currentStrategy
      });

      return true;

    } catch (error) {
      console.error('[CognitiveRuntime] Error en inicialización:', error.message);
      throw error;
    }
  }

  // --- API pública ---

  /**
   * Obtiene la estrategia cognitiva actual.
   * Si no existe, la genera automáticamente.
   * @param {boolean} forceRefresh - Si es true, ignora la caché y recarga.
   * @returns {Promise<object>} Estrategia cognitiva.
   */
  async function getCurrentStrategy(forceRefresh) {
    if (forceRefresh) {
      await refreshStrategy();
    }

    if (!_currentStrategy) {
      await refreshStrategy();
    }

    return _currentStrategy;
  }

  /**
   * Refresca la estrategia cognitiva desde el motor pedagógico.
   * @returns {Promise<object>} Nueva estrategia.
   */
  async function refreshStrategy() {
    try {
      // Forzar refresco en PedagogicalEngine para obtener datos actualizados
      PedagogicalEngine.refresh();
      var strategy = await PedagogicalEngine.getStrategy(true);

      _currentStrategy = strategy;
      _userContext.strategy = strategy;
      _lastUpdate = Date.now();

      // Emitir evento de estrategia actualizada
      EventBus.emit('runtime:strategy_updated', {
        strategy: strategy,
        timestamp: _lastUpdate
      });

      return strategy;

    } catch (error) {
      console.error('[CognitiveRuntime] Error refrescando estrategia:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene una copia superficial del contexto cognitivo.
   * Contrato Hito 5.0 - Solo lectura.
   * @returns {object}
   */
  function getUserContext() {
    return {
      identity: _userContext.identity,
      profile: _userContext.profile,
      learning: _userContext.learning,
      strategy: _userContext.strategy,
      module: _userContext.module
    };
  }
    

  /**
   * Verifica si el runtime está inicializado.
   * @returns {boolean}
   */
  function isInitialized() {
    return _initialized;
  }

  /**
   * Obtiene la última fecha de actualización de la estrategia.
   * @returns {number|null} Timestamp o null.
   */
  function getLastUpdate() {
    return _lastUpdate;
  }

  // --- Exponer API pública ---
  return {
    initialize: initialize,
    getCurrentStrategy: getCurrentStrategy,
    refreshStrategy: refreshStrategy,
    getUserContext: getUserContext,
    isInitialized: isInitialized,
    getLastUpdate: getLastUpdate
  };

})();
