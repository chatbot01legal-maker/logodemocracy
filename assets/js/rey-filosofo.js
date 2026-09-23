// assets/js/rey-filosofo.js
// Controlador principal del Rey Filósofo.
// Coordina ApiClient y ChatUI, gestiona la sesión y el flujo de mensajes.
// No contiene lógica de razonamiento, ZDP, Sophia, ni evaluación.

(function() {
  'use strict';

  // --- Estado ---
  var sessionId = null;
    var currentView = 'inicio';
    var mainContent;
    var navbarLinks;

  var isLoading = false;
  // Initialize window.currentUserId if it's not already set.
  // This aligns with CognitiveRuntime's usage.
  window.currentUserId = window.currentUserId || 'guest';
  
  // --- Hito 5.3: Contexto Cognitivo Centralizado ---
  function getCognitiveContext() {
    if (
      typeof CognitiveRuntime !== 'undefined' &&
      typeof CognitiveRuntime.getUserContext === 'function'
    ) {
      return CognitiveRuntime.getUserContext();
    }
    return null;
  }
  
  // --- Funciones de sesión ---

  function getOrCreateSessionId() {
    var stored = localStorage.getItem(CONFIG.SESSION_STORAGE_KEY);
    if (stored) {
      return stored;
    }
    var newId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      newId = crypto.randomUUID();
    } else {
      newId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    localStorage.setItem(CONFIG.SESSION_STORAGE_KEY, newId);
    return newId;
  }

  // --- Funciones para la gestión de Microtests ---

  /**
   * Simula la lógica de envío de resultados de microtests al servicio.
   * Esta función sería invocada por la UI o el motor de microtests
   * una vez que los resultados estén listos.
   * @param {Array<object>} results Los resultados de los microtests a guardar (array de objetos).
   */


  /**
   * Refresca la interfaz de usuario que muestra el estado cognitivo.
   * Invoca a `updateCognitiveInfo` que ya existe para actualizar los labels.
   */


  // --- Vistas SPA ---

  
// ================================================================
// MICROTESTS COGNITIVOS — INTEGRACIÓN REAL
// Fuente: rey-filosofo.backup.js
// Persistencia: MicrotestService
// Contexto pedagógico: LearningProfileService / CognitiveRuntime
// ================================================================

const MICROTESTS = [
  {
    id: "brujula",
    title: "Cómo construyes una comprensión",
    dimension: "construccion_comprension",
    phase: "construccion_comprension",
    indicators: ["ejemplo", "principio", "analogia", "secuencia"],
    questions: [
      {
        id: "brujula-Q1",
        questionId: "brujula-Q1",
        text: "Estás intentando entender por qué una determinada idea política empieza a ser considerada aceptable después de haber sido marginal durante años. ¿Por dónde comenzarías?",
        question: "Estás intentando entender por qué una determinada idea política empieza a ser considerada aceptable después de haber sido marginal durante años. ¿Por dónde comenzarías?",
        prompt: "Estás intentando entender por qué una determinada idea política empieza a ser considerada aceptable después de haber sido marginal durante años. ¿Por dónde comenzarías?",
        domain: "sociedad",
        phase: "construccion_comprension",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar un caso concreto en que haya ocurrido ese cambio.", text: "Buscar un caso concreto en que haya ocurrido ese cambio.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Compararlo con otro fenómeno conocido que haya seguido una transformación parecida.", text: "Compararlo con otro fenómeno conocido que haya seguido una transformación parecida.", indicator: "analogia" },
          { value: "C", key: "C", id: "C", label: "Identificar la regla o principio que explica cuándo una idea pasa de ser marginal a aceptable.", text: "Identificar la regla o principio que explica cuándo una idea pasa de ser marginal a aceptable.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Reconstruir cómo fue cambiando la situación a lo largo del tiempo.", text: "Reconstruir cómo fue cambiando la situación a lo largo del tiempo.", indicator: "secuencia" }
        ]
      },
      {
        id: "brujula-Q2",
        questionId: "brujula-Q2",
        text: "Quieres comprender cómo una red de organismos bajo tierra puede intercambiar recursos entre distintas plantas.",
        question: "Quieres comprender cómo una red de organismos bajo tierra puede intercambiar recursos entre distintas plantas.",
        prompt: "Quieres comprender cómo una red de organismos bajo tierra puede intercambiar recursos entre distintas plantas.",
        domain: "biologia",
        phase: "construccion_comprension",
        options: [
          { value: "A", key: "A", id: "A", label: "Seguir el proceso desde el primer intercambio hasta sus consecuencias.", text: "Seguir el proceso desde el primer intercambio hasta sus consecuencias.", indicator: "secuencia" },
          { value: "B", key: "B", id: "B", label: "Buscar una situación concreta en la que pueda observarse ese intercambio.", text: "Buscar una situación concreta en la que pueda observarse ese intercambio.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Compararlo con una red que ya conozcas.", text: "Compararlo con una red que ya conozcas.", indicator: "analogia" },
          { value: "D", key: "D", id: "D", label: "Identificar el mecanismo general que permite que ocurra.", text: "Identificar el mecanismo general que permite que ocurra.", indicator: "principio" }
        ]
      },
      {
        id: "brujula-Q3",
        questionId: "brujula-Q3",
        text: "Tienes que entender cómo funciona un sistema de riego automático.",
        question: "Tienes que entender cómo funciona un sistema de riego automático.",
        prompt: "Tienes que entender cómo funciona un sistema de riego automático.",
        domain: "tecnologia",
        phase: "construccion_comprension",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar las reglas que determinan cuándo y cómo se activa.", text: "Identificar las reglas que determinan cuándo y cómo se activa.", indicator: "principio" },
          { value: "B", key: "B", id: "B", label: "Buscar una instalación que ya esté funcionando y observarla.", text: "Buscar una instalación que ya esté funcionando y observarla.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Compararlo con otro sistema de distribución que conozcas.", text: "Compararlo con otro sistema de distribución que conozcas.", indicator: "analogia" },
          { value: "D", key: "D", id: "D", label: "Seguir ordenadamente qué ocurre desde que recibe una señal hasta que entrega agua.", text: "Seguir ordenadamente qué ocurre desde que recibe una señal hasta que entrega agua.", indicator: "secuencia" }
        ]
      },
      {
        id: "brujula-Q4",
        questionId: "brujula-Q4",
        text: "Un sistema electrónico transmite información entre varios componentes y no entiendes bien qué está ocurriendo.",
        question: "Un sistema electrónico transmite información entre varios componentes y no entiendes bien qué está ocurriendo.",
        prompt: "Un sistema electrónico transmite información entre varios componentes y no entiendes bien qué está ocurriendo.",
        domain: "tecnologia",
        phase: "construccion_comprension",
        options: [
          { value: "A", key: "A", id: "A", label: "Pensar en otro sistema conocido que funcione mediante intercambio de mensajes.", text: "Pensar en otro sistema conocido que funcione mediante intercambio de mensajes.", indicator: "analogia" },
          { value: "B", key: "B", id: "B", label: "Identificar la regla general que determina cómo circula la información.", text: "Identificar la regla general que determina cómo circula la información.", indicator: "principio" },
          { value: "C", key: "C", id: "C", label: "Seguir un mensaje concreto desde que sale hasta que llega.", text: "Seguir un mensaje concreto desde que sale hasta que llega.", indicator: "secuencia" },
          { value: "D", key: "D", id: "D", label: "Buscar un caso real de funcionamiento y observar qué ocurre.", text: "Buscar un caso real de funcionamiento y observar qué ocurre.", indicator: "ejemplo" }
        ]
      },
      {
        id: "brujula-Q5",
        questionId: "brujula-Q5",
        text: "Quieres comprender cómo una institución histórica llegó a tener tanta influencia.",
        question: "Quieres comprender cómo una institución histórica llegó a tener tanta influencia.",
        prompt: "Quieres comprender cómo una institución histórica llegó a tener tanta influencia.",
        domain: "historia",
        phase: "construccion_comprension",
        options: [
          { value: "A", key: "A", id: "A", label: "Reconstruir las etapas que llevaron desde su origen hasta esa posición.", text: "Reconstruir las etapas que llevaron desde su origen hasta esa posición.", indicator: "secuencia" },
          { value: "B", key: "B", id: "B", label: "Buscar un caso concreto que muestre cómo ejercía esa influencia.", text: "Buscar un caso concreto que muestre cómo ejercía esa influencia.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Compararla con una institución que conozcas de otro período.", text: "Compararla con una institución que conozcas de otro período.", indicator: "analogia" },
          { value: "D", key: "D", id: "D", label: "Identificar el principio que explica cómo pudo acumular ese poder.", text: "Identificar el principio que explica cómo pudo acumular ese poder.", indicator: "principio" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "ejemplos",
    title: "Construir sobre lo que ya sabes",
    dimension: "conocimiento_previo",
    phase: "conocimiento_previo",
    indicators: ["anclaje_experiencial", "recuperacion_conocimiento", "comparacion", "contraste"],
    questions: [
      {
        id: "ejemplos-Q1",
        questionId: "ejemplos-Q1",
        text: "Lees sobre cómo funcionaban las rutas comerciales romanas.",
        question: "Lees sobre cómo funcionaban las rutas comerciales romanas.",
        prompt: "Lees sobre cómo funcionaban las rutas comerciales romanas.",
        domain: "comercio",
        phase: "conocimiento_previo",
        options: [
          { value: "A", key: "A", id: "A", label: "Compararlo con otro sistema histórico de comercio que conozcas.", text: "Compararlo con otro sistema histórico de comercio que conozcas.", indicator: "comparacion" },
          { value: "B", key: "B", id: "B", label: "Relacionarlo con experiencias actuales de comprar o transportar productos.", text: "Relacionarlo con experiencias actuales de comprar o transportar productos.", indicator: "anclaje_experiencial" },
          { value: "C", key: "C", id: "C", label: "Buscar qué conocimientos anteriores necesitas recuperar para entenderlo.", text: "Buscar qué conocimientos anteriores necesitas recuperar para entenderlo.", indicator: "recuperacion_conocimiento" },
          { value: "D", key: "D", id: "D", label: "Buscar primero diferencias que impidan asumir que ambos sistemas funcionaban igual.", text: "Buscar primero diferencias que impidan asumir que ambos sistemas funcionaban igual.", indicator: "contraste" }
        ]
      },
      {
        id: "ejemplos-Q2",
        questionId: "ejemplos-Q2",
        text: "Te explican un fenómeno relacionado con la inercia y tu primera intuición no coincide con la explicación.",
        question: "Te explican un fenómeno relacionado con la inercia y tu primera intuición no coincide con la explicación.",
        prompt: "Te explican un fenómeno relacionado con la inercia y tu primera intuición no coincide con la explicación.",
        domain: "fisica",
        phase: "conocimiento_previo",
        options: [
          { value: "A", key: "A", id: "A", label: "Recordar otros fenómenos físicos que hayas estudiado y relacionarlos con este.", text: "Recordar otros fenómenos físicos que hayas estudiado y relacionarlos con este.", indicator: "recuperacion_conocimiento" },
          { value: "B", key: "B", id: "B", label: "Pensar en alguna experiencia cotidiana en la que hayas observado algo parecido.", text: "Pensar en alguna experiencia cotidiana en la que hayas observado algo parecido.", indicator: "anclaje_experiencial" },
          { value: "C", key: "C", id: "C", label: "Buscar inmediatamente qué diferencia existe entre tu intuición y el fenómeno explicado.", text: "Buscar inmediatamente qué diferencia existe entre tu intuición y el fenómeno explicado.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Compararlo con otro fenómeno conocido que pueda servirte como referencia.", text: "Compararlo con otro fenómeno conocido que pueda servirte como referencia.", indicator: "comparacion" }
        ]
      },
      {
        id: "ejemplos-Q3",
        questionId: "ejemplos-Q3",
        text: "Debes aprender a utilizar una herramienta digital que nunca has usado.",
        question: "Debes aprender a utilizar una herramienta digital que nunca has usado.",
        prompt: "Debes aprender a utilizar una herramienta digital que nunca has usado.",
        domain: "tecnologia",
        phase: "conocimiento_previo",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar qué funciones de otras herramientas conocidas pueden servirte aquí.", text: "Identificar qué funciones de otras herramientas conocidas pueden servirte aquí.", indicator: "recuperacion_conocimiento" },
          { value: "B", key: "B", id: "B", label: "Compararla con herramientas que ya sabes utilizar.", text: "Compararla con herramientas que ya sabes utilizar.", indicator: "comparacion" },
          { value: "C", key: "C", id: "C", label: "Relacionarla con alguna experiencia concreta que hayas tenido con tecnología.", text: "Relacionarla con alguna experiencia concreta que hayas tenido con tecnología.", indicator: "anclaje_experiencial" },
          { value: "D", key: "D", id: "D", label: "Buscar primero qué diferencias podrían impedir que funcione como las herramientas anteriores.", text: "Buscar primero qué diferencias podrían impedir que funcione como las herramientas anteriores.", indicator: "contraste" }
        ]
      },
      {
        id: "ejemplos-Q4",
        questionId: "ejemplos-Q4",
        text: "Encuentras una explicación que contradice una idea que sostenías desde hace tiempo.",
        question: "Encuentras una explicación que contradice una idea que sostenías desde hace tiempo.",
        prompt: "Encuentras una explicación que contradice una idea que sostenías desde hace tiempo.",
        domain: "sociedad",
        phase: "conocimiento_previo",
        options: [
          { value: "A", key: "A", id: "A", label: "Revisar qué experiencia personal estaba detrás de tu idea inicial.", text: "Revisar qué experiencia personal estaba detrás de tu idea inicial.", indicator: "anclaje_experiencial" },
          { value: "B", key: "B", id: "B", label: "Comparar ambas explicaciones punto por punto.", text: "Comparar ambas explicaciones punto por punto.", indicator: "comparacion" },
          { value: "C", key: "C", id: "C", label: "Recuperar los conocimientos anteriores que podrían estar influyendo en tu interpretación.", text: "Recuperar los conocimientos anteriores que podrían estar influyendo en tu interpretación.", indicator: "recuperacion_conocimiento" },
          { value: "D", key: "D", id: "D", label: "Buscar qué diferencias entre los casos podrían explicar la aparente contradicción.", text: "Buscar qué diferencias entre los casos podrían explicar la aparente contradicción.", indicator: "contraste" }
        ]
      },
      {
        id: "ejemplos-Q5",
        questionId: "ejemplos-Q5",
        text: "Un concepto nuevo parece parecido a algo que ya conocías, pero no estás seguro de que la comparación sea válida.",
        question: "Un concepto nuevo parece parecido a algo que ya conocías, pero no estás seguro de que la comparación sea válida.",
        prompt: "Un concepto nuevo parece parecido a algo que ya conocías, pero no estás seguro de que la comparación sea válida.",
        domain: "ciencia",
        phase: "conocimiento_previo",
        options: [
          { value: "A", key: "A", id: "A", label: "Recordar exactamente qué sabías sobre el fenómeno anterior.", text: "Recordar exactamente qué sabías sobre el fenómeno anterior.", indicator: "recuperacion_conocimiento" },
          { value: "B", key: "B", id: "B", label: "Buscar una experiencia concreta que te ayude a relacionarlos.", text: "Buscar una experiencia concreta que te ayude a relacionarlos.", indicator: "anclaje_experiencial" },
          { value: "C", key: "C", id: "C", label: "Comparar ambos fenómenos para encontrar correspondencias.", text: "Comparar ambos fenómenos para encontrar correspondencias.", indicator: "comparacion" },
          { value: "D", key: "D", id: "D", label: "Examinar primero dónde dejan de ser equivalentes.", text: "Examinar primero dónde dejan de ser equivalentes.", indicator: "contraste" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "puentes",
    title: "Transferir a una situación nueva",
    dimension: "transferencia",
    phase: "transferencia",
    indicators: ["transferencia_global", "mapeo_analitico", "contraste", "extraccion_regla"],
    questions: [
      {
        id: "puentes-Q1",
        questionId: "puentes-Q1",
        text: "Conoces un sistema en el que distintos componentes transmiten señales entre sí. Encuentras otro sistema que parece funcionar de manera parecida.",
        question: "Conoces un sistema en el que distintos componentes transmiten señales entre sí. Encuentras otro sistema que parece funcionar de manera parecida.",
        prompt: "Conoces un sistema en el que distintos componentes transmiten señales entre sí. Encuentras otro sistema que parece funcionar de manera parecida.",
        domain: "biologia",
        phase: "transferencia",
        options: [
          { value: "A", key: "A", id: "A", label: "Intentar aplicar la solución anterior prácticamente de la misma manera.", text: "Intentar aplicar la solución anterior prácticamente de la misma manera.", indicator: "transferencia_global" },
          { value: "B", key: "B", id: "B", label: "Emparejar los elementos de ambos sistemas antes de decidir qué corresponde con qué.", text: "Emparejar los elementos de ambos sistemas antes de decidir qué corresponde con qué.", indicator: "mapeo_analitico" },
          { value: "C", key: "C", id: "C", label: "Buscar primero las diferencias que podrían hacer fallar la comparación.", text: "Buscar primero las diferencias que podrían hacer fallar la comparación.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Extraer la regla general del primer sistema y comprobar si también sirve para el segundo.", text: "Extraer la regla general del primer sistema y comprobar si también sirve para el segundo.", indicator: "extraccion_regla" }
        ]
      },
      {
        id: "puentes-Q2",
        questionId: "puentes-Q2",
        text: "Una organización enfrenta un problema de comunicación parecido a otro que ya conoces.",
        question: "Una organización enfrenta un problema de comunicación parecido a otro que ya conoces.",
        prompt: "Una organización enfrenta un problema de comunicación parecido a otro que ya conoces.",
        domain: "organizacion",
        phase: "transferencia",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar qué elementos cumplen funciones equivalentes en ambos casos.", text: "Identificar qué elementos cumplen funciones equivalentes en ambos casos.", indicator: "mapeo_analitico" },
          { value: "B", key: "B", id: "B", label: "Buscar inmediatamente qué diferencias podrían impedir trasladar la solución.", text: "Buscar inmediatamente qué diferencias podrían impedir trasladar la solución.", indicator: "contraste" },
          { value: "C", key: "C", id: "C", label: "Extraer el principio organizativo que estaba detrás de la solución anterior.", text: "Extraer el principio organizativo que estaba detrás de la solución anterior.", indicator: "extraccion_regla" },
          { value: "D", key: "D", id: "D", label: "Intentar reproducir la solución anterior con los mínimos cambios posibles.", text: "Intentar reproducir la solución anterior con los mínimos cambios posibles.", indicator: "transferencia_global" }
        ]
      },
      {
        id: "puentes-Q3",
        questionId: "puentes-Q3",
        text: "Encuentras un conflicto histórico que recuerda a otro que ya estudiaste.",
        question: "Encuentras un conflicto histórico que recuerda a otro que ya estudiaste.",
        prompt: "Encuentras un conflicto histórico que recuerda a otro que ya estudiaste.",
        domain: "historia",
        phase: "transferencia",
        options: [
          { value: "A", key: "A", id: "A", label: "Aplicar directamente la explicación utilizada para el conflicto anterior.", text: "Aplicar directamente la explicación utilizada para el conflicto anterior.", indicator: "transferencia_global" },
          { value: "B", key: "B", id: "B", label: "Identificar qué actores y relaciones cumplen funciones equivalentes.", text: "Identificar qué actores y relaciones cumplen funciones equivalentes.", indicator: "mapeo_analitico" },
          { value: "C", key: "C", id: "C", label: "Examinar primero las diferencias entre ambos conflictos.", text: "Examinar primero las diferencias entre ambos conflictos.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Extraer la estructura general que podría explicar ambos casos.", text: "Extraer la estructura general que podría explicar ambos casos.", indicator: "extraccion_regla" }
        ]
      },
      {
        id: "puentes-Q4",
        questionId: "puentes-Q4",
        text: "Una solución que funcionó anteriormente parece aplicable a un problema nuevo.",
        question: "Una solución que funcionó anteriormente parece aplicable a un problema nuevo.",
        prompt: "Una solución que funcionó anteriormente parece aplicable a un problema nuevo.",
        domain: "problema_practico",
        phase: "transferencia",
        options: [
          { value: "A", key: "A", id: "A", label: "Trasladar la solución anterior casi sin modificarla.", text: "Trasladar la solución anterior casi sin modificarla.", indicator: "transferencia_global" },
          { value: "B", key: "B", id: "B", label: "Identificar correspondencias entre las partes de ambos problemas.", text: "Identificar correspondencias entre las partes de ambos problemas.", indicator: "mapeo_analitico" },
          { value: "C", key: "C", id: "C", label: "Determinar primero qué elementos son diferentes y podrían cambiar el resultado.", text: "Determinar primero qué elementos son diferentes y podrían cambiar el resultado.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Separar los detalles y quedarse con la regla que hizo funcionar la solución anterior.", text: "Separar los detalles y quedarse con la regla que hizo funcionar la solución anterior.", indicator: "extraccion_regla" }
        ]
      },
      {
        id: "puentes-Q5",
        questionId: "puentes-Q5",
        text: "Una explicación conocida parece útil para interpretar un fenómeno nuevo.",
        question: "Una explicación conocida parece útil para interpretar un fenómeno nuevo.",
        prompt: "Una explicación conocida parece útil para interpretar un fenómeno nuevo.",
        domain: "investigacion",
        phase: "transferencia",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar qué partes del fenómeno nuevo corresponden a la estructura anterior.", text: "Buscar qué partes del fenómeno nuevo corresponden a la estructura anterior.", indicator: "mapeo_analitico" },
          { value: "B", key: "B", id: "B", label: "Aplicar inicialmente la explicación anterior como punto de partida.", text: "Aplicar inicialmente la explicación anterior como punto de partida.", indicator: "transferencia_global" },
          { value: "C", key: "C", id: "C", label: "Examinar qué diferencias limitan esa transferencia.", text: "Examinar qué diferencias limitan esa transferencia.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Extraer el principio común y probar si permite explicar el nuevo fenómeno.", text: "Extraer el principio común y probar si permite explicar el nuevo fenómeno.", indicator: "extraccion_regla" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "mapa_camino",
    title: "Convertir comprensión en acción",
    dimension: "ejecucion",
    phase: "ejecucion",
    indicators: ["experimentacion", "planificacion", "modelo_referencia", "descomposicion"],
    questions: [
      {
        id: "mapa_camino-Q1",
        questionId: "mapa_camino-Q1",
        text: "Quieres construir un sistema de riego para un huerto pequeño.",
        question: "Quieres construir un sistema de riego para un huerto pequeño.",
        prompt: "Quieres construir un sistema de riego para un huerto pequeño.",
        domain: "huerto",
        phase: "ejecucion",
        options: [
          { value: "A", key: "A", id: "A", label: "Construir primero una versión sencilla y probarla.", text: "Construir primero una versión sencilla y probarla.", indicator: "experimentacion" },
          { value: "B", key: "B", id: "B", label: "Diseñar el proyecto completo antes de comenzar la construcción.", text: "Diseñar el proyecto completo antes de comenzar la construcción.", indicator: "planificacion" },
          { value: "C", key: "C", id: "C", label: "Buscar una instalación que funcione y reproducir su procedimiento.", text: "Buscar una instalación que funcione y reproducir su procedimiento.", indicator: "modelo_referencia" },
          { value: "D", key: "D", id: "D", label: "Dividir el sistema en partes independientes y construirlas por separado.", text: "Dividir el sistema en partes independientes y construirlas por separado.", indicator: "descomposicion" }
        ]
      },
      {
        id: "mapa_camino-Q2",
        questionId: "mapa_camino-Q2",
        text: "Tienes que elaborar un ensayo extenso.",
        question: "Tienes que elaborar un ensayo extenso.",
        prompt: "Tienes que elaborar un ensayo extenso.",
        domain: "escritura",
        phase: "ejecucion",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar un ensayo bien realizado y utilizarlo como referencia de trabajo.", text: "Buscar un ensayo bien realizado y utilizarlo como referencia de trabajo.", indicator: "modelo_referencia" },
          { value: "B", key: "B", id: "B", label: "Dividir el ensayo en partes y trabajar cada una por separado.", text: "Dividir el ensayo en partes y trabajar cada una por separado.", indicator: "descomposicion" },
          { value: "C", key: "C", id: "C", label: "Definir primero todo el recorrido del trabajo antes de escribir.", text: "Definir primero todo el recorrido del trabajo antes de escribir.", indicator: "planificacion" },
          { value: "D", key: "D", id: "D", label: "Escribir una primera versión y utilizarla para descubrir qué necesita cambiar.", text: "Escribir una primera versión y utilizarla para descubrir qué necesita cambiar.", indicator: "experimentacion" }
        ]
      },
      {
        id: "mapa_camino-Q3",
        questionId: "mapa_camino-Q3",
        text: "Debes preparar por primera vez un plato técnicamente complejo.",
        question: "Debes preparar por primera vez un plato técnicamente complejo.",
        prompt: "Debes preparar por primera vez un plato técnicamente complejo.",
        domain: "cocina",
        phase: "ejecucion",
        options: [
          { value: "A", key: "A", id: "A", label: "Preparar una pequeña cantidad y ajustar después de probarla.", text: "Preparar una pequeña cantidad y ajustar después de probarla.", indicator: "experimentacion" },
          { value: "B", key: "B", id: "B", label: "Seguir como referencia una preparación que ya haya demostrado funcionar.", text: "Seguir como referencia una preparación que ya haya demostrado funcionar.", indicator: "modelo_referencia" },
          { value: "C", key: "C", id: "C", label: "Organizar previamente todo el proceso y sus tiempos.", text: "Organizar previamente todo el proceso y sus tiempos.", indicator: "planificacion" },
          { value: "D", key: "D", id: "D", label: "Separar la preparación en componentes independientes.", text: "Separar la preparación en componentes independientes.", indicator: "descomposicion" }
        ]
      },
      {
        id: "mapa_camino-Q4",
        questionId: "mapa_camino-Q4",
        text: "Quieres construir una pequeña aplicación.",
        question: "Quieres construir una pequeña aplicación.",
        prompt: "Quieres construir una pequeña aplicación.",
        domain: "proyecto_digital",
        phase: "ejecucion",
        options: [
          { value: "A", key: "A", id: "A", label: "Dividirla en módulos y resolverlos por separado.", text: "Dividirla en módulos y resolverlos por separado.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Crear una versión mínima para probar si funciona.", text: "Crear una versión mínima para probar si funciona.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Estudiar primero un proyecto similar que ya esté funcionando.", text: "Estudiar primero un proyecto similar que ya esté funcionando.", indicator: "modelo_referencia" },
          { value: "D", key: "D", id: "D", label: "Diseñar antes la arquitectura completa y después comenzar a construir.", text: "Diseñar antes la arquitectura completa y después comenzar a construir.", indicator: "planificacion" }
        ]
      },
      {
        id: "mapa_camino-Q5",
        questionId: "mapa_camino-Q5",
        text: "Debes organizar una actividad que nunca has realizado.",
        question: "Debes organizar una actividad que nunca has realizado.",
        prompt: "Debes organizar una actividad que nunca has realizado.",
        domain: "actividad_nueva",
        phase: "ejecucion",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar una experiencia similar y utilizarla como referencia.", text: "Buscar una experiencia similar y utilizarla como referencia.", indicator: "modelo_referencia" },
          { value: "B", key: "B", id: "B", label: "Probar rápidamente una versión pequeña.", text: "Probar rápidamente una versión pequeña.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Dividir el trabajo en tareas independientes.", text: "Dividir el trabajo en tareas independientes.", indicator: "descomposicion" },
          { value: "D", key: "D", id: "D", label: "Establecer previamente el plan completo de ejecución.", text: "Establecer previamente el plan completo de ejecución.", indicator: "planificacion" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "redes",
    title: "Pensar en relaciones",
    dimension: "relaciones",
    phase: "relaciones",
    indicators: ["relacion_directa", "cadena_causal", "interdependencia", "retroalimentacion"],
    questions: [
      {
        id: "redes-Q1",
        questionId: "redes-Q1",
        text: "Una población animal comienza a disminuir.",
        question: "Una población animal comienza a disminuir.",
        prompt: "Una población animal comienza a disminuir.",
        domain: "ecologia",
        phase: "relaciones",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar qué factor está afectándola directamente.", text: "Buscar qué factor está afectándola directamente.", indicator: "relacion_directa" },
          { value: "B", key: "B", id: "B", label: "Reconstruir la cadena de causas y consecuencias.", text: "Reconstruir la cadena de causas y consecuencias.", indicator: "cadena_causal" },
          { value: "C", key: "C", id: "C", label: "Examinar cómo interactúan varias especies y recursos.", text: "Examinar cómo interactúan varias especies y recursos.", indicator: "interdependencia" },
          { value: "D", key: "D", id: "D", label: "Buscar si el cambio genera consecuencias que después vuelven a afectar la población inicial.", text: "Buscar si el cambio genera consecuencias que después vuelven a afectar la población inicial.", indicator: "retroalimentacion" }
        ]
      },
      {
        id: "redes-Q2",
        questionId: "redes-Q2",
        text: "El precio de un producto básico aumenta.",
        question: "El precio de un producto básico aumenta.",
        prompt: "El precio de un producto básico aumenta.",
        domain: "economia",
        phase: "relaciones",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar el factor que afecta directamente al precio.", text: "Identificar el factor que afecta directamente al precio.", indicator: "relacion_directa" },
          { value: "B", key: "B", id: "B", label: "Seguir las consecuencias que el aumento produce en distintos actores.", text: "Seguir las consecuencias que el aumento produce en distintos actores.", indicator: "cadena_causal" },
          { value: "C", key: "C", id: "C", label: "Analizar cómo consumidores, productores y autoridades se afectan mutuamente.", text: "Analizar cómo consumidores, productores y autoridades se afectan mutuamente.", indicator: "interdependencia" },
          { value: "D", key: "D", id: "D", label: "Examinar si las consecuencias del aumento terminan modificando nuevamente el precio.", text: "Examinar si las consecuencias del aumento terminan modificando nuevamente el precio.", indicator: "retroalimentacion" }
        ]
      },
      {
        id: "redes-Q3",
        questionId: "redes-Q3",
        text: "Una ciudad entra en una crisis prolongada.",
        question: "Una ciudad entra en una crisis prolongada.",
        prompt: "Una ciudad entra en una crisis prolongada.",
        domain: "historia",
        phase: "relaciones",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar el acontecimiento que desencadenó la crisis.", text: "Identificar el acontecimiento que desencadenó la crisis.", indicator: "relacion_directa" },
          { value: "B", key: "B", id: "B", label: "Reconstruir la sucesión de causas y consecuencias.", text: "Reconstruir la sucesión de causas y consecuencias.", indicator: "cadena_causal" },
          { value: "C", key: "C", id: "C", label: "Examinar las relaciones entre economía, instituciones, grupos y recursos.", text: "Examinar las relaciones entre economía, instituciones, grupos y recursos.", indicator: "interdependencia" },
          { value: "D", key: "D", id: "D", label: "Buscar ciclos en los que una consecuencia de la crisis produzca nuevas causas.", text: "Buscar ciclos en los que una consecuencia de la crisis produzca nuevas causas.", indicator: "retroalimentacion" }
        ]
      },
      {
        id: "redes-Q4",
        questionId: "redes-Q4",
        text: "Un equipo empieza a cometer errores repetidamente.",
        question: "Un equipo empieza a cometer errores repetidamente.",
        prompt: "Un equipo empieza a cometer errores repetidamente.",
        domain: "organizacion",
        phase: "relaciones",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar el factor que está produciendo directamente el error.", text: "Identificar el factor que está produciendo directamente el error.", indicator: "relacion_directa" },
          { value: "B", key: "B", id: "B", label: "Seguir cómo un problema inicial genera otros posteriores.", text: "Seguir cómo un problema inicial genera otros posteriores.", indicator: "cadena_causal" },
          { value: "C", key: "C", id: "C", label: "Examinar las relaciones entre personas, procedimientos, recursos y objetivos.", text: "Examinar las relaciones entre personas, procedimientos, recursos y objetivos.", indicator: "interdependencia" },
          { value: "D", key: "D", id: "D", label: "Buscar si las consecuencias de los errores están produciendo las condiciones para nuevos errores.", text: "Buscar si las consecuencias de los errores están produciendo las condiciones para nuevos errores.", indicator: "retroalimentacion" }
        ]
      },
      {
        id: "redes-Q5",
        questionId: "redes-Q5",
        text: "Una zona comienza a perder biodiversidad.",
        question: "Una zona comienza a perder biodiversidad.",
        prompt: "Una zona comienza a perder biodiversidad.",
        domain: "medioambiente",
        phase: "relaciones",
        options: [
          { value: "A", key: "A", id: "A", label: "Identificar un factor que esté afectando directamente a una especie.", text: "Identificar un factor que esté afectando directamente a una especie.", indicator: "relacion_directa" },
          { value: "B", key: "B", id: "B", label: "Reconstruir cómo ese cambio puede producir una sucesión de consecuencias.", text: "Reconstruir cómo ese cambio puede producir una sucesión de consecuencias.", indicator: "cadena_causal" },
          { value: "C", key: "C", id: "C", label: "Analizar las interacciones entre especies, territorio y recursos.", text: "Analizar las interacciones entre especies, territorio y recursos.", indicator: "interdependencia" },
          { value: "D", key: "D", id: "D", label: "Buscar mecanismos mediante los cuales los cambios producidos puedan reforzarse o compensarse.", text: "Buscar mecanismos mediante los cuales los cambios producidos puedan reforzarse o compensarse.", indicator: "retroalimentacion" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "sentidos",
    title: "Cambiar la representación cuando algo no funciona",
    dimension: "cambio_representacion",
    phase: "cambio_representacion",
    indicators: ["reexplicacion", "ejemplo", "representacion_visual", "reorganizacion"],
    questions: [
      {
        id: "sentidos-Q1",
        questionId: "sentidos-Q1",
        text: "Una explicación escrita no te permite entender un fenómeno.",
        question: "Una explicación escrita no te permite entender un fenómeno.",
        prompt: "Una explicación escrita no te permite entender un fenómeno.",
        domain: "ciencia",
        phase: "cambio_representacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Pedir que la explicación sea expresada con palabras más sencillas.", text: "Pedir que la explicación sea expresada con palabras más sencillas.", indicator: "reexplicacion" },
          { value: "B", key: "B", id: "B", label: "Buscar un caso concreto que muestre el fenómeno.", text: "Buscar un caso concreto que muestre el fenómeno.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Representar visualmente cómo se relacionan sus partes.", text: "Representar visualmente cómo se relacionan sus partes.", indicator: "representacion_visual" },
          { value: "D", key: "D", id: "D", label: "Reordenar la explicación comenzando por la idea central y después sus componentes.", text: "Reordenar la explicación comenzando por la idea central y después sus componentes.", indicator: "reorganizacion" }
        ]
      },
      {
        id: "sentidos-Q2",
        questionId: "sentidos-Q2",
        text: "Una explicación sobre una revolución te resulta confusa.",
        question: "Una explicación sobre una revolución te resulta confusa.",
        prompt: "Una explicación sobre una revolución te resulta confusa.",
        domain: "historia",
        phase: "cambio_representacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar un episodio concreto que permita verla en acción.", text: "Buscar un episodio concreto que permita verla en acción.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Reorganizar la información separando causas, acontecimientos y consecuencias.", text: "Reorganizar la información separando causas, acontecimientos y consecuencias.", indicator: "reorganizacion" },
          { value: "C", key: "C", id: "C", label: "Pedir una explicación utilizando palabras más directas.", text: "Pedir una explicación utilizando palabras más directas.", indicator: "reexplicacion" },
          { value: "D", key: "D", id: "D", label: "Representar visualmente los actores y sus relaciones.", text: "Representar visualmente los actores y sus relaciones.", indicator: "representacion_visual" }
        ]
      },
      {
        id: "sentidos-Q3",
        questionId: "sentidos-Q3",
        text: "No entiendes cómo se conectan varios componentes de un sistema.",
        question: "No entiendes cómo se conectan varios componentes de un sistema.",
        prompt: "No entiendes cómo se conectan varios componentes de un sistema.",
        domain: "tecnologia",
        phase: "cambio_representacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Pedir una explicación verbal más sencilla.", text: "Pedir una explicación verbal más sencilla.", indicator: "reexplicacion" },
          { value: "B", key: "B", id: "B", label: "Buscar un ejemplo concreto de un sistema funcionando.", text: "Buscar un ejemplo concreto de un sistema funcionando.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Dibujar las conexiones entre los componentes.", text: "Dibujar las conexiones entre los componentes.", indicator: "representacion_visual" },
          { value: "D", key: "D", id: "D", label: "Reorganizar el sistema por funciones para entender qué papel cumple cada parte.", text: "Reorganizar el sistema por funciones para entender qué papel cumple cada parte.", indicator: "reorganizacion" }
        ]
      },
      {
        id: "sentidos-Q4",
        questionId: "sentidos-Q4",
        text: "Un argumento te resulta difícil de seguir.",
        question: "Un argumento te resulta difícil de seguir.",
        prompt: "Un argumento te resulta difícil de seguir.",
        domain: "filosofia",
        phase: "cambio_representacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar un caso cotidiano que permita observar la misma estructura.", text: "Buscar un caso cotidiano que permita observar la misma estructura.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Ordenar las premisas y la conclusión según su dependencia.", text: "Ordenar las premisas y la conclusión según su dependencia.", indicator: "reorganizacion" },
          { value: "C", key: "C", id: "C", label: "Representar visualmente cómo las premisas conducen a la conclusión.", text: "Representar visualmente cómo las premisas conducen a la conclusión.", indicator: "representacion_visual" },
          { value: "D", key: "D", id: "D", label: "Reformular el argumento con palabras más sencillas.", text: "Reformular el argumento con palabras más sencillas.", indicator: "reexplicacion" }
        ]
      },
      {
        id: "sentidos-Q5",
        questionId: "sentidos-Q5",
        text: "Después de varias explicaciones sigues sin comprender un concepto.",
        question: "Después de varias explicaciones sigues sin comprender un concepto.",
        prompt: "Después de varias explicaciones sigues sin comprender un concepto.",
        domain: "aprendizaje",
        phase: "cambio_representacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Pedir una reformulación verbal más sencilla.", text: "Pedir una reformulación verbal más sencilla.", indicator: "reexplicacion" },
          { value: "B", key: "B", id: "B", label: "Buscar una situación concreta donde el concepto pueda observarse.", text: "Buscar una situación concreta donde el concepto pueda observarse.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Representar visualmente sus elementos y relaciones.", text: "Representar visualmente sus elementos y relaciones.", indicator: "representacion_visual" },
          { value: "D", key: "D", id: "D", label: "Cambiar el orden de la explicación para reconstruirla desde otra estructura.", text: "Cambiar el orden de la explicación para reconstruirla desde otra estructura.", indicator: "reorganizacion" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "escalando",
    title: "Regular el nivel de abstracción",
    dimension: "abstraccion",
    phase: "abstraccion",
    indicators: ["concreto", "patron", "principio", "panorama_global"],
    questions: [
      {
        id: "escalando-Q1",
        questionId: "escalando-Q1",
        text: "Quieres entender por qué determinadas especies prosperan en un ambiente y otras desaparecen.",
        question: "Quieres entender por qué determinadas especies prosperan en un ambiente y otras desaparecen.",
        prompt: "Quieres entender por qué determinadas especies prosperan en un ambiente y otras desaparecen.",
        domain: "naturaleza",
        phase: "abstraccion",
        options: [
          { value: "A", key: "A", id: "A", label: "Comenzar por un caso concreto de una especie.", text: "Comenzar por un caso concreto de una especie.", indicator: "concreto" },
          { value: "B", key: "B", id: "B", label: "Comparar varios casos para encontrar un patrón.", text: "Comparar varios casos para encontrar un patrón.", indicator: "patron" },
          { value: "C", key: "C", id: "C", label: "Buscar el principio general que permita explicar los casos.", text: "Buscar el principio general que permita explicar los casos.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Comenzar observando el funcionamiento general del ecosistema antes de estudiar especies concretas.", text: "Comenzar observando el funcionamiento general del ecosistema antes de estudiar especies concretas.", indicator: "panorama_global" }
        ]
      },
      {
        id: "escalando-Q2",
        questionId: "escalando-Q2",
        text: "Quieres entender por qué cambia el precio de ciertos productos.",
        question: "Quieres entender por qué cambia el precio de ciertos productos.",
        prompt: "Quieres entender por qué cambia el precio de ciertos productos.",
        domain: "economia",
        phase: "abstraccion",
        options: [
          { value: "A", key: "A", id: "A", label: "Comenzar observando el precio de un producto concreto.", text: "Comenzar observando el precio de un producto concreto.", indicator: "concreto" },
          { value: "B", key: "B", id: "B", label: "Comparar varios productos y períodos para encontrar patrones.", text: "Comparar varios productos y períodos para encontrar patrones.", indicator: "patron" },
          { value: "C", key: "C", id: "C", label: "Buscar el concepto económico general que permita explicarlos.", text: "Buscar el concepto económico general que permita explicarlos.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Comenzar por la situación económica general y después bajar hacia los productos.", text: "Comenzar por la situación económica general y después bajar hacia los productos.", indicator: "panorama_global" }
        ]
      },
      {
        id: "escalando-Q3",
        questionId: "escalando-Q3",
        text: "Quieres comprender una relación matemática nueva.",
        question: "Quieres comprender una relación matemática nueva.",
        prompt: "Quieres comprender una relación matemática nueva.",
        domain: "matematicas",
        phase: "abstraccion",
        options: [
          { value: "A", key: "A", id: "A", label: "Empezar calculando algunos valores concretos.", text: "Empezar calculando algunos valores concretos.", indicator: "concreto" },
          { value: "B", key: "B", id: "B", label: "Observar cómo cambia la relación entre distintos valores.", text: "Observar cómo cambia la relación entre distintos valores.", indicator: "patron" },
          { value: "C", key: "C", id: "C", label: "Buscar la formulación general que representa esa relación.", text: "Buscar la formulación general que representa esa relación.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Comenzar comprendiendo qué representa la relación completa antes de revisar casos particulares.", text: "Comenzar comprendiendo qué representa la relación completa antes de revisar casos particulares.", indicator: "panorama_global" }
        ]
      },
      {
        id: "escalando-Q4",
        questionId: "escalando-Q4",
        text: "Quieres analizar los efectos de una nueva política.",
        question: "Quieres analizar los efectos de una nueva política.",
        prompt: "Quieres analizar los efectos de una nueva política.",
        domain: "politica_publica",
        phase: "abstraccion",
        options: [
          { value: "A", key: "A", id: "A", label: "Comenzar estudiando cómo afecta a una persona concreta.", text: "Comenzar estudiando cómo afecta a una persona concreta.", indicator: "concreto" },
          { value: "B", key: "B", id: "B", label: "Comparar sus efectos sobre distintos grupos para detectar patrones.", text: "Comparar sus efectos sobre distintos grupos para detectar patrones.", indicator: "patron" },
          { value: "C", key: "C", id: "C", label: "Buscar un modelo general que permita explicar sus efectos.", text: "Buscar un modelo general que permita explicar sus efectos.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Comenzar examinando el impacto global sobre el país y luego bajar hacia grupos e individuos.", text: "Comenzar examinando el impacto global sobre el país y luego bajar hacia grupos e individuos.", indicator: "panorama_global" }
        ]
      },
      {
        id: "escalando-Q5",
        questionId: "escalando-Q5",
        text: "Quieres entender el cambio de una sociedad a lo largo de varias décadas.",
        question: "Quieres entender el cambio de una sociedad a lo largo de varias décadas.",
        prompt: "Quieres entender el cambio de una sociedad a lo largo de varias décadas.",
        domain: "historia",
        phase: "abstraccion",
        options: [
          { value: "A", key: "A", id: "A", label: "Comenzar por un acontecimiento concreto.", text: "Comenzar por un acontecimiento concreto.", indicator: "concreto" },
          { value: "B", key: "B", id: "B", label: "Comparar distintos períodos para encontrar patrones.", text: "Comparar distintos períodos para encontrar patrones.", indicator: "patron" },
          { value: "C", key: "C", id: "C", label: "Formular una explicación general del proceso histórico.", text: "Formular una explicación general del proceso histórico.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Comenzar observando la transformación global de la sociedad antes de estudiar acontecimientos particulares.", text: "Comenzar observando la transformación global de la sociedad antes de estudiar acontecimientos particulares.", indicator: "panorama_global" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "secuencia",
    title: "Reparar una comprensión incompleta",
    dimension: "reparacion",
    phase: "reparacion",
    indicators: ["retroceso", "aislamiento_error", "pregunta_diagnostica", "reconstruccion"],
    questions: [
      {
        id: "secuencia-Q1",
        questionId: "secuencia-Q1",
        text: "Un resultado experimental no coincide con lo esperado.",
        question: "Un resultado experimental no coincide con lo esperado.",
        prompt: "Un resultado experimental no coincide con lo esperado.",
        domain: "ciencia",
        phase: "reparacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Volver al último punto que sabes que funcionaba.", text: "Volver al último punto que sabes que funcionaba.", indicator: "retroceso" },
          { value: "B", key: "B", id: "B", label: "Intentar localizar exactamente en qué paso aparece la discrepancia.", text: "Intentar localizar exactamente en qué paso aparece la discrepancia.", indicator: "aislamiento_error" },
          { value: "C", key: "C", id: "C", label: "Formular una pregunta específica sobre la condición que podría explicarla.", text: "Formular una pregunta específica sobre la condición que podría explicarla.", indicator: "pregunta_diagnostica" },
          { value: "D", key: "D", id: "D", label: "Reconstruir la explicación desde sus supuestos iniciales.", text: "Reconstruir la explicación desde sus supuestos iniciales.", indicator: "reconstruccion" }
        ]
      },
      {
        id: "secuencia-Q2",
        questionId: "secuencia-Q2",
        text: "Dos fuentes históricas parecen contradecirse.",
        question: "Dos fuentes históricas parecen contradecirse.",
        prompt: "Dos fuentes históricas parecen contradecirse.",
        domain: "historia",
        phase: "reparacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Revisar desde qué premisas partía cada explicación.", text: "Revisar desde qué premisas partía cada explicación.", indicator: "reconstruccion" },
          { value: "B", key: "B", id: "B", label: "Buscar exactamente qué afirmación produce la contradicción.", text: "Buscar exactamente qué afirmación produce la contradicción.", indicator: "aislamiento_error" },
          { value: "C", key: "C", id: "C", label: "Preguntar qué información falta para poder resolverla.", text: "Preguntar qué información falta para poder resolverla.", indicator: "pregunta_diagnostica" },
          { value: "D", key: "D", id: "D", label: "Reconstruir el problema desde una perspectiva diferente.", text: "Reconstruir el problema desde una perspectiva diferente.", indicator: "retroceso" }
        ]
      },
      {
        id: "secuencia-Q3",
        questionId: "secuencia-Q3",
        text: "Una aplicación deja de funcionar después de un cambio.",
        question: "Una aplicación deja de funcionar después de un cambio.",
        prompt: "Una aplicación deja de funcionar después de un cambio.",
        domain: "tecnologia",
        phase: "reparacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Volver a la última configuración que funcionaba.", text: "Volver a la última configuración que funcionaba.", indicator: "retroceso" },
          { value: "B", key: "B", id: "B", label: "Identificar qué modificación concreta pudo producir el fallo.", text: "Identificar qué modificación concreta pudo producir el fallo.", indicator: "aislamiento_error" },
          { value: "C", key: "C", id: "C", label: "Preguntar qué condición específica podría explicar el comportamiento.", text: "Preguntar qué condición específica podría explicar el comportamiento.", indicator: "pregunta_diagnostica" },
          { value: "D", key: "D", id: "D", label: "Reconstruir el funcionamiento del sistema desde sus componentes básicos.", text: "Reconstruir el funcionamiento del sistema desde sus componentes básicos.", indicator: "reconstruccion" }
        ]
      },
      {
        id: "secuencia-Q4",
        questionId: "secuencia-Q4",
        text: "La conclusión de un razonamiento parece no seguir de sus premisas.",
        question: "La conclusión de un razonamiento parece no seguir de sus premisas.",
        prompt: "La conclusión de un razonamiento parece no seguir de sus premisas.",
        domain: "argumentacion",
        phase: "reparacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Revisar nuevamente las premisas iniciales.", text: "Revisar nuevamente las premisas iniciales.", indicator: "retroceso" },
          { value: "B", key: "B", id: "B", label: "Localizar exactamente dónde aparece el salto lógico.", text: "Localizar exactamente dónde aparece el salto lógico.", indicator: "aislamiento_error" },
          { value: "C", key: "C", id: "C", label: "Preguntar qué justificación falta para conectar ambas partes.", text: "Preguntar qué justificación falta para conectar ambas partes.", indicator: "pregunta_diagnostica" },
          { value: "D", key: "D", id: "D", label: "Reconstruir el argumento desde el principio.", text: "Reconstruir el argumento desde el principio.", indicator: "reconstruccion" }
        ]
      },
      {
        id: "secuencia-Q5",
        questionId: "secuencia-Q5",
        text: "Después de estudiar un concepto, descubres que una parte de tu explicación no funciona.",
        question: "Después de estudiar un concepto, descubres que una parte de tu explicación no funciona.",
        prompt: "Después de estudiar un concepto, descubres que una parte de tu explicación no funciona.",
        domain: "aprendizaje",
        phase: "reparacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Volver al último punto que comprendías con seguridad.", text: "Volver al último punto que comprendías con seguridad.", indicator: "retroceso" },
          { value: "B", key: "B", id: "B", label: "Identificar exactamente qué parte dejó de encajar.", text: "Identificar exactamente qué parte dejó de encajar.", indicator: "aislamiento_error" },
          { value: "C", key: "C", id: "C", label: "Formular una pregunta concreta sobre aquello que todavía no comprendes.", text: "Formular una pregunta concreta sobre aquello que todavía no comprendes.", indicator: "pregunta_diagnostica" },
          { value: "D", key: "D", id: "D", label: "Reconstruir la explicación desde sus fundamentos.", text: "Reconstruir la explicación desde sus fundamentos.", indicator: "reconstruccion" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "andamio",
    title: "Comprobar si realmente entendiste",
    dimension: "verificacion",
    phase: "verificacion",
    indicators: ["explicacion", "aplicacion", "transferencia", "contraste"],
    questions: [
      {
        id: "andamio-Q1",
        questionId: "andamio-Q1",
        text: "Crees haber entendido por qué una civilización entró en crisis.",
        question: "Crees haber entendido por qué una civilización entró en crisis.",
        prompt: "Crees haber entendido por qué una civilización entró en crisis.",
        domain: "historia",
        phase: "verificacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Intentar explicarlo con tus propias palabras sin consultar el material.", text: "Intentar explicarlo con tus propias palabras sin consultar el material.", indicator: "explicacion" },
          { value: "B", key: "B", id: "B", label: "Aplicar la explicación a un caso concreto de esa misma sociedad.", text: "Aplicar la explicación a un caso concreto de esa misma sociedad.", indicator: "aplicacion" },
          { value: "C", key: "C", id: "C", label: "Buscar otro caso histórico donde comprobar si la explicación también sirve.", text: "Buscar otro caso histórico donde comprobar si la explicación también sirve.", indicator: "transferencia" },
          { value: "D", key: "D", id: "D", label: "Intentar defender una explicación alternativa y comprobar si puedes responder a sus argumentos.", text: "Intentar defender una explicación alternativa y comprobar si puedes responder a sus argumentos.", indicator: "contraste" }
        ]
      },
      {
        id: "andamio-Q2",
        questionId: "andamio-Q2",
        text: "Crees haber comprendido un principio físico.",
        question: "Crees haber comprendido un principio físico.",
        prompt: "Crees haber comprendido un principio físico.",
        domain: "fisica",
        phase: "verificacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Utilizarlo para resolver un problema nuevo.", text: "Utilizarlo para resolver un problema nuevo.", indicator: "aplicacion" },
          { value: "B", key: "B", id: "B", label: "Explicarlo con tus propias palabras.", text: "Explicarlo con tus propias palabras.", indicator: "explicacion" },
          { value: "C", key: "C", id: "C", label: "Compararlo con un fenómeno diferente para comprobar si puedes reconocer la misma estructura.", text: "Compararlo con un fenómeno diferente para comprobar si puedes reconocer la misma estructura.", indicator: "transferencia" },
          { value: "D", key: "D", id: "D", label: "Buscar un caso que parezca contradecirlo y determinar si realmente lo contradice.", text: "Buscar un caso que parezca contradecirlo y determinar si realmente lo contradice.", indicator: "contraste" }
        ]
      },
      {
        id: "andamio-Q3",
        questionId: "andamio-Q3",
        text: "Crees haber entendido un argumento.",
        question: "Crees haber entendido un argumento.",
        prompt: "Crees haber entendido un argumento.",
        domain: "filosofia",
        phase: "verificacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Reconstruirlo con tus propias palabras.", text: "Reconstruirlo con tus propias palabras.", indicator: "explicacion" },
          { value: "B", key: "B", id: "B", label: "Utilizarlo para analizar un caso diferente.", text: "Utilizarlo para analizar un caso diferente.", indicator: "aplicacion" },
          { value: "C", key: "C", id: "C", label: "Compararlo con otro problema para comprobar si la estructura se mantiene.", text: "Compararlo con otro problema para comprobar si la estructura se mantiene.", indicator: "transferencia" },
          { value: "D", key: "D", id: "D", label: "Intentar defender una posición contraria y comprobar si puedes responderla.", text: "Intentar defender una posición contraria y comprobar si puedes responderla.", indicator: "contraste" }
        ]
      },
      {
        id: "andamio-Q4",
        questionId: "andamio-Q4",
        text: "Crees haber entendido cómo funciona una herramienta.",
        question: "Crees haber entendido cómo funciona una herramienta.",
        prompt: "Crees haber entendido cómo funciona una herramienta.",
        domain: "tecnologia",
        phase: "verificacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Resolver una tarea nueva utilizando lo aprendido.", text: "Resolver una tarea nueva utilizando lo aprendido.", indicator: "aplicacion" },
          { value: "B", key: "B", id: "B", label: "Explicar su funcionamiento sin consultar instrucciones.", text: "Explicar su funcionamiento sin consultar instrucciones.", indicator: "explicacion" },
          { value: "C", key: "C", id: "C", label: "Intentar utilizar el mismo principio en una herramienta o contexto diferente.", text: "Intentar utilizar el mismo principio en una herramienta o contexto diferente.", indicator: "transferencia" },
          { value: "D", key: "D", id: "D", label: "Buscar una situación que parezca no encajar y averiguar si realmente invalida la explicación.", text: "Buscar una situación que parezca no encajar y averiguar si realmente invalida la explicación.", indicator: "contraste" }
        ]
      },
      {
        id: "andamio-Q5",
        questionId: "andamio-Q5",
        text: "Crees haber entendido una explicación científica.",
        question: "Crees haber entendido una explicación científica.",
        prompt: "Crees haber entendido una explicación científica.",
        domain: "ciencia",
        phase: "verificacion",
        options: [
          { value: "A", key: "A", id: "A", label: "Explicarla de manera independiente.", text: "Explicarla de manera independiente.", indicator: "explicacion" },
          { value: "B", key: "B", id: "B", label: "Utilizarla para interpretar un caso nuevo.", text: "Utilizarla para interpretar un caso nuevo.", indicator: "aplicacion" },
          { value: "C", key: "C", id: "C", label: "Examinar si permite comprender un fenómeno diferente.", text: "Examinar si permite comprender un fenómeno diferente.", indicator: "transferencia" },
          { value: "D", key: "D", id: "D", label: "Buscar deliberadamente un caso aparentemente contrario y comprobar qué ocurre.", text: "Buscar deliberadamente un caso aparentemente contrario y comprobar qué ocurre.", indicator: "contraste" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  },
  {
    id: "navegando",
    title: "Elegir una estrategia ante un problema nuevo",
    dimension: "problema_nuevo",
    phase: "problema_nuevo",
    indicators: ["descomposicion", "experimentacion", "relaciones", "alternativas"],
    questions: [
      {
        id: "navegando-Q1",
        questionId: "navegando-Q1",
        text: "Un dispositivo deja de funcionar y no sabes por qué.",
        question: "Un dispositivo deja de funcionar y no sabes por qué.",
        prompt: "Un dispositivo deja de funcionar y no sabes por qué.",
        domain: "tecnologia",
        phase: "problema_nuevo",
        options: [
          { value: "A", key: "A", id: "A", label: "Separar el problema en componentes y revisar cada uno.", text: "Separar el problema en componentes y revisar cada uno.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Cambiar una condición concreta y observar qué ocurre.", text: "Cambiar una condición concreta y observar qué ocurre.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Analizar cómo interactúan los distintos componentes.", text: "Analizar cómo interactúan los distintos componentes.", indicator: "relaciones" },
          { value: "D", key: "D", id: "D", label: "Formular varias explicaciones posibles antes de intervenir.", text: "Formular varias explicaciones posibles antes de intervenir.", indicator: "alternativas" }
        ]
      },
      {
        id: "navegando-Q2",
        questionId: "navegando-Q2",
        text: "Dos grupos mantienen un conflicto que no parece tener una causa única.",
        question: "Dos grupos mantienen un conflicto que no parece tener una causa única.",
        prompt: "Dos grupos mantienen un conflicto que no parece tener una causa única.",
        domain: "conflicto_social",
        phase: "problema_nuevo",
        options: [
          { value: "A", key: "A", id: "A", label: "Separar el problema en aspectos distintos.", text: "Separar el problema en aspectos distintos.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Realizar una pequeña intervención y observar la respuesta.", text: "Realizar una pequeña intervención y observar la respuesta.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Mapear las relaciones entre los grupos y los factores involucrados.", text: "Mapear las relaciones entre los grupos y los factores involucrados.", indicator: "relaciones" },
          { value: "D", key: "D", id: "D", label: "Formular varias interpretaciones posibles antes de decidir cuál investigar.", text: "Formular varias interpretaciones posibles antes de decidir cuál investigar.", indicator: "alternativas" }
        ]
      },
      {
        id: "navegando-Q3",
        questionId: "navegando-Q3",
        text: "Tienes que organizar una actividad con pocos recursos.",
        question: "Tienes que organizar una actividad con pocos recursos.",
        prompt: "Tienes que organizar una actividad con pocos recursos.",
        domain: "organizacion",
        phase: "problema_nuevo",
        options: [
          { value: "A", key: "A", id: "A", label: "Dividirla en tareas independientes.", text: "Dividirla en tareas independientes.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Probar una versión pequeña antes de organizarla completamente.", text: "Probar una versión pequeña antes de organizarla completamente.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Analizar las dependencias entre recursos, tareas y participantes.", text: "Analizar las dependencias entre recursos, tareas y participantes.", indicator: "relaciones" },
          { value: "D", key: "D", id: "D", label: "Generar varias formas posibles de organizarla y compararlas.", text: "Generar varias formas posibles de organizarla y compararlas.", indicator: "alternativas" }
        ]
      },
      {
        id: "navegando-Q4",
        questionId: "navegando-Q4",
        text: "Observas un fenómeno que no puedes explicar.",
        question: "Observas un fenómeno que no puedes explicar.",
        prompt: "Observas un fenómeno que no puedes explicar.",
        domain: "investigacion",
        phase: "problema_nuevo",
        options: [
          { value: "A", key: "A", id: "A", label: "Separar las variables o componentes involucrados.", text: "Separar las variables o componentes involucrados.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Realizar una observación o prueba que permita distinguir entre posibilidades.", text: "Realizar una observación o prueba que permita distinguir entre posibilidades.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Construir un mapa de relaciones entre los factores.", text: "Construir un mapa de relaciones entre los factores.", indicator: "relaciones" },
          { value: "D", key: "D", id: "D", label: "Generar varias explicaciones posibles antes de escoger una.", text: "Generar varias explicaciones posibles antes de escoger una.", indicator: "alternativas" }
        ]
      },
      {
        id: "navegando-Q5",
        questionId: "navegando-Q5",
        text: "Una solución habitual deja de funcionar y no sabes por qué.",
        question: "Una solución habitual deja de funcionar y no sabes por qué.",
        prompt: "Una solución habitual deja de funcionar y no sabes por qué.",
        domain: "problema_cotidiano",
        phase: "problema_nuevo",
        options: [
          { value: "A", key: "A", id: "A", label: "Dividir el problema en partes para localizar dónde está la dificultad.", text: "Dividir el problema en partes para localizar dónde está la dificultad.", indicator: "descomposicion" },
          { value: "B", key: "B", id: "B", label: "Modificar una sola condición y observar el resultado.", text: "Modificar una sola condición y observar el resultado.", indicator: "experimentacion" },
          { value: "C", key: "C", id: "C", label: "Examinar cómo se relacionan entre sí los elementos del problema.", text: "Examinar cómo se relacionan entre sí los elementos del problema.", indicator: "relaciones" },
          { value: "D", key: "D", id: "D", label: "Generar varias posibles explicaciones y soluciones antes de actuar.", text: "Generar varias posibles explicaciones y soluciones antes de actuar.", indicator: "alternativas" }
        ]
      }
    ],
    compute(answers) {
      const counts = {};
      this.indicators.forEach((indicator) => { counts[indicator] = 0; });
      this.questions.forEach((question) => {
        const answer = answers && answers[question.id];
        const option = question.options.find((item) => item.value === answer || item.key === answer || item.id === answer);
        if (option && counts[option.indicator] !== undefined) {
          counts[option.indicator] += 1;
        }
      });
      return counts;
    }
  }
];

const MT_FINAL_MESSAGE = `Gracias por dedicar este tiempo. Ahora Rey Filósofo conoce un poco mejor tu forma de aprender y podrá acompañarte con explicaciones, ejemplos y preguntas más afines a vos. Cada pequeño paso que diste aquí ayuda a que tu camino de formación cívica sea más personalizado. Podés continuar cuando quieras, retomar más adelante o simplemente dejarlo así; el tutor siempre estará listo para acompañarte.`;

const MT_ENGINE = {
  profile: { completed: {}, variables: {} },
  activeId: null,
  stepIndex: 0,
  answers: {},
  showFinalMessage: false,

  getTest(id) { return MICROTESTS.find(t => t.id === id); },

  isCompleted(id) { return !!this.profile.completed[id]; },

  allCompleted() { return MICROTESTS.every(t => this.isCompleted(t.id)); },

  async hydrate() {
    try {
      if (
        typeof LearningProfileService === 'undefined' ||
        typeof LearningProfileService.getFullContext !== 'function'
      ) {
        throw new Error('LearningProfileService no está disponible.');
      }

      if (
        typeof LearningProfileService.refresh === 'function'
      ) {
        LearningProfileService.refresh();
      }

      const context =
        await LearningProfileService.getFullContext();

      const completed =
        context && Array.isArray(context.completedTests)
          ? context.completedTests
          : [];

      this.profile.completed = {};

      completed.forEach(function(testId) {
        this.profile.completed[testId] = true;
      }, this);

      this.profile.variables =
        context &&
        context.profile &&
        context.profile.raw_variables
          ? context.profile.raw_variables
          : {};

      this.refresh();

    } catch (error) {
      console.error(
        '[MT_ENGINE] Error cargando perfil de microtests:',
        error
      );

      const root = document.getElementById('mtRoot');

      if (root) {
        const panel = document.createElement('div');
        panel.className = 'mt-done-panel';

        const text = document.createElement('p');
        text.className = 'mt-done-text';
        text.textContent =
          'No fue posible cargar tu Perfil de Aprendizaje. ' +
          'Intenta nuevamente en unos instantes.';

        panel.appendChild(text);
        root.innerHTML = '';
        root.appendChild(panel);
      }
    }
  },

  openTest(id) {
    this.activeId = id;
    this.stepIndex = 0;
    this.answers = {};
    this.showFinalMessage = false;
    this.refresh();
  },

  backToList() {
    this.activeId = null;
    this.showFinalMessage = false;
    this.refresh();
  },

    toggleOption(qid, optId) {
      const test = this.getTest(this.activeId);
      if (!test) return;

      const q = test.questions[this.stepIndex];
      if (!q) return;

      this.answers[qid] = optId;
      this.refresh();
    },

    canContinue() {
      const test = this.getTest(this.activeId);
      if (!test) return false;

      const q = test.questions[this.stepIndex];
      if (!q) return false;

      const answer = this.answers[q.id];
      return answer !== undefined && answer !== null && answer !== "";
    },

  async nextStep() {
    const test = this.getTest(this.activeId);

    if (this.stepIndex < test.questions.length - 1) {
      this.stepIndex++;
      this.refresh();
    } else {
      await this.finishTest();
    }
  },
  async finishTest() {
    const test = this.getTest(this.activeId);
    const variables = test.compute(this.answers) || {};
    const answers = JSON.parse(JSON.stringify(this.answers));

    // Cada realización del microtest constituye un intento independiente.
    // El fallback existe para navegadores donde randomUUID no esté disponible.
    const attemptId =
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : `mt-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

    const timestamp = new Date().toISOString();

    // Cada respuesta genera evidencia contextual.
    const evidence = test.questions.map((question) => {
      const answer = answers[question.id];
      const option = question.options.find(
        (item) =>
          item.value === answer ||
          item.key === answer ||
          item.id === answer
      );

      return {
        testId: test.id,
        version: 'beta-1.0',
        attemptId,
        questionId: question.id,
        indicator: option ? option.indicator : null,
        phase: question.phase || test.phase || test.dimension,
        domain: question.domain || null,
        answer: answer !== undefined ? answer : null,
        timestamp
      };
    });

    const attempt = {
      testId: test.id,
      version: 'beta-1.0',
      attemptId,
      timestamp,
      phase: test.phase || test.dimension,
      domain: null,
      answers,
      variables,
      evidence
    };

    try {
      if (
        typeof MicrotestService === 'undefined' ||
        typeof MicrotestService.save !== 'function'
      ) {
        throw new Error('MicrotestService no está disponible.');
      }

      // La persistencia real ocurre primero.
      // El microtest solo queda completado si el backend confirma el guardado.
      await MicrotestService.save(test.id, answers, variables, attempt);

      // Actualización local del estado del motor.
      this.profile.completed[test.id] = true;
      this.profile.variables = {
        ...this.profile.variables,
        ...variables
      };

      // Invalidar el contexto pedagógico para que la nueva evidencia
      // pueda modificar la estrategia cognitiva.
      if (
        typeof LearningProfileService !== 'undefined' &&
        typeof LearningProfileService.refresh === 'function'
      ) {
        LearningProfileService.refresh();
      }

      // Regenerar la estrategia cognitiva con la nueva evidencia.
      if (
        typeof CognitiveRuntime !== 'undefined' &&
        typeof CognitiveRuntime.refreshStrategy === 'function'
      ) {
        await CognitiveRuntime.refreshStrategy();
      }

      if (typeof updateCognitiveInfo === 'function') {
        updateCognitiveInfo();
      }

      if (this.allCompleted()) {
        this.activeId = null;
        this.showFinalMessage = true;
      } else {
        this.activeId = '__done__' + test.id;
      }

      this.refresh();

    } catch (error) {
      console.error(
        `Error guardando microtest '${test.id}':`,
        error
      );

      // Importante: si el backend no confirmó el guardado,
      // el microtest no se considera completado localmente.
      throw error;
    }
  },

  nextPendingTest() {
    return MICROTESTS.find(t => !this.isCompleted(t.id));
  },

  refresh() {
    const root = document.getElementById('mtRoot');
    if (!root) return;
    root.innerHTML = this.render();
    this.bind(root);
  },

  render() {
    if (this.showFinalMessage) return this.renderFinal();
    if (this.activeId && this.activeId.startsWith('__done__')) return this.renderStepDone();
    if (this.activeId) return this.renderQuestion();
    return this.renderList();
  },

    renderList() {
      const cards = MICROTESTS.map((t, index) => {
        const done = this.isCompleted(t.id);

        return `
          <div class="mt-card ${done ? 'mt-card--done' : ''}" data-test-id="${t.id}">
            <div class="mt-card-num">${String(index + 1).padStart(2, '0')}</div>
            <div class="mt-card-body">
              <div class="mt-card-title">${t.title}</div>
            </div>
            <div class="mt-card-status ${done ? 'mt-status--done' : ''}">
              ${done ? '✓ Completado' : 'Sin iniciar'}
            </div>
          </div>`;
      }).join('');

      return `
        <p class="mt-intro">
          Estas actividades cortas ayudan al Rey Filósofo a comprender cómo aprendés.
          Son completamente <strong>opcionales</strong>: podés hacer una, varias,
          todas, o ninguna. Nunca vas a ver puntuaciones ni comparaciones.
        </p>
        <div class="mt-list">${cards}</div>
      `;
    },

    renderQuestion() {
      const test = this.getTest(this.activeId);
      if (!test) return '';

      const q = test.questions[this.stepIndex];
      if (!q) return '';

      const selected = this.answers[q.id];

      const optionsHtml = q.options.map(opt => {
        const active = selected === opt.id;

        return `
          <button
            type="button"
            class="mt-option ${active ? 'mt-option--selected' : ''}"
            data-qid="${q.id}"
            data-opt="${opt.id}">
            <span>${opt.label}</span>
          </button>`;
      }).join('');

      return `
        <button
          type="button"
          class="mt-back"
          data-action="back-to-list">
          ← Volver a Perfil de Aprendizaje
        </button>

        <div class="mt-eyebrow">
          Microtest · ${test.title}
        </div>

        <div class="mt-progress">
          Pregunta ${this.stepIndex + 1} de ${test.questions.length}
        </div>

        <div class="mt-prompt">${q.prompt}</div>

        <div class="mt-options">${optionsHtml}</div>

        <div class="mt-actions">
          <button
            type="button"
            class="mt-btn-continue"
            data-action="continue"
            ${this.canContinue() ? '' : 'disabled'}>
            ${this.stepIndex < test.questions.length - 1
              ? 'Continuar →'
              : 'Finalizar microtest →'}
          </button>
        </div>
      `;
    },

  renderStepDone() {
    const testId = this.activeId.replace('__done__', '');
    const test = this.getTest(testId);
    const next = this.nextPendingTest();
    return `
      <div class="mt-done-panel">
        <div class="mt-done-check">✓</div>
        <p class="mt-done-text">Listo. "${test.title}" quedó registrado — esto ayuda a que el Rey Filósofo afine tu acompañamiento.</p>
        <div class="mt-actions">
          <button type="button" class="mt-btn-continue" data-action="back-to-list">Volver a Perfil de Aprendizaje</button>
          ${next ? `<button type="button" class="mt-btn-secondary" data-action="open-test" data-test-id="${next.id}">Siguiente microtest →</button>` : ''}
        </div>
      </div>`;
  },

  renderFinal() {
    return `
      <div class="mt-done-panel">
        <div class="mt-done-check">🏛</div>
        <p class="mt-done-text">${MT_FINAL_MESSAGE}</p>
        <div class="mt-actions">
          <button type="button" class="mt-btn-continue" data-action="back-to-list">Ver Perfil de Aprendizaje</button>
        </div>
      </div>`;
  },

  bind(root) {
    root.querySelectorAll('.mt-card').forEach(card => {
      card.addEventListener('click', () => this.openTest(card.dataset.testId));
    });
    root.querySelectorAll('.mt-option').forEach(btn => {
      btn.addEventListener('click', () => this.toggleOption(btn.dataset.qid, btn.dataset.opt));
    });
    const backBtn = root.querySelector('[data-action="back-to-list"]');
    if (backBtn) backBtn.addEventListener('click', () => this.backToList());
    const continueBtn = root.querySelector('[data-action="continue"]');
    if (continueBtn) continueBtn.addEventListener('click', () => this.nextStep());
    const nextTestBtn = root.querySelector('[data-action="open-test"]');
    if (nextTestBtn) nextTestBtn.addEventListener('click', () => this.openTest(nextTestBtn.dataset.testId));
  }
};


function setupAuthView() {
  const root = document.getElementById('viewContent') ||
               document.querySelector('.document-content');

  if (!root) return;

  const user =
    window.LDIdentityProvider &&
    typeof LDIdentityProvider.getUser === 'function'
      ? LDIdentityProvider.getUser()
      : null;

  if (user) {
    renderAuthenticatedUser(root, user);
  } else {
    renderLoginForm(root);
  }
}

function renderLoginForm(root) {
  root.innerHTML = `
    <div class="view">
      <div class="view-eyebrow">Cuenta</div>
      <h1 class="view-title">Usuario</h1>

      <div class="view-body" style="max-width:520px;">
        <form id="authForm" style="display:flex;flex-direction:column;gap:14px;">

          <div id="authNameGroup" style="display:none;">
            <label for="authName">Usuario</label>
            <input
              id="authName"
              type="text"
              autocomplete="name"
              style="width:100%;box-sizing:border-box;padding:10px;margin-top:5px;"
            >
          </div>

          <div>
            <label for="authEmail">Correo electrónico</label>
            <input
              id="authEmail"
              type="email"
              autocomplete="email"
              required
              style="width:100%;box-sizing:border-box;padding:10px;margin-top:5px;"
            >
          </div>

          <div>
            <label for="authPassword">Contraseña</label>
            <input
              id="authPassword"
              type="password"
              autocomplete="current-password"
              required
              style="width:100%;box-sizing:border-box;padding:10px;margin-top:5px;"
            >
          </div>

          <button type="submit" id="authSubmit">
            Iniciar sesión
          </button>

          <button type="button" id="authToggle" style="background:transparent; border:none; color:inherit; cursor:pointer;">
            ¿No tienes cuenta? Crear cuenta
          </button>

          <button type="button" id="authGuest" style="background:transparent; border:none; color:inherit; cursor:pointer;">
            Continuar como invitado
          </button>

          <div id="authMessage" style="min-height:24px;"></div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('authForm');
  const nameGroup = document.getElementById('authNameGroup');
  const nameInput = document.getElementById('authName');
  const submit = document.getElementById('authSubmit');
  const toggle = document.getElementById('authToggle');
  const guest = document.getElementById('authGuest');
  const message = document.getElementById('authMessage');

  let registerMode = false;

  toggle.addEventListener('click', () => {
    registerMode = !registerMode;

    nameGroup.style.display = registerMode ? 'block' : 'none';
    nameInput.required = registerMode;

    submit.textContent = registerMode
      ? 'Crear cuenta'
      : 'Iniciar sesión';

    toggle.textContent = registerMode
      ? '¿Ya tienes cuenta? Iniciar sesión'
      : '¿No tienes cuenta? Crear cuenta';

    message.textContent = '';
  });

  guest.addEventListener('click', () => {
    if (window.LDIdentityProvider &&
        typeof LDIdentityProvider.clear === 'function') {
      LDIdentityProvider.clear();
    }

    updateAuthStatusLabel();
    renderLoginForm(root);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    message.textContent = 'Procesando...';
    submit.disabled = true;
    toggle.disabled = true;
    guest.disabled = true;

    try {
      if (!window.AuthService) {
        throw new Error('AuthService no está disponible.');
      }

      const email =
        document.getElementById('authEmail').value.trim();

      const password =
        document.getElementById('authPassword').value;

      let result;

      if (registerMode) {
        const name = nameInput.value.trim();

        if (!name) {
          throw new Error('Ingresa un usuario.');
        }

        const sessionId =
          window.LDIdentityProvider &&
          typeof LDIdentityProvider.getSessionId === 'function'
            ? LDIdentityProvider.getSessionId()
            : null;

        result = await AuthService.register(
          name,
          email,
          password,
          sessionId
        );
      } else {
        result = await AuthService.login(email, password);
      }

      const authenticatedUser =
        result && result.user
          ? result.user
          : (
              window.LDIdentityProvider &&
              typeof LDIdentityProvider.getUser === 'function'
                ? LDIdentityProvider.getUser()
                : null
            );

      updateAuthStatusLabel();
      renderAuthenticatedUser(root, authenticatedUser);

      if (window.CognitiveRuntime &&
          typeof CognitiveRuntime.refreshStrategy === 'function') {
        try {
          await CognitiveRuntime.refreshStrategy();
        } catch (error) {
          console.warn(
            'No se pudo refrescar la estrategia cognitiva:',
            error
          );
        }
      }

    } catch (error) {
      console.error('Error de autenticación:', error);

      message.textContent =
        error && error.message
          ? error.message
          : 'No fue posible completar la operación.';

      submit.disabled = false;
      toggle.disabled = false;
      guest.disabled = false;
    }
  });
}

function renderAuthenticatedUser(root, user) {
  const name =
    user && (user.name || user.username || user.email)
      ? (user.name || user.username || user.email)
      : 'Usuario';

  const email =
    user && user.email
      ? user.email
      : '';

  root.innerHTML = `
    <div class="view">
      <div class="view-eyebrow">Cuenta</div>
      <h1 class="view-title">Usuario</h1>

      <div class="view-body" style="max-width:520px;">
        <p><strong>Sesión iniciada.</strong></p>

        <p>
          Usuario:
          <strong>${escapeAuthHtml(name)}</strong>
        </p>

        ${email ? `
          <p>
            Correo electrónico:
            <strong>${escapeAuthHtml(email)}</strong>
          </p>
        ` : ''}

        <button type="button" id="authLogout">
          Cerrar sesión
        </button>
      </div>
    </div>
  `;

  const logout = document.getElementById('authLogout');

  if (logout) {
    logout.addEventListener('click', () => {
      if (window.AuthService &&
          typeof AuthService.logout === 'function') {
        AuthService.logout();
      } else if (
        window.LDIdentityProvider &&
        typeof LDIdentityProvider.clear === 'function'
      ) {
        LDIdentityProvider.clear();
      }

      updateAuthStatusLabel();
      renderLoginForm(root);
    });
  }

  updateAuthStatusLabel();
}

function escapeAuthHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateAuthStatusLabel() {
  const label = document.getElementById('lblUserSync');

  if (!label) return;

  const authenticated =
    window.LDIdentityProvider &&
    typeof LDIdentityProvider.getMode === 'function' &&
    LDIdentityProvider.getMode() === 'authenticated';

  label.textContent = authenticated
    ? 'Usuario: Autenticado'
    : 'Usuario: Invitado (Local)';
}

function navigateTo(viewName) {
    if (views[currentView] && views[currentView].onExit) {
      views[currentView].onExit();
    }

    currentView = viewName;
    renderView();

    if (views[currentView] && views[currentView].onEnter) {
      views[currentView].onEnter();
    }
    updateNavbarActiveState();
  }

  function renderView() {
    var view = views[currentView];
    if (view) {
      document.title = view.title;

      var viewTitle = document.getElementById('viewTitle');
      if (viewTitle) {
        viewTitle.textContent = view.title;
      }

      mainContent.innerHTML = view.render();
      updateCognitiveInfo();
    } else {
      console.error('Vista no encontrada:', currentView);
      document.title = 'Rey Filósofo - Error';

      var errorTitle = document.getElementById('viewTitle');
      if (errorTitle) {
        errorTitle.textContent = 'Rey Filósofo - Error';
      }

      mainContent.innerHTML = '<p>Error: Vista no encontrada.</p>';
    }
  }

  function updateNavbarActiveState() {
    navbarLinks.forEach(link => {
      if (link.dataset.view === currentView) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

var views = {
    usuario: {
      title: 'Usuario',
      render: function() {
        return '<div class="view"><div class="view-eyebrow">Cuenta</div><h1 class="view-title">Usuario</h1><p>Cargando...</p></div>';
      },
      onEnter: function() {
        setupAuthView();
      }
    },

    inicio: {
      title: 'Rey Filósofo — Tú eres el Rey Filósofo',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Tu espacio de aprendizaje</div>
            <h1 class="view-title">Rey Filósofo eres tú</h1>
            <div class="view-body">
              <p>El nombre viene de <strong>Platón</strong>. En <em>La República</em>, Platón imaginó al filósofo-rey: una persona cuya preparación para gobernar no se basaba simplemente en tener poder, sino en haber desarrollado la capacidad de conocer, comprender y examinar la realidad.</p>
              <p>LogoDemocracy toma esta idea y la transforma. No se trata de que unos pocos gobiernen a los demás. Se trata de que <strong>cada persona pueda convertirse en protagonista de su propia formación</strong>.</p>
              <p>Por eso, en LogoDemocracy, <strong>Rey Filósofo eres tú</strong>.</p>
              <p>Este es tu espacio personal de aprendizaje. Rey Filósofo no es una autoridad que decide qué debes pensar ni una máquina que intenta mantenerte conectado el mayor tiempo posible.</p>
              <p class="epistemic"><strong>No queremos capturar tu atención. Queremos devolvértela.</strong></p>
              <p>En una red social convencional, un algoritmo decide constantemente qué contenido mostrarte para mantener tu atención. Aquí ocurre lo contrario: <strong>tú decides qué quieres comprender y en qué quieres invertir tu tiempo y tu atención</strong>.</p>
              <p>Si, por ejemplo, quieres aprender sobre Fórmula 1, puedes decírselo al Rey Filósofo. Pero aprender no significa recibir instantáneamente un resumen generado por una IA. Primero necesita conocerte mejor: qué sabes, qué quieres comprender, qué aspectos te interesan y qué profundidad buscas. A partir de ese diálogo podrá ayudarte a construir una ruta de aprendizaje utilizando una <strong>biblioteca personal dentro de la Academia</strong>.</p>
              <p>Los documentos de la Academia mantienen una estructura común y familiar, diseñada para facilitar la lectura y la comprensión. <strong>Leer es parte esencial del proceso.</strong> LogoDemocracy no busca reemplazar la lectura por respuestas instantáneas, sino recuperar la lectura como una herramienta para comprender y pensar.</p>
              <p>La lógica es sencilla: <strong>leer → comprender → preguntar → pensar → volver al texto → comprender mejor</strong>.</p>
              <p>Cada biblioteca que construyes, cada tema que eliges, cada documento que lees y cada conversación que tienes aporta nueva información sobre tus intereses y sobre tu manera de aprender. Así se construye progresivamente un <strong>mapa de intereses</strong> y un <strong>perfil de aprendizaje</strong> que permite que Rey Filósofo adapte su acompañamiento a ti.</p>
              <p>El objetivo no es que la inteligencia artificial piense por ti. Es ayudarte a desarrollar, progresivamente, <strong>tu propia capacidad para comprender y pensar</strong>.</p>
              <p><strong>Tú eliges aquello que merece tu atención. Nosotros te ayudamos a comprenderlo.</strong></p>
            </div>
          </div>
        `;
      }
    },
    aprendizaje: {
      title: 'Rey Filósofo — Aprendizaje personalizado',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Tu espacio de aprendizaje</div>
            <h1 class="view-title">Aprendizaje personalizado</h1>
            <div class="view-body">
              <p>
                Rey Filósofo construye progresivamente una comprensión de
                cómo aprendes a partir de la evidencia que produces.
              </p>
              <p>
                Esa evidencia puede provenir de tus <strong>Microtests</strong>,
                conversaciones con Rey Filósofo, textos que lees, errores,
                dificultades y progresos.
              </p>
              <p class="epistemic">
                <strong>La adaptación debe poder explicarse y rastrearse.</strong>
              </p>
              <p>
                La lógica es:
                <strong>evidencia → mapa de aprendizaje → ZDP → adaptación</strong>.
              </p>
              <p>
                Cuanto más clara y honestamente expreses lo que sabes,
                lo que no sabes y lo que quieres comprender, mejor podrá
                adaptarse el acompañamiento.
              </p>
              <p>
                Por ejemplo, si quieres aprender sobre Fórmula 1, Rey Filósofo
                puede comenzar preguntando qué sabes, qué te interesa, qué has
                leído o visto y qué quieres llegar a comprender.
              </p>
              <p>
                El objetivo no es etiquetarte. Es comprender dónde estás
                para ayudarte a avanzar desde ahí.
              </p>
            </div>
          </div>
        `;
      }
    },

    zdp: {
      title: 'Rey Filósofo — ZDP',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Perfil de aprendizaje</div>
            <h1 class="view-title">Zona de Desarrollo Próximo</h1>
            <div class="view-body">
              <p>
                La ZDP muestra la distancia entre aquello que puedes hacer
                autónomamente y aquello que puedes alcanzar con ayuda.
              </p>
              <p>
                No es una nota ni una clasificación. Es una representación
                dinámica del punto en que te encuentras y del tipo de
                acompañamiento que puede ayudarte a avanzar.
              </p>
              <div class="epistemic">
                <p><strong>Autónomo</strong><br>
                Lo que actualmente puedes comprender o realizar por ti mismo.</p>
                <p><strong>Con acompañamiento</strong><br>
                Lo que puedes alcanzar con preguntas, ejemplos o explicaciones.</p>
                <p><strong>En desarrollo</strong><br>
                Lo que todavía requiere aprendizaje y nueva evidencia.</p>
              </div>
              <p>
                Esta información se actualizará a medida que interactúes,
                leas, respondas y avances.
              </p>
            </div>
          </div>
        `;
      }
    },

    prueba: {
      title: 'Rey Filósofo — Ponte a prueba',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Aprendizaje activo</div>
            <h1 class="view-title">Ponte a prueba</h1>
            <div class="view-body">
              <p>
                Aquí podrás responder preguntas sobre los contenidos que
                has estudiado en la Academia.
              </p>
              <p>
                El objetivo no es obtener una nota ni competir con otras
                personas. Es descubrir qué comprendes y dónde todavía
                existen dificultades.
              </p>
              <p>
                Tus respuestas podrán aportar nueva evidencia al perfil
                de aprendizaje y a tu Zona de Desarrollo Próximo.
              </p>
              <p class="epistemic">
                <strong>Equivocarse también produce información.</strong>
              </p>
              <p>
                La selección de contenidos y preguntas se conectará
                posteriormente con los documentos reales de la Academia.
              </p>
            </div>
          </div>
        `;
      }
    },

    aprende: {
      title: 'Rey Filósofo — Aprende lo que tú quieras',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Aprendizaje autodirigido</div>
            <h1 class="view-title">Aprende lo que tú quieras</h1>
            <div class="view-body">
              <p>
                Dile a Rey Filósofo qué quieres aprender.
              </p>
              <p>
                Puede ser Fórmula 1, historia, música, ajedrez, astronomía
                o cualquier otro tema que quieras comprender mejor.
              </p>
              <p>
                Rey Filósofo comenzará por conocerte: qué sabes, qué te
                interesa, qué has visto o leído y qué quieres conseguir.
              </p>
              <p>
                A partir de ese diálogo podrá construir una biblioteca
                personal dentro de la Academia.
              </p>
              <p>
                El proceso mantiene una lógica sencilla:
                <strong>leer → comprender → preguntar → pensar → volver al texto
                → comprender mejor</strong>.
              </p>
              <p class="epistemic">
                <strong>El objetivo es que aprendas a comprender, no que una IA
                piense por ti.</strong>
              </p>
            </div>
          </div>
        `;
      }
    },

    pregunta: {
      title: 'Rey Filósofo — Pregunta del día',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Comunidad</div>
            <h1 class="view-title">Pregunta del día</h1>
            <div class="view-body">
              <p>
                Cada día LogoDemocracy podrá plantear una pregunta para
                abrir una conversación entre las personas que participan
                en la plataforma.
              </p>
              <p>
                Puedes responder si quieres. También podrás leer las
                respuestas de otras personas y participar comentándolas.
              </p>
              <p class="epistemic">
                <strong>No se trata de ganar una discusión. Se trata de
                pensar juntos.</strong>
              </p>
              <p>
                La primera versión será deliberadamente sencilla:
                una pregunta, respuestas y comentarios.
              </p>
            </div>
          </div>
        `;
      }
    },

    chat: {
      title: 'Rey Filósofo — Conversación',
      render: function() {
        return `
          <div class="view chat-view">
            <div class="view-eyebrow">Chat de Tutoría</div>
            <h1 class="view-title">Tu Conversación con el Rey Filósofo</h1>
            <div class="view-body chat-container">
              <div id="chat-messages" class="chat-messages">
                <!-- Mensajes del chat se insertarán aquí -->
              </div>
              <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off">
                <button id="send-button" class="btn btn-primary">Enviar</button>
              </div>
            </div>
          </div>
        `;
      },
      onEnter: function() {
        document.getElementById('chat-input').focus();
        setupChatEventListeners();
      },
      onExit: function() {
        removeChatEventListeners();
      }
    },
    about: {
      title: 'Rey Filósofo — Acerca de',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Información Adicional</div>
            <h1 class="view-title">Acerca del Rey Filósofo</h1>
            <div class="view-body">
              <p>El Rey Filósofo es un sistema de tutoría cognitiva avanzada diseñado para mejorar la alfabetización epistemológica y el pensamiento crítico de los usuarios. Utiliza modelos inspirados en la psicología del desarrollo de Vygotsky y teorías de la argumentación para ofrecer una guía personalizada.</p>
              <p>Mediante el análisis de tus interacciones y tu progreso en microtests, el sistema adapta su estrategia pedagógica para ofrecer el soporte más adecuado a tu Zona de Desarrollo Próximo.</p>
              <p>Este proyecto es un esfuerzo continuo para democratizar el acceso a herramientas de pensamiento crítico y apoyar el aprendizaje autodirigido en temas complejos.</p>
            </div>
            <div class="view-actions">
              <button class="btn btn-secondary" onclick="window.ReyFilosofo.navigateTo('inicio')">Volver al Inicio</button>
            </div>
          </div>
        `;
      }
    },
  'perfil-aprendizaje': {
    title: 'Rey Filósofo — Perfil de aprendizaje',

    render: function() {
      return `
        <div class="view">
          <div class="view-eyebrow">Perfil de Aprendizaje</div>
          <h1 class="view-title">Mi perfil de aprendizaje</h1>

          <div class="view-body">
            <p>
              Este perfil se construye progresivamente a partir de evidencias
              sobre tu forma de aprender.
            </p>

            <p style="color:rgba(229,231,235,.68);">
              Los microtests son una primera fuente de evidencia. A medida que
              interactúas con Rey Filósofo, realizas actividades y desarrollas
              nuevos aprendizajes, este perfil puede cambiar.
            </p>

            <div id="learningProfileRoot">
              <p class="mt-hint">Cargando perfil de aprendizaje...</p>
            </div>
          </div>

          <div class="view-actions">
            <button
              class="btn btn-secondary"
              onclick="window.ReyFilosofo.navigateTo('microtests')"
            >
              Ver Microtests
            </button>
          </div>
        </div>
      `;
    },

    onEnter: async function() {
      var root = document.getElementById('learningProfileRoot');

      if (!root) {
        return;
      }

      root.innerHTML =
        '<p class="mt-hint">Cargando perfil de aprendizaje...</p>';

      try {
        if (
          typeof LearningProfileService === 'undefined' ||
          typeof LearningProfileService.getFullContext !== 'function'
        ) {
          throw new Error('LearningProfileService no está disponible.');
        }

        var context = await LearningProfileService.getFullContext();

        var profileResponse =
          context && context.profile
            ? context.profile
            : {};

        var profile =
          profileResponse.profile &&
          typeof profileResponse.profile === 'object'
            ? profileResponse.profile
            : profileResponse;

        var completedTests =
          Array.isArray(context.completedTests)
            ? context.completedTests
            : (
                Array.isArray(profile.completed_tests)
                  ? profile.completed_tests
                  : []
              );

        /*
         * IMPORTANTE:
         *
         * microtestEvidence es evidencia observada.
         * No se convierte aquí en una interpretación pedagógica.
         *
         * La interpretación de múltiples evidencias corresponde a una
         * capa posterior del sistema.
         */
        var microtestEvidence =
          context &&
          Array.isArray(context.microtestEvidence)
            ? context.microtestEvidence
            : (
                Array.isArray(profile.microtest_evidence)
                  ? profile.microtest_evidence
                  : []
              );

        var labels = {
          estilo_explicativo: 'Forma de explicación',
          preferencia_ejemplos: 'Uso de ejemplos',
          contexto_ejemplo: 'Contexto de ejemplos',
          tipo_analogia_dominante: 'Tipo de analogías',
          orientacion: 'Orientación',
          pensamiento_sistemico: 'Pensamiento sistémico',
          preferencia_formato: 'Formato preferido',
          nivel_abstraccion_inicial: 'Nivel de abstracción inicial',
          secuencia_preferida: 'Secuencia de aprendizaje',
          necesidad_andamiaje: 'Necesidad de andamiaje',
          tipo_andamiaje_preferido: 'Tipo de andamiaje',
          estrategias_metacognitivas: 'Estrategias metacognitivas',
          enfoque_resolucion: 'Enfoque ante problemas'
        };

        var humanize = function(value) {
          if (Array.isArray(value)) {
            return value.map(humanize).join(', ');
          }

          if (value === null || value === undefined || value === '') {
            return 'Aún no hay evidencia suficiente';
          }

          return String(value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, function(letter) {
              return letter.toUpperCase();
            });
        };

        /*
         * ----------------------------------------------------------
         * INTERPRETACIONES CONSOLIDADAS
         * ----------------------------------------------------------
         *
         * Solo mostramos aquí campos que realmente existen en el
         * PedagogicalProfile. No inferimos ninguno desde los
         * indicadores de Microtests.
         */
        var fields = Object.keys(labels)
          .filter(function(key) {
            return profile[key] !== undefined &&
                   profile[key] !== null &&
                   profile[key] !== '' &&
                   (!Array.isArray(profile[key]) || profile[key].length > 0);
          });

        /*
         * ----------------------------------------------------------
         * RESULTADO CUALITATIVO DE MICROTESTS
         * ----------------------------------------------------------
         *
         * microtestQualitative contiene resultados producidos por
         * la capa determinista. Aquí solo se presentan; no se
         * recalculan ni se convierten en una etiqueta del usuario.
         */
        var microtestQualitative =
          context && Array.isArray(context.microtestQualitative)
            ? context.microtestQualitative
            : [];

        var brujulaQualitative = microtestQualitative.find(function(item) {
          return item && item.testId === 'brujula';
        });

        var qualitativeHtml = '';

        if (
          brujulaQualitative &&
          brujulaQualitative.deterministicProfile &&
          brujulaQualitative.deterministicProfile.interpretation
        ) {
          var brujulaInterpretation =
            brujulaQualitative.deterministicProfile.interpretation;

          qualitativeHtml = `
            <div style="
              border:1px solid rgba(255,255,255,.14);
              padding:18px;
              margin-top:12px;
            ">
              <div style="
                font-family:var(--font-mono,monospace);
                font-size:.72rem;
                text-transform:uppercase;
                letter-spacing:.08em;
                color:rgba(229,231,235,.55);
                margin-bottom:8px;
              ">
                Resultado cualitativo · Brújula
              </div>

              <p style="
                margin:0 0 16px;
                color:rgba(229,231,235,.68);
                line-height:1.6;
                font-size:.86rem;
              ">
                Este resultado resume la evidencia de este Microtest.
                Es una hipótesis provisional y no constituye una etiqueta
                estable sobre tu forma de aprender.
              </p>

              <div style="
                display:grid;
                gap:14px;
              ">
                <div>
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.72rem;
                    text-transform:uppercase;
                    letter-spacing:.08em;
                    color:rgba(229,231,235,.55);
                    margin-bottom:5px;
                  ">
                    Patrón observado
                  </div>
                  <div style="
                    color:#f3f4f6;
                    line-height:1.6;
                  ">
                    ${brujulaInterpretation.patron}
                  </div>
                </div>

                <div>
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.72rem;
                    text-transform:uppercase;
                    letter-spacing:.08em;
                    color:rgba(229,231,235,.55);
                    margin-bottom:5px;
                  ">
                    Recurso dominante
                  </div>
                  <div style="
                    color:#f3f4f6;
                    line-height:1.6;
                  ">
                    ${brujulaInterpretation.dominante}
                  </div>
                </div>

                <div>
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.72rem;
                    text-transform:uppercase;
                    letter-spacing:.08em;
                    color:rgba(229,231,235,.55);
                    margin-bottom:5px;
                  ">
                    Relación entre recursos
                  </div>
                  <div style="
                    color:#f3f4f6;
                    line-height:1.6;
                  ">
                    ${brujulaInterpretation.relacion}
                  </div>
                </div>

                <div>
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.72rem;
                    text-transform:uppercase;
                    letter-spacing:.08em;
                    color:rgba(229,231,235,.55);
                    margin-bottom:5px;
                  ">
                    Implicación provisional
                  </div>
                  <div style="
                    color:#f3f4f6;
                    line-height:1.6;
                  ">
                    ${brujulaInterpretation.implicacion}
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          qualitativeHtml = `
            <div style="
              border-top:1px solid rgba(255,255,255,.12);
              padding:14px 0;
            ">
              <p style="
                margin:0;
                color:rgba(229,231,235,.62);
                line-height:1.6;
              ">
                Todavía no hay un resultado cualitativo disponible
                para este Microtest.
              </p>
            </div>
          `;
        }

        var consolidatedHtml = fields.length
          ? fields.map(function(key) {
              return `
                <div style="
                  border-top:1px solid rgba(255,255,255,.12);
                  padding:14px 0;
                ">
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.72rem;
                    text-transform:uppercase;
                    letter-spacing:.08em;
                    color:rgba(229,231,235,.55);
                    margin-bottom:5px;
                  ">
                    ${labels[key]}
                  </div>
                  <div style="
                    font-family:var(--font-mono,monospace);
                    font-size:.95rem;
                    color:#f3f4f6;
                  ">
                    ${humanize(profile[key])}
                  </div>
                </div>
              `;
            }).join('')
          : `
              <div style="
                border-top:1px solid rgba(255,255,255,.12);
                padding:14px 0;
              ">
                <p style="
                  margin:0;
                  color:rgba(229,231,235,.62);
                  line-height:1.6;
                ">
                  Aún no hay interpretaciones pedagógicas consolidadas.
                  Los Microtests ya pueden aportar evidencia sin convertirla
                  prematuramente en una etiqueta sobre tu forma de aprender.
                </p>
              </div>
            `;

        /*
         * ----------------------------------------------------------
         * EVIDENCIA DE MICROTESTS
         * ----------------------------------------------------------
         *
         * La estructura puede contener intentos completos con una
         * propiedad evidence[]. La pantalla muestra únicamente lo
         * registrado: test, dimensión, indicadores y cantidad de
         * respuestas. No calcula "estilos".
         */
        var evidenceAttempts = microtestEvidence.filter(function(item) {
          return item && typeof item === 'object';
        });

        var testTitles = {};

        if (typeof MICROTESTS !== 'undefined' && Array.isArray(MICROTESTS)) {
          MICROTESTS.forEach(function(test) {
            if (test && test.id) {
              testTitles[test.id] = test.title || test.id;
            }
          });
        }

        var evidenceHtml = '';

        if (!evidenceAttempts.length) {
          evidenceHtml = `
            <div style="
              border-top:1px solid rgba(255,255,255,.12);
              padding:14px 0;
            ">
              <p style="
                margin:0;
                color:rgba(229,231,235,.62);
                line-height:1.6;
              ">
                Todavía no hay evidencia detallada de respuestas de
                Microtests disponible en este perfil.
              </p>
            </div>
          `;
        } else {
          evidenceHtml = evidenceAttempts.map(function(attempt, index) {
            var testId = attempt.testId || 'microtest';
            var title = testTitles[testId] || testId;

            var evidence = Array.isArray(attempt.evidence)
              ? attempt.evidence
              : [];

            var indicators = [];

            evidence.forEach(function(item) {
              if (
                item &&
                item.indicator &&
                indicators.indexOf(item.indicator) === -1
              ) {
                indicators.push(item.indicator);
              }
            });

            var phase = attempt.phase || null;
            var domain = attempt.domain || null;

            var meta = [];

            if (phase) {
              meta.push('Fase: ' + humanize(phase));
            }

            if (domain) {
              meta.push('Dominio: ' + humanize(domain));
            }

            if (evidence.length) {
              meta.push(
                evidence.length +
                (evidence.length === 1
                  ? ' evidencia registrada'
                  : ' evidencias registradas')
              );
            }

            return `
              <div style="
                border-top:1px solid rgba(255,255,255,.12);
                padding:16px 0;
              ">
                <div style="
                  font-family:var(--font-mono,monospace);
                  font-size:.72rem;
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  color:rgba(229,231,235,.55);
                  margin-bottom:6px;
                ">
                  ${title}
                </div>

                <div style="
                  font-family:var(--font-mono,monospace);
                  font-size:.95rem;
                  color:#f3f4f6;
                  margin-bottom:7px;
                ">
                  Evidencia registrada
                </div>

                ${
                  meta.length
                    ? `
                      <div style="
                        color:rgba(229,231,235,.62);
                        font-size:.82rem;
                        line-height:1.6;
                        margin-bottom:7px;
                      ">
                        ${meta.join(' · ')}
                      </div>
                    `
                    : ''
                }

                ${
                  indicators.length
                    ? `
                      <div style="
                        color:rgba(229,231,235,.82);
                        font-size:.86rem;
                        line-height:1.6;
                      ">
                        Indicadores observados:
                        ${indicators.map(humanize).join(', ')}
                      </div>
                    `
                    : ''
                }
              </div>
            `;
          }).join('');
        }

        root.innerHTML = `
          <div style="
            border:1px solid rgba(255,255,255,.14);
            padding:18px;
            margin:20px 0;
          ">
            <div style="
              font-family:var(--font-mono,monospace);
              font-size:.72rem;
              text-transform:uppercase;
              letter-spacing:.08em;
              color:rgba(229,231,235,.55);
              margin-bottom:8px;
            ">
              Evidencia inicial
            </div>

            <div style="
              font-family:var(--font-mono,monospace);
              font-size:1.15rem;
              color:#f3f4f6;
            ">
              Microtests completados: ${completedTests.length} / 10
            </div>

            <div style="
              margin-top:8px;
              color:rgba(229,231,235,.62);
              font-size:.82rem;
            ">
              Intentos con evidencia detallada: ${evidenceAttempts.length}
            </div>
          </div>

          <h2 style="
            font-family:var(--font-serif,Georgia,serif);
            font-size:1.35rem;
            font-weight:400;
            margin:28px 0 4px;
            color:#f3f4f6;
          ">
            Evidencia de los Microtests
          </h2>

          <p style="
            color:rgba(229,231,235,.62);
            margin:0 0 12px;
            line-height:1.6;
          ">
            Aquí se muestra lo que el sistema ha registrado.
            Esta evidencia todavía no constituye una etiqueta sobre tu
            forma de aprender.
          </p>

          <div>
            ${evidenceHtml}
          </div>

          <h2 style="
            font-family:var(--font-serif,Georgia,serif);
            font-size:1.35rem;
            font-weight:400;
            margin:32px 0 4px;
            color:#f3f4f6;
          ">
            Resultado cualitativo
          </h2>

          <p style="
            color:rgba(229,231,235,.62);
            margin:0 0 12px;
            line-height:1.6;
          ">
            El motor determinista organiza la evidencia de cada Microtest
            en un resultado provisional. No constituye todavía una
            interpretación consolidada del perfil.
          </p>

          <div>
            ${qualitativeHtml}
          </div>

          <h2 style="
            font-family:var(--font-serif,Georgia,serif);
            font-size:1.35rem;
            font-weight:400;
            margin:32px 0 4px;
            color:#f3f4f6;
          ">
            Interpretaciones consolidadas
          </h2>

          <p style="
            color:rgba(229,231,235,.62);
            margin:0 0 12px;
            line-height:1.6;
          ">
            Estas dimensiones requieren una interpretación posterior de
            múltiples evidencias. No se generan automáticamente a partir
            de una sola respuesta.
          </p>

          <div>
            ${consolidatedHtml}
          </div>

          <div style="
            border-top:1px solid rgba(255,255,255,.12);
            margin-top:22px;
            padding-top:16px;
            color:rgba(229,231,235,.55);
            font-size:.82rem;
            line-height:1.6;
          ">
            El perfil seguirá evolucionando con nuevas conversaciones,
            actividades y evidencias de aprendizaje.
          </div>
        `;

      } catch (error) {
        console.error(
          '[REY_FILOSOFO] Error cargando perfil de aprendizaje:',
          error
        );

        root.innerHTML = `
          <div class="mt-done-panel">
            <p class="mt-done-text">
              No fue posible cargar tu perfil de aprendizaje.
              Intenta nuevamente en unos instantes.
            </p>
          </div>
        `;
      }
    },

    onExit: function() {
      // No hay listeners persistentes propios de esta vista.
    }
  },

  microtests: {
    title: 'Rey Filósofo — Microtests',
    render: function() {
      return `
        <div class="view">
          <div class="view-eyebrow">Perfil de aprendizaje</div>
          <h1 class="view-title">Microtests</h1>
          <div class="view-body">
            <p>
              Estas actividades cortas ayudan al Rey Filósofo a comprender
              cómo aprendes y a adaptar progresivamente su acompañamiento.
            </p>
            <p>
              Son completamente opcionales: puedes hacer una, varias,
              todas o ninguna. No hay puntuaciones ni comparaciones.
            </p>
            <div id="mtRoot"></div>
          </div>
          <div class="view-actions">
            <button
              class="btn btn-secondary"
              onclick="window.ReyFilosofo.navigateTo('inicio')"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      `;
    },
    onEnter: function() {
      var root = document.getElementById('mtRoot');

      if (root) {
        root.innerHTML =
          '<p class="mt-hint">Cargando Microtests...</p>';
      }

      MT_ENGINE.hydrate();
    },
    onExit: function() {
      // Los listeners del motor pertenecen al DOM de #mtRoot
      // y desaparecen al abandonar la vista.
    }
  },
  };


  var CONFIG = window.CONFIG || {
    SESSION_STORAGE_KEY: 'rey-filosofo-session-id',
    API_BASE_URL: 'http://localhost:3000' // Default if not provided
  };

// ChatUI Placeholder (debe existir en el entorno real)
  var ChatUI = window.ChatUI || {
    showLoading: function(isLoading) {
      console.log(`ChatUI: Loading state set to ${isLoading}`);
      const sendButton = document.getElementById('send-button');
      if (sendButton) {
        sendButton.disabled = isLoading;
        sendButton.textContent = isLoading ? 'Enviando...' : 'Enviar';
      }
      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.disabled = isLoading;
      }
    }
  };

// --- Variables y Funciones del Chat ---
  var chatInput;
  var chatMessages;
  var sendButton;
  var ApiClient; // Asegúrate de que esto esté bien inicializado en `init`

  function setupChatEventListeners() {
    chatInput = document.getElementById('chat-input');
    chatMessages = document.getElementById('chat-messages');
    sendButton = document.getElementById('send-button');

    if (chatInput) {
      chatInput.addEventListener('keypress', handleChatInputKeypress);
    }
    if (sendButton) {
      sendButton.addEventListener('click', handleSendMessage);
    }
  }

  function removeChatEventListeners() {
    if (chatInput) {
      chatInput.removeEventListener('keypress', handleChatInputKeypress);
    }
    if (sendButton) {
      sendButton.removeEventListener('click', handleSendMessage);
    }
  }

  async function handleSendMessage() {
    var message = chatInput.value.trim();
    if (message === '') {
      return;
    }

    appendMessage('user', message);
    chatInput.value = '';
    isLoading = true;
    ChatUI.showLoading(true);

    try {
      // Hito 5.3: Adjuntar el contexto cognitivo actual a cada mensaje del usuario
      var context = getCognitiveContext();
      var response = await ApiClient.post('/api/chat', {
        sessionId: sessionId,
        message: message,
        cognitiveContext: context // Adjuntamos el contexto cognitivo
      });
      appendMessage('system', response.reply);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      appendMessage('system', 'Lo siento, hubo un error al procesar tu solicitud.');
    } finally {
      isLoading = false;
      ChatUI.showLoading(false);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function appendMessage(sender, text) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleChatInputKeypress(event) {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  }

  function updateCognitiveInfo() {
    var lblZdp = document.getElementById('lbl-zdp-strategy');
    var lblSync = document.getElementById('lbl-sync-status');
    var userLabel = document.getElementById('user-label'); // Assuming user-label exists

    if (userLabel) {
        // Asignar currentUserId para que el contexto cognitivo pueda usarlo
        // Aquí se puede determinar si es un usuario autenticado o invitado
        // Para esta misión, si no hay un usuario logueado, lo tratamos como invitado.
        // `window.currentUserId` será utilizado por `CognitiveRuntime.getUserContext()`
        if (window.currentUserId === 'guest') { // Only modify if still default 'guest'
            window.currentUserId = userLabel.textContent.includes('Invitado') ? 'guest-' + sessionId.substring(0,8) : 'authenticated-user-id'; // Placeholder for real user ID
        }
    }


    if (userLabel && lblZdp) {
      var context = getCognitiveContext();
      if (context && context.currentStrategy) {
        lblZdp.textContent = 'ZPD: ' + (context.currentStrategy.name || context.currentStrategy);
      } else {
        lblZdp.textContent =
          'ZPD: Estrategia Vinculada';
      }

    } else if (userLabel && lblSync) {

      var isLoggedIn =
        !userLabel.textContent.includes('Invitado');

      lblSync.textContent = isLoggedIn
        ? 'Usuario: Autenticado (Local)'
        : 'Usuario: Invitado (Local)';
    }
  }


  // --- Inicialización ---

  function init() {
    // Inicializar ApiClient (asumiendo que está definido en otro lugar o globalmente)
    if (typeof window.ApiClient === 'undefined') {
        console.warn("ApiClient no está disponible globalmente. Usando un placeholder.");
        window.ApiClient = {
            post: async (path, data) => {
                console.log(`Placeholder ApiClient: POST ${path}`, data);
                // Simulate backend response
                return new Promise(resolve => setTimeout(() => {
                    resolve({ success: true, reply: 'Mensaje de respuesta simulado.' });
                }, 300));
            }
        };
    }
    ApiClient = window.ApiClient; // Make it accessible within this IIFE

    mainContent = document.getElementById('viewContent');
    navbarLinks = document.querySelectorAll('.pnav-item');

    navbarLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo(event.target.dataset.view);
      });
    });

    sessionId = getOrCreateSessionId(); // Obtener o crear sessionId

    // Establecer la vista inicial
    navigateTo('inicio');

    // Exponer funciones necesarias globalmente para interactuar desde el HTML u otros scripts
    window.ReyFilosofo = {
      navigateTo: navigateTo,
      // Puedes añadir más funciones aquí si son necesarias
    };

    updateCognitiveInfo(); // Llamada inicial para establecer la info en la UI
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
