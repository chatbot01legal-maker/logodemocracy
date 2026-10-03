'use strict';

module.exports = {
  "source_document": "brujula_microtest_1.md",
  "testId": "brujula",
  "nombre_conceptual": "Brújula",
  "dimension": "Entrada al contenido",
  "definicion_operacional": "La forma en que una persona inicia la construcción de significado frente a un contenido.",
  "indicadores": [
    {
      "name": "ejemplo",
      "code": "E"
    },
    {
      "name": "principio",
      "code": "P"
    },
    {
      "name": "analogia",
      "code": "A"
    },
    {
      "name": "secuencia",
      "code": "S"
    }
  ],
  "instrument_version": "1.0.0",
  "rule_version": "1.0.0",
  "questions": [
    {
      "id": "brujula-Q1",
      "questionId": "brujula-Q1",
      "text": "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
      "question": "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
      "prompt": "Te invitan a jugar un juego de mesa moderno que tiene muchas piezas y un tablero complejo. ¿Cómo prefieres empezar a entenderlo?",
      "options": [
        {
          "id": "Q1-A1",
          "text": "Leer el manual desde la página uno, revisando la fase de preparación y luego la estructura del turno.",
          "indicator": "secuencia"
        },
        {
          "id": "Q1-A2",
          "text": "Pedir que jueguen una ronda de demostración para ver qué acciones se toman en un turno real.",
          "indicator": "ejemplo"
        },
        {
          "id": "Q1-A3",
          "text": "Preguntar inmediatamente cómo se ganan los puntos de victoria y cuál es el objetivo final.",
          "indicator": "principio"
        },
        {
          "id": "Q1-A4",
          "text": "Preguntar a qué otros juegos que ya conoces se parece en sus mecánicas.",
          "indicator": "analogia"
        }
      ]
    },
    {
      "id": "brujula-Q2",
      "questionId": "brujula-Q2",
      "text": "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
      "question": "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
      "prompt": "Descargas una nueva aplicación de productividad para organizar tus proyectos. ¿Qué sueles hacer primero?",
      "options": [
        {
          "id": "Q2-A1",
          "text": "Revisar la propuesta de valor de la app para entender su lógica general de organización.",
          "indicator": "principio"
        },
        {
          "id": "Q2-A2",
          "text": "Buscar un video donde alguien muestre cómo estructuró su propio proyecto específico en la app.",
          "indicator": "ejemplo"
        },
        {
          "id": "Q2-A3",
          "text": "Explorar la interfaz buscando similitudes con herramientas que usaste en el pasado (carpetas, etiquetas).",
          "indicator": "analogia"
        },
        {
          "id": "Q2-A4",
          "text": "Hacer clic en el recorrido guiado inicial y completar los pasos de configuración uno por uno.",
          "indicator": "secuencia"
        }
      ]
    },
    {
      "id": "brujula-Q3",
      "questionId": "brujula-Q3",
      "text": "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
      "question": "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
      "prompt": "Tienes que armar un mueble de oficina que viene desarmado en una caja con muchas partes. ¿Cómo inicias el proceso?",
      "options": [
        {
          "id": "Q3-A1",
          "text": "Miras detenidamente la foto del mueble terminado en la caja para tener clara la imagen del resultado.",
          "indicator": "ejemplo"
        },
        {
          "id": "Q3-A2",
          "text": "Abres el manual de instrucciones y buscas el paso número uno antes de tocar las piezas.",
          "indicator": "secuencia"
        },
        {
          "id": "Q3-A3",
          "text": "Agrupas todas las piezas (tornillos, tablas) para entender la lógica del sistema de ensamblaje primero.",
          "indicator": "principio"
        },
        {
          "id": "Q3-A4",
          "text": "Recuerdas cómo armaste una repisa similar hace unos años y aplicas esa misma intuición inicial.",
          "indicator": "analogia"
        }
      ]
    },
    {
      "id": "brujula-Q4",
      "questionId": "brujula-Q4",
      "text": "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
      "question": "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
      "prompt": "Estás leyendo un artículo extenso sobre un fenómeno económico complejo que afecta a tu país. ¿En qué te enfocas para anclar tu comprensión?",
      "options": [
        {
          "id": "Q4-A1",
          "text": "Prestas atención a cuando el autor compara la economía del país con el presupuesto de una familia.",
          "indicator": "analogia"
        },
        {
          "id": "Q4-A2",
          "text": "Buscas el párrafo introductorio que define la ley macroeconómica central que explica el problema.",
          "indicator": "principio"
        },
        {
          "id": "Q4-A3",
          "text": "Lees primero la línea de tiempo de eventos para entender cómo se desencadenó la situación paso a paso.",
          "indicator": "secuencia"
        },
        {
          "id": "Q4-A4",
          "text": "Te centras en la historia de una persona o empresa real mencionada en el texto que sufre el fenómeno.",
          "indicator": "ejemplo"
        }
      ]
    },
    {
      "id": "brujula-Q5",
      "questionId": "brujula-Q5",
      "text": "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
      "question": "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
      "prompt": "Quieres preparar un plato tradicional de una cultura extranjera que nunca has cocinado. ¿Cómo abordas la preparación?",
      "options": [
        {
          "id": "Q5-A1",
          "text": "Sigues la receta al pie de la letra, pesando cada ingrediente y respetando el orden exacto.",
          "indicator": "secuencia"
        },
        {
          "id": "Q5-A2",
          "text": "Identificas qué guiso de tu propio país utiliza una base similar para guiarte por intuición.",
          "indicator": "analogia"
        },
        {
          "id": "Q5-A3",
          "text": "Buscas una foto o video corto para ver exactamente el color y la textura que debería tener la salsa.",
          "indicator": "ejemplo"
        },
        {
          "id": "Q5-A4",
          "text": "Lees sobre el perfil de sabor de esa cultura (equilibrio entre ácido, dulce y picante) antes de empezar.",
          "indicator": "principio"
        }
      ]
    }
  ],
  "signatures": {
    "ejemplo:5": {
      "signature": [5, 0, 0, 0],
      "descripcion": "Tus respuestas muestran una marcada tendencia a buscar casos concretos antes de avanzar. Esta evidencia sugiere que te resulta útil observar demostraciones prácticas puras para construir significado sin depender de teorías previas.",
      "ejemplo": "Al aprender un software financiero, podrías preferir abrir directamente un archivo de prueba con datos cargados para ver cómo luce un reporte terminado, saltándote las explicaciones estructurales del manual."
    },
    "principio:5": {
      "signature": [0, 5, 0, 0],
      "descripcion": "En este ejercicio parece ayudarte identificar la regla central o el propósito global inmediatamente. La evidencia sugiere una entrada abstracta, buscando la arquitectura de la información antes de ver los detalles.",
      "ejemplo": "En un curso de física, podrías enfocarte primero en memorizar y comprender la ecuación fundamental de la gravedad en su forma pura, antes de que te presenten el problema del péndulo o la caída libre."
    },
    "analogia:5": {
      "signature": [0, 0, 5, 0],
      "descripcion": "Tus respuestas muestran una estrategia basada enteramente en transferir conocimientos previos. Parece resultarte útil construir puentes inmediatos entre lo nuevo y lo que ya conoces, usando similitudes para anclar la información.",
      "ejemplo": "Si estás aprendiendo a tocar el bajo eléctrico tras años de tocar guitarra, podrías basar toda tu primera aproximación en mapear dónde están las notas correspondientes, ignorando temporalmente la técnica específica del nuevo instrumento."
    },
    "secuencia:5": {
      "signature": [0, 0, 0, 5],
      "descripcion": "Esta evidencia sugiere una entrada claramente guiada por el orden cronológico o procedimental. En este ejercicio, parece resultarte útil seguir instrucciones strictly paso a paso para reducir la fricción inicial.",
      "ejemplo": "Al configurar un nuevo servidor web, podrías seguir el documento de instalación línea por línea ejecutando cada comando en orden, sin detenerte a analizar qué hace cada línea hasta que el proceso esté completo."
    },
    "ejemplo:4|principio:1": {
      "signature": [4, 1, 0, 0],
      "descripcion": "Tus respuestas muestran una inclinación dominante hacia casos concretos, con una ligera consideración por las reglas generales. Sugiere que el andamiaje principal es la práctica, complementado con un entendimiento del concepto subyacente.",
      "ejemplo": "En una clase de pintura, podrías observar cómo el profesor mezcla los colores, y solo después preguntar sobre la teoría del círculo cromático para validar lo que ya observaste."
    },
    "ejemplo:4|analogia:1": {
      "signature": [4, 0, 1, 0],
      "descripcion": "En este ejercicio aparece una preferencia por la demostración práctica, apoyada puntualmente por comparaciones. Podría indicar que ver la acción ejecutada es tu prioridad, pero te ayuda a relacionarla con algo familiar.",
      "ejemplo": "Al aprender un paso de baile nuevo, podrías preferir ver al instructor ejecutarlo varias veces, y luego asimilarlo cuando dice que es como esquivar un charco."
    },
    "ejemplo:4|secuencia:1": {
      "signature": [4, 0, 0, 1],
      "descripcion": "La evidencia sugiere que buscas iniciar desde la observación de casos reales, utilizando el orden procedimental solo como un apoyo menor. Los ejemplos son tu mapa principal.",
      "ejemplo": "Al armar una computadora, podrías enfocarte en ver videos de builds terminadas, y solo revisar el primer paso del manual para saber exactamente qué cable conectar primero."
    },
    "principio:4|ejemplo:1": {
      "signature": [1, 4, 0, 0],
      "descripcion": "Tus respuestas muestran que la arquitectura conceptual guía tu entrada, apoyándote solo de forma secundaria en un caso demostrativo. Buscar las reglas del sistema parece ser tu prioridad.",
      "ejemplo": "Al estudiar derecho, podrías buscar entender primero el espíritu y la estructura de una ley, y luego leer un único caso de jurisprudencia para confirmar que has comprendido el concepto."
    },
    "principio:4|analogia:1": {
      "signature": [0, 4, 1, 0],
      "descripcion": "En este ejercicio parece ayudarte entender los sistemas de forma abstracta, usando comparaciones solo ocasionalmente para clarificar conceptos densos. La regla general predomina sobre la asociación.",
      "ejemplo": "Frente a un nuevo modelo económico, podrías centrarte en la interacción de sus variables formales, y utilizar la metáfora del motor acelerado solo para fijar el concepto de inflación."
    },
    "principio:4|secuencia:1": {
      "signature": [0, 4, 0, 1],
      "descripcion": "La evidencia sugiere que entras al contenido buscando la lógica global, y utilizas las guías paso a paso solo como soporte táctico inicial.",
      "ejemplo": "Al aprender un lenguaje de programación, podrías estudiar primero su paradigma orientado a objetos, y seguir el tutorial de \"Hola Mundo\" solo para asegurar que el entorno funciona."
    },
    "analogia:4|ejemplo:1": {
      "signature": [1, 0, 4, 0],
      "descripcion": "Tus respuestas muestran una evidente dependencia en asociar lo nuevo con lo conocido, utilizando un caso concreto aislado para afianzar esa relación. La metáfora es tu principal herramienta de entrada.",
      "ejemplo": "Si aprendes un nuevo idioma románico, podrías asumir reglas buscando paralelos directos con tu idioma natal, y memorizar una frase exacta solo para confirmar el acento."
    },
    "analogia:4|principio:1": {
      "signature": [0, 1, 4, 0],
      "descripcion": "En este ejercicio aparece una estrategia basada en comparar sistemas, integrando ocasionalmente reglas fundamentales puras. Parece útil transferir conocimientos estructurales.",
      "ejemplo": "Al adoptar un nuevo software 3D, podrías aprenderlo traduciendo mentalmente las herramientas del software que ya usabas, y buscar en la documentación oficial solo cuando la lógica estructural cambie drásticamente."
    },
    "analogia:4|secuencia:1": {
      "signature": [0, 0, 4, 1],
      "descripcion": "La evidencia sugiere que priorizas encontrar similitudes con experiencias previas, utilizando el seguimiento ordenado de instrucciones solo para destrabar partes específicas.",
      "ejemplo": "Al instalar una red doméstica, podrías aplicar lo que sabes de conexiones anteriores, y consultar el manual en orden solo si el router emite una luz de error que desconoces."
    },
    "secuencia:4|ejemplo:1": {
      "signature": [1, 0, 0, 4],
      "descripcion": "Tus respuestas muestran una clara inclinación a seguir procesos ordenados, apoyándote ocasionalmente en un caso terminado para verificar tu avance.",
      "ejemplo": "Durante una receta compleja de pastelería, podrías seguir el gramaje y el orden estrictamente, deteniéndote una sola vez a ver una foto de la masa para asegurarte de que vas bien."
    },
    "secuencia:4|principio:1": {
      "signature": [0, 1, 0, 4],
      "descripcion": "En este ejercicio parece resultarte útil guiarte por el procedimiento estricto, incorporando pequeñas dosis de entendimiento sistémico. Avanzas paso a paso pero validando la regla detrás.",
      "ejemplo": "Al ensamblar electrónica, podrías seguir el orden de las instrucciones visuales, deteniéndote brevemente para entender por qué la resistencia va antes que el LED."
    },
    "secuencia:4|analogia:1": {
      "signature": [0, 0, 1, 4],
      "descripcion": "La evidencia sugiere una entrada metódica paso a paso, que utiliza analogías menores para facilitar la comprensión de alguna instrucción compleja.",
      "ejemplo": "Al hacer un origami de alto nivel, podrías seguir el orden numérico de los dobleces, y cuando un paso sea confuso, te ayudaría a pensar que el pliegue es como cerrar un libro."
    },
    "ejemplo:3|principio:2": {
      "signature": [3, 2, 0, 0],
      "descripcion": "Tus respuestas muestran una oscilación casi equilibrada entre buscar casos concretos y comprender las reglas generales. Esta evidencia sugiere que integras la demostración práctica inmediatamente con la teoría subyacente.",
      "ejemplo": "En una clase de estadística, te ayudaría a ver cómo se resuelve un problema poblacional real, e inmediatamente después deducir cómo funciona la fórmula matemática que permitió ese resultado."
    },
    "ejemplo:3|analogia:2": {
      "signature": [3, 0, 2, 0],
      "descripcion": "En este ejercicio aparece una combinación entre apoyarte en demostraciones prácticas y buscar asociaciones con lo familiar. Parece útil anclar lo visual en lo conocido.",
      "ejemplo": "Al aprender un nuevo estilo de nado, te ayudaría a ver a un nadador experto ejecutarlo y asimilar la idea cuando el entrenador te dice que el movimiento del brazo es como sacar agua de un barril."
    },
    "ejemplo:3|secuencia:2": {
      "signature": [3, 0, 0, 2],
      "descripcion": "La evidencia sugiere que entras al contenido alternando entre la observación del resultado concreto y la ejecución paso a paso de los procesos para llegar ahí.",
      "ejemplo": "En un tutorial de diseño gráfico, podrías mirar el póster final para inspirarte, e inmediatamente reproducir los primeros tres pasos del tutorial para empezar a replicarlo."
    },
    "principio:3|ejemplo:2": {
      "signature": [2, 3, 0, 0],
      "descripcion": "Tus respuestas muestran que tiendes a analizar la arquitectura conceptual del problema, pero validando rápidamente con demostraciones empíricas. Regla y caso dialogan constantemente en tu inicio.",
      "ejemplo": "Al enfrentarte a un tratado filosófico, podrías leer primero las definiciones axiomáticas y buscar que el autor aterrice ese concepto denso en un dilema moral cotidiano."
    },
    "principio:3|analogia:2": {
      "signature": [0, 3, 2, 0],
      "descripcion": "En este ejercicio parece resultarte útil comprender la lógica global del sistema y relacionarla con otras estructuras que ya dominas. La abstracción y la metáfora guían tu entrada.",
      "ejemplo": "Para entender cómo funciona blockchain, podrías estudiar su base criptográfica descentralizada apoyándote en la idea de que es como un libro contable público inmodificable."
    },
    "principio:3|secuencia:2": {
      "signature": [0, 3, 0, 2],
      "descripcion": "La evidencia sugiere que te enfocas en entender las reglas del sistema, pero necesitas un camino ordenado de pasos para poner esa teoría en movimiento inicial.",
      "ejemplo": "Al estudiar botánica, podrías centrarte en el ciclo fotosintético global, para luego desglosar las fases bioquímicas de la planta en un estricto orden cronológico 1, 2 y 3."
    },
    "analogia:3|ejemplo:2": {
      "signature": [2, 0, 3, 0],
      "descripcion": "Tus respuestas muestran un marcado apoyo en la asociación de experiencias pasadas, validadas mediante casos demostrativos puntuales.",
      "ejemplo": "Al cambiar la rueda de un coche por primera vez, podrías asumir que el mecanismo es similar a apretar los tornillos de una bicicleta y buscar un video corto solo para confirmar que tu intuición es correcta."
    },
    "analogia:3|principio:2": {
      "signature": [0, 2, 3, 0],
      "descripcion": "En este ejercicio aparece una tendencia a utilizar modelos mentales previos como puente principal, intercalando momentos de análisis conceptual de las reglas nuevas.",
      "ejemplo": "Al migrar a un nuevo sistema operativo, podrías navegar asumiendo que el panel de control funcionará igual que en tu sistema anterior, y consultar la arquitectura de permisos del nuevo sistema solo cuando chocas."
    },
    "analogia:3|secuencia:2": {
      "signature": [0, 0, 3, 2],
      "descripcion": "La evidencia sugiere que abordas lo nuevo comparándolo con lo conocido, pero adoptas procesos ordenados paso a paso cuando la similitud no es suficiente para avanzar.",
      "ejemplo": "Al tejer un patrón novedoso, podrías asumir que la tensión de la lana es idéntica a tus trabajos pasados, pero seguir la primera vuelta del patrón leyendo exactamente cada instrucción."
    },
    "secuencia:3|ejemplo:2": {
      "signature": [2, 0, 0, 3],
      "descripcion": "Tus respuestas muestran una entrada operativa: sigues procedimientos detallados y observas resultados concretos, sin detenerte inicialmente en teorías abstractas.",
      "ejemplo": "En un laboratorio de química, podrías medir los reactivos en el orden exacto del manual observando que el color del líquido cambie a azul como se muestra en la referencia visual."
    },
    "secuencia:3|principio:2": {
      "signature": [0, 2, 0, 3],
      "descripcion": "En este ejercicio parece resultarte útil alternar entre el seguimiento riguroso de una guía operativa y el análisis de la regla estructural que justifica esos pasos.",
      "ejemplo": "Al instalar paneles solares, podrías conectar los cables en el orden dictado por el fabricante, mientras analizas el diagrama eléctrico general para entender la conversión de energía."
    },
    "secuencia:3|analogia:2": {
      "signature": [0, 0, 2, 3],
      "descripcion": "La evidencia sugiere una entrada metódica basada en pasos, complementada por la comparación ocasional con procesos similares que ya has dominado antes.",
      "ejemplo": "Al rellenar un formulario fiscal complejo, podrías seguir cuidadosamente la numeración de las casillas y apoyarte recordando cómo declarabas un impuesto similar el año anterior en las secciones confusas."
    },
    "ejemplo:3|analogia:1|principio:1": {
      "signature": [3, 1, 1, 0],
      "descripcion": "Tus respuestas muestran una inclinación hacia la demostración empírica, integrando tanto la regla general como asociaciones previas. Buscas ver la acción y rodearla de contexto.",
      "ejemplo": "Al aprender fotografía manual, podrías priorizar ver fotos de muestra con sus valores, entender brevemente la ley de reciprocidad y pensar en el diafragma como la pupila del ojo."
    },
    "ejemplo:3|principio:1|secuencia:1": {
      "signature": [3, 1, 0, 1],
      "descripcion": "En este ejercicio parece resultarte útil basar tu aprendizaje en observar casos concretos, sumando un conocimiento básico de la regla general y un pequeño apoyo procedimental.",
      "ejemplo": "Al cocinar, podrías mirar el plato terminado de un chef, entender que la técnica base es un estofado a fuego lento y seguir el primer paso de preparación de ingredientes."
    },
    "ejemplo:3|analogia:1|secuencia:1": {
      "signature": [3, 0, 1, 1],
      "descripcion": "La evidencia sugiere que anclas el contenido en ejemplos visibles, utilizando paralelos con conocimientos previos y alguna guía paso a paso para iniciar el flujo de trabajo.",
      "ejemplo": "Al aprender carpintería básica, podrías observar videos de cortes rectos, comparar el tacto de la madera con materiales que conoces y seguir las instrucciones de seguridad iniciales."
    },
    "principio:3|analogia:1|ejemplo:1": {
      "signature": [1, 3, 1, 0],
      "descripcion": "Tus respuestas muestran que priorizas entender las leyes conceptuales del tema, ilustradas por un ejemplo claro y vinculadas a algo familiar para cimentar el conocimiento.",
      "ejemplo": "En economía podrías enfocarte en entender la ley de oferta y demanda, recordar cómo el precio del pan sube en crisis y revisar la gráfica de un mercado específico."
    },
    "principio:3|ejemplo:1|secuencia:1": {
      "signature": [1, 3, 0, 1],
      "descripcion": "En este ejercicio aparece una estrategia centrada en dominar el sistema estructural, apoyada mínimamente por un caso demostrativo y el seguimiento inicial de reglas paso a paso.",
      "ejemplo": "Al programar, podrías dedicar tu esfuerzo a entender la arquitectura del servidor, copiar un fragmento funcional de código y configurar el entorno siguiendo el tutorial."
    },
    "principio:3|analogia:1|secuencia:1": {
      "signature": [0, 3, 1, 1],
      "descripcion": "La evidencia sugiere una aproximación teórica y abstracta al contenido, utilizando conexiones metafóricas y un proceso secuencial básico para poner en marcha esa teoría.",
      "ejemplo": "En física cuántica, podrías enfocarte en las ecuaciones probabilísticas, imaginar los electrones como nubes en lugar de órbitas y resolver un ejercicio guiado paso a paso."
    },
    "analogia:3|ejemplo:1|principio:1": {
      "signature": [1, 1, 3, 0],
      "descripcion": "Tus respuestas muestran un notable impulso por transferir experiencias previas mediante analogías, respaldado por la validación de un ejemplo concreto y la regla teórica base.",
      "ejemplo": "Si aprendes a pilotar un dron, podrías asumir que los controles responden como en un videojuego, aprenderte la regla aerodinámica de ascenso y ver un vuelo corto en vivo."
    },
    "analogia:3|ejemplo:1|secuencia:1": {
      "signature": [1, 0, 3, 1],
      "descripcion": "En este ejercicio parece resultarte útil asociar el conocimiento nuevo con el antiguo, utilizando un caso empírico y un seguimiento de pasos como herramientas secundarias de validación.",
      "ejemplo": "Al usar una máquina de coser nueva, podrías confiar en que el enhebrado es similar a tu máquina anterior, mirar cómo queda la costura recta y leer la primera instrucción de tensión."
    },
    "analogia:3|principio:1|secuencia:1": {
      "signature": [0, 1, 3, 1],
      "descripcion": "La evidencia sugiere que tu entrada se basa en mapas mentales previos mediante comparaciones, con ligeras incursiones teóricas y metódicas para corregir posibles errores de intuición.",
      "ejemplo": "Al aprender a editar video, podrías asumir que la línea de tiempo es como componer música, revisar la regla de formatos de exportación e importar los archivos siguiendo la guía."
    },
    "secuencia:3|ejemplo:1|principio:1": {
      "signature": [1, 1, 0, 3],
      "descripcion": "Tus respuestas muestran una preferencia por el orden procedimental, integrando de manera secundaria el entendimiento estructural y la observación de un caso ya finalizado.",
      "ejemplo": "Al armar una impresora 3D, podrías seguir la guía de ensamble estrictamente, deteniéndote para entender cómo el extrusor calienta y revisando una foto de la correa bien tensada."
    },
    "secuencia:3|analogia:1|ejemplo:1": {
      "signature": [1, 0, 1, 3],
      "descripcion": "En este ejercicio aparece un enfoque metódico paso a paso, aliviado en momentos de confusión mediante comparaciones familiares y visualizaciones concretas.",
      "ejemplo": "En un trámite legal, podrías seguir el flujo de pasos de la solicitud, asociar el timbre notarial a un proceso bancario que conoces y revisar un documento ya rellenado."
    },
    "secuencia:3|analogia:1|principio:1": {
      "signature": [0, 1, 1, 3],
      "descripcion": "La evidencia sugiere que abordas la información de manera ordenada y secuencial, integrando un destello de teoría general y una conexión comparativa para no perder el contexto.",
      "ejemplo": "En un tutorial de modelado 3D, podrías aplicar cada extrusión en orden, considerar la topología como si fuera una red elástica y entender la regla de cálculo poligonal básica."
    },
    "ejemplo:2|principio:2|analogia:1": {
      "signature": [2, 2, 1, 0],
      "descripcion": "Tus respuestas muestran una estrategia dual equilibrada entre los casos concretos y la comprensión de reglas, utilizando asociaciones familiares como enlace sin recurrir a procesos secuenciales.",
      "ejemplo": "Al aprender guitarra, podrías alternar equitativamente entre mirar al profesor tocar un acorde y analizar qué notas componen esa escala, pensando en el mástil como una cuadrícula geométrica."
    },
    "ejemplo:2|principio:2|secuencia:1": {
      "signature": [2, 2, 0, 1],
      "descripcion": "En este ejercicio parece resultarte útil un balance entre teoría abstracta y demostración práctica, soportado por un mínimo orden procedimental para empezar la ejecución.",
      "ejemplo": "Frente a un juego de estrategia, podrías aprender leyendo la meta final del juego y viendo turnos de prueba, para luego leer solo cómo se prepara el tablero en el paso uno."
    },
    "analogia:2|ejemplo:2|principio:1": {
      "signature": [2, 1, 2, 0],
      "descripcion": "La evidencia sugiere que combinas la observación de resultados con la asociación a conocimientos previos, anclando ambos en un concepto teórico fundamental.",
      "ejemplo": "Al estudiar botánica, podrías mirar diferentes hojas caídas, clasificarlas mentalmente como si fueran formas geométricas que ya conoces, y repasar la regla de fotosíntesis."
    },
    "analogia:2|ejemplo:2|secuencia:1": {
      "signature": [2, 0, 2, 1],
      "descripcion": "Tus respuestas muestran una entrada intuitiva basada en casos visuales y similitudes, con solo un pequeño anclaje operativo paso a paso para evitar el caos.",
      "ejemplo": "Al probar un deporte nuevo, podrías mirar jugar a los expertos, asumir movimientos de otros deportes que has practicado y pedir que te enseñen solo la posición de inicio paso a paso."
    },
    "ejemplo:2|secuencia:2|principio:1": {
      "signature": [2, 1, 0, 2],
      "descripcion": "En este ejercicio aparece una mezcla operativa: observas ejemplos y sigues procesos en igual medida, apoyado por una regla teórica que justifica las acciones.",
      "ejemplo": "Al aprender a soldar circuitos, podrías mirar demostraciones de soldaduras limpias, seguir la lista de seguridad eléctrica estricta y considerar la teoría de conducción de estaño."
    },
    "ejemplo:2|secuencia:2|analogia:1": {
      "signature": [2, 0, 1, 2],
      "descripcion": "La evidencia sugiere una entrada práctica donde la observación de casos y la ejecución metódica comparten prioridad, utilizando una leve comparación para desatascar dudas.",
      "ejemplo": "Al pintar una habitación, podrías ver tutoriales sobre los acabados, seguir el orden de preparar paredes antes de pintar y asumir que aplicar cinta es como enmascarar un lienzo."
    },
    "analogia:2|principio:2|ejemplo:1": {
      "signature": [1, 2, 2, 0],
      "descripcion": "Tus respuestas muestran una inclinación a combinar reglas abstractas con metáforas estructurales, utilizando un caso práctico único como prueba de concepto.",
      "ejemplo": "Al leer un ensayo sociológico, podrías centrarte en la hipótesis central y en cómo el autor compara la sociedad con un organismo vivo, revisando luego un estudio de caso poblacional."
    },
    "analogia:2|principio:2|secuencia:1": {
      "signature": [0, 2, 2, 1],
      "descripcion": "En este ejercicio parece resultarte útil la teoría y la comparación para mapear el terreno nuevo, usando un breve proceso paso a paso como puente a la acción.",
      "ejemplo": "Al manejar un vehículo con transmisión manual por primera vez, podrías asumir el cambio de marchas como los cambios de una bicicleta, entender la mecánica del embrague y seguir el orden de encendido."
    },
    "principio:2|secuencia:2|ejemplo:1": {
      "signature": [1, 2, 0, 2],
      "descripcion": "La evidencia sugiere un abordaje balanceado entre comprender las reglas del sistema y seguir su manual de operaciones, verificando el proceso con un ejemplo empírico aislado.",
      "ejemplo": "Al programar un dispositivo domótico, podrías entender su protocolo de comunicación y seguir la guía oficial de sincronización, verificando en un foro cómo luce la configuración final."
    },
    "principio:2|secuencia:2|analogia:1": {
      "signature": [0, 2, 1, 2],
      "descripcion": "Tus respuestas muestran un cruce entre el marco teórico y la ejecución ordenada, utilizando una referencia comparativa menor para suavizar conceptos complejos.",
      "ejemplo": "Al estudiar algoritmos, podrías interiorizar la lógica de clasificación ejecutando la prueba de escritorio iteración tras iteración, pensando en el proceso como ordenar una baraja de cartas."
    },
    "analogia:2|secuencia:2|ejemplo:1": {
      "signature": [1, 0, 2, 2],
      "descripcion": "En este ejercicio aparece una entrada impulsada equitativamente por conocimientos transferidos y procedimientos secuenciales, validando la ruta con un caso visible.",
      "ejemplo": "Al hacer origami complejo, podrías asumir que el papel reaccionará como en pliegues pasados, seguir estrictamente los diagramas y mirar la figura terminada de vez en cuando."
    },
    "analogia:2|secuencia:2|principio:1": {
      "signature": [0, 1, 2, 2],
      "descripcion": "La evidencia sugiere que te apoyas tanto en comparaciones como en el orden estricto de las instrucciones, extrayendo una sola regla general como brújula.",
      "ejemplo": "Al hacer pan de masa madre, podrías guiar tus tiempos estrictamente por el manual, asumiendo que el leudado visual se parece al de levadura común, y memorizar solo que la temperatura es vital."
    },
    "ejemplo:2|analogia:1|principio:1|secuencia:1": {
      "signature": [2, 1, 1, 1],
      "descripcion": "Tus respuestas muestran una entrada versátil con una ligera preferencia por casos concretos. Esta evidencia sugiere que despliegas herramientas procedimentales, teóricas y analógicas en un contexto predominantemente empírico.",
      "ejemplo": "Al armar una carpa compleja, podrías observar primero la foto final, entender el sistema de tensión, comparar el varillaje con otras carpas y luego seguir el primer paso del manual."
    },
    "principio:2|analogia:1|ejemplo:1|secuencia:1": {
      "signature": [1, 2, 1, 1],
      "descripcion": "En este ejercicio parece resultarte útil una exploración mixta liderada por el entendimiento de las reglas. Buscas el \"por qué\" global mientras mantienes casos, metáforas y secuencias como apoyo activo.",
      "ejemplo": "Al estudiar un periodo histórico, podrías buscar el tratado político que definió la época. Luego leer sobre una batalla concreta, seguir la línea de tiempo de eventos y ver ecos de esa crisis en el presente para asegurar tu comprensión de la regla."
    },
    "analogia:2|ejemplo:1|principio:1|secuencia:1": {
      "signature": [1, 1, 2, 1],
      "descripcion": "La evidencia sugiere un abordaje multidisciplinar impulsado ligeramente por analogías. Construyes significado trayendo a la mesa lo que ya sabes, validando todo desde diferentes perspectivas iniciales.",
      "ejemplo": "Al probar una herramienta de software de audio, podrías asumir inmediatamente cómo funciona un ecualizador basándote en estéreos antiguos. A partir de ahí, configurar el ruteo paso a paso, observar el medidor visual, repasar la teoría de frecuencias y ajustar todo basándote en intuiciones previas."
    },
    "secuencia:2|analogia:1|ejemplo:1|principio:1": {
      "signature": [1, 1, 1, 2],
      "descripcion": "Tus respuestas muestran una estrategia de entrada diversa, con un leve énfasis operativo y procedimental. Sugiere que el orden paso a paso te da seguridad mientras integras casos, reglas y metáforas simultáneamente.",
      "ejemplo": "Al montar un telescopio, podrías colocar las piezas siguiendo el orden numérico estricto del trípode. Mientras lo haces, asumir el montaje de las lentes como el de una cámara, recordar la regla óptica focal y verificar todo mirando una foto del manual."
    }
  }
};
