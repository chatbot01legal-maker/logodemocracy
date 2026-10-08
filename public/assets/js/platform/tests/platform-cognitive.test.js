// assets/js/platform/tests/platform-cognitive.test.js
// ==========================================================
// LogoDemocracy Platform - Cognitive Layer Tests
// Hito 3: Interpretación Cognitiva y Estrategia Personalizada
// Registrado en el TestRunner interno.
// ==========================================================

(function() {
  'use strict';


  function assert(condition, message) {

    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }

  }


  // ==========================================================
  // TEST 1
  // ==========================================================

  TestRunner.test(
    'PedagogicalEngine existe y tiene getStrategy()',
    function() {

      assert(
        typeof PedagogicalEngine !== 'undefined',
        'PedagogicalEngine no está definido'
      );


      assert(
        typeof PedagogicalEngine.getStrategy === 'function',
        'PedagogicalEngine.getStrategy debe ser una función'
      );


      assert(
        typeof PedagogicalEngine.refresh === 'function',
        'PedagogicalEngine.refresh debe ser una función'
      );

    }
  );



  // ==========================================================
  // TEST 2
  // ==========================================================

  TestRunner.test(
    'ContextAdapter existe y tiene normalize()',
    function() {

      assert(
        typeof ContextAdapter !== 'undefined',
        'ContextAdapter no está definido'
      );


      assert(
        typeof ContextAdapter.normalize === 'function',
        'ContextAdapter.normalize debe ser una función'
      );

    }
  );



  // ==========================================================
  // TEST 3
  // ==========================================================

  TestRunner.test(
    'LearningStrategy existe y tiene generate()',
    function() {

      assert(
        typeof LearningStrategy !== 'undefined',
        'LearningStrategy no está definido'
      );


      assert(
        typeof LearningStrategy.generate === 'function',
        'LearningStrategy.generate debe ser una función'
      );

    }
  );



  // ==========================================================
  // TEST 4
  // ==========================================================

  TestRunner.test(
    'ContextAdapter normaliza correctamente el contexto',
    function() {


      var mockContext = {

        profile: {

          estilo_explicativo: 'analogico',

          nivel_abstraccion_inicial: 'concreto',

          preferencia_formato: 'visual',

          necesidad_andamiaje: 'alta',

          tipo_andamiaje_preferido: [
            'resumen',
            'mapa'
          ],

          orientacion: 'practica',

          tipo_analogia_dominante: 'sistemica',

          preferencia_ejemplos: 'alta',

          secuencia_preferida: 'ejemplos_primero'

        },


        learningMap: {

          pensamiento_sistemico: 'alto',

          competencias: {

            argumentacion: {
              autonomy: 75
            },

            lectura_critica: {
              autonomy: 60
            },

            epistemologia: {
              autonomy: 45
            }

          }

        },


        completedTests: [

          'brujula',
          'ejemplos',
          'puentes'

        ]

      };



      var result = ContextAdapter.normalize(mockContext);



      assert(
        result.learningPreferences,
        'Falta learningPreferences'
      );


      assert(
        result.cognitiveProfile,
        'Falta cognitiveProfile'
      );


      assert(
        result.progress,
        'Falta progress'
      );


      assert(
        result.learningPreferences.explanationStyle === 'analogico',
        'explanationStyle incorrecto'
      );


      assert(
        result.learningPreferences.abstractionLevel === 'concreto',
        'abstractionLevel incorrecto'
      );


      assert(
        result.learningPreferences.preferredFormat === 'visual',
        'preferredFormat incorrecto'
      );


      assert(
        result.cognitiveProfile.systemsThinking === 'alto',
        'systemsThinking incorrecto'
      );


      assert(
        result.cognitiveProfile.argumentation === 75,
        'argumentation incorrecto'
      );


      assert(
        result.progress.completedTests.length === 3,
        'completedTests incorrecto'
      );


      assert(
        result.progress.progressPercentage === 30,
        'progressPercentage incorrecto'
      );


    }
  );



  // ==========================================================
  // TEST 5
  // ==========================================================

  TestRunner.test(
    'PedagogicalEngine genera estrategia coherente',
    async function() {


      var originalGetFullContext =
        LearningProfileService.getFullContext;



      var mockFullContext = {

        profile: {

          estilo_explicativo: 'analogico',

          nivel_abstraccion_inicial: 'concreto',

          preferencia_formato: 'visual',

          necesidad_andamiaje: 'alta',

          tipo_andamiaje_preferido: [
            'resumen',
            'mapa'
          ],

          orientacion: 'practica'

        },


        learningMap: {

          pensamiento_sistemico: 'alto',

          competencias: {}

        },


        completedTests: [

          'brujula'

        ]

      };



      LearningProfileService.getFullContext =
        function() {

          return Promise.resolve(mockFullContext);

        };



      PedagogicalEngine.refresh();



      var strategy =
        await PedagogicalEngine.getStrategy();



      assert(
        strategy,
        'La estrategia no debería ser null'
      );


      assert(
        typeof strategy.explanationStyle === 'string',
        'Falta explanationStyle'
      );


      assert(
        typeof strategy.abstractionLevel === 'string',
        'Falta abstractionLevel'
      );


      assert(
        typeof strategy.preferredFormat === 'string',
        'Falta preferredFormat'
      );


      assert(
        typeof strategy.scaffolding === 'string',
        'Falta scaffolding'
      );


      assert(
        typeof strategy.systemsThinking === 'string',
        'Falta systemsThinking'
      );


      assert(
        Array.isArray(strategy.recommendations),
        'recommendations debe ser array'
      );


      assert(
        strategy.recommendations.length > 0,
        'Debe existir al menos una recomendación'
      );



      assert(
        strategy.explanationStyle === 'analogical',
        'Estilo explicativo incorrecto'
      );


      assert(
        strategy.abstractionLevel === 'concrete_first',
        'Nivel abstracción incorrecto'
      );


      assert(
        strategy.preferredFormat === 'visual',
        'Formato incorrecto'
      );


      assert(
        strategy.scaffolding === 'high',
        'Andamiaje incorrecto'
      );


      assert(
        strategy.systemsThinking === 'high',
        'Pensamiento sistémico incorrecto'
      );



      LearningProfileService.getFullContext =
        originalGetFullContext;


    }
  );



  // ==========================================================
  // TEST 6
  // ==========================================================

  TestRunner.test(
    'Evento cognitive:strategy_generated funciona',
    function() {


      var eventReceived = false;

      var strategyData = null;



      function handler(detail) {

        eventReceived = true;

        strategyData = detail;

      }



      EventBus.on(
        'cognitive:strategy_generated',
        handler
      );



      var testStrategy = {

        explanationStyle: 'analogical',

        abstractionLevel: 'concrete_first',

        preferredFormat: 'visual',

        scaffolding: 'high',

        systemsThinking: 'high',

        recommendations: [

          'Usar analogías'

        ]

      };



      EventBus.emit(
        'cognitive:strategy_generated',
        testStrategy
      );



      assert(
        eventReceived === true,
        'Evento no recibido'
      );


      assert(
        strategyData !== null,
        'Datos del evento faltantes'
      );


      assert(
        strategyData.explanationStyle === 'analogical',
        'Datos incorrectos'
      );



      EventBus.off(
        'cognitive:strategy_generated',
        handler
      );


    }
  );


})();
