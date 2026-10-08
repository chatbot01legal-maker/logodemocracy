// assets/js/platform/cognitive/LearningStrategy.js
// Módulo de reglas pedagógicas. Genera recomendaciones personalizadas
// a partir del contexto normalizado del ciudadano.
// Dependencias: Ninguna (recibe el contexto normalizado como parámetro).

var LearningStrategy = (function() {
  'use strict';

  /**
   * Genera recomendaciones pedagógicas basadas en el contexto normalizado.
   * @param {object} normalizedContext - Contexto normalizado por ContextAdapter.
   * @returns {object} Estrategia con recomendaciones y campos pedagógicos.
   */
  function generate(normalizedContext) {
    if (!normalizedContext || typeof normalizedContext !== 'object') {
      throw new Error('LearningStrategy.generate: normalizedContext es obligatorio.');
    }

    var prefs = normalizedContext.learningPreferences || {};
    var cognitive = normalizedContext.cognitiveProfile || {};
    var progress = normalizedContext.progress || {};

    var recommendations = [];
    var explanationStyle = prefs.explanationStyle || 'general';
    var abstractionLevel = prefs.abstractionLevel || 'intermedio';
    var preferredFormat = prefs.preferredFormat || 'textual';
    var scaffolding = prefs.scaffoldingNeed || 'media';
    var systemsThinking = cognitive.systemsThinking || 'medio';

    // --- Reglas basadas en estilo explicativo ---
    if (prefs.explanationStyle === 'analogico') {
      recommendations.push('Usar analogías frecuentes para conectar conceptos nuevos con ideas familiares.');
      explanationStyle = 'analogical';
    } else if (prefs.explanationStyle === 'secuencial_estructurado') {
      recommendations.push('Estructurar la información en pasos lógicos y secuenciales.');
      recommendations.push('Incluir resúmenes al final de cada sección.');
      explanationStyle = 'structured';
    } else if (prefs.explanationStyle === 'conceptual') {
      recommendations.push('Partir de definiciones claras y luego profundizar en ejemplos.');
      recommendations.push('Usar lenguaje preciso y formal.');
      explanationStyle = 'conceptual';
    } else if (prefs.explanationStyle === 'paso_a_paso') {
      recommendations.push('Dividir conceptos complejos en pasos pequeños y accesibles.');
      recommendations.push('Incluir ejercicios prácticos después de cada paso.');
      explanationStyle = 'step_by_step';
    } else {
      explanationStyle = 'balanced';
      recommendations.push('Combinar explicaciones teóricas con ejemplos prácticos.');
    }

    // --- Reglas basadas en nivel de abstracción ---
    if (prefs.abstractionLevel === 'concreto') {
      recommendations.push('Comenzar desde ejemplos y casos concretos antes de generalizar.');
      abstractionLevel = 'concrete_first';
    } else if (prefs.abstractionLevel === 'abstracto') {
      recommendations.push('Presentar primero el marco teórico y luego los casos de aplicación.');
      abstractionLevel = 'abstract_first';
    } else {
      abstractionLevel = 'balanced';
      recommendations.push('Alternar entre ejemplos concretos y reflexiones abstractas.');
    }

    // --- Reglas basadas en formato preferido ---
    if (prefs.preferredFormat === 'visual') {
      recommendations.push('Apoyar la explicación con gráficos, diagramas o mapas conceptuales.');
      preferredFormat = 'visual';
    } else if (prefs.preferredFormat === 'auditivo_conversacional') {
      recommendations.push('Usar un tono conversacional y dinámico.');
      recommendations.push('Incluir preguntas retóricas y diálogos simulados.');
      preferredFormat = 'conversational';
    } else {
      preferredFormat = 'textual';
      recommendations.push('Priorizar textos claros y bien estructurados.');
    }

    // --- Reglas basadas en necesidad de andamiaje ---
    if (prefs.scaffoldingNeed === 'alta') {
      recommendations.push('Proporcionar andamiaje constante: guías paso a paso, preguntas guía y retroalimentación frecuente.');
      scaffolding = 'high';
    } else if (prefs.scaffoldingNeed === 'baja') {
      recommendations.push('Permitir mayor autonomía, ofrecer retos y preguntas abiertas.');
      scaffolding = 'low';
    } else {
      scaffolding = 'medium';
      recommendations.push('Ofrecer andamiaje moderado, con apoyos disponibles bajo demanda.');
    }

    // --- Reglas basadas en pensamiento sistémico ---
    if (cognitive.systemsThinking === 'alto') {
      recommendations.push('Profundizar en relaciones causales y bucles de retroalimentación.');
      recommendations.push('Incorporar análisis de sistemas complejos.');
      systemsThinking = 'high';
    } else if (cognitive.systemsThinking === 'bajo') {
      recommendations.push('Introducir el pensamiento sistémico gradualmente con ejemplos simples.');
      systemsThinking = 'low';
    } else {
      systemsThinking = 'medium';
      recommendations.push('Fomentar la conexión entre ideas aparentemente independientes.');
    }

    // --- Reglas basadas en orientación ---
    if (prefs.orientation === 'practica') {
      recommendations.push('Priorizar aplicaciones prácticas y ejercicios de resolución de problemas.');
    } else if (prefs.orientation === 'teorica') {
      recommendations.push('Valorar la profundidad conceptual y el análisis crítico.');
    }

    // --- Reglas basadas en secuencia preferida ---
    if (prefs.sequencePreference === 'ejemplos_primero') {
      recommendations.push('Iniciar con ejemplos ilustrativos y luego derivar la teoría.');
    } else if (prefs.sequencePreference === 'definicion_primero') {
      recommendations.push('Comenzar con definiciones claras y luego expandir con ejemplos.');
    }

    // --- Reglas de progreso ---
    if (progress.progressPercentage < 30) {
      recommendations.push('Fomentar la exploración gradual del currículum.');
    } else if (progress.progressPercentage > 70) {
      recommendations.push('Ofrecer contenidos avanzados y desafíos integradores.');
    }

    return {
      explanationStyle: explanationStyle,
      abstractionLevel: abstractionLevel,
      preferredFormat: preferredFormat,
      scaffolding: scaffolding,
      systemsThinking: systemsThinking,
      recommendations: recommendations
    };
  }

  return {
    generate: generate
  };

})();
