// assets/js/platform/runtime/ModuleContextAdapter.js
// ==========================================================
// Module Context Adapter - Hito 4
// Adapta la estrategia cognitiva general para cada módulo específico.
// Cada módulo recibe solo la información que necesita.
// ==========================================================

var ModuleContextAdapter = (function() {
  'use strict';

  /**
   * Adapta la estrategia cognitiva para un módulo específico.
   * @param {object} strategy - Estrategia general de PedagogicalEngine.
   * @param {string} moduleName - Nombre del módulo ('reyfilosofo', 'sophia', 'academia', etc.).
   * @returns {object} Contexto adaptado para el módulo.
   */
  function adapt(strategy, moduleName) {
    if (!strategy || typeof strategy !== 'object') {
      throw new Error('ModuleContextAdapter.adapt: strategy es obligatoria.');
    }

    if (!moduleName || typeof moduleName !== 'string') {
      throw new Error('ModuleContextAdapter.adapt: moduleName es obligatorio.');
    }

    var normalizedName = moduleName.toLowerCase().trim();

    // --- Adaptadores por módulo ---

    var adapters = {
      'reyfilosofo': function(s) {
        return {
          tutorStyle: _mapTutorStyle(s.explanationStyle),
          useAnalogies: s.explanationStyle === 'analogical',
          difficulty: _mapDifficulty(s.abstractionLevel),
          scaffoldingLevel: s.scaffolding || 'medium',
          preferredFormat: s.preferredFormat || 'textual',
          systemsThinkingLevel: s.systemsThinking || 'medium',
          recommendations: s.recommendations || []
        };
      },

      'sophia': function(s) {
        return {
          responseStyle: _mapResponseStyle(s.explanationStyle),
          explanationDepth: _mapDepth(s.abstractionLevel),
          formatPreference: s.preferredFormat || 'textual',
          useAnalogies: s.explanationStyle === 'analogical',
          recommendations: s.recommendations || []
        };
      },

      'academia': function(s) {
        return {
          contentStyle: _mapContentStyle(s.explanationStyle),
          abstractionLevel: s.abstractionLevel || 'balanced',
          preferredFormat: s.preferredFormat || 'textual',
          scaffolding: s.scaffolding || 'medium',
          recommendations: s.recommendations || []
        };
      },

      'logos': function(s) {
        return {
          argumentationStyle: _mapArgumentationStyle(s.explanationStyle),
          abstractionLevel: s.abstractionLevel || 'balanced',
          systemsThinking: s.systemsThinking || 'medium',
          recommendations: s.recommendations || []
        };
      },

      'aletheia': function(s) {
        return {
          verificationStyle: _mapVerificationStyle(s.explanationStyle),
          depth: _mapDepth(s.abstractionLevel),
          recommendations: s.recommendations || []
        };
      }
    };

    // Si el módulo no tiene adaptador específico, devolver contexto genérico
    var adapter = adapters[normalizedName];
    if (adapter) {
      return adapter(strategy);
    }

    // Contexto genérico para módulos no definidos
    return {
      explanationStyle: strategy.explanationStyle || 'balanced',
      abstractionLevel: strategy.abstractionLevel || 'balanced',
      preferredFormat: strategy.preferredFormat || 'textual',
      scaffolding: strategy.scaffolding || 'medium',
      recommendations: strategy.recommendations || []
    };
  }

  // --- Funciones de mapeo internas ---

  function _mapTutorStyle(style) {
    var map = {
      'analogical': 'socratic',
      'structured': 'directive',
      'conceptual': 'expository',
      'step_by_step': 'guided',
      'balanced': 'adaptive'
    };
    return map[style] || 'adaptive';
  }

  function _mapDifficulty(level) {
    var map = {
      'concrete_first': 'beginner',
      'balanced': 'intermediate',
      'abstract_first': 'advanced'
    };
    return map[level] || 'intermediate';
  }

  function _mapResponseStyle(style) {
    var map = {
      'analogical': 'narrative',
      'structured': 'analytical',
      'conceptual': 'theoretical',
      'step_by_step': 'practical',
      'balanced': 'balanced'
    };
    return map[style] || 'balanced';
  }

  function _mapDepth(level) {
    var map = {
      'concrete_first': 'low',
      'balanced': 'medium',
      'abstract_first': 'high'
    };
    return map[level] || 'medium';
  }

  function _mapContentStyle(style) {
    var map = {
      'analogical': 'illustrative',
      'structured': 'systematic',
      'conceptual': 'theoretical',
      'step_by_step': 'procedural',
      'balanced': 'balanced'
    };
    return map[style] || 'balanced';
  }

  function _mapArgumentationStyle(style) {
    var map = {
      'analogical': 'metaphorical',
      'structured': 'logical',
      'conceptual': 'abstract',
      'step_by_step': 'sequential',
      'balanced': 'balanced'
    };
    return map[style] || 'balanced';
  }

  function _mapVerificationStyle(style) {
    var map = {
      'analogical': 'comparative',
      'structured': 'systematic',
      'conceptual': 'theoretical',
      'step_by_step': 'incremental',
      'balanced': 'balanced'
    };
    return map[style] || 'balanced';
  }

  // --- Exponer API pública ---
  return {
    adapt: adapt
  };

})();
