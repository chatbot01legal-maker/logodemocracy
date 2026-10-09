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
    title: "Brújula",
    dimension: "entrada_al_contenido",
    indicators: ["ejemplo", "principio", "analogia", "secuencia"],
    questions: [
      {
        id: "brujula-Q1",
        questionId: "brujula-Q1",
        text: "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
        question: "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
        prompt: "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
        options: [
          { value: "A", key: "A", id: "A", label: "Leer el manual desde la página uno, revisando la fase de preparación y luego la estructura del turno.", text: "Leer el manual desde la página uno, revisando la fase de preparación y luego la estructura del turno.", indicator: "secuencia" },
          { value: "B", key: "B", id: "B", label: "Pedir que jueguen una ronda de demostración para ver qué acciones se toman en un turno real.", text: "Pedir que jueguen una ronda de demostración para ver qué acciones se toman en un turno real.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Preguntar inmediatamente cómo se ganan los puntos de victoria y cuál es el objetivo final.", text: "Preguntar inmediatamente cómo se ganan los puntos de victoria y cuál es el objetivo final.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Preguntar a qué otros juegos que ya conoces se parece en sus mecánicas.", text: "Preguntar a qué otros juegos que ya conoces se parece en sus mecánicas.", indicator: "analogia" }
        ]
      },
      {
        id: "brujula-Q2",
        questionId: "brujula-Q2",
        text: "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
        question: "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
        prompt: "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
        options: [
          { value: "A", key: "A", id: "A", label: "Revisar la propuesta de valor de la app para entender su lógica general de organización.", text: "Revisar la propuesta de valor de la app para entender su lógica general de organización.", indicator: "principio" },
          { value: "B", key: "B", id: "B", label: "Buscar un video donde alguien muestre cómo estructuró su propio proyecto específico en la app.", text: "Buscar un video donde alguien muestre cómo estructuró su propio proyecto específico en la app.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Explorar la interfaz buscando similitudes con herramientas que usaste en el pasado (carpetas, etiquetas).", text: "Explorar la interfaz buscando similitudes con herramientas que usaste en el pasado (carpetas, etiquetas).", indicator: "analogia" },
          { value: "D", key: "D", id: "D", label: "Hacer clic en el recorrido guiado inicial y completar los pasos de configuración uno por uno.", text: "Hacer clic en el recorrido guiado inicial y completar los pasos de configuración uno por uno.", indicator: "secuencia" }
        ]
      },
      {
        id: "brujula-Q3",
        questionId: "brujula-Q3",
        text: "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
        question: "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
        prompt: "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
        options: [
          { value: "A", key: "A", id: "A", label: "Miras detenidamente la foto del mueble terminado en la caja para tener clara la imagen del resultado.", text: "Miras detenidamente la foto del mueble terminado en la caja para tener clara la imagen del resultado.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Abres el manual de instrucciones y buscas el paso número uno antes de tocar las piezas.", text: "Abres el manual de instrucciones y buscas el paso número uno antes de tocar las piezas.", indicator: "secuencia" },
          { value: "C", key: "C", id: "C", label: "Agrupas todas las piezas (tornillos, tablas) para entender la lógica del sistema de ensamblaje primero.", text: "Agrupas todas las piezas (tornillos, tablas) para entender la lógica del sistema de ensamblaje primero.", indicator: "principio" },
          { value: "D", key: "D", id: "D", label: "Recuerdas cómo armaste una repisa similar hace unos años y aplicas esa misma intuición inicial.", text: "Recuerdas cómo armaste una repisa similar hace unos años y aplicas esa misma intuición inicial.", indicator: "analogia" }
        ]
      },
      {
        id: "brujula-Q4",
        questionId: "brujula-Q4",
        text: "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
        question: "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
        prompt: "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
        options: [
          { value: "A", key: "A", id: "A", label: "Prestas atención a cuando el autor compara la economía del país con el presupuesto de una familia.", text: "Prestas atención a cuando el autor compara la economía del país con el presupuesto de una familia.", indicator: "analogia" },
          { value: "B", key: "B", id: "B", label: "Buscas el párrafo introductorio que define la ley macroeconómica central que explica el problema.", text: "Buscas el párrafo introductorio que define la ley macroeconómica central que explica el problema.", indicator: "principio" },
          { value: "C", key: "C", id: "C", label: "Lees primero la línea de tiempo de eventos para entender cómo se desencadenó la situación paso a paso.", text: "Lees primero la línea de tiempo de eventos para entender cómo se desencadenó la situación paso a paso.", indicator: "secuencia" },
          { value: "D", key: "D", id: "D", label: "Te centras en la historia de una persona o empresa real mencionada en el texto que sufre el fenómeno.", text: "Te centras en la historia de una persona o empresa real mencionada en el texto que sufre el fenómeno.", indicator: "ejemplo" }
        ]
      },
      {
        id: "brujula-Q5",
        questionId: "brujula-Q5",
        text: "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
        question: "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
        prompt: "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
        options: [
          { value: "A", key: "A", id: "A", label: "Sigues la receta al pie de la letra, pesando cada ingrediente y respetando el orden exacto.", text: "Sigues la receta al pie de la letra, pesando cada ingrediente y respetando el orden exacto.", indicator: "secuencia" },
          { value: "B", key: "B", id: "B", label: "Identificas qué guiso de tu propio país utiliza una base similar para guiarte por intuición.", text: "Identificas qué guiso de tu propio país utiliza una base similar para guiarte por intuición.", indicator: "analogia" },
          { value: "C", key: "C", id: "C", label: "Buscas una foto o video corto para ver exactamente el color y la textura que debería tener la salsa.", text: "Buscas una foto o video corto para ver exactamente el color y la textura que debería tener la salsa.", indicator: "ejemplo" },
          { value: "D", key: "D", id: "D", label: "Lees sobre el perfil de sabor de esa cultura (equilibrio entre ácido, dulce y picante) antes de empezar.", text: "Lees sobre el perfil de sabor de esa cultura (equilibrio entre ácido, dulce y picante) antes de empezar.", indicator: "principio" }
        ]
      }
    ]
  },
  {
    id: "reconstruccion_function_1",
    title: "Reconstrucción de función 1",
    dimension: "reconstruccion_de_funcion",
    indicators: ["marcador", "contenido", "posicion", "contraste"],
    questions: [
      {
        id: "reconstruccion_function_1-Q1",
        questionId: "reconstruccion_function_1-Q1",
        text: "En un blog de cocina, un párrafo comienza con la frase «Por lo tanto, para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» Aparece justo después del apartado donde se explican los ingredientes. ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        question: "En un blog de cocina, un párrafo comienza con la frase «Por lo tanto, para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» Aparece justo después del apartado donde se explican los ingredientes. ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        prompt: "En un blog de cocina, un párrafo comienza con la frase «Por lo tanto, para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» Aparece justo después del apartado donde se explican los ingredientes. ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        options: [
          { value: "A", key: "A", id: "A", label: "Usar la expresión «Por lo tanto» como señal explícita de que el párrafo cierra una conclusión a partir de lo ya dicho.", text: "Usar la expresión «Por lo tanto» como señal explícita de que el párrafo cierra una conclusión a partir de lo ya dicho.", indicator: "marcador" },
          { value: "B", key: "B", id: "B", label: "Analizar qué indica específicamente el párrafo sobre el tiempo de reposo y cómo se relaciona con lo anterior.", text: "Analizar qué indica específicamente el párrafo sobre el tiempo de reposo y cómo se relaciona con lo anterior.", indicator: "contenido" },
          { value: "C", key: "C", id: "C", label: "Observar que el párrafo está ubicado después del apartado de ingredientes, cerrando ese bloque del texto.", text: "Observar que el párrafo está ubicado después del apartado de ingredientes, cerrando ese bloque del texto.", indicator: "posicion" },
          { value: "D", key: "D", id: "D", label: "Comparar este párrafo con otras partes del blog que solo describen pasos, para ver en qué se distingue.", text: "Comparar este párrafo con otras partes del blog que solo describen pasos, para ver en qué se distingue.", indicator: "contraste" }
        ]
      },
      {
        id: "reconstruccion_function_1-Q2",
        questionId: "reconstruccion_function_1-Q2",
        text: "En el envase de un producto de venta libre, hay una sección con el título «Precauciones» que aparece justo antes de las instrucciones de uso. ¿Cómo reconstruirías la función de esa sección dentro del envase?",
        question: "En el envase de un producto de venta libre, hay una sección con el título «Precauciones» que aparece justo antes de las instrucciones de uso. ¿Cómo reconstruirías la función de esa sección dentro del envase?",
        prompt: "En el envase de un producto de venta libre, hay una sección con el título «Precauciones» que aparece justo antes de las instrucciones de uso. ¿Cómo reconstruirías la función de esa sección dentro del envase?",
        options: [
          { value: "A", key: "A", id: "A", label: "Analizar qué precauciones menciona específicamente esa sección.", text: "Analizar qué precauciones menciona específicamente esa sección.", indicator: "contenido" },
          { value: "B", key: "B", id: "B", label: "Compararla con otras secciones del envase que no son advertencias.", text: "Compararla con otras secciones del envase que no son advertencias.", indicator: "contraste" },
          { value: "C", key: "C", id: "C", label: "Usar el título «Precauciones» como señal explícita que delimita su papel.", text: "Usar el título «Precauciones» como señal explícita que delimita su papel.", indicator: "marcador" },
          { value: "D", key: "D", id: "D", label: "Observar que la sección está ubicada justo antes de las instrucciones de uso.", text: "Observar que la sección está ubicada justo antes de las instrucciones de uso.", indicator: "posicion" }
        ]
      },
      {
        id: "reconstruccion_function_1-Q3",
        questionId: "reconstruccion_function_1-Q3",
        text: "En la reseña de una película publicada en un blog, hay un párrafo titulado «Mi recomendación» que aparece al final, después del resumen de la trama. ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        question: "En la reseña de una película publicada en un blog, hay un párrafo titulado «Mi recomendación» que aparece al final, después del resumen de la trama. ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        prompt: "En la reseña de una película publicada en un blog, hay un párrafo titulado «Mi recomendación» que aparece al final, después del resumen de la trama. ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        options: [
          { value: "A", key: "A", id: "A", label: "Observar que está ubicado al final, después del resumen de la trama.", text: "Observar que está ubicado al final, después del resumen de la trama.", indicator: "posicion" },
          { value: "B", key: "B", id: "B", label: "Usar el título «Mi recomendación» como etiqueta explícita de su función.", text: "Usar el título «Mi recomendación» como etiqueta explícita de su función.", indicator: "marcador" },
          { value: "C", key: "C", id: "C", label: "Compararlo con las partes previas de la reseña que solo describen la trama.", text: "Compararlo con las partes previas de la reseña que solo describen la trama.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué recomienda específicamente y con qué argumentos lo justifica.", text: "Analizar qué recomienda específicamente y con qué argumentos lo justifica.", indicator: "contenido" }
        ]
      },
      {
        id: "reconstruccion_function_1-Q4",
        questionId: "reconstruccion_function_1-Q4",
        text: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo comienza con «En resumen, lo que quiero decirte es que...». Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        question: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo comienza con «En resumen, lo que quiero decirte es que...». Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        prompt: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo comienza con «En resumen, lo que quiero decirte es que...». Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        options: [
          { value: "A", key: "A", id: "A", label: "Compararlo con los párrafos previos que describen lo que le pasó, para ver qué agrega.", text: "Compararlo con los párrafos previos que describen lo que le pasó, para ver qué agrega.", indicator: "contraste" },
          { value: "B", key: "B", id: "B", label: "Observar que está ubicado al final del mensaje, después de las descripciones.", text: "Observar que está ubicado al final del mensaje, después de las descripciones.", indicator: "posicion" },
          { value: "C", key: "C", id: "C", label: "Analizar qué quiere decirte concretamente en ese párrafo.", text: "Analizar qué quiere decirte concretamente en ese párrafo.", indicator: "contenido" },
          { value: "D", key: "D", id: "D", label: "Usar la expresión «En resumen, lo que quiero decirte es que» como señal explícita de que contiene el punto principal.", text: "Usar la expresión «En resumen, lo que quiero decirte es que» como señal explícita de que contiene el punto principal.", indicator: "marcador" }
        ]
      },
      {
        id: "reconstruccion_function_1-Q5",
        questionId: "reconstruccion_function_1-Q5",
        text: "En una publicación de blog personal, hay una sección titulada «Lo que no me funcionó» que aparece hacia el final, después de contar la experiencia principal. ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        question: "En una publicación de blog personal, hay una sección titulada «Lo que no me funcionó» que aparece hacia el final, después de contar la experiencia principal. ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        prompt: "En una publicación de blog personal, hay una sección titulada «Lo que no me funcionó» que aparece hacia el final, después de contar la experiencia principal. ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        options: [
          { value: "A", key: "A", id: "A", label: "Usar el título «Lo que no me funcionó» como señal explícita que declara su función.", text: "Usar el título «Lo que no me funcionó» como señal explícita que declara su función.", indicator: "marcador" },
          { value: "B", key: "B", id: "B", label: "Observar que está ubicada al final, después de la experiencia principal.", text: "Observar que está ubicada al final, después de la experiencia principal.", indicator: "posicion" },
          { value: "C", key: "C", id: "C", label: "Compararla con la sección donde cuenta la experiencia para ver qué aporta cada una.", text: "Compararla con la sección donde cuenta la experiencia para ver qué aporta cada una.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué cosas específicas no le funcionaron y cómo lo describe.", text: "Analizar qué cosas específicas no le funcionaron y cómo lo describe.", indicator: "contenido" }
        ]
      }
    ]
  },
  {
    id: "reconstruccion_function_2",
    title: "Reconstrucción de función 2",
    dimension: "reconstruccion_de_funcion",
    indicators: ["marcador", "contenido", "posicion", "contraste"],
    questions: [
      {
        id: "reconstruccion_function_2-Q1",
        questionId: "reconstruccion_function_2-Q1",
        text: "En un blog de cocina, después del apartado donde se explican los ingredientes, hay un párrafo que dice: «Para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        question: "En un blog de cocina, después del apartado donde se explican los ingredientes, hay un párrafo que dice: «Para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        prompt: "En un blog de cocina, después del apartado donde se explican los ingredientes, hay un párrafo que dice: «Para que el pan quede más esponjoso, hay que dejar reposar la masa dos horas más.» ¿Cómo reconstruirías la función de ese párrafo dentro del blog?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar en el párrafo o en su entorno alguna palabra o expresión, aunque no sea un conector explícito, que oriente sobre qué función cumple.", text: "Buscar en el párrafo o en su entorno alguna palabra o expresión, aunque no sea un conector explícito, que oriente sobre qué función cumple.", indicator: "marcador" },
          { value: "B", key: "B", id: "B", label: "Analizar qué indica específicamente el párrafo sobre el tiempo de reposo y qué información aporta al conjunto.", text: "Analizar qué indica específicamente el párrafo sobre el tiempo de reposo y qué información aporta al conjunto.", indicator: "contenido" },
          { value: "C", key: "C", id: "C", label: "Observar que el párrafo está ubicado después del apartado de ingredientes, cerrando ese bloque del texto.", text: "Observar que el párrafo está ubicado después del apartado de ingredientes, cerrando ese bloque del texto.", indicator: "posicion" },
          { value: "D", key: "D", id: "D", label: "Comparar este párrafo con otras partes del blog que solo describen pasos, para ver en qué se distingue.", text: "Comparar este párrafo con otras partes del blog que solo describen pasos, para ver en qué se distingue.", indicator: "contraste" }
        ]
      },
      {
        id: "reconstruccion_function_2-Q2",
        questionId: "reconstruccion_function_2-Q2",
        text: "En el envase de un producto de venta libre, justo antes de las instrucciones de uso, hay un bloque que dice: «No usar si está tomando anticoagulantes. Evitar el contacto con los ojos. No exceder la dosis indicada.» ¿Cómo reconstruirías la función de ese bloque dentro del envase?",
        question: "En el envase de un producto de venta libre, justo antes de las instrucciones de uso, hay un bloque que dice: «No usar si está tomando anticoagulantes. Evitar el contacto con los ojos. No exceder la dosis indicada.» ¿Cómo reconstruirías la función de ese bloque dentro del envase?",
        prompt: "En el envase de un producto de venta libre, justo antes de las instrucciones de uso, hay un bloque que dice: «No usar si está tomando anticoagulantes. Evitar el contacto con los ojos. No exceder la dosis indicada.» ¿Cómo reconstruirías la función de ese bloque dentro del envase?",
        options: [
          { value: "A", key: "A", id: "A", label: "Analizar qué menciona específicamente ese bloque sobre situaciones a evitar o contraindicaciones.", text: "Analizar qué menciona específicamente ese bloque sobre situaciones a evitar o contraindicaciones.", indicator: "contenido" },
          { value: "B", key: "B", id: "B", label: "Compararlo con otras secciones del envase que no mencionan advertencias.", text: "Compararlo con otras secciones del envase que no mencionan advertencias.", indicator: "contraste" },
          { value: "C", key: "C", id: "C", label: "Buscar en el bloque o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué tipo de información contiene.", text: "Buscar en el bloque o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué tipo de información contiene.", indicator: "marcador" },
          { value: "D", key: "D", id: "D", label: "Observar que el bloque está ubicado justo antes de las instrucciones de uso.", text: "Observar que el bloque está ubicado justo antes de las instrucciones de uso.", indicator: "posicion" }
        ]
      },
      {
        id: "reconstruccion_function_2-Q3",
        questionId: "reconstruccion_function_2-Q3",
        text: "En la reseña de una película publicada en un blog, después del resumen de la trama y al final del texto, hay un párrafo que dice: «Aunque la fotografía es excelente, el guion se siente forzado en el segundo acto. La recomiendo solo si te gustan las historias lentas.» ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        question: "En la reseña de una película publicada en un blog, después del resumen de la trama y al final del texto, hay un párrafo que dice: «Aunque la fotografía es excelente, el guion se siente forzado en el segundo acto. La recomiendo solo si te gustan las historias lentas.» ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        prompt: "En la reseña de una película publicada en un blog, después del resumen de la trama y al final del texto, hay un párrafo que dice: «Aunque la fotografía es excelente, el guion se siente forzado en el segundo acto. La recomiendo solo si te gustan las historias lentas.» ¿Cómo reconstruirías la función de ese párrafo dentro de la reseña?",
        options: [
          { value: "A", key: "A", id: "A", label: "Observar que está ubicado al final, después del resumen de la trama.", text: "Observar que está ubicado al final, después del resumen de la trama.", indicator: "posicion" },
          { value: "B", key: "B", id: "B", label: "Buscar en el párrafo o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué función cumple.", text: "Buscar en el párrafo o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué función cumple.", indicator: "marcador" },
          { value: "C", key: "C", id: "C", label: "Compararlo con las partes previas de la reseña que solo describen la trama.", text: "Compararlo con las partes previas de la reseña que solo describen la trama.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué opina específicamente el autor y con qué argumentos lo justifica.", text: "Analizar qué opina específicamente el autor y con qué argumentos lo justifica.", indicator: "contenido" }
        ]
      },
      {
        id: "reconstruccion_function_2-Q4",
        questionId: "reconstruccion_function_2-Q4",
        text: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo dice: «Lo que quiero decirte es que ya no sé qué hacer y necesito que me escuches.» Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        question: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo dice: «Lo que quiero decirte es que ya no sé qué hacer y necesito que me escuches.» Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        prompt: "En un mensaje extenso que un amigo te envía por chat contándote un problema, el último párrafo dice: «Lo que quiero decirte es que ya no sé qué hacer y necesito que me escuches.» Antes de él se describen varias cosas que le pasaron. ¿Cómo reconstruirías la función de ese párrafo dentro del mensaje?",
        options: [
          { value: "A", key: "A", id: "A", label: "Compararlo con los párrafos previos que describen lo que le pasó, para ver qué agrega.", text: "Compararlo con los párrafos previos que describen lo que le pasó, para ver qué agrega.", indicator: "contraste" },
          { value: "B", key: "B", id: "B", label: "Observar que está ubicado al final del mensaje, después de las descripciones.", text: "Observar que está ubicado al final del mensaje, después de las descripciones.", indicator: "posicion" },
          { value: "C", key: "C", id: "C", label: "Analizar qué intenta decirte concretamente en ese párrafo.", text: "Analizar qué intenta decirte concretamente en ese párrafo.", indicator: "contenido" },
          { value: "D", key: "D", id: "D", label: "Buscar en el párrafo alguna palabra o expresión, aunque no sea un conector explícito, que oriente sobre qué función cumple.", text: "Buscar en el párrafo alguna palabra o expresión, aunque no sea un conector explícito, que oriente sobre qué función cumple.", indicator: "marcador" }
        ]
      },
      {
        id: "reconstruccion_function_2-Q5",
        questionId: "reconstruccion_function_2-Q5",
        text: "En una publicación de blog personal, hacia el final, después de contar la experiencia principal, hay una sección que dice: «Lo que definitivamente no me sirvió fue levantarme a las cinco de la mañana. Tampoco me ayudó intentar meditar sin guía.» ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        question: "En una publicación de blog personal, hacia el final, después de contar la experiencia principal, hay una sección que dice: «Lo que definitivamente no me sirvió fue levantarme a las cinco de la mañana. Tampoco me ayudó intentar meditar sin guía.» ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        prompt: "En una publicación de blog personal, hacia el final, después de contar la experiencia principal, hay una sección que dice: «Lo que definitivamente no me sirvió fue levantarme a las cinco de la mañana. Tampoco me ayudó intentar meditar sin guía.» ¿Cómo reconstruirías la función de esa sección dentro de la publicación?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar en la sección o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué función cumple.", text: "Buscar en la sección o en su entorno alguna palabra o expresión, aunque no sea un título explícito, que oriente sobre qué función cumple.", indicator: "marcador" },
          { value: "B", key: "B", id: "B", label: "Observar que está ubicada al final, después de la experiencia principal.", text: "Observar que está ubicada al final, después de la experiencia principal.", indicator: "posicion" },
          { value: "C", key: "C", id: "C", label: "Compararla con la sección donde cuenta la experiencia para ver qué aporta cada una.", text: "Compararla con la sección donde cuenta la experiencia para ver qué aporta cada una.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué menciona específicamente la sección y cómo se relaciona con la experiencia principal.", text: "Analizar qué menciona específicamente la sección y cómo se relaciona con la experiencia principal.", indicator: "contenido" }
        ]
      }
    ]
  },
  {
    id: "premisa_oculta_1",
    title: "Premisa oculta 1",
    dimension: "deteccion_de_premisas_ocultas",
    indicators: ["vinculo", "contenido", "ejemplo", "contraste"],
    questions: [
      {
        id: "premisa_oculta_1-Q1",
        questionId: "premisa_oculta_1-Q1",
        text: "Considera este razonamiento: «Si llueve, la calle se moja. Hoy la calle está mojada. Por lo tanto, hoy llovió.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        question: "Considera este razonamiento: «Si llueve, la calle se moja. Hoy la calle está mojada. Por lo tanto, hoy llovió.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        prompt: "Considera este razonamiento: «Si llueve, la calle se moja. Hoy la calle está mojada. Por lo tanto, hoy llovió.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar la relación que conecta lo que se afirma con lo que se concluye, para ver qué eslabón lógico falta entre las premisas y la conclusión.", text: "Buscar la relación que conecta lo que se afirma con lo que se concluye, para ver qué eslabón lógico falta entre las premisas y la conclusión.", indicator: "vinculo" },
          { value: "B", key: "B", id: "B", label: "Analizar qué dicen exactamente las afirmaciones sobre la lluvia y la calle, para ver qué información adicional haría falta para sostener la conclusión.", text: "Analizar qué dicen exactamente las afirmaciones sobre la lluvia y la calle, para ver qué información adicional haría falta para sostener la conclusión.", indicator: "contenido" },
          { value: "C", key: "C", id: "C", label: "Probar el razonamiento con un caso concreto —por ejemplo, pensando en una calle que se mojó sin llover— para ver si el razonamiento se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, pensando en una calle que se mojó sin llover— para ver si el razonamiento se sostiene.", indicator: "ejemplo" },
          { value: "D", key: "D", id: "D", label: "Comparar qué supuestos alternativos podrían agregarse al razonamiento, para ver cuál es el que sostiene la conclusión y cuál no.", text: "Comparar qué supuestos alternativos podrían agregarse al razonamiento, para ver cuál es el que sostiene la conclusión y cuál no.", indicator: "contraste" }
        ]
      },
      {
        id: "premisa_oculta_1-Q2",
        questionId: "premisa_oculta_1-Q2",
        text: "Considera este razonamiento: «Esta planta creció sana durante años. Desde hace tres meses dejó de crecer. Por lo tanto, le falta agua.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        question: "Considera este razonamiento: «Esta planta creció sana durante años. Desde hace tres meses dejó de crecer. Por lo tanto, le falta agua.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        prompt: "Considera este razonamiento: «Esta planta creció sana durante años. Desde hace tres meses dejó de crecer. Por lo tanto, le falta agua.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Analizar qué dicen exactamente las afirmaciones sobre el crecimiento y el estado actual de la planta, para ver qué información adicional haría falta.", text: "Analizar qué dicen exactamente las afirmaciones sobre el crecimiento y el estado actual de la planta, para ver qué información adicional haría falta.", indicator: "contenido" },
          { value: "B", key: "B", id: "B", label: "Comparar supuestos alternativos —falta de luz, trasplante, enfermedad— para ver cuál es el que sostiene la conclusión del razonamiento.", text: "Comparar supuestos alternativos —falta de luz, trasplante, enfermedad— para ver cuál es el que sostiene la conclusión del razonamiento.", indicator: "contraste" },
          { value: "C", key: "C", id: "C", label: "Buscar la relación lógica que conecta lo que se afirma sobre el pasado de la planta con la conclusión sobre el agua, para ver qué eslabón falta.", text: "Buscar la relación lógica que conecta lo que se afirma sobre el pasado de la planta con la conclusión sobre el agua, para ver qué eslabón falta.", indicator: "vinculo" },
          { value: "D", key: "D", id: "D", label: "Probar el razonamiento con un caso concreto —imaginar una planta que dejó de crecer por otra causa— para ver si el razonamiento se sostiene.", text: "Probar el razonamiento con un caso concreto —imaginar una planta que dejó de crecer por otra causa— para ver si el razonamiento se sostiene.", indicator: "ejemplo" }
        ]
      },
      {
        id: "premisa_oculta_1-Q3",
        questionId: "premisa_oculta_1-Q3",
        text: "Considera este razonamiento: «Los últimos cinco veranos en esta ciudad fueron calurosos y secos. El próximo verano será igual.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        question: "Considera este razonamiento: «Los últimos cinco veranos en esta ciudad fueron calurosos y secos. El próximo verano será igual.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        prompt: "Considera este razonamiento: «Los últimos cinco veranos en esta ciudad fueron calurosos y secos. El próximo verano será igual.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Probar el razonamiento con un caso concreto —pensar en un verano pasado en que las condiciones fueron distintas— para ver si el razonamiento se sostiene.", text: "Probar el razonamiento con un caso concreto —pensar en un verano pasado en que las condiciones fueron distintas— para ver si el razonamiento se sostiene.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Buscar la relación lógica que conecta lo observado en los veranos anteriores con la predicción sobre el próximo, para ver qué eslabón falta.", text: "Buscar la relación lógica que conecta lo observado en los veranos anteriores con la predicción sobre el próximo, para ver qué eslabón falta.", indicator: "vinculo" },
          { value: "C", key: "C", id: "C", label: "Comparar supuestos alternativos —que el patrón se mantenga, que haya un cambio de ciclo, que haya factores nuevos— para ver cuál sostiene la conclusión.", text: "Comparar supuestos alternativos —que el patrón se mantenga, que haya un cambio de ciclo, que haya factores nuevos— para ver cuál sostiene la conclusión.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué dicen exactamente las afirmaciones sobre los veranos anteriores, para ver qué información adicional haría falta para sostener la predicción.", text: "Analizar qué dicen exactamente las afirmaciones sobre los veranos anteriores, para ver qué información adicional haría falta para sostener la predicción.", indicator: "contenido" }
        ]
      },
      {
        id: "premisa_oculta_1-Q4",
        questionId: "premisa_oculta_1-Q4",
        text: "Considera este razonamiento: «Mi amigo llegó tarde a la reunión de hoy. Es una persona que siempre llega tarde. Por lo tanto, la próxima vez también llegará tarde.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        question: "Considera este razonamiento: «Mi amigo llegó tarde a la reunión de hoy. Es una persona que siempre llega tarde. Por lo tanto, la próxima vez también llegará tarde.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        prompt: "Considera este razonamiento: «Mi amigo llegó tarde a la reunión de hoy. Es una persona que siempre llega tarde. Por lo tanto, la próxima vez también llegará tarde.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Comparar supuestos alternativos —que hoy haya sido una excepción, que la puntualidad varíe por contexto, que siempre llegue tarde— para ver cuál sostiene la conclusión.", text: "Comparar supuestos alternativos —que hoy haya sido una excepción, que la puntualidad varíe por contexto, que siempre llegue tarde— para ver cuál sostiene la conclusión.", indicator: "contraste" },
          { value: "B", key: "B", id: "B", label: "Probar el razonamiento con un caso concreto —pensar en una situación donde el amigo llegó a tiempo— para ver si el razonamiento se sostiene.", text: "Probar el razonamiento con un caso concreto —pensar en una situación donde el amigo llegó a tiempo— para ver si el razonamiento se sostiene.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Analizar qué dicen exactamente las afirmaciones sobre el comportamiento del amigo, para ver qué información adicional haría falta para sostener la predicción.", text: "Analizar qué dicen exactamente las afirmaciones sobre el comportamiento del amigo, para ver qué información adicional haría falta para sostener la predicción.", indicator: "contenido" },
          { value: "D", key: "D", id: "D", label: "Buscar la relación lógica que conecta lo observado hoy con la predicción sobre el futuro, para ver qué eslabón falta entre las premisas y la conclusión.", text: "Buscar la relación lógica que conecta lo observado hoy con la predicción sobre el futuro, para ver qué eslabón falta entre las premisas y la conclusión.", indicator: "vinculo" }
        ]
      },
      {
        id: "premisa_oculta_1-Q5",
        questionId: "premisa_oculta_1-Q5",
        text: "Considera este razonamiento: «El año pasado subió el precio del pan porque subió el trigo. Este año también subió el trigo. Por lo tanto, este año también subirá el precio del pan.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        question: "Considera este razonamiento: «El año pasado subió el precio del pan porque subió el trigo. Este año también subió el trigo. Por lo tanto, este año también subirá el precio del pan.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        prompt: "Considera este razonamiento: «El año pasado subió el precio del pan porque subió el trigo. Este año también subió el trigo. Por lo tanto, este año también subirá el precio del pan.» ¿Cómo identificarías qué debe suponerse para que el razonamiento se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar la relación lógica que conecta lo que se afirma sobre el trigo con lo que se concluye sobre el pan, para ver qué eslabón falta entre las premisas y la conclusión.", text: "Buscar la relación lógica que conecta lo que se afirma sobre el trigo con lo que se concluye sobre el pan, para ver qué eslabón falta entre las premisas y la conclusión.", indicator: "vinculo" },
          { value: "B", key: "B", id: "B", label: "Probar el razonamiento con un caso concreto —pensar en un año donde subió el trigo pero no el pan— para ver si el razonamiento se sostiene.", text: "Probar el razonamiento con un caso concreto —pensar en un año donde subió el trigo pero no el pan— para ver si el razonamiento se sostiene.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Comparar supuestos alternativos —que el precio del pan siempre siga al del trigo, que haya subsidios, que el pan se importe— para ver cuál sostiene la conclusión.", text: "Comparar supuestos alternativos —que el precio del pan siempre siga al del trigo, que haya subsidios, que el pan se importe— para ver cuál sostiene la conclusión.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué dicen exactamente las afirmaciones sobre el trigo y el pan, para ver qué información adicional haría falta para sostener la predicción.", text: "Analizar qué dicen exactamente las afirmaciones sobre el trigo y el pan, para ver qué información adicional haría falta para sostener la predicción.", indicator: "contenido" }
        ]
      }
    ]
  },
  {
    id: "premisa_oculta_2",
    title: "Premisa oculta 2",
    dimension: "deteccion_de_premisas_ocultas",
    indicators: ["vinculo", "contenido", "ejemplo", "contraste"],
    questions: [
      {
        id: "premisa_oculta_2-Q1",
        questionId: "premisa_oculta_2-Q1",
        text: "Un negocio de barrio bajó sus ventas desde hace seis meses. Se formulan varias explicaciones posibles: que hay más competencia en la zona, que los clientes cambiaron sus hábitos de consumo, que el dueño subió los precios. Alguien concluye: «La caída se debe a la nueva competencia.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        question: "Un negocio de barrio bajó sus ventas desde hace seis meses. Se formulan varias explicaciones posibles: que hay más competencia en la zona, que los clientes cambiaron sus hábitos de consumo, que el dueño subió los precios. Alguien concluye: «La caída se debe a la nueva competencia.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        prompt: "Un negocio de barrio bajó sus ventas desde hace seis meses. Se formulan varias explicaciones posibles: que hay más competencia en la zona, que los clientes cambiaron sus hábitos de consumo, que el dueño subió los precios. Alguien concluye: «La caída se debe a la nueva competencia.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar el eslabón lógico entre lo observado —caída de ventas y presencia de competencia— y la conclusión, para ver qué hace falta suponer.", text: "Buscar el eslabón lógico entre lo observado —caída de ventas y presencia de competencia— y la conclusión, para ver qué hace falta suponer.", indicator: "vinculo" },
          { value: "B", key: "B", id: "B", label: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", text: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", indicator: "contenido" },
          { value: "C", key: "C", id: "C", label: "Probar el razonamiento con un caso concreto —por ejemplo, comparar con un negocio similar que también perdió ventas sin competencia nueva— para ver si la conclusión se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, comparar con un negocio similar que también perdió ventas sin competencia nueva— para ver si la conclusión se sostiene.", indicator: "ejemplo" },
          { value: "D", key: "D", id: "D", label: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", text: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", indicator: "contraste" }
        ]
      },
      {
        id: "premisa_oculta_2-Q2",
        questionId: "premisa_oculta_2-Q2",
        text: "Un amigo dejó de responder mensajes desde hace una semana. Se formulan varias explicaciones posibles: que está enojado por algo, que está muy ocupado, que se le rompió el teléfono. Alguien concluye: «Dejó de responder porque está enojado.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        question: "Un amigo dejó de responder mensajes desde hace una semana. Se formulan varias explicaciones posibles: que está enojado por algo, que está muy ocupado, que se le rompió el teléfono. Alguien concluye: «Dejó de responder porque está enojado.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        prompt: "Un amigo dejó de responder mensajes desde hace una semana. Se formulan varias explicaciones posibles: que está enojado por algo, que está muy ocupado, que se le rompió el teléfono. Alguien concluye: «Dejó de responder porque está enojado.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", text: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", indicator: "contenido" },
          { value: "B", key: "B", id: "B", label: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", text: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", indicator: "contraste" },
          { value: "C", key: "C", id: "C", label: "Buscar el eslabón lógico entre lo observado —dejar de responder— y la conclusión, para ver qué hace falta suponer.", text: "Buscar el eslabón lógico entre lo observado —dejar de responder— y la conclusión, para ver qué hace falta suponer.", indicator: "vinculo" },
          { value: "D", key: "D", id: "D", label: "Probar el razonamiento con un caso concreto —por ejemplo, recordar otra vez en que dejó de responder sin estar enojado— para ver si la conclusión se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, recordar otra vez en que dejó de responder sin estar enojado— para ver si la conclusión se sostiene.", indicator: "ejemplo" }
        ]
      },
      {
        id: "premisa_oculta_2-Q3",
        questionId: "premisa_oculta_2-Q3",
        text: "Las plantas del jardín se marchitaron durante el verano. Se formulan varias explicaciones posibles: que faltó agua, que hubo exceso de sol, que apareció una plaga. Alguien concluye: «Se marchitaron por la plaga.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        question: "Las plantas del jardín se marchitaron durante el verano. Se formulan varias explicaciones posibles: que faltó agua, que hubo exceso de sol, que apareció una plaga. Alguien concluye: «Se marchitaron por la plaga.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        prompt: "Las plantas del jardín se marchitaron durante el verano. Se formulan varias explicaciones posibles: que faltó agua, que hubo exceso de sol, que apareció una plaga. Alguien concluye: «Se marchitaron por la plaga.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Probar el razonamiento con un caso concreto —por ejemplo, recordar otras plantas que se marchitaron por otras causas— para ver si la conclusión se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, recordar otras plantas que se marchitaron por otras causas— para ver si la conclusión se sostiene.", indicator: "ejemplo" },
          { value: "B", key: "B", id: "B", label: "Buscar el eslabón lógico entre lo observado —plantas marchitas— y la conclusión, para ver qué hace falta suponer.", text: "Buscar el eslabón lógico entre lo observado —plantas marchitas— y la conclusión, para ver qué hace falta suponer.", indicator: "vinculo" },
          { value: "C", key: "C", id: "C", label: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", text: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", text: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", indicator: "contenido" }
        ]
      },
      {
        id: "premisa_oculta_2-Q4",
        questionId: "premisa_oculta_2-Q4",
        text: "Una persona rechazó una oferta de trabajo. Se formulan varias explicaciones posibles: el sueldo era bajo, la ubicación era lejos, el horario era incompatible con su vida familiar. Alguien concluye: «Rechazó la oferta porque el sueldo era bajo.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        question: "Una persona rechazó una oferta de trabajo. Se formulan varias explicaciones posibles: el sueldo era bajo, la ubicación era lejos, el horario era incompatible con su vida familiar. Alguien concluye: «Rechazó la oferta porque el sueldo era bajo.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        prompt: "Una persona rechazó una oferta de trabajo. Se formulan varias explicaciones posibles: el sueldo era bajo, la ubicación era lejos, el horario era incompatible con su vida familiar. Alguien concluye: «Rechazó la oferta porque el sueldo era bajo.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", text: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", indicator: "contraste" },
          { value: "B", key: "B", id: "B", label: "Probar el razonamiento con un caso concreto —por ejemplo, imaginar a alguien que rechazó una oferta por el mismo sueldo en otro caso— para ver si la conclusión se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, imaginar a alguien que rechazó una oferta por el mismo sueldo en otro caso— para ver si la conclusión se sostiene.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", text: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", indicator: "contenido" },
          { value: "D", key: "D", id: "D", label: "Buscar el eslabón lógico entre lo observado —el rechazo de la oferta— y la conclusión, para ver qué hace falta suponer.", text: "Buscar el eslabón lógico entre lo observado —el rechazo de la oferta— y la conclusión, para ver qué hace falta suponer.", indicator: "vinculo" }
        ]
      },
      {
        id: "premisa_oculta_2-Q5",
        questionId: "premisa_oculta_2-Q5",
        text: "En una ciudad, el patrón de consumo cambió en los últimos cinco años. Se formulan varias explicaciones posibles: la inflación, las nuevas costumbres de consumo, la llegada de migrantes con hábitos distintos. Alguien concluye: «El cambio se debió a la llegada de migrantes.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        question: "En una ciudad, el patrón de consumo cambió en los últimos cinco años. Se formulan varias explicaciones posibles: la inflación, las nuevas costumbres de consumo, la llegada de migrantes con hábitos distintos. Alguien concluye: «El cambio se debió a la llegada de migrantes.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        prompt: "En una ciudad, el patrón de consumo cambió en los últimos cinco años. Se formulan varias explicaciones posibles: la inflación, las nuevas costumbres de consumo, la llegada de migrantes con hábitos distintos. Alguien concluye: «El cambio se debió a la llegada de migrantes.» ¿Cómo identificarías cuál es la premisa estructuralmente necesaria para que esa conclusión se sostenga?",
        options: [
          { value: "A", key: "A", id: "A", label: "Buscar el eslabón lógico entre lo observado —el cambio en el consumo— y la conclusión, para ver qué hace falta suponer.", text: "Buscar el eslabón lógico entre lo observado —el cambio en el consumo— y la conclusión, para ver qué hace falta suponer.", indicator: "vinculo" },
          { value: "B", key: "B", id: "B", label: "Probar el razonamiento con un caso concreto —por ejemplo, comparar con otra ciudad que también cambió su consumo sin migración— para ver si la conclusión se sostiene.", text: "Probar el razonamiento con un caso concreto —por ejemplo, comparar con otra ciudad que también cambió su consumo sin migración— para ver si la conclusión se sostiene.", indicator: "ejemplo" },
          { value: "C", key: "C", id: "C", label: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", text: "Comparar las explicaciones entre sí, para ver cuál sostendría la conclusión y cuáles no serían necesarias.", indicator: "contraste" },
          { value: "D", key: "D", id: "D", label: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", text: "Analizar qué afirma específicamente cada explicación, para ver cuál de ellas es la que efectivamente se necesita para sostener la conclusión.", indicator: "contenido" }
        ]
      }
    ]
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
    const variables = (typeof test.compute === 'function' ? test.compute(this.answers) : {}) || {};
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

var profileState = {
  authUser: null,
  data: {},
  root: null,
  pendingAvatar: null
};

var INTERESTS_OPTIONS = [
  'Filosofía','Política','Democracia','Historia','Ciencia','Tecnología',
  'Inteligencia artificial','Economía','Psicología','Sociología',
  'Antropología','Arte','Literatura','Música','Cine','Educación',
  'Derechos humanos','Ecología','Salud','Religión y espiritualidad'
];

var EDU_LABELS = {
  basica: 'Básica', media: 'Media', tecnica: 'Técnica',
  universitaria: 'Universitaria', posgrado: 'Posgrado',
  prefiero_no_decir: 'Prefiero no decir'
};

var AGE_LABELS = {
  menos_18: 'Menos de 18', '18_25': '18 a 25', '26_35': '26 a 35',
  '36_50': '36 a 50', '51_65': '51 a 65', mas_65: 'Más de 65',
  prefiero_no_decir: 'Prefiero no decir'
};

var PRONOUN_LABELS = {
  el: 'Él', ella: 'Ella', elle: 'Elle', prefiero_no_decir: 'Prefiero no decir'
};

var AVATARS = [
  { id: 'rastas',    file: '/assets/avatares/rastas.svg' },
  { id: 'afro',      file: '/assets/avatares/afro.svg' },
  { id: 'spiky',     file: '/assets/avatares/spiky.svg' },
  { id: 'largo',     file: '/assets/avatares/largo.svg' },
  { id: 'bob',       file: '/assets/avatares/bob.svg' },
  { id: 'coleta',    file: '/assets/avatares/coleta.svg' },
  { id: 'mono',      file: '/assets/avatares/mono.svg' },
  { id: 'hiyab',     file: '/assets/avatares/hiyab.svg' },
  { id: 'anteojos',  file: '/assets/avatares/anteojos.svg' },
  { id: 'barba',     file: '/assets/avatares/barba.svg' },
  { id: 'bigote',    file: '/assets/avatares/bigote.svg' },
  { id: 'gorra',     file: '/assets/avatares/gorra.svg' },
  { id: 'trenza',    file: '/assets/avatares/trenza.svg' },
  { id: 'rulos',     file: '/assets/avatares/rulos.svg' },
  { id: 'mayor',     file: '/assets/avatares/mayor.svg' },
  { id: 'capucha',   file: '/assets/avatares/capucha.svg' },
  { id: 'vincha',    file: '/assets/avatares/vincha.svg' },
  { id: 'copa',      file: '/assets/avatares/copa.svg' },
  { id: 'ondulado',  file: '/assets/avatares/ondulado.svg' },
  { id: 'dos_monos', file: '/assets/avatares/dos_monos.svg' }
];

function _normalize(str) {
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function _orDash(v) {
  if (v === null || v === undefined) return '—';
  var s = String(v).trim();
  return s.length ? s : '—';
}

function _avatarById(id) {
  for (var i = 0; i < AVATARS.length; i++) {
    if (AVATARS[i].id === id) return AVATARS[i];
  }
  return null;
}

function _avatarDisplayHtml(avatarId, size) {
  var large = size === 'large';
  var cls = large ? 'profile-avatar-large' : 'profile-avatar-small';
  var a = avatarId ? _avatarById(avatarId) : null;
  if (a) {
    return '<img src="' + a.file + '" alt="" class="profile-avatar-img ' + cls + '">';
  }
  return '<div class="profile-avatar-badge ' + cls + '">RF</div>';
}

function _attachLogoutHandler(root) {
  var logout = document.getElementById('authLogout');
  if (!logout) return;
  logout.addEventListener('click', function () {
    if (window.AuthService && typeof AuthService.logout === 'function') {
      AuthService.logout();
    } else if (window.LDIdentityProvider && typeof LDIdentityProvider.clear === 'function') {
      LDIdentityProvider.clear();
    }
    updateAuthStatusLabel();
    renderLoginForm(root);
  });
}

function _setupCountryAutocomplete(inputId) {
  var input = document.getElementById(inputId);
  if (!input) return;

  var wrap = input.parentElement;
  var dropdown = wrap ? wrap.querySelector('.profile-autocomplete-dropdown') : null;
  if (!dropdown) return;

  var countries = (window.LD_COUNTRIES && Array.isArray(window.LD_COUNTRIES))
    ? window.LD_COUNTRIES
    : [];

  var normalized = countries.map(function (c) {
    return { label: c, norm: _normalize(c) };
  });

  function renderDropdown(query) {
    var q = _normalize(query).trim();
    if (q.length < 1) {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      return;
    }
    var matches = normalized.filter(function (c) {
      return c.norm.indexOf(q) === 0;
    }).slice(0, 8);

    if (!matches.length) {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      return;
    }

    dropdown.innerHTML = matches.map(function (c) {
      return '<div class="profile-autocomplete-item" data-value="' +
        escapeAuthHtml(c.label) + '">' + escapeAuthHtml(c.label) + '</div>';
    }).join('');

    dropdown.hidden = false;

    dropdown.querySelectorAll('.profile-autocomplete-item').forEach(function (item) {
      item.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        input.value = item.getAttribute('data-value');
        dropdown.hidden = true;
        dropdown.innerHTML = '';
      });
    });
  }

  input.addEventListener('input', function () {
    renderDropdown(input.value);
  });

  input.addEventListener('focus', function () {
    if (input.value) renderDropdown(input.value);
  });

  input.addEventListener('blur', function () {
    setTimeout(function () {
      dropdown.hidden = true;
    }, 200);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.hidden = true;
    }
  });
}

function renderAuthenticatedUser(root, user) {
  profileState.authUser = user || null;
  profileState.root = root;
  profileState.data = {};
  profileState.pendingAvatar = null;

  root.innerHTML = `
    <div class="view">
      <div class="view-eyebrow">Cuenta</div>
      <h1 class="view-title">Usuario</h1>
      <div class="view-body">
        <p>Cargando tu perfil…</p>
      </div>
    </div>
  `;

  if (window.ProfileService && typeof ProfileService.getUserInfo === 'function') {
    ProfileService.getUserInfo()
      .then(function (data) {
        profileState.data = data || {};
        renderProfileView(root);
      })
      .catch(function (err) {
        console.warn('[Usuario] No se pudo leer el perfil:', err.message);
        profileState.data = {};
        renderProfileView(root);
      });
  } else {
    renderProfileView(root);
  }
}

function renderProfileView(root) {
  var data = profileState.data || {};
  var authUser = profileState.authUser || {};

  var name = data.name || authUser.name || authUser.email || 'Usuario';
  var email = data.email || authUser.email || '';
  var displayName = _orDash(data.display_name);
  var bio = _orDash(data.bio);
  var eduLabel = EDU_LABELS[data.education_level] || '—';
  var ageLabel = AGE_LABELS[data.age_range] || '—';
  var pronounsLabel = PRONOUN_LABELS[data.pronouns] || '—';
  var nationality = _orDash(data.nationality);
  var country = _orDash(data.country);
  var interests = Array.isArray(data.interests) ? data.interests : [];

  var interestsHtml = interests.length
    ? '<div class="profile-interest-list">' +
        interests.map(function (i) {
          return '<span class="profile-interest-chip">' + escapeAuthHtml(i) + '</span>';
        }).join('') +
      '</div>'
    : '<span class="profile-empty">—</span>';

  var avatarHtml = _avatarDisplayHtml(data.avatar_id, 'large');

  root.innerHTML = `
    <div class="view">
      <div class="view-eyebrow">Cuenta</div>
      <h1 class="view-title">Usuario</h1>
      <div class="view-body">

        <div class="profile-view-avatar">${avatarHtml}</div>

        <div class="profile-view-row">
          <div class="profile-view-label">Nombre para mostrar</div>
          <div class="profile-view-value">${escapeAuthHtml(displayName)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Sobre ti</div>
          <div class="profile-view-value profile-view-value--multiline">${escapeAuthHtml(bio)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Pronombres</div>
          <div class="profile-view-value">${escapeAuthHtml(pronounsLabel)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Edad</div>
          <div class="profile-view-value">${escapeAuthHtml(ageLabel)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Nivel educacional</div>
          <div class="profile-view-value">${escapeAuthHtml(eduLabel)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Nacionalidad</div>
          <div class="profile-view-value">${escapeAuthHtml(nationality)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">País de residencia</div>
          <div class="profile-view-value">${escapeAuthHtml(country)}</div>
        </div>

        <div class="profile-view-row">
          <div class="profile-view-label">Intereses</div>
          <div class="profile-view-value">${interestsHtml}</div>
        </div>

        <div class="profile-actions">
          <button type="button" id="profileEdit" class="profile-save-btn">
            Editar perfil
          </button>
        </div>

        <div id="profileMessage" class="profile-message"></div>

        <hr class="profile-sep">

        <p class="profile-session-info">
          Sesión iniciada como <strong>${escapeAuthHtml(name)}</strong>${email ? ' · ' + escapeAuthHtml(email) : ''}
        </p>

        <button type="button" id="authLogout" class="profile-logout-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  `;

  var editBtn = document.getElementById('profileEdit');
  if (editBtn) {
    editBtn.addEventListener('click', function () {
      profileState.pendingAvatar = data.avatar_id || null;
      renderProfileForm(root);
    });
  }

  _attachLogoutHandler(root);
  updateAuthStatusLabel();
}

function renderProfileForm(root) {
  var data = profileState.data || {};
  var authUser = profileState.authUser || {};

  var name = data.name || authUser.name || authUser.email || 'Usuario';
  var email = data.email || authUser.email || '';
  var displayName = data.display_name || '';
  var bio = data.bio || '';
  var edu = data.education_level || '';
  var age = data.age_range || '';
  var pronouns = data.pronouns || '';
  var nationality = data.nationality || '';
  var country = data.country || '';
  var interests = Array.isArray(data.interests) ? data.interests : [];
  var pendingAvatar = profileState.pendingAvatar;

  var interestsHtml = INTERESTS_OPTIONS.map(function (opt) {
    var selected = interests.indexOf(opt) !== -1 ? ' selected' : '';
    return '<button type="button" class="profile-interest-toggle' + selected +
      '" data-interest="' + escapeAuthHtml(opt) + '">' + escapeAuthHtml(opt) + '</button>';
  }).join('');

  var ageOptions = [
    { v: '', l: 'Prefiero no decir' },
    { v: 'menos_18', l: 'Menos de 18' },
    { v: '18_25', l: '18 a 25' },
    { v: '26_35', l: '26 a 35' },
    { v: '36_50', l: '36 a 50' },
    { v: '51_65', l: '51 a 65' },
    { v: 'mas_65', l: 'Más de 65' }
  ].map(function (o) {
    return '<option value="' + o.v + '"' + (age === o.v ? ' selected' : '') + '>' + o.l + '</option>';
  }).join('');

  var pronounOptions = [
    { v: '', l: 'Prefiero no decir' },
    { v: 'el', l: 'Él' },
    { v: 'ella', l: 'Ella' },
    { v: 'elle', l: 'Elle' }
  ].map(function (o) {
    return '<option value="' + o.v + '"' + (pronouns === o.v ? ' selected' : '') + '>' + o.l + '</option>';
  }).join('');

  var avatarHtml = _avatarDisplayHtml(pendingAvatar, 'small');

  var avatarGridHtml = AVATARS.map(function (a) {
    var sel = pendingAvatar === a.id ? ' selected' : '';
    return '<button type="button" class="profile-avatar-option' + sel +
      '" data-avatar-id="' + a.id + '">' +
      '<img src="' + a.file + '" alt="">' +
      '</button>';
  }).join('');

  root.innerHTML = `
    <div class="view">
      <div class="view-eyebrow">Cuenta</div>
      <h1 class="view-title">Usuario</h1>
      <div class="view-body">

        <div class="profile-avatar-block">
          ${avatarHtml}
          <button type="button" id="profileToggleAvatarGrid" class="profile-avatar-btn">
            Elegir avatar
          </button>
          <div id="profileAvatarGrid" class="profile-avatar-grid" hidden>
            ${avatarGridHtml}
          </div>
        </div>

        <div class="profile-field">
          <label for="profileDisplayName">Nombre para mostrar</label>
          <input type="text" id="profileDisplayName" class="profile-input" maxlength="50" placeholder="${escapeAuthHtml(name)}" value="${escapeAuthHtml(displayName)}">
        </div>

        <div class="profile-field">
          <label for="profileBio">Sobre ti</label>
          <textarea id="profileBio" class="profile-input profile-textarea" maxlength="300" rows="4" placeholder="Podés escribir una breve descripción si querés.">${escapeAuthHtml(bio)}</textarea>
        </div>

        <div class="profile-field">
          <label for="profilePronouns">Pronombres</label>
          <select id="profilePronouns" class="profile-input">${pronounOptions}</select>
        </div>

        <div class="profile-field">
          <label for="profileAge">Edad</label>
          <select id="profileAge" class="profile-input">${ageOptions}</select>
        </div>

        <div class="profile-field">
          <label for="profileEdu">Nivel educacional</label>
          <select id="profileEdu" class="profile-input">
            <option value=""${edu === '' ? ' selected' : ''}>Prefiero no decir</option>
            <option value="basica"${edu === 'basica' ? ' selected' : ''}>Básica</option>
            <option value="media"${edu === 'media' ? ' selected' : ''}>Media</option>
            <option value="tecnica"${edu === 'tecnica' ? ' selected' : ''}>Técnica</option>
            <option value="universitaria"${edu === 'universitaria' ? ' selected' : ''}>Universitaria</option>
            <option value="posgrado"${edu === 'posgrado' ? ' selected' : ''}>Posgrado</option>
          </select>
        </div>

        <div class="profile-field">
          <label for="profileNationality">Nacionalidad</label>
          <div class="profile-autocomplete-wrap">
            <input type="text" id="profileNationality" class="profile-input" autocomplete="off" maxlength="60" placeholder="Empezá a escribir…" value="${escapeAuthHtml(nationality)}">
            <div class="profile-autocomplete-dropdown" hidden></div>
          </div>
        </div>

        <div class="profile-field">
          <label for="profileCountry">País de residencia</label>
          <div class="profile-autocomplete-wrap">
            <input type="text" id="profileCountry" class="profile-input" autocomplete="off" maxlength="60" placeholder="Empezá a escribir…" value="${escapeAuthHtml(country)}">
            <div class="profile-autocomplete-dropdown" hidden></div>
          </div>
        </div>

        <div class="profile-field">
          <label>Intereses</label>
          <div class="profile-interests-grid">${interestsHtml}</div>
        </div>

        <div class="profile-actions profile-actions--dual">
          <button type="button" id="profileSave" class="profile-save-btn">
            Guardar cambios
          </button>
          <button type="button" id="profileCancel" class="profile-cancel-btn">
            Cancelar
          </button>
        </div>

        <div id="profileMessage" class="profile-message"></div>

        <hr class="profile-sep">

        <p class="profile-session-info">
          Sesión iniciada como <strong>${escapeAuthHtml(name)}</strong>${email ? ' · ' + escapeAuthHtml(email) : ''}
        </p>

        <button type="button" id="authLogout" class="profile-logout-btn">
          Cerrar sesión
        </button>
      </div>
    </div>
  `;

  // Toggle del grid de avatares
  var toggleGrid = document.getElementById('profileToggleAvatarGrid');
  var grid = document.getElementById('profileAvatarGrid');
  if (toggleGrid && grid) {
    toggleGrid.addEventListener('click', function () {
      grid.hidden = !grid.hidden;
    });
  }

  // Selección de avatar
  root.querySelectorAll('.profile-avatar-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      profileState.pendingAvatar = btn.getAttribute('data-avatar-id');
      root.querySelectorAll('.profile-avatar-option').forEach(function (b) {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      // Actualizar el badge/avatar grande
      var block = root.querySelector('.profile-avatar-block');
      var current = block.querySelector('.profile-avatar-svg, .profile-avatar-badge');
      if (current) {
        var newHtml = _avatarDisplayHtml(profileState.pendingAvatar, 'small');
        var temp = document.createElement('div');
        temp.innerHTML = newHtml;
        block.replaceChild(temp.firstChild, current);
      }
    });
  });

  // Intereses
  root.querySelectorAll('.profile-interest-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('selected');
    });
  });

  // Autocomplete custom
  _setupCountryAutocomplete('profileNationality');
  _setupCountryAutocomplete('profileCountry');

  var saveBtn = document.getElementById('profileSave');
  var cancelBtn = document.getElementById('profileCancel');
  var message = document.getElementById('profileMessage');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      profileState.pendingAvatar = null;
      renderProfileView(root);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      message.textContent = 'Guardando…';
      message.className = 'profile-message';

      var selectedInterests = [];
      root.querySelectorAll('.profile-interest-toggle.selected').forEach(function (btn) {
        selectedInterests.push(btn.getAttribute('data-interest'));
      });

      var payload = {
        display_name: document.getElementById('profileDisplayName').value.trim() || null,
        bio: document.getElementById('profileBio').value.trim() || null,
        education_level: document.getElementById('profileEdu').value || null,
        age_range: document.getElementById('profileAge').value || null,
        pronouns: document.getElementById('profilePronouns').value || null,
        nationality: document.getElementById('profileNationality').value.trim() || null,
        country: document.getElementById('profileCountry').value.trim() || null,
        avatar_id: profileState.pendingAvatar || null,
        interests: selectedInterests
      };

      if (!window.ProfileService || typeof ProfileService.updateUserInfo !== 'function') {
        message.textContent = 'No se pudo guardar: servicio no disponible.';
        message.className = 'profile-message profile-message--error';
        return;
      }

      saveBtn.disabled = true;
      if (cancelBtn) cancelBtn.disabled = true;

      ProfileService.updateUserInfo(payload)
        .then(function (updated) {
          profileState.data = Object.assign({}, profileState.data, updated || payload);
          profileState.pendingAvatar = null;
          renderProfileView(root);
          var msg = document.getElementById('profileMessage');
          if (msg) {
            msg.textContent = 'Cambios guardados.';
            msg.className = 'profile-message profile-message--ok';
            setTimeout(function () {
              var m2 = document.getElementById('profileMessage');
              if (m2) {
                m2.textContent = '';
                m2.className = 'profile-message';
              }
            }, 3000);
          }
        })
        .catch(function (err) {
          message.textContent = 'No se pudo guardar: ' + (err.message || 'error desconocido');
          message.className = 'profile-message profile-message--error';
          saveBtn.disabled = false;
          if (cancelBtn) cancelBtn.disabled = false;
        });
    });
  }

  _attachLogoutHandler(root);
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
      onEnter: function() {
        var updateCta = function() {
          if (typeof CurrentUser === 'undefined') return;
          var cta = document.getElementById('rf-cta-crear-cuenta');
          if (!cta) return;
          cta.style.display = CurrentUser.exists() ? 'none' : 'block';
        };
        updateCta();
        if (!window._rfCtaBound && typeof EventBus !== 'undefined' && EventBus.on) {
          window._rfCtaBound = true;
          EventBus.on('identity:changed', updateCta);
        }
      },
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Tu espacio de aprendizaje</div>
            <h1 class="view-title">Rey Filósofo eres tú</h1>
            <div class="view-body">
              <p>El nombre viene de <strong>Platón</strong>. En <em>La República</em> imaginó al filósofo-rey: alguien cuya preparación para gobernar no venía del poder, sino de la capacidad de conocer, comprender y examinar la realidad.</p>

              <p>LogoDemocracy invierte el sueño de Platón: ya no hay un rey que gobierne a su pueblo, sino personas que aprenden a <strong>gobernar su propio entendimiento</strong>.</p>

              <div class="view-question-block">
                <p class="view-question">¿Qué hace un rey con su poder?</p>
                <p class="view-question view-question--light">Si tu atención es tu reino, ¿Quién la gobierna?</p>
              </div>

              <div class="rf-cta-inline" id="rf-cta-crear-cuenta">
                <button class="rf-cta-button rf-cta-button--light" onclick="event.stopPropagation();(function(){var nav=document.querySelector('.module-nav');if(nav&&!nav.classList.contains('open'))nav.classList.add('open');var p=document.querySelector('#ld-header-auth .auth-panel');if(p)p.hidden=false;var t=document.querySelector('#ld-header-auth .auth-toggle');if(t&&t.textContent.indexOf('Crear')>-1)t.click();})()">
                  Crear cuenta →
                </button>
              </div>

              <p>Rey Filósofo no es una autoridad que decide qué debes pensar. No es una máquina que intenta retenerte.</p>

              <p>En una red social convencional, un algoritmo decide qué ves. Aquí ocurre lo contrario: <strong>tú decides qué quieres comprender y en qué invertir tu atención</strong>.</p>

              <p class="view-question">No queremos capturar tu atención. Queremos devolvértela.</p>

              <p>Leer es pensar. Y también entretiene. Cuando lees con atención, no solo recibes información: comparas ideas, dudas, vuelves sobre lo que no entendiste, reconstruyes lo que el texto propone. Esa práctica te ayuda a pensar mejor.</p>

              <p>Hay un mundo esperándote para leer.</p>

              <p class="view-question view-question--light">Crea tu propia librería y empieza por donde tú quieras.</p>

              <div class="rf-cta-inline">
                <button class="rf-cta-button rf-cta-button--light" onclick="window.ReyFilosofo.navigateTo('aprende')">
                  Crear mi librería →
                </button>
              </div>
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
              <p class="epistemic">
                <strong>En construcción.</strong>
              </p>
              <p>
                Esta sección todavía no está disponible. Se habilitará cuando
                la infraestructura de microtests y evidencia acumulada esté
                completa.
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

    biblioteca: {
      title: 'Rey Filósofo — Mi Biblioteca',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Biblioteca personal</div>
            <h1 class="view-title">Mi Biblioteca</h1>
            <div id="rf-biblioteca-root"></div>
          </div>
        `;
      },
      onEnter: function() {
        if (window.ReyFilosofoBiblioteca && typeof window.ReyFilosofoBiblioteca.mount === 'function') {
          window.ReyFilosofoBiblioteca.mount();
        } else {
          console.error('[RF] ReyFilosofoBiblioteca no está cargado.');
        }
      },
      onExit: function() {
        if (window.ReyFilosofoBiblioteca && typeof window.ReyFilosofoBiblioteca.unmount === 'function') {
          window.ReyFilosofoBiblioteca.unmount();
        }
      }
    },

    aprende: {
      title: 'Rey Filósofo — Aprende lo que tú quieras',
      render: function() {
        return `
          <div class="view">
            <div class="view-eyebrow">Aprendizaje autodirigido</div>
            <h1 class="view-title">Aprende lo que tú quieras</h1>
            <div id="rf-libreria-root"></div>
          </div>
        `;
      },
      onEnter: function() {
        if (window.ReyFilosofoLibreria && typeof window.ReyFilosofoLibreria.mount === 'function') {
          window.ReyFilosofoLibreria.mount();
        } else {
          console.error('[RF] ReyFilosofoLibreria no está cargado.');
        }
      },
      onExit: function() {
        if (window.ReyFilosofoLibreria && typeof window.ReyFilosofoLibreria.unmount === 'function') {
          window.ReyFilosofoLibreria.unmount();
        }
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

        if (!this._profileRefreshBound && typeof EventBus !== 'undefined') {
          this._profileRefreshBound = true;
          var profileView = this;

          EventBus.on('microtest:completed', function() {
            if (document.getElementById('learningProfileRoot')) {
              profileView.onEnter();
            }
          });
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

    var deterministicQualitativeItems = microtestQualitative.filter(function(item) {
  return (
    item &&
    item.deterministicProfile &&
    item.deterministicProfile.interpretation &&
    typeof item.deterministicProfile.interpretation.descripcion === 'string' &&
    item.deterministicProfile.interpretation.descripcion.trim() &&
    typeof item.deterministicProfile.interpretation.ejemplo === 'string' &&
    item.deterministicProfile.interpretation.ejemplo.trim()
  );
});

var qualitativeHtml = deterministicQualitativeItems.map(function(item) {
  var interpretation = item.deterministicProfile.interpretation;
  var itemTitle = item.title || item.testId || 'Microtest';

  return `
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
        Resultado cualitativo · ${itemTitle}
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
          <strong>Descripción</strong>
          <p>${interpretation.descripcion}</p>
        </div>
        <div>
          <strong>Ejemplo</strong>
          <p>${interpretation.ejemplo}</p>
        </div>
      </div>
    </div>
  `;
}).join('');

if (!qualitativeHtml) {
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
        var validMicrotestIds = (typeof MICROTESTS !== 'undefined' && Array.isArray(MICROTESTS))
          ? MICROTESTS.map(function(t) { return t && t.id; }).filter(Boolean)
          : [];

        var evidenceAttempts = microtestEvidence.filter(function(item) {
          return (
            item &&
            typeof item === 'object' &&
            item.testId &&
            validMicrotestIds.indexOf(item.testId) !== -1
          );
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
              Microtests completados: ${completedTests.filter(function(id) { return validMicrotestIds.indexOf(id) !== -1; }).length} / ${MICROTESTS.length}
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
