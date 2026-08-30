/* ═══════════════════════════════════════════════════════════════
   SOPHIA ENGINE v4.0 — Motor de Auditoría Epistemológica Contextual
   Implementa INSTRUMENT_SPECIFICATION_SOPHIA_v4.md
   Agnóstico de entorno: funciona en navegador (window.SophiaEngineV4)
   y en Node (module.exports), igual que sophiaCore.js del backend.
   ═══════════════════════════════════════════════════════════════ */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SophiaEngineV4 = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '4.0';

  /* ═══════════════════════════════════════════════════════════
     CAPA 1 — CLASIFICACIÓN DOCUMENTAL
     Determina naturaleza_documental: SC, INF, ARG, POL, NORM
     Heurística basada en marcadores léxico-estructurales (§3 del
     documento normativo). No usa embeddings ni ML — es un primer
     clasificador determinista y auditable, sustituible a futuro.
     ═══════════════════════════════════════════════════════════ */

  var CLASSIFICATION_MARKERS = {
    SC: {
      label: 'Científica',
      patrones: [
        'metodología', 'hipótesis', 'muestra', 'estudio', 'resultados',
        'p<', 'p <', 'n=', 'n =', 'variable independiente', 'variable dependiente',
        'estadísticamente significativo', 'replicable', 'revisión sistemática',
        'meta-análisis', 'controlado', 'aleatorizado'
      ]
    },
    INF: {
      label: 'Informativa',
      patrones: [
        'según informó', 'declaró', 'fuentes consultadas', 'reportó',
        'de acuerdo con', 'medios locales', 'agencia', 'confirmó',
        'este medio', 'entrevistado', 'testigos'
      ]
    },
    ARG: {
      label: 'Argumentativa',
      patrones: [
        'sostengo que', 'mi argumento', 'considero que', 'a mi juicio',
        'en mi opinión', 'defiendo la tesis', 'planteo que', 'propongo pensar',
        'cabe preguntarse', 'filosóficamente'
      ]
    },
    POL: {
      label: 'Política Deliberativa',
      patrones: [
        'ciudadanos', 'nuestro gobierno', 'compatriotas', 'propongo',
        'nuestra nación', 'el pueblo', 'votantes', 'campaña', 'electorado',
        'oposición', 'coalición', 'nuestros valores'
      ]
    },
    NORM: {
      label: 'Normativa/Propositiva',
      patrones: [
        'se establece', 'artículo', 'deberá', 'la presente ley',
        'reglamento', 'queda prohibido', 'se autoriza', 'plan de gobierno',
        'entrará en vigencia', 'disposición transitoria'
      ]
    }
  };

  function classifyDocument(text) {
    var lower = text.toLowerCase();
    var scores = {};

    Object.keys(CLASSIFICATION_MARKERS).forEach(function (key) {
      var count = 0;
      CLASSIFICATION_MARKERS[key].patrones.forEach(function (p) {
        var idx = 0;
        while ((idx = lower.indexOf(p, idx)) !== -1) {
          count++;
          idx += p.length;
        }
      });
      scores[key] = count;
    });

    var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
    var totalHits = Object.keys(scores).reduce(function (acc, k) { return acc + scores[k]; }, 0);

    var naturaleza_primaria = totalHits === 0 ? 'ARG' : ranked[0];
    var confianza = totalHits === 0 ? 0 : scores[naturaleza_primaria] / totalHits;

    var naturalezas_secundarias = ranked.filter(function (k) {
      return k !== naturaleza_primaria && scores[k] > 0 && scores[k] / totalHits >= 0.2;
    });

    return {
      naturaleza_primaria: naturaleza_primaria,
      naturalezas_secundarias: naturalezas_secundarias,
      hibrido: naturalezas_secundarias.length > 0,
      confianza: Math.round(confianza * 100) / 100,
      scores: scores
    };
  }

  /* ═══════════════════════════════════════════════════════════
     CAPA 2 — DICCIONARIO ATÓMICO
     20 átomos, uno por criterio (cardinalidad 1:1 según §9 del
     documento normativo), cada uno con identidad semántica estable
     y perfiles contextuales para SC / ARG / POL. Los perfiles INF y
     NORM no definidos heredan la definición base (Regla estructural
     3: "Herencia y sobrescritura" — comportamiento explícitamente
     permitido y documentado como esperado en la fase inicial, §13
     "Configuraciones incompletas").
     ═══════════════════════════════════════════════════════════ */

  var ATOM_DICTIONARY = {

    ATOMO_CONTRADICCION: {
      id: 'ATOMO_CONTRADICCION',
      definicion_base: 'Presencia de proposiciones excluyentes sin resolución.',
      criterio: '1.1', fase: 'fase1',
      perfiles: {
        SC: { definicion_contextual: 'Resultados o afirmaciones que se contradicen sin que el autor reconcilie la discrepancia metodológicamente.', indicadores: ['sin embargo', 'no obstante', 'contradictorio', 'inconsistente con'], contraindicadores: ['por lo tanto', 'en consecuencia', 'esto se explica porque'], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Reconciliación metodológica explícita', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Tensión entre premisas del ensayo que el autor no resuelve dialécticamente.', indicadores: ['pero', 'aunque', 'sin embargo', 'paradójicamente'], contraindicadores: ['de modo que', 'por lo tanto', 'esta tensión se resuelve'], relevancia: 0.8, severidad_base: 10, evidencia_esperada: 'Resolución dialéctica', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Promesas o posturas incompatibles dentro del mismo discurso.', indicadores: ['pero también', 'al mismo tiempo', 'sin embargo'], contraindicadores: ['esto se compatibiliza', 'la forma de conciliar'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Explicación de compatibilidad', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_ESTABILIDAD_CONCEPTUAL: {
      id: 'ATOMO_ESTABILIDAD_CONCEPTUAL',
      definicion_base: 'Constancia del significado de un concepto a lo largo del discurso.',
      criterio: '1.2', fase: 'fase1',
      perfiles: {
        SC: { definicion_contextual: 'Uso consistente de las definiciones operacionales declaradas en metodología.', indicadores: ['definimos', 'entendemos por', 'operacionalmente'], contraindicadores: ['en otro sentido', 'redefinimos'], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Definición operacional única', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Estabilidad del significado de los conceptos filosóficos centrales del ensayo.', indicadores: ['por concepto entiendo', 'en este sentido'], contraindicadores: ['ahora bien, en otro sentido', 'cambiando de acepción'], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Coherencia terminológica', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Uso estable de términos clave de la propuesta (ej. "libertad", "seguridad") sin deslizamiento semántico oportunista.', indicadores: ['lo que llamamos', 'nuestra idea de'], contraindicadores: ['en otro contexto esto significa'], relevancia: 0.6, severidad_base: 8, evidencia_esperada: 'Consistencia retórica', umbral_incertidumbre: 'alto' }
      }
    },

    ATOMO_DICOTOMIA: {
      id: 'ATOMO_DICOTOMIA',
      definicion_base: 'Reducción forzada de un problema multidimensional a una elección binaria.',
      criterio: '1.3', fase: 'fase1',
      perfiles: {
        SC: { definicion_contextual: 'Presentación de dos hipótesis como únicas posibles cuando el diseño no las agota.', indicadores: ['solo dos hipótesis', 'una u otra explicación'], contraindicadores: ['entre otras posibles causas', 'multifactorial'], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Exploración de hipótesis alternativas', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Falso dilema filosófico que ignora posiciones intermedias.', indicadores: ['o aceptamos', 'o bien', 'no hay término medio'], contraindicadores: ['una postura intermedia', 'matizando'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Reconocimiento de espectro de posiciones', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Reducción de una política pública compleja a "o esto o el caos".', indicadores: ['dos caminos', 'no hay otra opción', 'o estamos con'], contraindicadores: ['existen matices', 'otras alternativas'], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Reconocimiento de alternativas de política', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_SOPORTE_LOGICO: {
      id: 'ATOMO_SOPORTE_LOGICO',
      definicion_base: 'Justificación lógica que ancla un enunciado declarativo.',
      criterio: '1.4', fase: 'fase1',
      perfiles: {
        SC: { definicion_contextual: 'Cada afirmación empírica debe estar anclada a datos o citas.', indicadores: ['porque', 'dado que', 'ya que'], contraindicadores: [], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Cita o dato de respaldo', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Cada afirmación debe derivarse de una premisa declarada.', indicadores: ['porque', 'puesto que', 'en tanto que'], contraindicadores: [], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Premisa explícita', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Las promesas deben apoyarse en razones o datos, no solo en autoridad.', indicadores: ['porque', 'ya que', 'esto se debe a'], contraindicadores: [], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Razón declarada', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_PROPORCION_INFERENCIAL: {
      id: 'ATOMO_PROPORCION_INFERENCIAL',
      definicion_base: 'Proporcionalidad entre la magnitud de la conclusión y la de las premisas.',
      criterio: '2.1', fase: 'fase2',
      perfiles: {
        SC: { definicion_contextual: 'La generalidad de la conclusión no debe exceder el alcance de la muestra.', indicadores: ['en conclusión', 'por lo tanto', 'esto demuestra'], contraindicadores: ['dentro de esta muestra', 'limitado a'], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Alcance declarado de la muestra', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'La conclusión filosófica no debe saltar más allá de lo que las premisas permiten.', indicadores: ['en conclusión', 'de esto se sigue', 'necesariamente'], contraindicadores: ['con las salvedades mencionadas'], relevancia: 0.8, severidad_base: 10, evidencia_esperada: 'Coherencia de alcance', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Una propuesta no debe presentarse como solución total a partir de evidencia parcial.', indicadores: ['esto resolverá', 'de una vez por todas', 'total'], contraindicadores: ['un paso hacia', 'contribuirá a'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Alcance realista de la propuesta', umbral_incertidumbre: 'medio' }
      }
    },

    // Átomo desarrollado en detalle como ejemplo normativo en §4.2 del documento
    ATOMO_CAUSALIDAD: {
      id: 'ATOMO_CAUSALIDAD',
      definicion_base: 'Relación explicativa entre un fenómeno antecedente y un fenómeno consecuente.',
      criterio: '2.2', fase: 'fase2',
      perfiles: {
        SC: {
          definicion_contextual: 'Relación causal demostrada mediante diseño metodológico, con control de variables alternativas, direccionalidad y replicabilidad.',
          indicadores: ['hipótesis causal', 'variable independiente', 'variable dependiente', 'mecanismo', 'control de', 'causa', 'provoca', 'genera'],
          contraindicadores: ['correlación', 'asociado con', 'coincide con'],
          relevancia: 1.0, severidad_base: 25, evidencia_esperada: 'Datos empíricos, estudios previos, metodología', umbral_incertidumbre: 'bajo'
        },
        ARG: {
          definicion_contextual: 'Relación conceptual o explicativa que conecta ideas en un marco teórico.',
          indicadores: ['se deriva de', 'depende de', 'fundamenta', 'explica por qué'],
          contraindicadores: ['salto lógico', 'no se sigue de'],
          relevancia: 0.5, severidad_base: 5, evidencia_esperada: 'Coherencia conceptual', umbral_incertidumbre: 'alto'
        },
        POL: {
          definicion_contextual: 'Atribución causal utilizada para justificar políticas o decisiones, con base en datos históricos, comparaciones o mecanismos plausibles.',
          indicadores: ['causa', 'provoca', 'genera', 'debido a', 'es responsable de', 'desencadena'],
          contraindicadores: ['podría estar relacionado', 'entre otros factores'],
          relevancia: 0.8, severidad_base: 12.5, evidencia_esperada: 'Datos históricos, comparaciones, plausibilidad', umbral_incertidumbre: 'medio_alto'
        }
      }
    },

    ATOMO_GENERALIZACION: {
      id: 'ATOMO_GENERALIZACION',
      definicion_base: 'Extensión de un caso singular a una regla universal.',
      criterio: '2.3', fase: 'fase2',
      perfiles: {
        SC: { definicion_contextual: 'Generalización de un hallazgo de muestra a población sin justificación estadística.', indicadores: ['siempre', 'todos los casos', 'universalmente'], contraindicadores: ['dentro de esta muestra', 'se requiere replicación'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Justificación de representatividad', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Anécdota o ejemplo único elevado a principio general.', indicadores: ['por ejemplo', 'como en el caso de', 'esto prueba que siempre'], contraindicadores: ['este caso ilustra, sin agotar'], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Reconocimiento de excepciones', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Caso aislado presentado como patrón nacional o generalizado.', indicadores: ['siempre', 'nunca', 'todos', 'ningún'], contraindicadores: ['en algunos casos', 'no es la norma'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Datos de prevalencia', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_CIRCULARIDAD: {
      id: 'ATOMO_CIRCULARIDAD',
      definicion_base: 'Estructura donde la conclusión repite la premisa sin avance argumentativo.',
      criterio: '2.4', fase: 'fase2',
      perfiles: {
        SC: { definicion_contextual: 'La hipótesis se da por probada usando la misma definición que la constituye.', indicadores: ['por definición', 'esto es así porque así se definió'], contraindicadores: ['de forma independiente se verificó'], relevancia: 0.8, severidad_base: 25, evidencia_esperada: 'Verificación independiente', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Petición de principio: la conclusión ya estaba asumida en la premisa.', indicadores: ['porque es evidente que', 'por su propia naturaleza'], contraindicadores: ['esto se demuestra independientemente'], relevancia: 1.0, severidad_base: 25, evidencia_esperada: 'Demostración no circular', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Justificación de una política asumiendo como probado lo que se busca justificar.', indicadores: ['sabemos que funciona porque funciona', 'obviamente'], contraindicadores: ['la evidencia independiente muestra'], relevancia: 0.9, severidad_base: 25, evidencia_esperada: 'Evidencia externa a la premisa', umbral_incertidumbre: 'medio' }
      }
    },

    // Átomo desarrollado en detalle como ejemplo normativo (variante de EVIDENCIA)
    ATOMO_EVIDENCIA: {
      id: 'ATOMO_EVIDENCIA',
      definicion_base: 'Información que respalda una afirmación.',
      criterio: '3.1', fase: 'fase3',
      perfiles: {
        SC: { definicion_contextual: 'Datos empíricos trazables a una fuente verificable y metodología explícita.', indicadores: ['según el estudio', 'los datos muestran', 'fuente:', 'n=', 'verificable'], contraindicadores: ['se dice que', 'es sabido que'], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Cita, dataset o referencia verificable', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Razones o ejemplos que respaldan la tesis, no necesariamente empíricos.', indicadores: ['un ejemplo de esto', 'consideremos el caso'], contraindicadores: ['sin ningún respaldo'], relevancia: 0.5, severidad_base: 7.5, evidencia_esperada: 'Ejemplo o razón articulada', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'Datos o estudios citados para justificar una propuesta de política.', indicadores: ['según', 'fuente', 'estudio', 'informe', 'dato', 'cifra'], contraindicadores: ['se dice que', 'todo el mundo sabe'], relevancia: 0.8, severidad_base: 12.5, evidencia_esperada: 'Fuente identificable', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_INCERTIDUMBRE: {
      id: 'ATOMO_INCERTIDUMBRE',
      definicion_base: 'Grado de duda o falta de certeza asociado a una afirmación.',
      criterio: '3.2', fase: 'fase3',
      perfiles: {
        SC: { definicion_contextual: 'Declaración explícita de márgenes de error, intervalos de confianza o limitaciones.', indicadores: ['probablemente', 'sugiere', 'intervalo de confianza', 'limitación del estudio'], contraindicadores: ['es seguro que', 'sin duda', 'está demostrado que'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Cuantificación de incertidumbre', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Reconocimiento del carácter debatible de la tesis filosófica.', indicadores: ['podría argumentarse', 'no es concluyente', 'es discutible'], contraindicadores: ['es una verdad evidente', 'indiscutiblemente'], relevancia: 0.6, severidad_base: 7.5, evidencia_esperada: 'Reconocimiento de debate abierto', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'Reconocimiento de la complejidad e incertidumbre de los efectos de una política.', indicadores: ['es posible que', 'podría', 'estimamos', 'se espera'], contraindicadores: ['es seguro', 'sin duda alguna', 'garantizado'], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Matización de expectativas', umbral_incertidumbre: 'medio_alto' }
      }
    },

    ATOMO_HECHO_VALOR: {
      id: 'ATOMO_HECHO_VALOR',
      definicion_base: 'Distinción entre un enunciado de hecho y un juicio de valor.',
      criterio: '3.3', fase: 'fase3',
      perfiles: {
        SC: { definicion_contextual: 'Separación estricta entre resultados observados e interpretación valorativa.', indicadores: ['los datos indican', 'se observa que'], contraindicadores: ['esto es bueno', 'esto es preocupante', 'lamentablemente'], relevancia: 0.8, severidad_base: 12.5, evidencia_esperada: 'Lenguaje descriptivo separado del evaluativo', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Explicitación de cuándo se pasa de describir a valorar.', indicadores: ['sostengo que es correcto', 'considero deseable'], contraindicadores: [], relevancia: 0.6, severidad_base: 7.5, evidencia_esperada: 'Marcado explícito del juicio', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'Distinción entre datos objetivos de la política y su valoración ideológica.', indicadores: ['es', 'está', 'existe'], contraindicadores: ['bueno', 'malo', 'justo', 'injusto', 'debería'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Transparencia del juicio de valor', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_CONTEXTO: {
      id: 'ATOMO_CONTEXTO',
      definicion_base: 'Variables del entorno que afectan la lectura correcta de un dato.',
      criterio: '3.4', fase: 'fase3',
      perfiles: {
        SC: { definicion_contextual: 'Variables de confusión y condiciones experimentales no reportadas.', indicadores: ['contexto', 'condiciones del experimento', 'variables de control'], contraindicadores: ['sin mencionar contexto'], relevancia: 0.7, severidad_base: 12.5, evidencia_esperada: 'Reporte de condiciones', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Circunstancias históricas o teóricas necesarias para interpretar la tesis.', indicadores: ['en el contexto de', 'dadas las circunstancias'], contraindicadores: [], relevancia: 0.5, severidad_base: 7.5, evidencia_esperada: 'Encuadre explícito', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'Factores estructurales omitidos al presentar un dato político (ej. inflación, comparación internacional).', indicadores: ['contexto', 'factor', 'condición', 'comparado con'], contraindicadores: ['dato aislado sin comparación'], relevancia: 0.8, severidad_base: 12.5, evidencia_esperada: 'Comparación o serie temporal', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_STEELMAN: {
      id: 'ATOMO_STEELMAN',
      definicion_base: 'Representación robusta del argumento contrario.',
      criterio: '4.1', fase: 'fase4',
      perfiles: {
        SC: { definicion_contextual: 'Reconocimiento de hipótesis rivales y su tratamiento justo en la discusión.', indicadores: ['una explicación alternativa', 'otros autores sostienen'], contraindicadores: ['sin considerar alternativas'], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Discusión de hipótesis rivales', umbral_incertidumbre: 'medio' },
        ARG: { definicion_contextual: 'La mejor versión posible de la postura opuesta, no una caricatura.', indicadores: ['el argumento contrario más fuerte', 'quienes sostienen lo opuesto argumentan'], contraindicadores: ['esa postura ridícula', 'nadie serio piensa'], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Formulación robusta de la tesis opuesta', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Reconocimiento honesto de las razones de la oposición.', indicadores: ['quienes se oponen argumentan', 'la posición contraria sostiene con razón'], contraindicadores: ['la oposición solo quiere', 'no tienen argumentos'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Representación justa del rival', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_CARGA_EMOCIONAL: {
      id: 'ATOMO_CARGA_EMOCIONAL',
      definicion_base: 'Sustitución del argumento por activación emocional mediante lenguaje cargado.',
      criterio: '4.2', fase: 'fase4',
      perfiles: {
        SC: { definicion_contextual: 'Adjetivación valorativa en la presentación de resultados.', indicadores: ['alarmante', 'preocupante', 'extraordinario'], contraindicadores: ['se observa un incremento de'], relevancia: 0.5, severidad_base: 7.5, evidencia_esperada: 'Lenguaje neutro en resultados', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Apelación emocional que sustituye a la razón en el ensayo.', indicadores: ['terrible', 'maravilloso', 'espantoso'], contraindicadores: [], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Argumentación racional', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Lenguaje diseñado para activar miedo, indignación o entusiasmo en vez de deliberación.', indicadores: ['terrible', 'catastrófico', 'maravilloso', 'lamentable', 'indignante'], contraindicadores: [], relevancia: 1.0, severidad_base: 12.5, evidencia_esperada: 'Proporcionalidad emocional al hecho', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_IDENTIDAD_ARGUMENTO: {
      id: 'ATOMO_IDENTIDAD_ARGUMENTO',
      definicion_base: 'Separación entre la identidad del emisor y la validez del argumento.',
      criterio: '4.3', fase: 'fase4',
      perfiles: {
        SC: { definicion_contextual: 'El argumento se sostiene independientemente de la afiliación del investigador.', indicadores: ['conflicto de interés declarado'], contraindicadores: ['por ser reconocido experto, debe ser cierto'], relevancia: 0.5, severidad_base: 10, evidencia_esperada: 'Declaración de conflictos de interés', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'El argumento no depende de quién lo enuncia.', indicadores: [], contraindicadores: ['ad hominem', 'por ser quien es'], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Ausencia de falacia ad hominem', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Debate centrado en propuestas, no en atacar la identidad del oponente.', indicadores: [], contraindicadores: ['ellos', 'esa gente', 'como era de esperar de'], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Foco en la propuesta, no en la persona', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_AMBIGUEDAD_LEXICA: {
      id: 'ATOMO_AMBIGUEDAD_LEXICA',
      definicion_base: 'Uso de términos con múltiples interpretaciones sin definición operacional.',
      criterio: '4.4', fase: 'fase4',
      perfiles: {
        SC: { definicion_contextual: 'Constructos sin definición operacional medible.', indicadores: ['bienestar', 'calidad', 'impacto'], contraindicadores: ['definido operacionalmente como'], relevancia: 0.7, severidad_base: 10, evidencia_esperada: 'Definición operacional', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'Términos filosóficos densos usados sin precisión (ej. "libertad", "justicia").', indicadores: ['libertad', 'justicia', 'bien común'], contraindicadores: ['entiendo por libertad'], relevancia: 0.6, severidad_base: 7.5, evidencia_esperada: 'Definición conceptual explícita', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'Términos movilizadores sin contenido operativo (ej. "cambio", "progreso").', indicadores: ['cambio', 'progreso', 'futuro mejor', 'justicia'], contraindicadores: ['concretamente esto significa'], relevancia: 0.8, severidad_base: 10, evidencia_esperada: 'Concreción de la propuesta', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_RELEVANCIA_TEMATICA: {
      id: 'ATOMO_RELEVANCIA_TEMATICA',
      definicion_base: 'Pertinencia de un segmento respecto al núcleo temático declarado.',
      criterio: '5.1', fase: 'fase5',
      perfiles: {
        ARG: { definicion_contextual: 'Digresiones que no alteran lógicamente la tesis central.', indicadores: ['a propósito de otro tema', 'cambiando de tema'], contraindicadores: ['esto es directamente relevante porque'], relevancia: 0.5, severidad_base: 7.5, evidencia_esperada: 'Retorno explícito al tema', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Desvío del tema en debate hacia asuntos no relacionados con la propuesta.', indicadores: ['y hablando de otra cosa', 'aprovecho de mencionar'], contraindicadores: ['volviendo al tema central'], relevancia: 0.7, severidad_base: 12.5, evidencia_esperada: 'Foco en el tema declarado', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_PROPUESTA_CONSTRUCTIVA: {
      id: 'ATOMO_PROPUESTA_CONSTRUCTIVA',
      definicion_base: 'Aportación propositiva que acompaña a toda crítica.',
      criterio: '5.2', fase: 'fase5',
      perfiles: {
        ARG: { definicion_contextual: 'La crítica filosófica se acompaña de una alternativa conceptual.', indicadores: ['propongo en cambio', 'una alternativa sería'], contraindicadores: ['solo critica sin proponer'], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Alternativa articulada', umbral_incertidumbre: 'medio' },
        POL: { definicion_contextual: 'Toda crítica a una política debe venir acompañada de una propuesta concreta.', indicadores: ['propongo', 'sugiero', 'la alternativa es', 'en su lugar'], contraindicadores: [], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Propuesta concreta', umbral_incertidumbre: 'medio' },
        NORM: { definicion_contextual: 'Toda observación crítica a una norma debe sugerir una vía de corrección.', indicadores: ['se sugiere modificar', 'como alternativa se propone'], contraindicadores: [], relevancia: 0.9, severidad_base: 12.5, evidencia_esperada: 'Vía de corrección concreta', umbral_incertidumbre: 'bajo' }
      }
    },

    ATOMO_SIMETRIA_EPISTEMICA: {
      id: 'ATOMO_SIMETRIA_EPISTEMICA',
      definicion_base: 'Aplicación del mismo estándar de prueba a todas las posiciones en disputa.',
      criterio: '5.3', fase: 'fase5',
      perfiles: {
        SC: { definicion_contextual: 'Mismo rigor metodológico exigido a hipótesis propia y rival.', indicadores: ['con el mismo criterio', 'aplicando el mismo estándar'], contraindicadores: ['a diferencia de los otros estudios, el nuestro no requiere'], relevancia: 0.7, severidad_base: 12.5, evidencia_esperada: 'Estándar único de prueba', umbral_incertidumbre: 'bajo' },
        POL: { definicion_contextual: 'El mismo estándar de exigencia para la propuesta propia y la ajena.', indicadores: ['con el mismo rigor', 'igual estándar'], contraindicadores: ['a ellos se les exige, mientras que nosotros'], relevancia: 0.8, severidad_base: 12.5, evidencia_esperada: 'Simetría de exigencia', umbral_incertidumbre: 'medio' }
      }
    },

    ATOMO_FALSABILIDAD: {
      id: 'ATOMO_FALSABILIDAD',
      definicion_base: 'Apertura del argumento a ser refutado por evidencia contraria.',
      criterio: '5.4', fase: 'fase5',
      perfiles: {
        SC: { definicion_contextual: 'La hipótesis especifica condiciones bajo las cuales sería refutada.', indicadores: ['sería refutado si', 'condición de falsación', 'contraejemplo'], contraindicadores: ['es válido en cualquier caso', 'no admite excepciones'], relevancia: 1.0, severidad_base: 25, evidencia_esperada: 'Condición de falsación explícita', umbral_incertidumbre: 'bajo' },
        ARG: { definicion_contextual: 'La tesis reconoce qué la refutaría.', indicadores: ['si se demostrara lo contrario', 'estaría dispuesto a revisar'], contraindicadores: ['esto es cierto pase lo que pase'], relevancia: 0.6, severidad_base: 10, evidencia_esperada: 'Disposición a revisión', umbral_incertidumbre: 'alto' },
        POL: { definicion_contextual: 'La propuesta reconoce métricas que, de no cumplirse, indicarían su fracaso.', indicadores: ['si no se logra', 'indicador de éxito', 'métrica de evaluación'], contraindicadores: ['funcionará sin importar el resultado'], relevancia: 0.7, severidad_base: 12.5, evidencia_esperada: 'Métricas de evaluación de la propuesta', umbral_incertidumbre: 'medio' }
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════
     CAPA 3 — SEGMENTACIÓN SEMÁNTICA
     Divide el texto en segmentos y les asigna una función semántica
     (dato, interpretación, causal, generalización, propuesta, juicio)
     mediante heurísticas de patrones de encadenamiento — no solo
     detecta la palabra, sino el rol que cumple en el argumento.
     ═══════════════════════════════════════════════════════════ */

  var FUNCTION_MARKERS = {
    dato: ['%', 'según datos', 'estudio', 'cifra', 'número de', 'n=', 'estadística'],
    causal: ['causa', 'provoca', 'genera', 'debido a', 'porque', 'desencadena', 'es responsable de'],
    generalizacion: ['siempre', 'nunca', 'todos', 'ningún', 'universalmente'],
    propuesta: ['propongo', 'deberíamos', 'es necesario', 'hay que', 'sugiero', 'la solución es'],
    juicio: ['bueno', 'malo', 'justo', 'injusto', 'debería', 'lamentable', 'deseable']
  };

  function detectFunction(segmentLower) {
    var detected = [];
    Object.keys(FUNCTION_MARKERS).forEach(function (fn) {
      var hit = FUNCTION_MARKERS[fn].some(function (m) { return segmentLower.indexOf(m) !== -1; });
      if (hit) detected.push(fn);
    });
    return detected.length > 0 ? detected : ['interpretacion'];
  }

  function segmentText(text) {
    var raw = text.split(/[.!?]+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
    return raw.map(function (segmento, idx) {
      var lower = segmento.toLowerCase();
      return {
        indice: idx,
        texto: segmento,
        funciones: detectFunction(lower)
      };
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CAPA 3.5 — ANÁLISIS SEMÁNTICO CONTEXTUAL
     NUEVO: analiza el contexto semántico de un segmento para
     reducir falsos positivos. Detecta negaciones, citas, discurso
     referido, preguntas, hipótesis y modalidad epistémica.
     ═══════════════════════════════════════════════════════════ */

  /**
   * Tokeniza un texto en palabras, devolviendo un array de tokens con
   * su posición (índice en el texto original normalizado).
   * @param {string} text - Texto a tokenizar
   * @returns {Array<{word: string, start: number, end: number}>}
   */
  function tokenize(text) {
    var tokens = [];
    var lower = text.toLowerCase();
    // regex simple: captura palabras (incluye caracteres acentuados y ñ)
    var regex = /[a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9]+/g;
    var match;
    while ((match = regex.exec(lower)) !== null) {
      tokens.push({ word: match[0], start: match.index, end: regex.lastIndex });
    }
    return tokens;
  }

  /**
   * Detecta si el segmento completo es una pregunta (contiene '?' o
   * comienza con palabra interrogativa).
   * @param {string} text - Texto del segmento
   * @returns {boolean}
   */
  function isInterrogative(text) {
    var lower = text.trim().toLowerCase();
    // Contiene signo de interrogación
    if (lower.indexOf('?') !== -1) return true;
    // Comienza con palabra interrogativa
    var interrogatives = ['qué', 'cómo', 'cuál', 'cuáles', 'cuándo', 'dónde', 'por qué', 'para qué', 'quién', 'quiénes', 'cuánto', 'cuánta', 'cuántos', 'cuántas'];
    for (var i = 0; i < interrogatives.length; i++) {
      if (lower.indexOf(interrogatives[i]) === 0) return true;
    }
    return false;
  }

  /**
   * Detecta si el segmento está en discurso referido o es una cita.
   * Busca comillas, patrones de atribución ("según X", "X afirma que").
   * @param {string} text - Texto del segmento
   * @returns {boolean}
   */
  function isReportedSpeechOrQuote(text) {
    var lower = text.trim().toLowerCase();
    // Comillas (angulares, inglesas, simples)
    if (/[""''«»]/.test(text)) return true;
    // Patrones de discurso referido
    var reportedPatterns = [
      'de acuerdo con', 'afirmó que', 'dijo que', 'declaró que',
      'sostiene que', 'argumenta que', 'en palabras de',
      'citando a', 'como señala', 'como indica', 'como afirma'
    ];
    for (var i = 0; i < reportedPatterns.length; i++) {
      if (lower.indexOf(reportedPatterns[i]) !== -1) return true;
    }
    return false;
  }

  /**
   * Detecta si el segmento tiene estructura hipotética o condicional.
   * @param {string} text - Texto del segmento
   * @returns {boolean}
   */
  function isHypothetical(text) {
    var lower = text.trim().toLowerCase();
    // Estructuras condicionales
    if (lower.indexOf('si ') === 0 || lower.indexOf('si,') !== -1 || lower.indexOf('si no') !== -1) return true;
    // Marcadores hipotéticos
    var hypotheticalMarkers = [
      'en caso de', 'supongamos', 'suponga', 'hipotéticamente',
      'asumiendo que', 'daría', 'sería', 'podría ser', 'pudiera',
      'en un escenario', 'si acaso', 'tal vez', 'quizás', 'quizá'
    ];
    for (var i = 0; i < hypotheticalMarkers.length; i++) {
      if (lower.indexOf(hypotheticalMarkers[i]) !== -1) return true;
    }
    return false;
  }

  /**
   * Detecta la presencia de negaciones en el segmento y devuelve
   * información sobre si el segmento completo está negado.
   * @param {string} text - Texto del segmento
   * @returns {{ isNegated: boolean, negationWords: string[] }}
   */
  function detectNegation(text) {
    var lower = text.trim().toLowerCase();
    var negationWords = ['no', 'nunca', 'jamás', 'tampoco'];
    var found = [];
    for (var i = 0; i < negationWords.length; i++) {
      // Buscar la palabra como token independiente
      var regex = new RegExp('\\b' + negationWords[i] + '\\b', 'g');
      if (regex.test(lower)) {
        found.push(negationWords[i]);
      }
    }
    return {
      isNegated: found.length > 0,
      negationWords: found
    };
  }

  /**
   * Detecta la modalidad epistémica del segmento (certeza, duda, probabilidad).
   * @param {string} text - Texto del segmento
   * @returns {{ modality: string, markers: string[] }}
   */
  function detectModality(text) {
    var lower = text.trim().toLowerCase();
    var markers = [];
    // Alta certeza
    var highCertainty = ['es seguro que', 'sin duda', 'indudablemente', 'claramente', 'evidentemente', 'está demostrado', 'es un hecho'];
    // Duda / probabilidad
    var uncertainty = ['probablemente', 'posiblemente', 'es posible que', 'tal vez', 'quizás', 'quizá', 'podría', 'pudiera', 'no es seguro'];
    
    for (var i = 0; i < highCertainty.length; i++) {
      if (lower.indexOf(highCertainty[i]) !== -1) markers.push('alta_certeza');
    }
    for (var j = 0; j < uncertainty.length; j++) {
      if (lower.indexOf(uncertainty[j]) !== -1) markers.push('incertidumbre');
    }
    
    return {
      modality: markers.length > 0 ? markers.join(',') : 'neutra',
      markers: markers
    };
  }

  /**
   * Detecta conectores argumentativos en el segmento.
   * @param {string} text - Texto del segmento
   * @returns {string[]} Lista de conectores encontrados
   */
  function detectConnectors(text) {
    var lower = text.trim().toLowerCase();
    var connectors = [
      'sin embargo', 'no obstante', 'por lo tanto', 'en consecuencia',
      'además', 'por otra parte', 'en cambio', 'por el contrario',
      'así pues', 'de este modo', 'por consiguiente', 'entonces',
      'ahora bien', 'con todo', 'aun así', 'pese a ello'
    ];
    var found = [];
    for (var i = 0; i < connectors.length; i++) {
      if (lower.indexOf(connectors[i]) !== -1) found.push(connectors[i]);
    }
    return found;
  }

  /**
   * Detecta marcadores de evidencia en el segmento.
   * @param {string} text - Texto del segmento
   * @returns {string[]} Lista de marcadores encontrados
   */
  function detectEvidenceMarkers(text) {
    var lower = text.trim().toLowerCase();
    var markers = [
      'según el estudio', 'los datos muestran', 'fuente:', 'n=',
      'verificable', 'estudio publicado', 'investigación', 'encuesta',
      'datos de', 'cifras de', 'reporte de', 'informe de'
    ];
    var found = [];
    for (var i = 0; i < markers.length; i++) {
      if (lower.indexOf(markers[i]) !== -1) found.push(markers[i]);
    }
    return found;
  }

  /**
   * Detecta marcadores causales en el segmento.
   * @param {string} text - Texto del segmento
   * @returns {string[]} Lista de marcadores causales encontrados
   */
  function detectCausalMarkers(text) {
    var lower = text.trim().toLowerCase();
    var markers = [
      'porque', 'ya que', 'debido a', 'puesto que', 'dado que',
      'causa', 'provoca', 'genera', 'desencadena', 'es responsable de',
      'produce', 'ocasiona', 'resulta en', 'conlleva', 'implica'
    ];
    var found = [];
    for (var i = 0; i < markers.length; i++) {
      if (lower.indexOf(markers[i]) !== -1) found.push(markers[i]);
    }
    return found;
  }

  /**
   * Función principal de análisis semántico contextual.
   * Recibe un segmento y devuelve un objeto con el análisis completo.
   *
   * @param {Object} segment - Objeto con { indice, texto, funciones }
   * @returns {Object} Análisis semántico contextual
   */
  function analyzeSemanticContext(segment) {
    var text = segment.texto;
    var lower = text.toLowerCase();
    var tokens = tokenize(text);
    var negation = detectNegation(text);
    var interrogative = isInterrogative(text);
    var quotedOrReported = isReportedSpeechOrQuote(text);
    var hypothetical = isHypothetical(text);
    var modality = detectModality(text);
    var connectors = detectConnectors(text);
    var evidenceMarkers = detectEvidenceMarkers(text);
    var causalMarkers = detectCausalMarkers(text);
    
    return {
      text: text,
      tokens: tokens,
      negated: negation.isNegated,
      negationWords: negation.negationWords,
      quoted: quotedOrReported,
      reportedSpeech: quotedOrReported, // alias
      hypothetical: hypothetical,
      interrogative: interrogative,
      modality: modality.modality,
      modalityMarkers: modality.markers,
      connectors: connectors,
      evidenceMarkers: evidenceMarkers,
      causalMarkers: causalMarkers
    };
  }

  /* ═══════════════════════════════════════════════════════════
     CAPA 4 — DETECCIÓN Y EVALUACIÓN CONTEXTUAL DE ÁTOMOS
     Cruza segmento × átomo × perfil. Genera el Observation Registry.
     VERSIÓN MEJORADA: utiliza analyzeSemanticContext para filtrar
     falsos positivos.
     ═══════════════════════════════════════════════════════════ */

  function getProfileForAtom(atom, perfilKey) {
    if (atom.perfiles[perfilKey]) return atom.perfiles[perfilKey];
    return {
      definicion_contextual: atom.definicion_base,
      indicadores: [],
      contraindicadores: [],
      relevancia: 0.3,
      severidad_base: 5,
      evidencia_esperada: 'No especificada para este perfil (heredado de definición base)',
      umbral_incertidumbre: 'alto',
      heredado: true
    };
  }

  /**
   * Determina si un indicador debe activar un átomo considerando
   * el contexto semántico. Filtra falsos positivos por negación,
   * cita, pregunta, hipótesis, etc.
   *
   * @param {string} indicador - El indicador a buscar
   * @param {Object} segment - El segmento de texto
   * @param {Object} context - Resultado de analyzeSemanticContext
   * @param {Object} perfilData - Datos del perfil del átomo
   * @returns {boolean} true si el indicador debe activar el átomo
   */
  function shouldActivateIndicator(indicador, segment, context, perfilData) {
    var lower = segment.texto.toLowerCase();
    
    // Verificar presencia del indicador
    if (lower.indexOf(indicador) === -1) return false;
    
    // Regla 1: si el segmento es una pregunta, no activar átomos de afirmación
    if (context.interrogative) {
      // Algunos átomos pueden aplicar en preguntas retóricas, pero en general no
      var allowInQuestions = ['ATOMO_STEELMAN', 'ATOMO_IDENTIDAD_ARGUMENTO'];
      // No tengo acceso al ID del átomo aquí, así que por ahora no activamos en preguntas
      return false;
    }
    
    // Regla 2: si el segmento está negado, verificar si el indicador está dentro
    // del alcance de la negación
    if (context.negated) {
      // Buscar la posición del indicador y ver si hay una negación cercana
      var idx = lower.indexOf(indicador);
      // Obtener las palabras de negación encontradas
      var negationWords = context.negationWords || [];
      var isNegatedLocally = false;
      
      for (var n = 0; n < negationWords.length; n++) {
        var negWord = negationWords[n];
        var negIdx = lower.indexOf(negWord);
        if (negIdx !== -1 && Math.abs(negIdx - idx) <= 30) {
          // Negación cercana al indicador
          isNegatedLocally = true;
          break;
        }
      }
      if (isNegatedLocally) return false;
    }
    
    // Regla 3: si es discurso referido o cita, en general no activar
    // a menos que el átomo sea específicamente sobre citas
    if (context.quoted || context.reportedSpeech) {
      // Para la mayoría de átomos, las citas no reflejan la posición del autor
      return false;
    }
    
    // Regla 4: si es hipotético, algunos átomos (como causalidad) no aplican
    if (context.hypothetical) {
      // Para átomos de causalidad, la hipótesis no es una afirmación causal
      return false;
    }
    
    // Si pasa todos los filtros, el indicador puede activar el átomo
    return true;
  }

  function evaluateAtomsInContext(segments, perfilPrimario) {
    var observaciones = [];

    Object.keys(ATOM_DICTIONARY).forEach(function (atomId) {
      var atom = ATOM_DICTIONARY[atomId];
      var perfilData = getProfileForAtom(atom, perfilPrimario);
      if (!perfilData.indicadores || perfilData.indicadores.length === 0) return;

      segments.forEach(function (seg) {
        // Obtener análisis contextual del segmento
        var context = analyzeSemanticContext(seg);
        
        // Buscar indicadores que deban activarse según el contexto
        var indicadorActivado = null;
        for (var i = 0; i < perfilData.indicadores.length; i++) {
          var ind = perfilData.indicadores[i];
          if (shouldActivateIndicator(ind, seg, context, perfilData)) {
            indicadorActivado = ind;
            break;
          }
        }
        if (!indicadorActivado) return;

        // Verificar contraindicadores con el mismo criterio contextual
        var contraindicadorActivo = false;
        if (perfilData.contraindicadores && perfilData.contraindicadores.length > 0) {
          for (var c = 0; c < perfilData.contraindicadores.length; c++) {
            var ci = perfilData.contraindicadores[c];
            // Para contraindicadores, también aplicamos filtro contextual
            if (seg.texto.toLowerCase().indexOf(ci) !== -1 && !context.negated && !context.quoted) {
              contraindicadorActivo = true;
              break;
            }
          }
        }

        observaciones.push({
          atomo: atomId,
          criterio: atom.criterio,
          fase: atom.fase,
          perfil: perfilPrimario,
          segmento_indice: seg.indice,
          fragmento: seg.texto,
          funciones_segmento: seg.funciones,
          indicador_activado: indicadorActivado,
          mitigado_por_contraindicador: contraindicadorActivo,
          relevancia: perfilData.relevancia,
          severidad_base: perfilData.severidad_base,
          evidencia_esperada: perfilData.evidencia_esperada,
          umbral_incertidumbre: perfilData.umbral_incertidumbre,
          heredado: !!perfilData.heredado
        });
      });
    });

    return observaciones;
  }

  /* ═══════════════════════════════════════════════════════════
     CAPA 5 — RUTAS INFERENCIALES
     Dato → Interpretación → Causalidad → Generalización → Propuesta
     Evalúa continuidad, justificación y proporcionalidad (§5).
     ═══════════════════════════════════════════════════════════ */

  var ROUTE_SEQUENCE = ['dato', 'interpretacion', 'causal', 'generalizacion', 'propuesta'];

  function evaluateInferentialRoutes(segments) {
    var presentes = {};
    ROUTE_SEQUENCE.forEach(function (step) { presentes[step] = false; });

    segments.forEach(function (seg) {
      seg.funciones.forEach(function (fn) {
        if (presentes.hasOwnProperty(fn)) presentes[fn] = true;
      });
    });

    var saltos = [];
    var penalizacion_ruta = 0;

    if (presentes.propuesta && !presentes.dato && !presentes.causal) {
      saltos.push({
        tipo: 'propuesta_sin_fundamento',
        descripcion: 'Se detectaron segmentos de propuesta sin segmentos de dato o causalidad que la sustenten.',
        penalizacion: 15
      });
      penalizacion_ruta += 15;
    }

    if (presentes.generalizacion && !presentes.dato) {
      saltos.push({
        tipo: 'generalizacion_sin_dato',
        descripcion: 'Se detectó generalización sin segmentos de dato que la respalden.',
        penalizacion: 10
      });
      penalizacion_ruta += 10;
    }

    if (presentes.causal && !presentes.dato) {
      saltos.push({
        tipo: 'causalidad_sin_dato',
        descripcion: 'Se afirma causalidad sin segmentos de dato que la sustenten en el documento.',
        penalizacion: 10
      });
      penalizacion_ruta += 10;
    }

    return {
      ruta_esperada: ROUTE_SEQUENCE,
      pasos_presentes: presentes,
      saltos_detectados: saltos,
      penalizacion_ruta: Math.min(penalizacion_ruta, 25),
      continuidad: Object.keys(presentes).filter(function (k) { return presentes[k]; }).length / ROUTE_SEQUENCE.length
    };
  }

  /* ═══════════════════════════════════════════════════════════
     CAPA 6 — MOTOR DE PUNTUACIÓN
     ═══════════════════════════════════════════════════════════ */

  var FASE_META = {
    fase1: { nombre: 'Estructura Lógica' },
    fase2: { nombre: 'Inferencia' },
    fase3: { nombre: 'Calibración Epistémica' },
    fase4: { nombre: 'Transparencia Retórica' },
    fase5: { nombre: 'Pertinencia Deliberativa' }
  };

  var CRITERIO_NOMBRE = {
    '1.1': 'No Contradicción', '1.2': 'Continuidad Semántica', '1.3': 'Ausencia de Falsas Dicotomías', '1.4': 'Integridad de las Premisas',
    '2.1': 'Suficiencia Inferencial', '2.2': 'Causalidad Rigurosa', '2.3': 'Proporcionalidad Generalizadora', '2.4': 'Inmunidad a Petición de Principio',
    '3.1': 'Trazabilidad de la Evidencia', '3.2': 'Declaración de Incertidumbre', '3.3': 'Delimitación Hecho-Valor', '3.4': 'Completitud del Contexto',
    '4.1': 'Representación Justa (Steelman)', '4.2': 'Neutralidad Emocional', '4.3': 'Despersonalización del Debate', '4.4': 'Claridad Denotativa',
    '5.1': 'Focalización Temática', '5.2': 'Responsabilidad Constructiva', '5.3': 'Universalidad (Simetría)', '5.4': 'Falsabilidad'
  };

  function scoreEngine(observaciones, rutaEval) {
    var porCriterio = {};
    observaciones.forEach(function (obs) {
      if (obs.mitigado_por_contraindicador) return;
      porCriterio[obs.criterio] = porCriterio[obs.criterio] || [];
      porCriterio[obs.criterio].push(obs);
    });

    var porFase = {};
    var evidencias = [];

    Object.keys(ATOM_DICTIONARY).forEach(function (atomId) {
      var atom = ATOM_DICTIONARY[atomId];
      var crit = atom.criterio;
      var fase = atom.fase;
      porFase[fase] = porFase[fase] || { id: fase, nombre: FASE_META[fase].nombre, criterios: [] };

      var obsDeCriterio = porCriterio[crit] || [];
      var penalizacion_atomo_total = 0;
      var atomos_activados = [];

      obsDeCriterio.forEach(function (obs) {
        var p = obs.severidad_base * 1 * obs.relevancia;
        penalizacion_atomo_total += p;
        atomos_activados.push({ atomo: obs.atomo, segmento: obs.segmento_indice, penalizacion: Math.round(p * 100) / 100, heredado: obs.heredado });
        evidencias.push({ atomo: obs.atomo, criterio: crit, fragmento: obs.fragmento, perfil: obs.perfil });
      });

      var penalizacion_criterio = Math.min(penalizacion_atomo_total, 25);

      porFase[fase].criterios.push({
        id: crit,
        nombre: CRITERIO_NOMBRE[crit],
        atomo: atomId,
        penalizacion: Math.round(penalizacion_criterio * 100) / 100,
        atomos_activados: atomos_activados
      });
    });

    if (rutaEval.penalizacion_ruta > 0 && porFase.fase2) {
      porFase.fase2.criterios.push({
        id: 'RUTA-INF',
        nombre: 'Ruta Inferencial (Dato→Interpretación→Causalidad→Generalización→Propuesta)',
        atomo: null,
        penalizacion: rutaEval.penalizacion_ruta,
        atomos_activados: [],
        saltos: rutaEval.saltos_detectados
      });
    }

    var fases = Object.keys(porFase).map(function (faseId) {
      var f = porFase[faseId];
      var penalizacion_fase = f.criterios.reduce(function (acc, c) { return acc + c.penalizacion; }, 0);
      var puntaje_fase = Math.max(0, 100 - penalizacion_fase);
      return {
        id: f.id,
        nombre: f.nombre,
        puntaje: Math.round(puntaje_fase),
        infracciones: f.criterios.filter(function (c) { return c.penalizacion > 0; }).map(function (c) {
          return {
            criterio: c.id + ' - ' + c.nombre,
            constructo: c.atomo || 'Ruta Inferencial',
            penalizacion: c.penalizacion,
            atomos_activados: c.atomos_activados,
            saltos: c.saltos || undefined
          };
        })
      };
    });

    var IRD_global = Math.round(fases.reduce(function (acc, f) { return acc + f.puntaje; }, 0) / fases.length);

    var nivel3Count = fases.reduce(function (acc, f) {
      return acc + f.infracciones.filter(function (i) { return i.penalizacion >= 25; }).length;
    }, 0);

    var riesgo = 'Normal';
    if (nivel3Count >= 4) riesgo = 'Riesgo Extremo';
    else if (nivel3Count >= 3) riesgo = 'Alta Fragilidad';
    else if (nivel3Count >= 2) riesgo = 'Atención';

    return { fases: fases, evidencias: evidencias, IRD_global: IRD_global, riesgo: riesgo };
  }

  /* ═══════════════════════════════════════════════════════════
     ORQUESTADOR PRINCIPAL
     ═══════════════════════════════════════════════════════════ */

  function evaluate(text) {
    if (!text || text.trim().length === 0) return null;

    var clasificacion = classifyDocument(text);
    var segmentos = segmentText(text);
    var observaciones = evaluateAtomsInContext(segmentos, clasificacion.naturaleza_primaria);
    var rutaEval = evaluateInferentialRoutes(segmentos);
    var scoring = scoreEngine(observaciones, rutaEval);

    return {
      protocol_version: VERSION,
      naturaleza_documental: clasificacion.naturaleza_primaria,
      naturalezas_secundarias: clasificacion.naturalezas_secundarias,
      hibrido: clasificacion.hibrido,
      confianza_clasificacion: clasificacion.confianza,
      rutas_evaluadas: rutaEval,
      fases: scoring.fases,
      evidencias: scoring.evidencias,
      IRD_global: scoring.IRD_global,
      riesgo: scoring.riesgo
    };
  }

  return {
    version: VERSION,
    evaluate: evaluate,
    classifyDocument: classifyDocument,
    segmentText: segmentText,
    analyzeSemanticContext: analyzeSemanticContext, // NUEVO: expuesto para auditoría
    ATOM_DICTIONARY: ATOM_DICTIONARY,
    CLASSIFICATION_MARKERS: CLASSIFICATION_MARKERS
  };
});
