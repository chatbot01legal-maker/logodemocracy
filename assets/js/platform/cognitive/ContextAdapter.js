// assets/js/platform/cognitive/ContextAdapter.js
// Normaliza el contexto pedagógico del ciudadano para que todos los módulos
// reciban un formato estable y predecible.
// Dependencias: Ninguna (recibe el contexto como parámetro).

var ContextAdapter = (function() {
  'use strict';

  /**
   * Normaliza el contexto completo del ciudadano.
   * @param {object} context - Contexto obtenido de LearningProfileService.getFullContext().
   * @param {object} context.profile - Perfil pedagógico estable.
   * @param {object} context.learningMap - Mapa dinámico de competencias.
   * @param {string[]} context.completedTests - Lista de microtests completados.
   * @returns {object} Contexto normalizado con learningPreferences, cognitiveProfile y progress.
   */
  function normalize(context) {
    if (!context || typeof context !== 'object') {
      throw new Error('ContextAdapter.normalize: context es obligatorio y debe ser un objeto.');
    }

    var profile = context.profile || {};
    var learningMap = context.learningMap || {};
    var completedTests = context.completedTests || [];

    // --- learningPreferences: preferencias explícitas del ciudadano ---
    var learningPreferences = {
      explanationStyle: profile.estilo_explicativo || null,
      abstractionLevel: profile.nivel_abstraccion_inicial || null,
      preferredFormat: profile.preferencia_formato || null,
      scaffoldingNeed: profile.necesidad_andamiaje || null,
      preferredScaffoldTypes: profile.tipo_andamiaje_preferido || [],
      orientation: profile.orientacion || null, // práctica, teórica, mixta
      analogyPreference: profile.tipo_analogia_dominante || null,
      examplePreference: profile.preferencia_ejemplos || null,
      sequencePreference: profile.secuencia_preferida || null // ejemplos_primero, definicion_primero
    };

    // --- cognitiveProfile: capacidades cognitivas evaluadas (dinámicas) ---
    var cognitiveProfile = {
      systemsThinking: learningMap.pensamiento_sistemico || null,
      argumentation: learningMap.competencias?.argumentacion?.autonomy || null,
      criticalReading: learningMap.competencias?.lectura_critica?.autonomy || null,
      epistemology: learningMap.competencias?.epistemologia?.autonomy || null,
      deliberation: learningMap.competencias?.deliberacion?.autonomy || null,
      logic: learningMap.competencias?.logica?.autonomy || null,
      fallacyDetection: learningMap.competencias?.deteccion_falacias?.autonomy || null
    };

    // --- progress: estado de avance ---
    var progress = {
      completedTests: completedTests,
      testCount: completedTests.length,
      totalTests: 10, // total de microtests definidos en la plataforma
      progressPercentage: Math.round((completedTests.length / 10) * 100)
    };

    return {
      learningPreferences: learningPreferences,
      cognitiveProfile: cognitiveProfile,
      progress: progress
    };
  }

  return {
    normalize: normalize
  };

})();
