// assets/js/platform/services/LearningProfileService.js
// Servicio orquestador del contexto pedagógico.
// Combina perfil, mapa de aprendizaje y evidencia de Microtests.
// Los indicadores y evidencias estructuradas quedan disponibles para
// Rey Filósofo; las interpretaciones cualitativas se presentan al usuario.

var LearningProfileService = (function() {
  'use strict';

  var _cache = null;

  // ============================================================
  // UTILIDADES
  // ============================================================

  function _normalizeCompletedTests(microtests) {
    if (microtests && Array.isArray(microtests.completed_tests)) {
      return microtests.completed_tests;
    }
    return [];
  }

  function _invalidateCache() {
    _cache = null;
  }

  /**
   * Cuenta los indicadores encontrados en las evidencias.
   * Esta información es INTERNA.
   */
  function _indicatorCounts(evidence) {
    var counts = {};

    (evidence || []).forEach(function(item) {
      if (!item || !item.indicator) {
        return;
      }

      counts[item.indicator] = (counts[item.indicator] || 0) + 1;
    });

    return counts;
  }

  /**
   * Devuelve los indicadores encontrados, ordenados por frecuencia.
   * Esta información es INTERNA.
   */
  function _dominantIndicators(evidence) {
    var counts = _indicatorCounts(evidence);

    return Object.keys(counts).sort(function(a, b) {
      return counts[b] - counts[a];
    });
  }

  // ============================================================
  // INTERPRETACIONES CUALITATIVAS
  // ============================================================
  //
  // Estas frases NO son etiquetas psicológicas.
  // Son piezas de lenguaje que permiten convertir la evidencia
  // estructurada de cada Microtest en una devolución comprensible.
  //

  var MICROTEST_QUALITATIVE = {

    brujula: {
      title: 'Cómo construyes una comprensión',

      frames: {
        ejemplo:
          'Sueles entrar en una idea nueva a partir de situaciones concretas que te permiten verla funcionando.',

        principio:
          'Tiendes a buscar la idea general o el principio que permite explicar lo que estás observando.',

        analogia:
          'Tiendes a comprender relacionando lo nuevo con algo que ya conoces y que puede servirte como referencia.',

        secuencia:
          'Tiendes a construir la comprensión siguiendo un orden, avanzando desde una parte hacia otra hasta llegar al conjunto.'
      },

      close:
        'Por eso, al acompañarte en un aprendizaje nuevo puede ser útil combinar explicaciones generales con ejemplos, conexiones o pasos concretos.'
    },

    ejemplos: {
      title: 'Construir sobre lo que ya sabes',

      frames: {
        anclaje_experiencial:
          'Sueles relacionar lo nuevo con experiencias o situaciones que ya conoces.',

        recuperacion_conocimiento:
          'Tu comprensión parece apoyarse en recuperar conocimientos que ya tienes disponibles y utilizarlos como punto de partida.',

        comparacion:
          'Tiendes a encontrar puntos de contacto entre lo nuevo y conocimientos anteriores para construir una comprensión más sólida.',

        contraste:
          'Las diferencias entre lo conocido y lo nuevo también parecen ayudarte a precisar qué cambia y qué permanece.'
      },

      close:
        'Por eso, conectar los contenidos nuevos con lo que ya conoces y utilizar comparaciones puede ser una vía especialmente útil para profundizar tu comprensión.'
    },

    puentes: {
      title: 'Transferir a una situación nueva',

      frames: {
        transferencia_global:
          'Cuando cambia la situación, tiendes a intentar llevar directamente lo aprendido al nuevo contexto.',

        mapeo_analitico:
          'Tiendes a examinar qué elementos de una situación conocida corresponden a los de una situación nueva.',

        contraste:
          'Las diferencias entre situaciones parecen ayudarte a decidir qué parte de lo aprendido sigue siendo útil.',

        extraccion_regla:
          'Tiendes a buscar una regla general que puedas volver a utilizar cuando aparezca una situación diferente.'
      },

      close:
        'Esto muestra que para ti comprender algo también implica descubrir qué parte de ese aprendizaje puede seguir siendo útil cuando cambia el contexto.'
    },

    mapa_camino: {
      title: 'Convertir comprensión en acción',

      frames: {
        experimentacion:
          'Ante un problema, aparece una disposición a probar una posibilidad y aprender del resultado.',

        planificacion:
          'Tiendes a pensar primero en un camino de acción antes de comenzar a ejecutarlo.',

        modelo_referencia:
          'Sueles buscar una referencia o un modelo que te ayude a orientar lo que vas a hacer.',

        descomposicion:
          'Tiendes a dividir un problema grande en partes más manejables antes de actuar.'
      },

      close:
        'Por eso, al aprender algo que después debes utilizar, puede ser especialmente útil pasar de la comprensión a la acción mediante pasos que permitan comprobar y ajustar el camino.'
    },

    redes: {
      title: 'Pensar en relaciones',

      frames: {
        relacion_directa:
          'Tiendes a fijarte en cómo se relacionan directamente los elementos de una situación.',

        cadena_causal:
          'Aparece una tendencia a seguir una cadena de causas y consecuencias para comprender lo que ocurre.',

        interdependencia:
          'Sueles considerar que distintas partes de un problema pueden depender unas de otras.',

        retroalimentacion:
          'Aparece sensibilidad hacia situaciones en las que una acción puede modificar posteriormente las condiciones que la produjeron.'
      },

      close:
        'Por eso, mostrar cómo se conectan las partes de un problema puede ayudarte más que presentar cada elemento de manera aislada.'
    },

    sentidos: {
      title: 'Cambiar la representación cuando algo no funciona',

      frames: {
        reexplicacion:
          'Cuando una explicación no resulta suficiente, tiendes a intentar formularla de otra manera.',

        ejemplo:
          'Los ejemplos concretos parecen ser una vía útil para volver comprensible una idea difícil.',

        representacion_visual:
          'Aparece una tendencia a beneficiarte de organizar visualmente la información.',

        reorganizacion:
          'Tiendes a ordenar nuevamente la información cuando la primera forma de presentarla no funciona.'
      },

      close:
        'Esto sugiere que cambiar la forma de representar una idea puede ser una estrategia importante cuando la primera explicación no consigue producir comprensión.'
    },

    escalando: {
      title: 'Regular el nivel de abstracción',

      frames: {
        concreto:
          'Tiendes a comprender mejor cuando puedes partir de algo concreto y reconocible.',

        patron:
          'Aparece una tendencia a buscar patrones que permitan conectar varios casos.',

        principio:
          'Tiendes a avanzar desde los casos hacia principios más generales.',

        panorama_global:
          'También aparece capacidad para mirar el problema desde una perspectiva más amplia antes de entrar en los detalles.'
      },

      close:
        'Una explicación para ti puede necesitar moverse entre ejemplos concretos, patrones y principios generales, en lugar de permanecer siempre en un solo nivel.'
    },

    secuencia: {
      title: 'Reparar una comprensión incompleta',

      frames: {
        retroceso:
          'Cuando aparece una dificultad, puedes volver atrás para localizar dónde comenzó el problema.',

        aislamiento_error:
          'Tiendes a intentar identificar exactamente qué parte de la comprensión está fallando.',

        pregunta_diagnostica:
          'Las preguntas que permiten descubrir qué falta parecen ser una herramienta útil para revisar tu comprensión.',

        reconstruccion:
          'Cuando una comprensión queda incompleta, aparece una tendencia a reconstruirla desde sus partes fundamentales.'
      },

      close:
        'Ante una dificultad, puede ser más útil localizar el punto exacto donde se produjo la ruptura que simplemente volver a explicar todo desde el principio.'
    },

    andamio: {
      title: 'Comprobar si realmente entendiste',

      frames: {
        explicacion:
          'Explicar una idea con tus propias palabras aparece como una vía relevante para comprobar comprensión.',

        aplicacion:
          'Tiendes a considerar que una idea está realmente comprendida cuando puedes utilizarla.',

        transferencia:
          'La capacidad de utilizar lo aprendido en una situación diferente aparece como una señal importante de comprensión.',

        contraste:
          'Comparar situaciones o posibilidades parece ayudarte a comprobar si realmente entendiste una idea.'
      },

      close:
        'Por eso, para comprobar una comprensión puede ser especialmente útil no quedarse en reconocer una explicación, sino intentar explicarla, aplicarla o utilizarla en otro contexto.'
    },

    navegando: {
      title: 'Elegir una estrategia ante un problema nuevo',

      frames: {
        descomposicion:
          'Ante un problema nuevo, tiendes a buscar primero cómo dividirlo en partes manejables.',

        experimentacion:
          'Aparece una disposición a probar caminos y aprender de lo que ocurre.',

        relaciones:
          'Tiendes a buscar las relaciones entre los elementos antes de decidir cómo actuar.',

        alternativas:
          'Aparece una tendencia a considerar más de una posibilidad antes de elegir un camino.'
      },

      close:
        'Esto sugiere que frente a problemas nuevos puede ser útil explorar primero el espacio del problema antes de fijar demasiado pronto una única estrategia.'
    }
  };

  // ============================================================
  // CONSTRUCCIÓN DE UNA LECTURA CUALITATIVA
  // ============================================================

  function _flattenMicrotestEvidence(attempts) {
  var flattened = [];

  (attempts || []).forEach(function(attempt) {
    if (!attempt || typeof attempt !== 'object') {
      return;
    }

    if (Array.isArray(attempt.evidence)) {
      attempt.evidence.forEach(function(item) {
        if (!item || typeof item !== 'object') {
          return;
        }

        flattened.push({
          testId: item.testId || attempt.testId || null,
          version: item.version || attempt.version || null,
          attemptId: item.attemptId || attempt.attemptId || null,
          questionId: item.questionId || null,
          indicator: item.indicator || null,
          phase: item.phase || attempt.phase || null,
          domain: item.domain || attempt.domain || null,
          answer: item.answer,
          timestamp: item.timestamp || attempt.timestamp || null
        });
      });

      return;
    }

    /*
     * Compatibilidad con registros antiguos que pudieran contener
     * una evidencia directamente, sin el contenedor evidence[].
     */
    if (attempt.indicator) {
      flattened.push({
        testId: attempt.testId || null,
        version: attempt.version || null,
        attemptId: attempt.attemptId || null,
        questionId: attempt.questionId || null,
        indicator: attempt.indicator,
        phase: attempt.phase || null,
        domain: attempt.domain || null,
        answer: attempt.answer,
        timestamp: attempt.timestamp || null
      });
    }
  });

  return flattened;
}


function _groupMicrotestEvidenceByTest(attempts) {
  var grouped = {};

  _flattenMicrotestEvidence(attempts).forEach(function(item) {
    if (!item.testId) {
      return;
    }

    if (!grouped[item.testId]) {
      grouped[item.testId] = [];
    }

    grouped[item.testId].push(item);
  });

  return grouped;
}


function _indicatorProfile(evidence) {
  var counts = {};
  var sequence = [];

  (evidence || []).forEach(function(item) {
    if (!item || !item.indicator) {
      return;
    }

    var indicator = String(item.indicator);

    counts[indicator] = (counts[indicator] || 0) + 1;

    sequence.push({
      indicator: indicator,
      questionId: item.questionId || null,
      timestamp: item.timestamp || null
    });
  });

  var indicators = Object.keys(counts);

  var repeated = indicators
    .filter(function(indicator) {
      return counts[indicator] > 1;
    })
    .sort(function(a, b) {
      return counts[b] - counts[a];
    });

  var ordered = indicators.slice().sort(function(a, b) {
    return counts[b] - counts[a];
  });

  return {
    counts: counts,
    sequence: sequence,
    indicators: indicators,
    repeated: repeated,
    ordered: ordered,
    total: sequence.length
  };
}


function _patternSentence(profile, config) {
  var counts = profile.counts;
  var indicators = profile.indicators;
  var repeated = profile.repeated;
  var total = profile.total;

  if (!total) {
    return (
      'Tus respuestas aportan una primera señal sobre ' +
      String(config.title).toLowerCase() +
      ', pero todavía no hay suficiente evidencia para formular una lectura cualitativa precisa.'
    );
  }

  if (indicators.length === 1) {
    return (
      'Tus cinco respuestas muestran una pauta muy consistente en esta dimensión: ' +
      String(config.frames[indicators[0]] || '').replace(/[.!?]+$/, '') +
      '.'
    );
  }

  if (repeated.length >= 2) {
    return (
      'Tus respuestas no apuntan a una única forma de abordar esta dimensión, sino que combinan ' +
      'varios recursos que aparecen de manera recurrente y se complementan entre sí.'
    );
  }

  if (repeated.length === 1) {
    return (
      'Tus respuestas muestran una pauta reconocible, pero también incorporan otros recursos; ' +
      'la combinación sugiere una forma flexible de abordar esta dimensión.'
    );
  }

  return (
    'Tus respuestas presentan una combinación variada de recursos para abordar esta dimensión, ' +
    'sin concentrarse en una única estrategia.'
  );
}


function _frameText(config, indicator) {
  if (!config || !config.frames || !config.frames[indicator]) {
    return '';
  }

  return String(config.frames[indicator])
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/, '');
}


function _composeMicrotestInterpretation(profile, config) {
  var indicators = profile.indicators;
  var ordered = profile.ordered;
  var repeated = profile.repeated;
  var counts = profile.counts;

  if (!profile.total || indicators.length === 0) {
    return (
      'Tus respuestas aportan una primera señal sobre ' +
      String(config.title).toLowerCase() +
      ', pero todavía se necesita más evidencia para elaborar una lectura cualitativa precisa.'
    );
  }

  var parts = [];

  /*
   * 1. Lectura global.
   * Utiliza la configuración completa de las respuestas, no un indicador
   * aislado.
   */
  parts.push(_patternSentence(profile, config));

  /*
   * 2. Primera manifestación importante.
   * La selección sirve para redactar, pero el patrón anterior ya fue
   * calculado utilizando las cinco evidencias.
   */
  var first = ordered[0];
  var firstFrame = _frameText(config, first);

  if (firstFrame) {
    parts.push(
      firstFrame.charAt(0).toUpperCase() + firstFrame.slice(1) + '.'
    );
  }

  /*
   * 3. Segunda manifestación cuando existe.
   */
  var second = ordered[1];

  if (second && second !== first) {
    var secondFrame = _frameText(config, second);

    if (secondFrame) {
      parts.push(
        secondFrame.charAt(0).toUpperCase() + secondFrame.slice(1) + '.'
      );
    }
  }

  /*
   * 4. Interpretación de la combinación completa.
   *
   * Aquí se utilizan los recuentos de TODAS las respuestas.
   * No se presenta el conteo al usuario como una puntuación.
   */
  if (repeated.length >= 2) {
    parts.push(
      'En conjunto, la combinación de tus respuestas muestra que estos recursos ' +
      'no aparecen de forma aislada, sino que pueden complementarse entre sí ' +
      'según lo que necesites comprender o resolver.'
    );
  } else if (repeated.length === 1) {
    parts.push(
      'La combinación indica que cuentas con un recurso que aparece de forma recurrente, ' +
      'pero también recurres a otras formas de abordar la misma situación cuando resulta necesario.'
    );
  } else if (indicators.length >= 3) {
    parts.push(
      'La variedad de tus respuestas sugiere que puedes recurrir a diferentes formas de abordar ' +
      'esta dimensión en lugar de depender siempre de un único camino.'
    );
  } else {
    parts.push(
      'La combinación de tus respuestas sugiere que estos recursos pueden funcionar de manera complementaria.'
    );
  }

  /*
   * 5. Cierre pedagógico.
   */
  if (config.close) {
    parts.push(String(config.close).trim());
  }

  /*
   * Limitar únicamente la extensión final.
   * NO se eliminan evidencias para calcular el patrón.
   */
  return parts
    .filter(function(part) {
      return part && String(part).trim();
    })
    .slice(0, 5)
    .join(' ');
}


function _qualitativeForTest(testId, evidence) {
  var config = MICROTEST_QUALITATIVE[testId];

  if (!config) {
    return {
      testId: testId,
      title: testId,
      interpretation:
        'Todavía no hay suficiente información para elaborar una lectura cualitativa de este Microtest.',
      indicators: []
    };
  }

  var profile = _indicatorProfile(evidence || []);

  var interpretation = _composeMicrotestInterpretation(
    profile,
    config
  );

  return {
    testId: testId,
    title: config.title,
    interpretation: interpretation,

    /*
     * Los indicadores se conservan únicamente como información interna
     * para el sistema. La interfaz pública no debe mostrarlos como resultado.
     */
    indicators: profile.indicators,

    /*
     * Información interna útil para futuras reglas deterministas.
     */
    evidenceCount: profile.total,
    indicatorCounts: profile.counts,
    indicatorSequence: profile.sequence.map(function(item) {
      return item.indicator;
    })
  };
}


function _deterministicQualitativeForBrujula(attempts) {
  var list = Array.isArray(attempts) ? attempts : [];
  var deterministicProfile = null;

  // El historial es append-only.
  // Buscamos el último intento de brujula con un perfil determinista válido.
  for (var i = list.length - 1; i >= 0; i -= 1) {
    var attempt = list[i];

    if (
      !attempt ||
      !attempt.deterministic_profile ||
      typeof attempt.deterministic_profile !== 'object'
    ) {
      continue;
    }

    var candidate = attempt.deterministic_profile;
    var interpretation = candidate.interpretation;

    if (
      !interpretation ||
      typeof interpretation !== 'object' ||
      !interpretation.patron ||
      !interpretation.dominante ||
      !interpretation.relacion ||
      !interpretation.implicacion
    ) {
      continue;
    }

    deterministicProfile = candidate;
    break;
  }

  // Si todavía no existe resultado determinista, no inventamos
  // una interpretación para brujula.
  if (!deterministicProfile) {
    return {
      testId: 'brujula',
      title: 'Cómo construyes una comprensión',
      interpretation: '',
      indicators: [],
      evidenceCount: 0,
      indicatorCounts: {},
      indicatorSequence: [],
      deterministicProfile: null
    };
  }

  var interpretation = deterministicProfile.interpretation;

  var frame =
    'A partir de tus cinco respuestas en este Microtest, el sistema formula esta hipótesis provisional:';

  var body = [
    interpretation.patron,
    interpretation.dominante,
    interpretation.relacion,
    interpretation.implicacion
  ].join(' ');

  return {
    testId: 'brujula',
    title: 'Cómo construyes una comprensión',
    interpretation: frame + ' ' + body,
    indicators: Array.isArray(deterministicProfile.indicators)
      ? deterministicProfile.indicators
      : [],
    evidenceCount: Array.isArray(deterministicProfile.indicators)
      ? deterministicProfile.indicators.length
      : 0,
    indicatorCounts: {},
    indicatorSequence: Array.isArray(deterministicProfile.indicators)
      ? deterministicProfile.indicators.slice()
      : [],
    deterministicProfile: deterministicProfile
  };
}


function _buildQualitativeProfile(evidence) {
  var groupedAttempts =
    Array.isArray(evidence)
      ? evidence
      : [];

  var grouped =
    _groupMicrotestEvidenceByTest(groupedAttempts);

  return Object.keys(MICROTEST_QUALITATIVE).map(function(testId) {
    if (testId === 'brujula') {
      return _deterministicQualitativeForBrujula(
        grouped[testId] || []
      );
    }

    return _qualitativeForTest(
      testId,
      grouped[testId] || []
    );
  });
}





function _buildProfileSynthesis(qualitative) {
    var completed = (qualitative || []).filter(function(item) {
      return item && item.indicators && item.indicators.length > 0;
    });

    if (completed.length === 0) {
      return {
        title: 'Una primera mirada a tu forma de aprender',
        text:
          'Todavía no hay suficiente evidencia para construir una síntesis general. A medida que completes Microtests y participes en nuevas actividades, aparecerán patrones más claros.'
      };
    }

    var allIndicators = [];

    completed.forEach(function(item) {
      item.indicators.forEach(function(indicator) {
        allIndicators.push(indicator);
      });
    });

    var counts = {};
    allIndicators.forEach(function(indicator) {
      counts[indicator] = (counts[indicator] || 0) + 1;
    });

    var dominant = Object.keys(counts).sort(function(a, b) {
      return counts[b] - counts[a];
    }).slice(0, 3);

    var parts = [];

    if (
      dominant.indexOf('comparacion') !== -1 ||
      dominant.indexOf('contraste') !== -1 ||
      dominant.indexOf('recuperacion_conocimiento') !== -1
    ) {
      parts.push(
        'Aparece una tendencia a construir lo nuevo en relación con conocimientos anteriores, utilizando semejanzas y diferencias para precisar la comprensión.'
      );
    }

    if (
      dominant.indexOf('transferencia_global') !== -1 ||
      dominant.indexOf('mapeo_analitico') !== -1 ||
      dominant.indexOf('extraccion_regla') !== -1
    ) {
      parts.push(
        'También aparece interés por llevar lo comprendido a situaciones diferentes y descubrir qué principios pueden mantenerse cuando cambia el contexto.'
      );
    }

    if (
      dominant.indexOf('descomposicion') !== -1 ||
      dominant.indexOf('experimentacion') !== -1 ||
      dominant.indexOf('alternativas') !== -1
    ) {
      parts.push(
        'Frente a problemas, aparecen señales de búsqueda de caminos posibles, división del problema y comprobación mediante la acción.'
      );
    }

    if (
      dominant.indexOf('cadena_causal') !== -1 ||
      dominant.indexOf('interdependencia') !== -1 ||
      dominant.indexOf('retroalimentacion') !== -1
    ) {
      parts.push(
        'También aparecen señales de atención a las relaciones entre los elementos y a las consecuencias que una parte puede producir sobre otra.'
      );
    }

    if (
      dominant.indexOf('principio') !== -1 ||
      dominant.indexOf('patron') !== -1 ||
      dominant.indexOf('panorama_global') !== -1
    ) {
      parts.push(
        'Hay señales de búsqueda de patrones y principios que permitan pasar de casos concretos a una comprensión más amplia.'
      );
    }

    if (
      dominant.indexOf('reexplicacion') !== -1 ||
      dominant.indexOf('reorganizacion') !== -1 ||
      dominant.indexOf('pregunta_diagnostica') !== -1
    ) {
      parts.push(
        'Cuando una explicación no funciona, aparecen señales de disposición a cambiar la representación o localizar qué parte de la comprensión necesita ser reconstruida.'
      );
    }

    if (parts.length === 0) {
      parts.push(
        'Los Microtests empiezan a mostrar algunas tendencias en la manera en que abordas situaciones de aprendizaje, pero todavía es demasiado pronto para establecer un patrón general con precisión.'
      );
    }

    var text = parts.slice(0, 3).join(' ');

    text +=
      ' Esta es una primera lectura: el perfil deberá contrastarse y enriquecerse con tus conversaciones, ejercicios, problemas y nuevas evidencias.';

    return {
      title: 'Una primera mirada a tu forma de aprender',
      text: text
    };
  }

  // ============================================================
  // CONTEXTO COMPLETO
  // ============================================================

  async function getFullContext() {
    if (_cache) {
      return _cache;
    }

    try {
      var results = await Promise.all([
        ProfileService.getProfile(),
        LearningMapService.getLearningMap(),
        MicrotestService.listCompleted()
      ]);

      var profile = results[0] || {};
      var learningMap = results[1] || {};
      var microtests = results[2] || {};

      var completedTests =
        _normalizeCompletedTests(microtests);

      var microtestEvidence =
        profile &&
        Array.isArray(profile.microtest_evidence)
          ? profile.microtest_evidence
          : [];

      var rawVariables =
        profile &&
        profile.raw_variables
          ? profile.raw_variables
          : {};

      var microtestQualitative =
        _buildQualitativeProfile(microtestEvidence);

      var microtestSynthesis =
        _buildProfileSynthesis(microtestQualitative);

      var context = {
        profile: profile,
        learningMap: learningMap,
        completedTests: completedTests,

        // Evidencia técnica para Rey Filósofo.
        microtestEvidence: microtestEvidence,
        rawVariables: rawVariables,

        // Lectura cualitativa para la interfaz.
        microtestQualitative: microtestQualitative,
        microtestSynthesis: microtestSynthesis,

        timestamp: Date.now()
      };

      _cache = context;

      EventBus.emit('profile:loaded', context);

      return context;

    } catch (error) {
      throw error;
    }
  }

  // ============================================================
  // REFRESH
  // ============================================================

  async function refresh(userIdentifier, profileUpdateData) {
    if (!userIdentifier) {
      console.error(
        'LearningProfileService.refresh: userIdentifier es obligatorio.'
      );
      return false;
    }

    _invalidateCache();

    console.log(
      `LearningProfileService: Caché invalidada para '${userIdentifier}'.`
    );

    var updatedProfile = {
      id: userIdentifier,
      lastUpdate: Date.now(),
      updateReason:
        profileUpdateData && profileUpdateData.source
          ? profileUpdateData.source
          : 'microtest_completion',
      details: profileUpdateData || {}
    };

    console.log(
      `LearningProfileService: Perfil de aprendizaje para '${userIdentifier}' actualizado (simulado). Datos:`,
      updatedProfile
    );

    if (
      typeof CognitiveRuntime !== 'undefined' &&
      CognitiveRuntime.refreshStrategy
    ) {
      console.log(
        `LearningProfileService: Invocando CognitiveRuntime.refreshStrategy para '${userIdentifier}'.`
      );

      await CognitiveRuntime.refreshStrategy(
        userIdentifier,
        updatedProfile
      );

      return true;

    } else {
      console.error(
        'LearningProfileService: CognitiveRuntime no disponible o refreshStrategy ausente. No se pudo actualizar la estrategia cognitiva.'
      );

      return false;
    }
  }

  // ============================================================
  // API PÚBLICA
  // ============================================================

  return {
    getFullContext: getFullContext,
    refresh: refresh
  };

})();
