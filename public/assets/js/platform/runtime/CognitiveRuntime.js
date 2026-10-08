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
  var _strategyRefreshInProgress = false;

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
   * Consulta al LDIdentityProvider de forma defensiva.
   */
  function updateIdentity() {

  var identity = {};

  if (typeof LDIdentityProvider !== 'undefined') {

    identity.mode =
      typeof LDIdentityProvider.getMode === 'function'
        ? LDIdentityProvider.getMode()
        : 'unknown';


    if (typeof LDIdentityProvider.getUser === 'function') {

      var currentUser = LDIdentityProvider.getUser();

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

    console.log('[CognitiveRuntime] Inicializando...');

    // Actualizar identidad al inicio
    updateIdentity();

    // Escuchar cambios de autenticación/sesión (si LDIdentityProvider emite eventos)
    if (typeof EventBus !== 'undefined') {
      EventBus.on('identity:changed', updateIdentity);
      // Escuchar 'profile:loaded' para refrescar estrategia cuando el perfil esté listo
      EventBus.on('profile:loaded', function(context) {
        console.log('[CognitiveRuntime] Recibido profile:loaded. Refrescando estrategia.');
        // Llamar a refreshStrategy sin argumentos si el evento ya contiene el contexto completo
        // o si refreshStrategy está diseñado para operar con el contexto global/del usuario actual.
        // Para esta misión, refreshStrategy se invocará directamente con userId y updatedProfilePayload
        // desde LearningProfileService, así que esta escucha puede ser un respaldo o para otros flujos.
        // if (context && context.profile && window.currentUserId) {
        //   refreshStrategy(window.currentUserId, context.profile);
        // }
      });
    }

    try {
      // Intentar cargar la estrategia inicial
      await refreshStrategy(window.currentUserId || 'guest', {}); // Cargar estrategia para el usuario actual o 'guest'
      _initialized = true;

      EventBus.emit('runtime:ready', {
        timestamp: Date.now(),
        strategy: _currentStrategy
      });
      console.log('[CognitiveRuntime] Inicialización completada. Estrategia inicial:', _currentStrategy);
      return true;
    } catch (error) {
      console.error('[CognitiveRuntime] Error durante la inicialización:', error);
      _initialized = false;
      return false;
    }
  }

  /**
   * Devuelve la estrategia pedagógica actual.
   * @returns {object|null} La estrategia actual o null si no hay ninguna.
   */
  function getCurrentStrategy() {
    return _currentStrategy;
  }

  /**
   * Obtiene el contexto cognitivo completo del usuario actual.
   * Este es el objeto que se adjunta a las llamadas a la API o se utiliza para la lógica interna.
   * @returns {object} El contexto cognitivo actual del usuario.
   */
  function getUserContext() {
    // Asegurarse de que el userId en el contexto sea el actual o el fallback.
    _userContext.identity.user = _userContext.identity.user || { id: window.currentUserId || 'guest' };
    _userContext.strategy = _currentStrategy;
    return _userContext;
  }

  /**
   * Indica si el runtime cognitivo ha sido inicializado.
   * @returns {boolean} True si está inicializado, false en caso contrario.
   */
  function isInitialized() {
    return _initialized;
  }

  /**
   * Devuelve la marca de tiempo de la última actualización de la estrategia.
   * @returns {number|null} Timestamp en milisegundos o null.
   */
  function getLastUpdate() {
    return _lastUpdate;
  }

  /**
   * Actualiza la estrategia pedagógica para un usuario basándose en su perfil de aprendizaje actualizado.
   * @param {string} userId - El ID del usuario para quien se debe actualizar la estrategia.
   * @param {object} updatedProfilePayload - Datos del perfil actualizados (provenientes de LearningProfileService).
   * @returns {Promise<object>} La estrategia actualizada.
   */
  async function refreshStrategy(userId, updatedProfilePayload) {
    if (_strategyRefreshInProgress) {
      console.warn('[CognitiveRuntime] refreshStrategy ya en progreso. Saltando llamada redundante.');
      // Podríamos esperar a que la anterior termine o devolver la estrategia actual si es apropiado
      return _currentStrategy;
    }
    if (!userId) {
      console.error('[CognitiveRuntime] refreshStrategy: userId es obligatorio. Usando fallback.');
      userId = window.currentUserId || 'guest';
    }

    _strategyRefreshInProgress = true;
    console.log(`[CognitiveRuntime] Iniciando actualización de estrategia para usuario '${userId}' con payload:`, updatedProfilePayload);

    try {
      // Actualizar el nodo 'profile' en el contexto interno con el payload recibido.
      // Esto asegura que _userContext.profile tenga la información más reciente,
      // aunque luego se obtenga el contexto completo de LearningProfileService.
      _userContext.profile = { ...(_userContext.profile || {}), ...(updatedProfilePayload || {}) };
      _userContext.identity.user = { id: userId }; // Asegurar que la identidad del usuario esté configurada

      // Obtener el contexto completo. Ya que LearningProfileService.refresh()
      // invalida su caché, esta llamada obtendrá datos frescos de todas las fuentes.
      var fullContext = await LearningProfileService.getFullContext();
      
      // Actualizar _userContext con la información más completa del fullContext
      _userContext.profile = fullContext.profile;
      _userContext.learning = {
        map: fullContext.learningMap,
        completedTests: fullContext.completedTests
      };
      
      // --- Lógica de Determinación de Estrategia ---
      // Aquí se usaría el 'fullContext' para determinar la nueva estrategia pedagógica.
      // Por ejemplo: _currentStrategy = PedagogicalEngine.determineStrategy(fullContext);
      // Para esta misión, simularemos una estrategia basada en la información disponible.
      _currentStrategy = {
        id: `strategy-${userId}-${Date.now()}`,
        name: `Estrategia Adaptativa para ${userId}`,
        level: 'contextual', // Nivel simulado
        focus: updatedProfilePayload?.details?.variables?.topic || 'general_learning', // Usar información del payload
        fullContextSnapshot: fullContext // Guardar el contexto completo para referencia
      };
      _userContext.strategy = _currentStrategy;

      _lastUpdate = Date.now();

      EventBus.emit('runtime:strategyUpdated', {
        userId: userId,
        strategy: _currentStrategy,
        timestamp: _lastUpdate
      });

      console.log(`[CognitiveRuntime] Estrategia actualizada para usuario '${userId}':`, _currentStrategy);
      return _currentStrategy;

    } catch (error) {
      console.error('[CognitiveRuntime] Error actualizando estrategia:', error);
      throw error;
    } finally {
      _strategyRefreshInProgress = false;
    }
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
