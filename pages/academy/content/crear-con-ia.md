---
library: "Alfabetización Digital para humanistas"
folder: "Curso Inicial"
title: "Crear con IA: del texto al proyecto"
tags:
  - alfabetizacion-digital
  - inteligencia-artificial
  - desarrollo
  - programacion
  - codigo
  - algoritmos
  - proyectos
  - colaboracion
  - documentacion
  - humanidades-digitales

---

# Crear con IA: del texto al proyecto

## Pregunta central

¿Cómo podemos transformar una idea expresada en lenguaje humano en un proyecto tecnológico real utilizando inteligencia artificial?

## Idea central

Crear con inteligencia artificial no consiste simplemente en pedirle a una IA que escriba código.

Entre una idea y una aplicación funcionando existe una cadena de transformaciones.

Una persona puede comenzar diciendo:

> «Quiero crear una herramienta que ayude a las personas a aprender.»

Pero una aplicación necesita algo mucho más concreto.

Necesita:

- objetivos;
- funcionalidades;
- datos;
- archivos;
- algoritmos;
- código;
- interfaces;
- servicios;
- pruebas;
- documentación;
- infraestructura.

La inteligencia artificial puede ayudarnos a recorrer ese camino.

Pero para hacerlo necesitamos aprender a transformar progresivamente una idea abstracta en instrucciones concretas, después en código y finalmente en un sistema que pueda ser ejecutado por un computador.

Podemos representar el proceso así:

```text
idea
  ↓
problema
  ↓
funcionalidades
  ↓
diseño
  ↓
algoritmos
  ↓
código
  ↓
prueba
  ↓
corrección
  ↓
integración
  ↓
aplicación
La idea fundamental es sencilla:
Crear con IA significa aprender a traducir progresivamente una intención humana en un sistema que una máquina pueda ejecutar.
De la idea al problema
Una de las primeras dificultades al desarrollar es que normalmente comenzamos con una idea demasiado grande.
Por ejemplo:
«Quiero crear una plataforma educativa con inteligencia artificial.»
Eso todavía no es una especificación técnica.
Necesitamos comenzar a preguntar:
¿Qué problema queremos resolver?
¿Para quién?
¿Qué debería poder hacer el usuario?
¿Qué debería ocurrir cuando el usuario realiza determinada acción?
¿Qué información necesita el sistema?
¿Qué resultado esperamos obtener?
La IA puede ayudarnos a transformar una idea general en preguntas más concretas.
Por ejemplo:
Idea:
crear una plataforma educativa.

Problema:
los usuarios necesitan aprender conceptos
complejos de manera personalizada.

Función:
el usuario puede seleccionar un documento.

Acción:
el sistema analiza el documento.

Resultado:
el tutor genera una pregunta adaptada
al nivel del usuario.
La idea empieza a convertirse en comportamiento.
Una aplicación es un conjunto de comportamientos
Cuando utilizamos una aplicación normalmente vemos una interfaz.
Un botón.
Una pantalla.
Un formulario.
Un menú.
Pero detrás de cada elemento existe algún comportamiento.
Si presionamos:
[Enviar]
pueden ocurrir muchas cosas.
El navegador puede:
recoger los datos;
transformarlos;
enviarlos al servidor;
esperar una respuesta;
recibir información;
procesarla;
mostrarla al usuario.
Por eso una aplicación puede entenderse como un conjunto de comportamientos coordinados.
Podemos comenzar a pensar:
«¿Qué debería ocurrir?»
antes de pensar:
«¿Qué código necesito escribir?»
Esta diferencia es fundamental.
¿Qué es un algoritmo?
Antes del código aparece otro concepto importante:
el algoritmo.
Un algoritmo es una secuencia definida de pasos para resolver un problema o producir un resultado.
No necesitamos comenzar con matemáticas complejas.
Podemos pensar en una receta.
Por ejemplo:
1. Recibir un número.
2. Comprobar si es mayor que 10.
3. Si es mayor que 10, mostrar "alto".
4. Si no, mostrar "bajo".
Eso ya describe un algoritmo.
El algoritmo expresa la lógica.
El código expresa esa lógica en un lenguaje que el computador puede ejecutar.
Por eso podemos distinguir:
problema
   ↓
algoritmo
   ↓
código
   ↓
ejecución
La inteligencia artificial puede ayudarnos a pasar de un nivel al siguiente.
El algoritmo no es el código
Esta distinción es especialmente importante para un humanista.
Podemos explicar una solución sin saber programarla.
Por ejemplo:
«Necesito que el sistema reciba una lista de documentos, los ordene por fecha y muestre primero los más recientes.»
Eso contiene una lógica.
La IA puede ayudarnos a convertirla en un algoritmo:
1. Recibir los documentos.
2. Obtener la fecha de cada documento.
3. Comparar las fechas.
4. Ordenar de mayor a menor.
5. Mostrar los documentos.
Después puede convertir ese algoritmo en código.
Por ejemplo:
documents.sort((a, b) => b.date - a.date);
El código es la implementación concreta de una lógica.
Comprender esta diferencia permite conversar con una IA incluso antes de saber programar.
El código es una forma de dar instrucciones
Podemos pensar el código como un lenguaje mediante el cual expresamos instrucciones que un computador puede ejecutar.
Por ejemplo:
const nombre = "Ana";
console.log(nombre);
Aquí estamos diciendo, aproximadamente:
«Guarda el texto "Ana" en una variable llamada nombre y después muéstralo.»
El código no es magia.
Es una forma estructurada de expresar operaciones.
Esta idea es importante porque permite cambiar nuestra relación psicológica con la programación.
No necesitamos comenzar pensando:
«Tengo que aprender un idioma completamente desconocido.»
Podemos comenzar pensando:
«Tengo que aprender cómo expresar determinadas instrucciones de manera que el computador pueda ejecutarlas.»
La inteligencia artificial puede ayudarnos con esa traducción.
Hablar con la IA antes de escribir código
Una de las mejores prácticas para comenzar un desarrollo consiste en no pedir inmediatamente:
«Escribe el código.»
Es preferible comenzar preguntando:
«Ayúdame a diseñar la solución.»
Podemos pedirle a la IA que nos ayude a identificar:
el problema;
las funcionalidades;
los componentes;
los datos necesarios;
los algoritmos;
los archivos;
las dependencias;
las pruebas.
Esto permite construir primero un mapa.
Después podemos pedir:
«Ahora transforma esta solución en instrucciones técnicas.»
Y solamente después:
«Implementa estas instrucciones.»
El proceso se vuelve:
idea
 ↓
conversación
 ↓
diseño
 ↓
instrucciones
 ↓
código
Esto reduce considerablemente la posibilidad de construir algo que no sabemos por qué existe.
Del texto a los archivos
Una idea comienza siendo texto.
Pero un proyecto necesita estructura.
Por ejemplo:
mi-proyecto/
├── index.html
├── styles.css
├── app.js
├── README.md
└── docs/
    ├── arquitectura.md
    └── contrato.md
Cada archivo cumple una función.
Podemos pedirle a una IA:
«A partir de esta especificación, propón una estructura inicial de archivos.»
La IA puede ayudarnos a diseñar esa estructura.
Después podemos construir cada pieza progresivamente.
Esto es importante:
No necesitamos construir todo el proyecto de una sola vez.
Podemos construirlo por piezas.
Los códigos conversan entre sí
Una aplicación rara vez consiste en un único archivo.
Normalmente existen diferentes componentes.
Por ejemplo:
frontend
   ↓
API
   ↓
backend
   ↓
base de datos
Cada componente realiza una tarea.
Pero además necesita comunicarse con los demás.
El frontend puede enviar:
{
  "text": "Hola"
}
El backend puede responder:
{
  "response": "Hola. ¿En qué puedo ayudarte?"
}
Para que esto funcione, ambos componentes deben respetar determinadas reglas.
Aquí vuelve a aparecer un concepto del documento anterior:
el contrato.
El contrato define cómo conversan las diferentes partes del sistema.
El contrato como idioma común
Imaginemos que una IA desarrolla el frontend y otra desarrolla el backend.
Si no tienen un acuerdo, una puede construir:
POST /api/message
mientras la otra espera:
POST /api/chat
Una puede enviar:
{
  "text": "..."
}
y la otra esperar:
{
  "message": "..."
}
El código puede estar perfectamente escrito en ambos lados.
Pero el sistema no funcionará.
El problema es que no están hablando el mismo idioma.
Por eso debemos documentar:
nombres;
formatos;
endpoints;
parámetros;
respuestas;
errores;
versiones.
El contrato permite que diferentes partes puedan desarrollarse de manera relativamente independiente y aun así conversar.
Construir por bloques
Una recomendación fundamental cuando trabajamos con IA es evitar construir archivos gigantescos o bloques enormes de código sin necesidad.
Es preferible construir componentes relativamente pequeños.
Por ejemplo:
autenticacion.js
usuarios.js
documentos.js
chat.js
api.js
en lugar de concentrar toda la lógica en un único archivo gigantesco.
Esto tiene varias ventajas.
Un bloque pequeño:
es más fácil de comprender;
es más fácil de probar;
es más fácil de modificar;
es más fácil de explicar;
es más fácil de revisar por una IA;
permite localizar errores con mayor precisión.
La modularidad no solamente beneficia al programador.
También beneficia a la inteligencia artificial que está colaborando con nosotros.
La regla del cambio pequeño
Cuando estamos desarrollando con IA, una práctica especialmente útil consiste en realizar cambios pequeños.
En lugar de pedir:
«Reescribe toda la aplicación y agrega autenticación, pagos, perfiles, inteligencia artificial y panel administrativo.»
podemos dividir:
1. Crear autenticación.
2. Probar autenticación.
3. Integrar perfiles.
4. Probar perfiles.
5. Crear panel.
6. Probar panel.
Cada modificación produce un nuevo estado del sistema.
Si algo deja de funcionar, sabemos aproximadamente dónde buscar.
Esto también permite utilizar Git para conservar la historia.
Código corto y revisable
El código no debería ser innecesariamente largo.
Cuando un bloque contiene demasiadas responsabilidades, se vuelve difícil saber qué está haciendo.
Por ejemplo, una función que:
consulta una base de datos;
valida al usuario;
transforma datos;
genera una respuesta;
registra errores;
envía un correo;
puede funcionar.
Pero también puede resultar difícil de comprender y modificar.
Es preferible separar responsabilidades cuando tenga sentido:
validarUsuario()
      ↓
obtenerDatos()
      ↓
transformarDatos()
      ↓
generarRespuesta()
Esto permite que cada pieza pueda ser revisada individualmente.
La pregunta no es:
«¿Cuánto código puedo escribir?»
Sino:
«¿Cómo puedo construir algo suficientemente pequeño para comprenderlo y mantenerlo?»
Los comentarios explican el código
Los comentarios cumplen una función especialmente importante cuando trabajamos con IA.
Podemos escribir:
// Verificamos que el usuario tenga una sesión activa
// antes de permitir el acceso al documento.
if (user.isAuthenticated) {
    openDocument();
}
El comentario no cambia el funcionamiento del programa.
Pero explica la intención.
Esto es especialmente útil cuando una IA vuelve a revisar el código semanas después.
Puede observar:
if (user.isAuthenticated)
y comprender qué hace.
Pero el comentario puede explicar:
por qué esa condición es necesaria.
Por eso es recomendable utilizar comentarios para explicar:
intención;
decisiones;
restricciones;
comportamientos no evidentes;
razones para mantener determinada lógica.
No es necesario comentar cada línea.
Un buen comentario explica aquello que no resulta evidente solamente leyendo el código.
Código que se puede leer
Una aplicación no solamente debe poder ejecutarse.
También debería poder ser comprendida.
Por eso importa:
utilizar nombres claros;
separar responsabilidades;
evitar funciones innecesariamente largas;
mantener estructuras coherentes;
comentar decisiones importantes;
documentar contratos.
Por ejemplo:
const usuarioActual = obtenerUsuarioActual();
es más comprensible que:
const x = getData();
El código se convierte así en una forma de comunicación entre personas y máquinas.
Y, en un proyecto asistido por IA, también entre diferentes inteligencias artificiales.
La memoria externa del proyecto
Como vimos anteriormente, una IA puede perder contexto.
Por eso el proyecto necesita memoria fuera de la conversación.
Podemos utilizar:
/docs
    arquitectura.md
    contrato.md
    decisiones.md
    instrucciones.md
    modulo-usuarios.md
Estos documentos permiten reconstruir el contexto.
Podemos decirle a una nueva IA:
«Lee primero arquitectura.md y contrato.md. Después revisa modulo-usuarios.md. No modifiques nada todavía. Explícame cómo entiendes el sistema.»
Esto es muy diferente de comenzar una conversación desde cero.
La documentación se convierte en una especie de memoria externa compartida.
Un documento por cada decisión importante
No todo necesita ser documentado.
Pero algunas decisiones deberían quedar registradas.
Por ejemplo:
Decisión:

El frontend no accederá directamente a la base de datos.

Motivo:

Toda operación pasará por el backend para centralizar
autenticación y control de permisos.
Esto puede evitar que una IA posterior proponga una solución incompatible.
La documentación permite decir:
«No estamos empezando de cero. Ya existe una decisión.»
El proyecto como conversación acumulativa
Podemos pensar el desarrollo asistido por IA como una conversación que se acumula en diferentes soportes.
Una parte está en:
la conversación con la IA;
otra en:
los archivos;
otra en:
Git;
otra en:
los contratos;
otra en:
la documentación;
otra en:
las pruebas.
No necesitamos confiar en una única conversación para conservar toda la historia.
La conversación puede cambiar.
La documentación permanece.
Probar antes de seguir
Un error común consiste en construir muchas cosas antes de comprobar si las primeras funcionan.
Es mejor utilizar ciclos cortos:
construir
   ↓
probar
   ↓
observar
   ↓
corregir
   ↓
volver a probar
Por ejemplo:
«Primero hagamos que el botón funcione.»
Después:
«Ahora hagamos que envíe los datos.»
Después:
«Ahora mostremos la respuesta.»
Después:
«Ahora agreguemos manejo de errores.»
Cada etapa agrega complejidad de manera controlada.
Los errores forman parte del desarrollo
Cuando aparece:
404
no significa simplemente:
«Algo salió mal.»
Significa que tenemos información.
Podemos preguntar:
«¿Qué significa este 404 en este contexto?»
Si aparece:
500
podemos preguntar:
«¿Qué parte del servidor produjo este error?»
Si aparece:
SyntaxError
podemos preguntar:
«¿Qué parte del código tiene un problema de sintaxis?»
La IA puede ayudarnos a interpretar estos mensajes.
Pero debemos aprender a entregar el contexto adecuado:
1. qué estábamos intentando hacer;
2. qué comando ejecutamos;
3. qué ocurrió;
4. qué error apareció;
5. qué código está relacionado.
La calidad de la ayuda depende en gran medida de la calidad del contexto.
Pedir código a una IA de manera útil
Una petición vaga puede producir una respuesta vaga.
En lugar de:
«Hazme una aplicación.»
podemos decir:
«Quiero construir una aplicación web sencilla. El usuario debe poder cargar un documento, enviarlo a un backend y recibir una respuesta generada por un modelo de IA. Primero quiero definir la arquitectura. No escribas código todavía.»
Después:
«Ahora propón la estructura de archivos.»
Después:
«Ahora define el contrato entre frontend y backend.»
Después:
«Ahora genera solamente el archivo app.js.»
Después:
«Explícame qué hace cada bloque antes de continuar.»
La IA deja de ser solamente un generador.
Se convierte en una compañera de construcción.
El prompt como instrucción de trabajo
En este punto podemos comprender mejor qué es un buen prompt.
No necesariamente es una frase ingeniosa.
Puede ser un documento de trabajo.
Por ejemplo:
ROL:
Actúa como desarrollador frontend.

OBJETIVO:
Implementar el botón "Profundizar".

CONTEXTO:
El documento activo ya está cargado en la aplicación.

CONTRATO:
El backend recibe { text, userId }.

RESTRICCIONES:
No modificar el sistema de selección de archivos.

TAREA:
Modificar únicamente archive.js.

RESULTADO ESPERADO:
Al pulsar "Profundizar", utilizar automáticamente
el documento actualmente cargado.

ANTES DE ESCRIBIR:
Explica qué vas a modificar.
Este tipo de instrucción reduce la ambigüedad.
La IA recibe:
rol;
objetivo;
contexto;
contrato;
restricciones;
tarea;
resultado esperado.
Eso se parece mucho más a una orden de trabajo que a una pregunta.
Del proyecto grande al siguiente paso
Un proyecto puede ser enorme.
Pero la siguiente acción puede ser pequeña.
Podemos tener como objetivo:
«Construir una plataforma educativa.»
Pero el siguiente paso puede ser:
«Crear una página que muestre el título del curso.»
Después:
«Agregar una lista de documentos.»
Después:
«Permitir abrir un documento.»
Después:
«Agregar el botón Profundizar.»
Después:
«Conectar el botón con el backend.»
El desarrollo aparece como una secuencia de pequeños pasos.
Esto reduce la sensación de estar frente a una montaña imposible.
La IA puede construir, pero nosotros debemos conducir
Una IA puede escribir cientos de líneas de código en segundos.
Eso no significa que debamos pedírselas.
A veces la mejor instrucción es:
«No escribas todavía. Ayúdame a pensar.»
Después:
«Ahora propón una solución.»
Después:
«Ahora divídela en tareas.»
Después:
«Implementemos solamente la primera.»
Este orden es importante.
La velocidad de generación de la IA puede ser mucho mayor que nuestra capacidad para comprender lo generado.
Por eso debemos controlar la velocidad del proceso.
El tamaño de nuestra comprensión
Existe una regla pedagógica importante:
No deberíamos avanzar mucho más rápido de lo que podemos comprender.
Si una IA genera 2.000 líneas de código y nosotros no sabemos qué hacen, hemos producido código, pero no necesariamente hemos aprendido.
En cambio, si genera 50 líneas, las revisamos, las ejecutamos, comprendemos su función y después agregamos otras 50, nuestro conocimiento crece junto con el proyecto.
El objetivo no es solamente terminar.
Es aprender a construir.
Una metodología práctica
Podemos resumir el proceso de creación con IA en diez pasos:
1. Expresar
Describe la idea en lenguaje humano.
2. Delimitar
Define qué problema concreto quieres resolver.
3. Descomponer
Divide el problema en funcionalidades pequeñas.
4. Diseñar
Pide a la IA que proponga una arquitectura.
5. Contratar
Define cómo se comunicarán los diferentes componentes.
6. Documentar
Registra arquitectura, decisiones e intenciones importantes.
7. Implementar
Construye una pieza pequeña.
8. Probar
Comprueba que realmente funciona.
9. Auditar
Pide a otra IA que revise el resultado.
10. Integrar
Incorpora la pieza al sistema y continúa.
Podemos representarlo así:
idea
 ↓
problema
 ↓
funcionalidad
 ↓
arquitectura
 ↓
contrato
 ↓
documentación
 ↓
código
 ↓
prueba
 ↓
auditoría
 ↓
integración
 ↓
siguiente funcionalidad
Un ejemplo completo
Imaginemos que queremos construir una pequeña aplicación que permita conversar con un documento.
Comenzamos con una idea:
«Quiero poder hacer preguntas sobre un documento.»
La convertimos en funcionalidades:
1. cargar documento;
2. mostrar documento;
3. escribir pregunta;
4. enviar pregunta;
5. recibir respuesta;
6. mostrar respuesta.
Después definimos componentes:
navegador
    ↓
frontend
    ↓
backend
    ↓
modelo de IA
Definimos un contrato:
{
  "document": "...",
  "question": "..."
}
y una respuesta:
{
  "answer": "..."
}
Después creamos la estructura:
document-chat/
├── index.html
├── styles.css
├── app.js
├── server.js
└── docs/
    ├── arquitectura.md
    └── contrato.md
Construimos primero la interfaz.
La probamos.
Después construimos el backend.
Lo probamos.
Después conectamos ambos.
Lo probamos nuevamente.
Finalmente conectamos el modelo de IA.
Cada paso produce algo observable.
Así una idea termina convirtiéndose en un sistema.
De consumidor a constructor
Cuando utilizamos una aplicación terminada, vemos el resultado.
Cuando construimos una aplicación comenzamos a ver las capas que existen detrás.
Descubrimos:
interfaz
 ↓
eventos
 ↓
código
 ↓
API
 ↓
servidor
 ↓
datos
 ↓
servicios
 ↓
infraestructura
Ese cambio de perspectiva es uno de los aprendizajes más importantes de la alfabetización digital.
Dejamos de pensar:
«La aplicación hace esto.»
Y comenzamos a preguntar:
«¿Qué tendría que ocurrir para que la aplicación pueda hacer esto?»
Esa pregunta abre la puerta al desarrollo.
Una herramienta para pensar críticamente
Cuando queramos convertir una idea en tecnología podemos preguntarnos:
¿Qué problema estoy intentando resolver?
¿Quién utilizará la solución?
¿Qué comportamiento espero?
¿Cuál es la unidad más pequeña que puedo construir primero?
¿Qué algoritmo necesito?
¿Qué datos necesita?
¿Qué componentes deben comunicarse?
¿Qué contrato necesitan respetar?
¿Qué parte puede implementar una IA?
¿Qué parte necesito comprender personalmente?
¿Cómo voy a probarla?
¿Cómo voy a documentarla?
¿Qué ocurrirá si la IA pierde el contexto?
¿Dónde está registrada la intención del código?
¿Podría otra IA continuar el proyecto sin tener esta conversación?
Estas preguntas permiten convertir una idea en un proceso de construcción.
Implicaciones para los humanistas
La posibilidad de crear software con IA modifica la relación tradicional entre humanidades y tecnología.
Un humanista puede comenzar con una pregunta conceptual y terminar construyendo una herramienta.
Un psicólogo puede transformar una hipótesis en una aplicación experimental.
Un historiador puede construir una herramienta para explorar archivos.
Un filósofo puede crear un sistema para analizar argumentos.
Un educador puede desarrollar un tutor.
Un ciudadano puede construir una herramienta para resolver un problema de su comunidad.
La barrera ya no es únicamente:
«¿Sé programar?»
También es:
«¿Sé transformar una idea en una secuencia de decisiones que pueda ser implementada?»
La inteligencia artificial reduce parte de la distancia entre ambas cosas.
Pero esa distancia no desaparece.
Necesitamos aprender a recorrerla.
Límite
La inteligencia artificial puede escribir código rápidamente.
Eso no garantiza que el código sea correcto.
Tampoco garantiza que la arquitectura sea adecuada.
Una IA puede producir una solución que funcione en una situación concreta y que después genere problemas en otra.
Por eso:
el código debe probarse;
las interfaces deben verificarse;
los contratos deben respetarse;
las decisiones importantes deben documentarse;
los cambios deben poder rastrearse;
los errores deben investigarse.
La IA acelera la construcción.
No elimina la necesidad de comprender qué estamos construyendo.
Conexiones
Este documento se relaciona directamente con otros conceptos de Alfabetización Digital para humanistas:
Inteligencia artificial: qué es y qué no es: comprender las capacidades y límites de la IA permite utilizarla como herramienta de construcción sin confundir generación de código con comprensión.
Herramientas de Desarrollo: terminal, archivos, Git, GitHub, servidores, Render y CLI proporcionan el entorno material donde las ideas pueden convertirse en sistemas reales.
Conversar con una IA: del prompt a la colaboración: transformar una conversación en instrucciones progresivamente más precisas permite pasar del diálogo a la construcción.
Pensar con IA sin dejar que la IA piense por ti: la IA puede ayudar a producir soluciones, pero el usuario debe conservar el criterio sobre el problema y evaluar las decisiones.
Arquitectura de colaboración con inteligencia artificial: diferentes IA pueden asumir roles distintos y trabajar mediante contratos, documentación y memoria externa.
La pauta que conecta: una aplicación no es solamente una colección de archivos, sino una red de relaciones entre componentes.
Causalidad y retroalimentación: cada modificación produce consecuencias que deben observarse antes de continuar.
Tipos lógicos y niveles de abstracción: una idea puede pasar por diferentes niveles: intención, funcionalidad, arquitectura, algoritmo, código y ejecución.
Evolución, aprendizaje y cambio: desarrollar implica iterar, experimentar, corregir y modificar progresivamente el sistema.
Para recordar
Crear con inteligencia artificial no significa decir:
«IA, construye mi aplicación.»
Significa aprender a recorrer una cadena de transformaciones:
idea
 ↓
problema
 ↓
funcionalidad
 ↓
algoritmo
 ↓
arquitectura
 ↓
contrato
 ↓
código
 ↓
prueba
 ↓
documentación
 ↓
integración
 ↓
aplicación
El algoritmo expresa la lógica.
El código expresa esa lógica en un lenguaje ejecutable.
Los componentes del sistema necesitan contratos para poder comunicarse.
Los archivos deben organizarse de manera comprensible.
El código debe mantenerse suficientemente modular para poder ser leído, probado y revisado.
Los comentarios deben conservar las intenciones que no resultan evidentes.
La documentación funciona como memoria externa cuando la conversación con una IA ya no puede conservar todo el contexto.
Y los proyectos deben construirse mediante pequeños ciclos de:
construir
→ probar
→ observar
→ corregir
→ documentar
→ continuar
La idea fundamental puede resumirse así:
Una idea no se convierte en tecnología de una sola vez. Se convierte en tecnología mediante una cadena de pequeñas traducciones que podemos aprender a realizar con ayuda de la inteligencia artificial.
Y quizás la transformación más importante sea esta:
Al principio dices:
«Tengo una idea, pero no sé cómo construirla.»
Después comienzas a preguntar:
«¿Qué tendría que ocurrir para que esto funcione?»
Luego:
«¿Cuál es el primer componente?»
Después:
«¿Cuál es el algoritmo?»
Luego:
«¿Qué código implementa ese algoritmo?»
Y finalmente:
«¿Cómo conecto esta pieza con la siguiente?»
En ese momento ya no estás solamente utilizando inteligencia artificial.
Estás construyendo con ella.
