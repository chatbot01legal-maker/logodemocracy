// assets/js/platform/tests/platform-runtime.test.js
// ==========================================================
// Pruebas del Hito 4 - Cognitive Runtime Layer
// Registra las pruebas para el TestRunner interno.
// ==========================================================

(function() {
  'use strict';

  // Función assert global para las pruebas
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // ==========================
  // TESTS
  // ==========================

  TestRunner.test(
    'CognitiveRuntime existe y tiene interfaz pública',
    function() {
      assert(
        typeof CognitiveRuntime !== 'undefined',
        'CognitiveRuntime no está definido'
      );

      assert(
        typeof CognitiveRuntime.initialize === 'function',
        'CognitiveRuntime.initialize debe ser función'
      );

      assert(
        typeof CognitiveRuntime.getCurrentStrategy === 'function',
        'CognitiveRuntime.getCurrentStrategy debe ser función'
      );

      assert(
        typeof CognitiveRuntime.refreshStrategy === 'function',
        'CognitiveRuntime.refreshStrategy debe ser función'
      );

      assert(
        typeof CognitiveRuntime.isInitialized === 'function',
        'CognitiveRuntime.isInitialized debe ser función'
      );

      assert(
        typeof CognitiveRuntime.getLastUpdate === 'function',
        'CognitiveRuntime.getLastUpdate debe ser función'
      );
    }
  );

  TestRunner.test(
    'ModuleContextAdapter existe y tiene adapt()',
    function() {
      assert(
        typeof ModuleContextAdapter !== 'undefined',
        'ModuleContextAdapter no está definido'
      );

      assert(
        typeof ModuleContextAdapter.adapt === 'function',
        'ModuleContextAdapter.adapt debe ser función'
      );
    }
  );

  TestRunner.test(
    'CognitiveRuntime puede inicializarse',
    function() {
      // Verificar que la inicialización no falle
      return CognitiveRuntime.initialize()
        .then(function(result) {
          assert(
            result === true || result === undefined,
            'La inicialización debe retornar true o undefined'
          );

          assert(
            CognitiveRuntime.isInitialized() === true,
            'isInitialized debe ser true después de initialize()'
          );
        });
    }
  );

  TestRunner.test(
    'CognitiveRuntime puede obtener estrategia',
    function() {
      return CognitiveRuntime.initialize()
        .then(function() {
          return CognitiveRuntime.getCurrentStrategy();
        })
        .then(function(strategy) {
          assert(
            strategy !== null && strategy !== undefined,
            'getCurrentStrategy no debe retornar null o undefined'
          );

          assert(
            typeof strategy === 'object',
            'La estrategia debe ser un objeto'
          );

          // Verificar campos esenciales
          assert(
            'recommendations' in strategy,
            'La estrategia debe tener recommendations'
          );

          assert(
            Array.isArray(strategy.recommendations),
            'recommendations debe ser un array'
          );
        });
    }
  );

  TestRunner.test(
    'CognitiveRuntime.refreshStrategy() actualiza la estrategia',
    function() {
      var oldTimestamp = CognitiveRuntime.getLastUpdate();

      return CognitiveRuntime.refreshStrategy()
        .then(function(newStrategy) {
          var newTimestamp = CognitiveRuntime.getLastUpdate();

          assert(
            newTimestamp !== null,
            'getLastUpdate no debe retornar null después de refresh'
          );

          // Verificar que la estrategia tiene la estructura esperada
          assert(
            newStrategy && typeof newStrategy === 'object',
            'refreshStrategy debe retornar una estrategia válida'
          );
        });
    }
  );

  TestRunner.test(
    'ModuleContextAdapter adapta para Rey Filósofo',
    function() {
      var mockStrategy = {
        explanationStyle: 'analogical',
        abstractionLevel: 'concrete_first',
        preferredFormat: 'visual',
        scaffolding: 'high',
        systemsThinking: 'high',
        recommendations: ['Usar analogías', 'Comenzar desde ejemplos']
      };

      var adapted = ModuleContextAdapter.adapt(mockStrategy, 'reyfilosofo');

      assert(
        adapted.tutorStyle === 'socratic',
        'tutorStyle debería ser socratic para analogical'
      );

      assert(
        adapted.useAnalogies === true,
        'useAnalogies debería ser true para analogical'
      );

      assert(
        adapted.difficulty === 'beginner',
        'difficulty debería ser beginner para concrete_first'
      );

      assert(
        adapted.scaffoldingLevel === 'high',
        'scaffoldingLevel debería coincidir'
      );
    }
  );

  TestRunner.test(
    'ModuleContextAdapter adapta para Sophia',
    function() {
      var mockStrategy = {
        explanationStyle: 'conceptual',
        abstractionLevel: 'abstract_first',
        preferredFormat: 'textual',
        scaffolding: 'low',
        recommendations: []
      };

      var adapted = ModuleContextAdapter.adapt(mockStrategy, 'sophia');

      assert(
        adapted.responseStyle === 'theoretical',
        'responseStyle debería ser theoretical para conceptual'
      );

      assert(
        adapted.explanationDepth === 'high',
        'explanationDepth debería ser high para abstract_first'
      );

      assert(
        adapted.formatPreference === 'textual',
        'formatPreference debería coincidir'
      );
    }
  );

  TestRunner.test(
    'ModuleContextAdapter adapta para Academia',
    function() {
      var mockStrategy = {
        explanationStyle: 'structured',
        abstractionLevel: 'balanced',
        preferredFormat: 'visual',
        scaffolding: 'medium',
        recommendations: []
      };

      var adapted = ModuleContextAdapter.adapt(mockStrategy, 'academia');

      assert(
        adapted.contentStyle === 'systematic',
        'contentStyle debería ser systematic para structured'
      );

      assert(
        adapted.abstractionLevel === 'balanced',
        'abstractionLevel debería coincidir'
      );

      assert(
        adapted.scaffolding === 'medium',
        'scaffolding debería coincidir'
      );
    }
  );

  TestRunner.test(
    'ModuleContextAdapter maneja módulos desconocidos con contexto genérico',
    function() {
      var mockStrategy = {
        explanationStyle: 'balanced',
        abstractionLevel: 'balanced',
        preferredFormat: 'visual',
        scaffolding: 'medium',
        recommendations: ['Recomendación genérica']
      };

      var adapted = ModuleContextAdapter.adapt(mockStrategy, 'modulo_desconocido');

      assert(
        adapted.explanationStyle === 'balanced',
        'El contexto genérico debe mantener explanationStyle'
      );

      assert(
        adapted.recommendations.length === 1,
        'El contexto genérico debe mantener recommendations'
      );
    }
  );

  TestRunner.test(
    'Evento runtime:ready es emitido por CognitiveRuntime',
    function() {
      var eventReceived = false;
      var eventData = null;

      function handler(detail) {
        eventReceived = true;
        eventData = detail;
      }

      EventBus.on('runtime:ready', handler);

      // Reinicializar para forzar evento
      return CognitiveRuntime.initialize()
        .then(function() {
          assert(
            eventReceived === true,
            'El evento runtime:ready no fue emitido'
          );

          assert(
            eventData && eventData.strategy !== undefined,
            'El evento runtime:ready debe incluir estrategia'
          );

          assert(
            eventData.timestamp !== undefined,
            'El evento runtime:ready debe incluir timestamp'
          );

          EventBus.off('runtime:ready', handler);
        })
        .catch(function(error) {
          EventBus.off('runtime:ready', handler);
          throw error;
        });
    }
  );

  TestRunner.test(
    'Evento runtime:strategy_updated es emitido al refrescar',
    function() {
      var eventReceived = false;
      var eventData = null;

      function handler(detail) {
        eventReceived = true;
        eventData = detail;
      }

      EventBus.on('runtime:strategy_updated', handler);

      return CognitiveRuntime.refreshStrategy()
        .then(function() {
          assert(
            eventReceived === true,
            'El evento runtime:strategy_updated no fue emitido'
          );

          assert(
            eventData && eventData.strategy !== undefined,
            'El evento debe incluir la estrategia'
          );

          assert(
            eventData.timestamp !== undefined,
            'El evento debe incluir timestamp'
          );

          EventBus.off('runtime:strategy_updated', handler);
        })
        .catch(function(error) {
          EventBus.off('runtime:strategy_updated', handler);
          throw error;
        });
    }
  );

})();
