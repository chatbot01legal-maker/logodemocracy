---

library: "Alfabetización Digital para humanistas"
folder: "Curso Inicial"
title: "Crear tu primer proyecto con inteligencia artificial"
tags:

  - alfabetizacion-digital
  - desarrollo
  - inteligencia-artificial
  - desarrollo-web
  - html
  - css
  - javascript
  - termux
  - github
  - render
  - api
  - google-cloud
  - cli
  - copiloto
  - humanidades-digitales

---

<div align="justify">

## Crear tu primer proyecto con inteligencia artificial

### Idea central

No necesitas aprender primero todo lo necesario para desarrollar software.

Puedes comenzar con una idea y aprender, paso a paso, las herramientas que necesitas para convertirla en algo que funciona.

Este ejercicio propone hacer exactamente eso:

> **Construir y publicar un sitio web utilizando inteligencia artificial como copiloto.**

Durante el proceso aprenderás a utilizar una terminal, crear archivos, escribir código, utilizar Git, guardar versiones en GitHub, desplegar una aplicación en Render, conectarla con una API de inteligencia artificial y utilizar servicios de Google Cloud.

Pero esas herramientas no serán el objetivo principal.

El objetivo será **construir algo**.

La tecnología aparecerá en el camino porque la necesitas para avanzar.

---

## El desafío

Imagina que tienes una idea para una herramienta digital.

Puede ser algo muy sencillo:

- una herramienta educativa;
- una calculadora;
- un pequeño juego;
- un formulario;
- una herramienta para estudiar;
- un generador de textos;
- una aplicación para resolver un problema cotidiano;
- una herramienta para organizar información;
- una interfaz para conversar con una inteligencia artificial.

No importa demasiado cuál sea la idea.

Lo importante es que tenga una característica:

> **debe poder convertirse progresivamente en una aplicación que funcione.**

No vamos a comenzar aprendiendo programación.

Vamos a comenzar preguntándonos:

> **¿Qué quiero construir?**

Y luego iremos aprendiendo lo necesario para construirlo.

---

## Una oportunidad para experimentar

Desarrollar tecnología puede implicar costos.

Necesitamos servidores, almacenamiento, procesamiento, APIs y, cuando utilizamos inteligencia artificial, acceso a modelos que requieren infraestructura informática.

Google Cloud dispone de programas de crédito promocional para nuevos usuarios y proyectos elegibles. Cuando una cuenta dispone de créditos, estos pueden utilizarse para experimentar con determinados servicios de infraestructura y de inteligencia artificial sin tener que asumir inmediatamente todo el costo de utilización.

Las condiciones de estas promociones pueden cambiar y dependen de la cuenta y del programa vigente.

Por eso, antes de comenzar, revisa las condiciones actuales de tu cuenta.

La idea de este ejercicio es aprovechar esa oportunidad para hacer algo concreto:

> **utilizar infraestructura real para desarrollar y publicar tu primera aplicación con ayuda de inteligencia artificial.**

No se trata solamente de probar una IA.

Se trata de descubrir que puedes pasar de:

```

una idea

```

a

```

un proyecto

```

y finalmente a

```

una aplicación accesible por Internet

```

---

## Cómo vamos a trabajar

Durante todo el ejercicio utilizaremos inteligencia artificial como copiloto.

Esto significa que no esperamos que la persona conozca previamente todas las herramientas.

Cuando aparezca algo que no comprendemos, podemos preguntar.

Cuando aparezca un error, podemos investigarlo.

Cuando necesitemos un comando, podemos solicitarlo.

Cuando necesitemos comprender un archivo, podemos pedir una explicación.

Cuando necesitemos implementar una función, podemos solicitar ayuda.

Pero existe una regla fundamental:

> **La inteligencia artificial puede ayudarnos a construir. Nosotros seguimos siendo responsables de comprender qué estamos construyendo.**

Por eso trabajaremos de manera progresiva.

Cada paso tendrá:

1. una meta;
2. acciones concretas;
3. un resultado observable;
4. un prompt para trabajar con inteligencia artificial.

---

## Paso 1 — Decide qué quieres construir

### Objetivo

Transformar una idea general en una primera descripción de una aplicación.

No necesitamos todavía saber cómo programarla.

Necesitamos saber qué queremos que haga.

### Acciones

1. Elige un problema sencillo que quieras resolver.
2. Imagina una aplicación que pueda ayudar a resolverlo.
3. Describe qué debería poder hacer.
4. Decide quién utilizaría esa aplicación.
5. Escribe una descripción breve de tu idea.

Por ejemplo:

> Quiero crear una página que permita a un estudiante ingresar un concepto y recibir una explicación sencilla acompañada de ejemplos.

Todavía no sabemos cómo hacerlo.

No importa.

Tenemos algo mucho más importante:

**una intención.**

### Prompt de aprendizaje

```

Quiero desarrollar mi primer proyecto tecnológico utilizando inteligencia artificial como copiloto.

Mi idea es:

[ESCRIBE AQUÍ TU IDEA]

Actúa como jefe de proyecto y ayúdame a transformar esta idea en una especificación inicial muy sencilla.

No escribas código todavía.

Ayúdame a identificar:

1. cuál es el problema que quiero resolver;
2. quién utilizaría la aplicación;
3. qué debería poder hacer;
4. cuál sería la funcionalidad mínima que permitiría considerar que el proyecto funciona;
5. qué podríamos agregar posteriormente.

Estoy aprendiendo desarrollo tecnológico y no soy programador profesional.

Explícame los conceptos técnicos cuando aparezcan y evita asumir conocimientos que todavía no tengo.

```

### Resultado

Al terminar este paso deberías tener una descripción clara de tu proyecto.

Todavía no has programado.

Pero ya has comenzado a desarrollar.

---

## Paso 2 — Abre tu espacio de desarrollo con Termux

### Objetivo

Aprender a interactuar directamente con el sistema mediante una terminal.

No necesitas memorizar muchos comandos.

Necesitas comenzar a comprender qué estás haciendo.

### Acciones

Abre Termux y aprende a realizar algunas operaciones básicas:

- comprobar dónde estás;
- listar archivos;
- crear una carpeta;
- entrar en una carpeta;
- volver a la carpeta anterior;
- crear archivos;
- consultar información.

Por ejemplo:

```

pwd

```

permite saber dónde estamos.

```

ls

```

permite observar qué existe en el lugar actual.

```

mkdir mi-proyecto

```

crea una carpeta.

```

cd mi-proyecto

```

entra en ella.

La terminal deja de ser una pantalla misteriosa.

Comienza a convertirse en nuestro espacio de trabajo.

### Prompt de aprendizaje

```

Quiero aprender a utilizar Termux como espacio de desarrollo.

Actúa como mi profesor de terminal.

Estoy comenzando desde cero y quiero aprender haciendo.

Necesito crear una carpeta para mi primer proyecto y aprender a:

1. saber dónde estoy;
2. listar archivos;
3. crear una carpeta;
4. entrar en una carpeta;
5. salir de una carpeta;
6. crear archivos;
7. consultar información básica.

Dame los comandos uno por uno.

Después de cada comando explícame brevemente:

· qué hace;
· qué debería aparecer;
· qué significa el resultado.

No me entregues todos los comandos de una sola vez. Quiero avanzar paso a paso y comprobar cada resultado antes de continuar.

```

### Resultado

Ahora tienes una carpeta que representa físicamente tu proyecto.

La idea comienza a tener una existencia concreta.

---

## Paso 3 — Crea la estructura de tu primera aplicación

### Objetivo

Crear los archivos básicos de un sitio web.

Utilizaremos tres tecnologías:

- HTML;
- CSS;
- JavaScript.

No necesitas aprenderlas completamente antes de utilizarlas.

Vamos a aprenderlas mientras construimos.

### Acciones

Dentro de la carpeta del proyecto crea:

```

mi-proyecto/
├── index.html
├── style.css
└── script.js

```

Cada archivo tendrá una función diferente.

**HTML**

Define la estructura y los contenidos de la página.

**CSS**

Define cómo se presenta visualmente.

**JavaScript**

Permite incorporar comportamiento e interacción.

Podemos imaginarlo así:

```

HTML
↓
estructura

CSS
↓
apariencia

JavaScript
↓
comportamiento

```

### Prompt de aprendizaje

```

Estoy creando mi primer sitio web.

Quiero utilizar tres archivos:

index.html
style.css
script.js

Explícame qué función cumple cada uno y cómo se relacionan entre sí.

Después ayúdame a crear una versión mínima de cada archivo para que pueda abrir el sitio en un navegador.

Quiero que el código sea corto, claro y fácil de revisar.

Incluye comentarios breves en las partes importantes del código para explicar qué hace cada bloque.

No agregues funcionalidades innecesarias.

Quiero comprender qué estamos construyendo antes de continuar.

```

### Resultado

Ya tienes la estructura básica de una aplicación web.

Todavía es muy sencilla.

Eso es exactamente lo que queremos.

---

## Paso 4 — Haz que tu primera página funcione

### Objetivo

Ver cómo una idea escrita se convierte en algo visible.

Ahora vamos a transformar la estructura inicial en una página.

### Acciones

1. Abre `index.html`.
2. Agrega el contenido de tu proyecto.
3. Conecta `style.css`.
4. Conecta `script.js`.
5. Abre la página en un navegador.
6. Observa el resultado.
7. Cambia alguna parte.
8. Vuelve a abrirla.
9. Comprueba qué cambió.

En este momento ocurre algo importante.

El código deja de ser texto abstracto.

Comienza a producir un resultado.

Puedes cambiar una palabra y verla aparecer.

Puedes modificar un estilo y observar cómo cambia la página.

Puedes agregar una interacción y comprobar cómo responde.

### Prompt de aprendizaje

```

Quiero convertir mi idea en una primera página web funcional.

Mi proyecto es:

[DESCRIPCIÓN DEL PROYECTO]

Ayúdame a implementar solamente una primera versión mínima.

Quiero trabajar con:

index.html
style.css
script.js

Dame el código necesario para cada archivo por separado.

El código debe ser:

· corto;
· sencillo;
· modular;
· fácil de leer;
· fácil de modificar;
· fácil de revisar por otra inteligencia artificial.

Incluye comentarios breves para explicar los bloques importantes.

No agregues funcionalidades que todavía no necesito.

Después explícame cómo probar la página y qué debería observar.

```

### Resultado

Tienes tu primera aplicación funcionando localmente.

Este es un momento importante:

ya no solamente estás utilizando tecnología. Estás construyendo con ella.

---

## Paso 5 — Guarda tu primera versión con Git

### Objetivo

Aprender a conservar la historia de nuestro proyecto.

A partir de ahora vamos a asumir que cualquier cambio puede producir un problema.

Por eso necesitamos poder volver atrás.

Git nos permite registrar versiones.

### Acciones

1. Inicializa Git en el proyecto.
2. Comprueba qué archivos reconoce.
3. Guarda la primera versión.
4. Modifica el proyecto.
5. Comprueba qué cambió.
6. Guarda una nueva versión.
7. Observa la diferencia entre ambas.

El principio es sencillo:

```

cambio
↓
comprobación
↓
versión
↓
nuevo cambio
↓
nueva versión

```

Esto permite experimentar sin sentir que cada modificación destruye lo anterior.

### Prompt de aprendizaje

```

Estoy trabajando en mi primer proyecto y quiero aprender Git desde cero.

Estoy utilizando Termux.

Quiero:

1. inicializar Git;
2. comprobar el estado del proyecto;
3. guardar mi primera versión;
4. modificar un archivo;
5. comprobar qué cambió;
6. guardar una segunda versión.

Dame los comandos uno por uno.

Explícame qué significa cada comando y qué debería observar después de ejecutarlo.

No quiero memorizar comandos.

Quiero comprender qué problema resuelve Git y por qué cada paso es necesario.

```

### Resultado

Ahora tu proyecto tiene memoria.

Puedes experimentar sabiendo que existe una historia de cambios.

---

## Paso 6 — Sube el proyecto a GitHub

### Objetivo

Guardar el proyecto en un repositorio remoto y aprender a trabajar con él.

Git y GitHub no son lo mismo.

Git registra la historia del proyecto.

GitHub permite alojar y compartir ese repositorio.

Podemos representarlo así:

```

tu dispositivo
↓
Git
↓
GitHub

```

### Acciones

1. Crea un repositorio en GitHub.
2. Conecta tu proyecto local con ese repositorio.
3. Realiza el primer push.
4. Comprueba que los archivos aparecen en GitHub.
5. Haz una modificación local.
6. Guarda el cambio con Git.
7. Vuelve a subirlo.
8. Comprueba que GitHub refleja la nueva versión.

### Prompt de aprendizaje

```

Quiero aprender a utilizar GitHub para guardar mi primer proyecto.

Tengo un proyecto local en Termux y ya lo estoy gestionando con Git.

Quiero aprender a:

1. crear un repositorio en GitHub;
2. conectarlo con mi proyecto local;
3. hacer el primer push;
4. comprobar que los archivos llegaron correctamente;
5. modificar el proyecto;
6. crear una nueva versión;
7. volver a subirla a GitHub.

Explícame cada paso de manera sencilla.

Cuando necesite utilizar la terminal, dame el comando exacto.

No supongas que conozco GitHub.

Si existe alguna diferencia entre Git y GitHub que sea importante para entender el proceso, explícala brevemente.

```

### Resultado

Tu proyecto ya tiene una copia remota y versionada.

Esto significa que puedes trabajar con mayor seguridad.

---

## Paso 7 — Publica tu sitio con Render

### Objetivo

Transformar el proyecto que funciona en nuestro dispositivo en un sitio accesible desde Internet.

Hasta ahora:

```

idea
↓
código
↓
Git
↓
GitHub

```

Ahora agregamos:

```

GitHub
↓
Render
↓
Internet

```

### Acciones

1. Crea o abre una cuenta en Render.
2. Conecta GitHub.
3. Selecciona el repositorio.
4. Configura el servicio necesario.
5. Realiza el primer despliegue.
6. Espera la construcción.
7. Abre la URL proporcionada por Render.
8. Comprueba que tu sitio funciona desde Internet.

Ahora existe una diferencia fundamental.

Ya no solamente tienes:

> «una carpeta con archivos».

Tienes:

> una aplicación que otras personas pueden visitar.

### Prompt de aprendizaje

```

Quiero publicar mi primer sitio web utilizando GitHub y Render.

Mi proyecto actualmente:

· funciona localmente;
· está guardado con Git;
· está alojado en GitHub.

Quiero conectarlo con Render y obtener una URL pública.

Actúa como mi instructor de despliegue.

Explícame:

1. qué significa desplegar una aplicación;
2. qué relación existe entre GitHub y Render;
3. qué tipo de servicio necesito para mi proyecto;
4. qué configuración debo utilizar;
5. cómo comprobar si el despliegue funcionó;
6. cómo interpretar los errores si el despliegue falla.

Quiero avanzar paso a paso.

No me des instrucciones que dependan de configuraciones que todavía no hemos comprobado.

```

### Resultado

Tu primera aplicación está disponible en Internet.

Este es otro salto conceptual:

```

código
↓
servidor
↓
Internet
↓
usuario

```

---

## Paso 8 — Conecta tu aplicación con una inteligencia artificial

### Objetivo

Ahora vamos a incorporar inteligencia artificial dentro del proyecto.

Hasta este momento utilizamos IA para ayudarnos a desarrollar.

Ahora la IA también será parte de la aplicación que estamos construyendo.

Esta diferencia es fundamental.

```

IA como copiloto
↓
nos ayuda a construir

IA como componente
↓
forma parte de lo que construimos

```

### Acciones

Dependiendo del proyecto elegido, podremos:

- crear o utilizar un proyecto en Google Cloud;
- revisar los créditos disponibles;
- configurar la facturación necesaria;
- habilitar el servicio correspondiente;
- configurar la autenticación;
- obtener acceso a una API;
- realizar una primera solicitud;
- recibir una respuesta;
- mostrar esa respuesta dentro de nuestra aplicación.

En este paso aparecerán conceptos como:

- API;
- autenticación;
- credenciales;
- permisos;
- variables de entorno;
- cuotas;
- costos.

No necesitamos aprenderlos todos de una vez.

Los iremos comprendiendo porque necesitamos utilizarlos.

### Prompt de aprendizaje

```

Quiero conectar mi aplicación web con un servicio de inteligencia artificial mediante una API.

Estoy aprendiendo desarrollo y necesito que me guíes paso a paso.

Mi proyecto está actualmente:

· desarrollado localmente;
· versionado con Git;
· alojado en GitHub;
· desplegado en Render.

Quiero utilizar Google Cloud y los servicios de inteligencia artificial disponibles para mi cuenta.

Primero ayúdame a determinar:

1. qué servicio necesito;
2. qué debo configurar;
3. qué credenciales o permisos necesito;
4. qué información debe mantenerse privada;
5. cómo utilizar variables de entorno;
6. cómo realizar una primera solicitud a la API;
7. cómo recibir la respuesta;
8. cómo mostrarla en mi aplicación.

No inventes configuraciones.

Antes de cada paso, dime qué estamos intentando conseguir y por qué.

Cuando necesitemos utilizar la terminal o una CLI, dame el comando exacto y explícame qué hace.

```

### Resultado

Tu sitio comienza a comunicarse con una inteligencia artificial.

La aplicación ya no solamente presenta información.

Ahora puede procesar una solicitud y recibir una respuesta de un modelo de IA.

---

## Paso 9 — Desarrolla una funcionalidad propia con IA como copiloto

### Objetivo

Ahora comienza la parte más importante del ejercicio.

Hasta este momento hemos seguido un camino relativamente definido.

Ahora debes decidir qué quieres que haga tu aplicación.

La IA será tu copiloto.

Tú defines la intención.

La inteligencia artificial ayuda a traducir esa intención en decisiones técnicas y código.

### Acciones

1. Decide una nueva funcionalidad.
2. Explícala en lenguaje natural.
3. Pide a la IA que transforme tu idea en una especificación.
4. Pide que identifique los archivos que será necesario modificar.
5. Pide instrucciones técnicas.
6. Implementa los cambios.
7. Prueba la funcionalidad.
8. Lee los errores.
9. Corrige.
10. Guarda una nueva versión con Git.
11. Súbela a GitHub.
12. Despliega nuevamente.

Podemos representar el proceso así:

```

idea
↓
especificación
↓
instrucciones
↓
código
↓
prueba
↓
error
↓
corrección
↓
Git
↓
GitHub
↓
Render

```

Este ciclo puede repetirse muchas veces.

Y precisamente ahí comienza el verdadero desarrollo.

### Prompt de aprendizaje

```

Quiero desarrollar una nueva funcionalidad para mi aplicación.

La funcionalidad que quiero es:

[DESCRIBE AQUÍ TU IDEA]

Actúa como mi copiloto de desarrollo.

No quiero que simplemente escribas código.

Quiero que me ayudes a desarrollar la funcionalidad siguiendo este proceso:

1. comprender mi intención;

2. convertirla en una especificación técnica;

3. identificar qué archivos deben modificarse;

4. explicar qué debería cambiar en cada archivo;

5. proponer una implementación sencilla;

6. escribir únicamente el código necesario;

7. indicarme cómo probarlo;

8. ayudarme a interpretar los errores;

9. corregirlos si aparecen.


Mantén el código modular, corto y fácil de revisar.

No reescribas archivos completos si solamente necesitamos modificar una pequeña parte.

Incluye comentarios breves en los bloques importantes.

No agregues funcionalidades que no te haya solicitado.

Antes de modificar el código, explícame qué vamos a hacer y espera mi confirmación.

```

### Resultado

Ahora estás desarrollando una funcionalidad propia.

La inteligencia artificial ya no es solamente una herramienta que responde preguntas.

Se convierte en un copiloto dentro de un proceso de desarrollo.

---

## Paso 10 — Publica tu primera aplicación

### Objetivo

Cerrar el ciclo completo.

Ya no estamos aprendiendo herramientas aisladamente.

Estamos integrándolas.

### Acciones

Antes de publicar la versión final:

1. prueba la aplicación;
2. comprueba las funcionalidades principales;
3. revisa los errores;
4. verifica que no existan credenciales expuestas;
5. guarda una versión estable con Git;
6. sube la versión a GitHub;
7. despliega nuevamente en Render;
8. abre la URL pública;
9. prueba la aplicación desde otro dispositivo;
10. comparte el resultado con otra persona.

La secuencia completa es:

```

IDEA
↓
TERMUX
↓
ARCHIVOS
↓
HTML + CSS + JAVASCRIPT
↓
GIT
↓
GITHUB
↓
RENDER
↓
API
↓
GOOGLE CLOUD
↓
INTELIGENCIA ARTIFICIAL
↓
APLICACIÓN
↓
USUARIO

```

Y detrás de todo esto existe un proceso mucho más importante:

```

pregunta
↓
idea
↓
acción
↓
resultado
↓
error
↓
interpretación
↓
corrección
↓
aprendizaje
↓
nueva acción

```

---

## Lo que acabas de aprender

Es posible que al comenzar hayas pensado que este ejercicio consistía en aprender:

- Termux;
- Git;
- GitHub;
- Render;
- HTML;
- CSS;
- JavaScript;
- APIs;
- Google Cloud;
- inteligencia artificial.

Pero ese no era realmente el objetivo.

El objetivo era experimentar un proceso completo de desarrollo.

Ahora sabes que una aplicación puede comenzar con una idea expresada en lenguaje natural.

Esa idea puede transformarse en una especificación.

La especificación puede convertirse en código.

El código puede organizarse en archivos.

Los archivos pueden versionarse.

Las versiones pueden almacenarse en GitHub.

El proyecto puede desplegarse en un servidor.

El servidor puede comunicarse con una API.

La API puede conectarse con un modelo de inteligencia artificial.

Y todo ese sistema puede terminar convertido en una aplicación que otra persona puede utilizar.

---

## El código como conversación entre componentes

Una de las ideas más importantes que debes conservar es que una aplicación no es necesariamente un único bloque de código.

Puede estar formada por diferentes componentes.

Por ejemplo:

```

navegador
↓
frontend
↓
backend
↓
API
↓
modelo de inteligencia artificial

```

Cada componente cumple una función.

Y los componentes necesitan comunicarse de acuerdo con determinadas reglas.

Por eso, cuando desarrolles proyectos más complejos, será importante aprender a pensar en términos de:

- entradas;
- salidas;
- funciones;
- responsabilidades;
- interfaces;
- contratos;
- datos;
- errores.

No necesitas dominar estos conceptos ahora.

Pero ya has visto por primera vez cómo aparecen en un proyecto real.

---

## El principio de los pequeños cambios

A medida que tus proyectos crezcan, aparecerá una regla especialmente útil:

> Es mejor hacer un cambio pequeño que intentar transformar todo el proyecto de una sola vez.

Un cambio pequeño es más fácil de:

- comprender;
- probar;
- revisar;
- corregir;
- explicar;
- guardar;
- revertir.

Por eso, cuando trabajes con una inteligencia artificial, evita pedirle:

> «Reescribe todo mi proyecto y agrega estas veinte funcionalidades.»

Es preferible trabajar así:

```

una intención
↓
un cambio
↓
una prueba
↓
un resultado
↓
siguiente cambio

```

Esto reduce los errores y hace que tanto tú como la IA puedan comprender mejor lo que está ocurriendo.

---

## El código también necesita memoria

A medida que un proyecto crece, ya no basta con recordar mentalmente cómo funciona.

Necesitamos memoria externa.

Esa memoria puede estar formada por:

- archivos;
- comentarios;
- README;
- documentación;
- contratos;
- especificaciones;
- historial de Git;
- mensajes de commit;
- instrucciones para las IA.

Esto es especialmente importante cuando trabajamos con inteligencia artificial.

Una IA puede olvidar parte del contexto.

Por eso, no debemos depender exclusivamente de la memoria de una conversación.

Podemos construir una memoria externa del proyecto.

El proyecto puede contener documentos que expliquen:

- qué hace cada parte;
- por qué existe;
- cómo debe comportarse;
- qué acuerdos deben respetarse;
- qué cosas no deben modificarse.

De esta manera, la inteligencia artificial puede volver a consultar la información necesaria cuando la necesite.

---

## La inteligencia artificial como copiloto

Durante este ejercicio puedes descubrir una forma completamente diferente de aprender tecnología.

En lugar de preguntar:

> «¿Cómo aprendo programación?»

puedes comenzar preguntando:

> «¿Qué necesito aprender para hacer esto?»

La diferencia parece pequeña.

Pero cambia completamente el proceso.

La inteligencia artificial puede ayudarte a:

- traducir una intención en una especificación;
- explicar conceptos;
- generar código;
- explicar código existente;
- producir comandos;
- interpretar errores;
- revisar modificaciones;
- proponer alternativas;
- documentar el proyecto;
- ayudarte a probar;
- ayudarte a depurar.

Pero tú sigues siendo quien decide:

> qué quieres construir.

---

## No necesitas entenderlo todo para comenzar

Cuando aparezcan palabras que no comprendes, no te detengas inmediatamente.

Pregúntate:

> ¿Necesito comprender esto ahora para continuar?

Si la respuesta es sí, aprende ese concepto.

Si la respuesta es no, puedes continuar y volver posteriormente.

El desarrollo tecnológico tiene muchas capas.

No necesitas dominar todas simultáneamente.

Puedes aprender:

```

lo necesario
para el siguiente paso

```

Y después:

```

lo necesario
para el paso siguiente

```

Así se construye progresivamente una comprensión más profunda.

---

## De consumidor a constructor

Al comenzar este curso quizás la tecnología podía parecer algo que otras personas construían.

Las aplicaciones estaban hechas.

Los servidores estaban configurados.

Las páginas existían.

Las inteligencias artificiales funcionaban.

Los sistemas parecían demasiado complejos para intervenir en ellos.

Ahora has visto otra posibilidad.

Puedes abrir una terminal.

Puedes crear una carpeta.

Puedes crear un archivo.

Puedes modificar código.

Puedes guardar una versión.

Puedes subirla a GitHub.

Puedes desplegarla.

Puedes conectar una API.

Puedes utilizar inteligencia artificial.

Puedes construir una aplicación.

La distancia entre:

> «utilizo una tecnología»

y

> «puedo construir con esa tecnología»

es mucho menor de lo que inicialmente parece.

Está formada por pequeños pasos.

---

## Para recordar

El objetivo de este ejercicio no era convertirte en programador profesional.

Era darte una experiencia diferente:

> la experiencia de construir.

Comenzaste con una idea.

Después aprendiste a abrir un espacio de trabajo.

Creaste archivos.

Escribiste código.

Viste aparecer una página.

Guardaste versiones.

Subiste tu proyecto.

Lo publicaste.

Conectaste una API.

Incorporaste inteligencia artificial.

Desarrollaste una funcionalidad.

Y finalmente publicaste una aplicación.

Quizás todavía no comprendas completamente cómo funciona cada componente.

No importa.

Ahora sabes algo que antes no sabías:

> puedes entrar en un proceso de desarrollo tecnológico.

Y puedes hacerlo acompañado por inteligencia artificial.

La idea fundamental de este curso puede resumirse así:

> No necesitas aprender todo sobre tecnología para comenzar a construir con ella. Necesitas aprender lo suficiente para dar el siguiente paso.

Y entonces ocurre algo que al principio casi no se nota.

Aprendes un comando.

Después otro.

Aprendes a encontrar un archivo.

Aprendes a leer un error.

Aprendes a preguntar mejor.

Aprendes a modificar una línea.

Aprendes a guardar una versión.

Aprendes a desplegar.

Aprendes a conectar una API.

Aprendes a trabajar con una inteligencia artificial.

Y, mientras creías que estabas simplemente aprendiendo herramientas, estabas aprendiendo algo mucho más importante:

> cómo convertir una idea en algo que funciona.

---

## Cierre del Curso Inicial

Este ejercicio cierra el recorrido inicial de Alfabetización Digital para humanistas.

No porque hayas aprendido todo lo necesario para desarrollar software.

Sino porque ya has atravesado la primera frontera.

La frontera entre:

```

usar tecnología

```

y

```

construir con tecnología

```

A partir de aquí comienza un territorio mucho más amplio.

Puedes profundizar en programación.

Puedes aprender bases de datos.

Puedes estudiar APIs.

Puedes desarrollar aplicaciones móviles.

Puedes trabajar con inteligencia artificial.

Puedes automatizar procesos.

Puedes construir herramientas para investigación.

Puedes crear plataformas educativas.

Puedes desarrollar proyectos para tu comunidad.

Pero ya no partes desde afuera.

Ahora sabes cómo entrar.

Y esa era la verdadera finalidad de este curso.

> Aprender haciendo.
> Construir para aprender.
> Y aprender lo necesario para poder construir lo siguiente.

</div>
```
