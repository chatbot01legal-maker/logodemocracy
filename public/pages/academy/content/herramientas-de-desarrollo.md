---
library: "Alfabetización Digital para humanistas"
folder: "Encerar, pulir... no olvidar respirar, muy importante"
title: "5. Herramientas de Desarrollo"
tags:
- alfabetizacion-digital
- desarrollo
- terminal
- termux
- github
- render
- cli
- herramientas
- humanidades-digitales
---

<div align="justify">

# Herramientas de Desarrollo

## Pregunta central

¿Qué herramientas necesita comprender un humanista para pasar de utilizar tecnología a construir con ella?

## Idea central

Desarrollar software no consiste solamente en aprender a programar.

Antes de escribir código necesitamos aprender a trabajar con las herramientas que permiten crear, modificar, probar, organizar y publicar ese código.

Una terminal.

Un editor de texto.

Un repositorio.

Un sistema de control de versiones.

Un servidor.

Una plataforma de despliegue.

Un navegador.

Una cuenta en la nube.

Una interfaz de línea de comandos.

Al principio, estas herramientas pueden parecer desconectadas entre sí.

Pero forman un sistema.

Comprender ese sistema permite que una persona que no proviene de la ingeniería pueda comenzar a construir tecnología de manera progresiva.

La pregunta no es:

«¿Sé programar?»

La pregunta inicial es:

«¿Sé trabajar con las herramientas que permiten que una idea se convierta en algo que funciona?»

---

## El computador como herramienta de trabajo

Cuando utilizamos un computador normalmente pensamos en las aplicaciones que vemos.

Un navegador.

Un procesador de textos.

Una aplicación de mensajería.

Una plataforma de videos.

Pero debajo de esas interfaces existe otra capa.

Archivos.

Carpetas.

Procesos.

Programas.

Servidores.

Redes.

Sistemas operativos.

Configuraciones.

Durante mucho tiempo, estas capas estuvieron ocultas para el usuario.

Eso hizo que utilizar computadores fuera más sencillo.

Pero también produjo una consecuencia:

muchas personas aprendieron a usar tecnología sin aprender cómo funciona la tecnología que estaban utilizando.

La alfabetización digital para humanistas busca atravesar parcialmente esa capa.

No para convertir a todas las personas en ingenieros.

Sino para entregarles suficiente comprensión como para poder construir.

---

## La terminal

Una de las primeras herramientas que puede resultar extraña es la terminal.

En lugar de hacer clic sobre iconos, escribimos instrucciones.

Por ejemplo:

```text

pwd

podemos pedirle al computador que nos diga dónde estamos.

Con:

ls

podemos observar qué archivos existen en ese lugar.

Con:

cd proyecto

podemos entrar en una carpeta.

La terminal parece menos amigable que una interfaz gráfica.

Pero tiene una característica poderosa:

permite conversar directamente con el sistema mediante instrucciones precisas.

La terminal no es programación

Es importante distinguir ambas cosas.

Utilizar una terminal no significa necesariamente programar.

Podemos utilizar comandos para:

movernos entre carpetas;

crear archivos;

copiarlos;

eliminarlos;

instalar herramientas;
ejecutar programas;

consultar información;

iniciar servidores;

conectarnos con servicios externos.

La terminal es, en cierto sentido, una interfaz de control.

Aprender a utilizarla permite comprender que el computador no es solamente una colección de ventanas.

Es un sistema que puede recibir instrucciones.

Termux: llevar la terminal al teléfono

En Android existe una herramienta especialmente interesante para este aprendizaje:
Termux.

Termux permite utilizar un entorno de terminal directamente desde un dispositivo Android.

Esto tiene una consecuencia pedagógica importante.

El desarrollo deja de estar necesariamente asociado a un computador tradicional.

Podemos comenzar a experimentar con:

archivos;

comandos;

programas;

servidores;

Git;

código;

automatizaciones.

Incluso desde un teléfono o una tablet.

El objetivo no es convertir el dispositivo móvil en una estación profesional de ingeniería.

El objetivo es comprender algo más fundamental:

podemos interactuar directamente con el sistema que ejecuta nuestras herramientas.Los archivos son el material de construcción

Antes de pensar en grandes programas, necesitamos comprender algo mucho más sencillo:

un proyecto está compuesto por archivos.

Un archivo puede contener:

texto;

código;

configuración;

datos;

instrucciones;

documentación.

Una carpeta permite organizar esos archivos.

Por ejemplo:

mi-proyecto/
├── index.html
├── styles.css
├── app.js
└── README.md

Esto puede parecer trivial.

Pero comprender esta estructura es fundamental.

Un proyecto de software no aparece mágicamente dentro de una aplicación.

Está compuesto por piezas que podemos observar, modificar y reorganizar.

El editor de código

Necesitamos también una herramienta para trabajar con esos archivos.

Puede ser un editor gráfico.

Puede ser un editor dentro de la terminal.

Puede ser una aplicación móvil.

Lo importante no es comenzar utilizando la herramienta más sofisticada.

Lo importante es poder hacer algo mucho más básico:

abrir un archivo, comprenderlo, modificarlo y guardarlo.

Cuando una persona comienza a hacer esto, ocurre un cambio importante.

El software deja de ser algo que solamente consume.

Comienza a convertirse en algo que puede modificar.

Git: recordar los cambios

A medida que nuestros proyectos crecen aparece un problema.

¿Qué ocurre si modificamos algo y después deja de funcionar?

¿Qué ocurría antes?

¿Qué archivo cambiamos?

¿Qué parte eliminamos?

¿Cómo volvemos atrás?

Aquí aparece Git.

Git permite registrar la historia de un proyecto.

Podemos imaginarlo como una memoria del desarrollo.

En lugar de tener solamente:

proyecto-final/

podemos tener una historia de cómo llegamos hasta allí.

Esto permite experimentar con mayor seguridad.

Podemos cambiar.

Probar.

Equivocarnos.

Volver atrás.

Intentar nuevamente.

Git transforma el desarrollo en un proceso mucho más reversible.

GitHub: guardar y compartir el proyecto

Git y GitHub no son exactamente lo mismo.

Git es una herramienta de control de versiones.

GitHub es una plataforma que permite alojar repositorios Git y colaborar alrededor de ellos.

Un proyecto puede encontrarse en nuestro dispositivo y también en un repositorio remoto.

Por ejemplo:

dispositivo
     ↓
    Git
     ↓
  GitHub

Esto permite disponer de una copia remota del proyecto y facilita trabajar con otras personas o con diferentes dispositivos.

También cambia nuestra relación con el código.

El proyecto deja de ser simplemente una carpeta perdida en nuestro computador.

Puede convertirse en un objeto identificable, versionado y compartible.

La nube no es magia

Cuando escuchamos expresiones como:

«Está en la nube.»

parece que nuestros archivos simplemente desaparecieron hacia algún lugar abstracto.

Pero no.

La nube sigue siendo infraestructura informática.

Son computadores.

Servidores.

Redes.

Sistemas de almacenamiento.

Servicios.

La diferencia fundamental es que no necesariamente son computadores que nosotros poseemos físicamente.

Comprender esto ayuda a eliminar parte del misterio que rodea al desarrollo moderno.

Render: convertir código en una aplicación accesible

Podemos tener un proyecto funcionando en nuestro dispositivo.

Pero eso no significa que otra persona pueda acceder a él desde Internet.

Para eso necesitamos desplegarlo.

Una plataforma como Render permite conectar nuestro proyecto con infraestructura que puede ejecutar nuestra aplicación y hacerla accesible desde Internet.

Podemos imaginar el proceso:

código
  ↓
GitHub
  ↓
Render
  ↓
servidor
  ↓
Internet
  ↓
usuario

Esto representa un salto conceptual importante.

Nuestro código deja de existir solamente en nuestro dispositivo.

Comienza a existir como un servicio que otras personas pueden utilizar.

El servidor

Un servidor no es una especie de computador completamente diferente.

Es, fundamentalmente, un computador que está disponible para atender solicitudes.

Cuando alguien visita una página web, su dispositivo realiza una solicitud.

Un servidor recibe esa solicitud.

Procesa algo.

Y devuelve una respuesta.

Podemos simplificarlo así:

usuario
   ↓
solicitud
   ↓
servidor
   ↓
procesamiento
   ↓
respuesta
   ↓
usuario

Comprender este ciclo es una de las primeras grandes puertas hacia el desarrollo web.

CLI: hablar con los servicios

CLI significa Command Line Interface, o interfaz de línea de comandos.

Muchas plataformas tecnológicas proporcionan herramientas CLI.

CLI como lenguaje de intermediación

Una de las consecuencias más importantes de las interfaces de línea de comandos es que permiten reducir la dependencia de interfaces gráficas complejas.

Una plataforma como Google Cloud puede contener cientos de opciones, menús y configuraciones. Una base de datos puede tener una interfaz propia. Un servicio puede requerir aprender una plataforma completa antes de poder utilizarlo.

La CLI permite otra estrategia.

Podemos preguntarle a una inteligencia artificial:

«Quiero realizar X. Estoy utilizando este servicio. ¿Qué comando necesito ejecutar?»

La IA puede ayudarnos a transformar nuestra intención en una instrucción ejecutable.

De esta manera, la persona no necesita comenzar aprendiendo toda la interfaz de la plataforma. Puede comenzar por el problema que quiere resolver.

La IA funciona entonces como una capa de traducción entre el lenguaje humano y el lenguaje operativo de las herramientas digitales.

El proceso puede repetirse:

intención → IA → comando → ejecución → resultado → interpretación → siguiente comando

Esto permite aprender mientras se construye.

Esto permite hacer desde la terminal cosas que también podríamos hacer mediante una interfaz gráfica.

Por ejemplo:

gcloud ...

permite interactuar con Google Cloud mediante comandos.

Esto puede utilizarse para:

configurar proyectos;

autenticar cuentas;

administrar servicios;

consultar recursos;

desplegar aplicaciones;

trabajar con APIs;

configurar determinados servicios de inteligencia artificial.

La ventaja es que comenzamos a comprender que muchas de las acciones que parecen «mágicas» dentro de una plataforma web son simplemente instrucciones que podemos ejecutar de manera explícita.

Google Cloud y las credenciales

Cuando trabajamos con inteligencia artificial mediante servicios en la nube aparece otro concepto fundamental:
las credenciales.

Un servicio necesita saber quién está realizando una determinada operación y qué permisos tiene.

Por eso podemos encontrarnos con:

proyectos;

cuentas;

autenticación;

permisos;

claves;

APIs;

cuotas;

facturación.

Por ejemplo, para utilizar determinados servicios de Google Cloud podemos necesitar configurar un proyecto y habilitar las APIs correspondientes.

La terminal permite realizar muchas de estas operaciones mediante herramientas CLI.

Esto puede parecer complejo al comienzo.

Pero detrás existe una idea sencilla:

un servicio necesita saber quién eres, qué quieres utilizar y si tienes autorización para hacerlo.

El crédito y el costo

Trabajar con servicios de inteligencia artificial también introduce una dimensión que un humanista debe comprender:

la infraestructura tiene costos.

Una aplicación puede utilizar:

procesamiento;

almacenamiento;

tráfico;

modelos de inteligencia artificial;

bases de datos;

servidores.

Por eso es importante distinguir entre:

tener acceso a una herramienta y poder utilizarla indefinidamente sin costo.

Los créditos promocionales, cuotas gratuitas y planes sin costo pueden ser muy útiles para aprender y experimentar.

Pero forman parte de un sistema económico.

Comprenderlo es también alfabetización digital.

Las variables de entorno

Cuando una aplicación necesita una contraseña, una clave de API o una credencial, no deberíamos escribirla directamente dentro del código.

Podemos utilizar variables de entorno.

Por ejemplo:

API_KEY=...

La idea fundamental es separar:

el código de los secretos necesarios para ejecutarlo.

Esto introduce una práctica esencial de seguridad.

Nunca debemos publicar accidentalmente credenciales privadas en un repositorio público.

El navegador como laboratorio

El navegador tampoco es solamente una herramienta para consumir contenido.

Puede convertirse en un laboratorio.

Podemos abrir las herramientas de desarrollador y observar:

HTML;

CSS;

JavaScript;

solicitudes de red;

respuestas;

errores;

almacenamiento;

consola.

Esto permite observar qué ocurre detrás de una página web.

Una página deja de ser una superficie completamente cerrada.

Comenzamos a observar sus componentes.

Los errores son información

Uno de los cambios psicológicos más importantes al comenzar a desarrollar consiste en cambiar nuestra relación con los errores.

Un error no significa necesariamente:

«No sé hacer esto.»

Puede significar:

«El sistema acaba de entregarme información sobre lo que hice.»

Un mensaje como:

SyntaxError

nos está diciendo que existe un problema de sintaxis.

Un error:

404 nos indica que un recurso no fue encontrado.

Un:

500 indica que ocurrió un problema en el servidor.

Los errores son señales.

Aprender a leerlos es una habilidad fundamental.

La inteligencia artificial como compañera de desarrollo

Aquí aparece una herramienta que cambia radicalmente la curva de aprendizaje:
la inteligencia artificial.

Podemos preguntarle:

«¿Qué significa este error?»

Podemos entregarle un archivo.

Podemos pedirle que explique un comando.

Podemos pedirle que revise nuestro código.

Podemos preguntarle qué archivo debemos modificar.

Incluso podemos construir proyectos completos mediante interacción progresiva.

Pero existe una distinción fundamental.

La inteligencia artificial puede producir código.

Eso no significa que nosotros comprendamos el sistema que estamos construyendo.

Por eso la IA debe utilizarse como:

tutor;

explicador;

asistente;

depurador;

colaborador;

generador de alternativas.

No como sustituto absoluto de nuestra comprensión.

Construir por capas

Un proyecto puede parecer enorme si lo observamos completo.

Pero podemos dividirlo.

Por ejemplo:

idea
 ↓
archivo
 ↓
código
 ↓
prueba local
 ↓
Git
 ↓
GitHub
 ↓
servidor
 ↓
API
 ↓
aplicación
 ↓
usuario

Cada capa introduce nuevos conceptos.

No necesitamos comprender todo antes de comenzar.

Podemos aprender una capa mientras construimos.

El desarrollo como aprendizaje progresivo

Al principio podemos aprender algo aparentemente insignificante.

Crear una carpeta.

Mover un archivo.

Ejecutar un comando.

Abrir una terminal.

Modificar una línea.

Hacer que aparezca una página.

Subir un archivo a GitHub.

Conectar un repositorio con Render.

Después aparece algo interesante.

Comenzamos a combinar esas acciones.

Terminal + archivos.

Archivos + código.

Código + Git.

Git + GitHub.

GitHub + Render.

Render + servidor.

Servidor + API.

API + inteligencia artificial.

Y de pronto estamos construyendo una aplicación.

No hubo necesariamente un momento exacto en el que «aprendimos a desarrollar».

El desarrollo apareció como consecuencia de haber aprendido progresivamente las herramientas necesarias para hacerlo.

De consumidor a constructor

Existe una transformación importante.

Al principio:

«Uso una aplicación.»

Después:

«Entiendo aproximadamente cómo funciona.»

Luego:

«Puedo modificarla.»

Finalmente:

«Puedo construir una.»

La distancia entre esos estados puede parecer enorme.

Pero no siempre lo es.

Muchas veces está formada por pequeñas habilidades acumuladas.

Una carpeta.

Un comando.

Un archivo.

Un error.

Una búsqueda.

Una pregunta a una IA.

Una modificación.

Una prueba.

Otra modificación.

Y otra.

Una herramienta para pensar críticamente

Cuando encontremos una nueva herramienta tecnológica podemos preguntarnos:

¿Qué problema resuelve?

¿Qué hace realmente?

¿Dónde funciona?

¿Qué necesita para funcionar?

¿Dónde están mis datos?

¿Quién controla la infraestructura?

¿Qué permisos necesita?

¿Cuánto cuesta?

¿Qué ocurre si deja de funcionar?

¿Existe una alternativa?

¿Puedo comprender suficientemente su funcionamiento como para utilizarla de manera responsable?

Estas preguntas permiten pasar de utilizar herramientas pasivamente a comprenderlas.

Implicaciones para los humanistas

La tecnología no debería ser un territorio reservado exclusivamente a quienes estudiaron ingeniería.

Un psicólogo puede construir una herramienta para investigación.

Un historiador puede crear una biblioteca digital.

Un filósofo puede desarrollar un sistema de análisis argumentativo.

Un profesor puede crear una plataforma educativa.

Un periodista puede construir herramientas para investigar datos.

Un ciudadano puede crear una aplicación para resolver un problema de su comunidad.

La alfabetización digital no busca convertir al humanista en ingeniero.

Busca permitirle participar activamente en la construcción del mundo digital.

Límite

Conocer estas herramientas no convierte automáticamente a una persona en desarrollador profesional.

Existen conocimientos técnicos mucho más profundos:

arquitectura de software;

seguridad;

redes;

bases de datos;

sistemas distribuidos;

programación avanzada;

infraestructura;

ingeniería de software.

El objetivo de este documento es diferente.

Busca entregar un mapa inicial para que una persona pueda entrar en ese territorio sin quedar completamente dependiente de especialistas.

La profundidad puede venir después.

Conexiones

Este documento se relaciona directamente con otros conceptos de Alfabetización Digital para humanistas:

Inteligencia artificial, qué es y qué no es: comprender qué puede hacer una IA permite utilizarla como herramienta de aprendizaje y desarrollo sin atribuirle capacidades que no posee.

Programación como lenguaje: el código permite transformar instrucciones e ideas en comportamientos ejecutables.

Datos e información: las aplicaciones trabajan con información que debe ser almacenada, transformada y transmitida.

Internet y la web: servidores, navegadores, APIs y redes permiten que los programas se comuniquen.

Seguridad digital: credenciales, permisos y variables de entorno muestran que desarrollar también implica proteger sistemas y datos.

Pensamiento crítico: utilizar una herramienta implica comprender sus supuestos, límites, costos y consecuencias.

Para recordar

Las herramientas de desarrollo no son solamente instrumentos técnicos.

Son formas de relacionarnos con los sistemas digitales.

La terminal nos permite dar instrucciones.

Los archivos nos permiten construir.

Git nos permite conservar la historia.

GitHub nos permite compartir y colaborar.

Los servidores permiten ejecutar nuestros proyectos.

Render permite desplegarlos.

Las CLI permiten controlar servicios mediante instrucciones.

Las nubes permiten utilizar infraestructura que no poseemos físicamente.

La inteligencia artificial puede acompañar nuestro proceso de aprendizaje y construcción.

Pero ninguna herramienta reemplaza completamente la comprensión.

La idea fundamental puede resumirse así:

No necesitas aprender todo sobre tecnología para comenzar a construir con ella. Necesitas aprender lo suficiente para dar el siguiente paso.

Y entonces aparece algo que al principio parece casi imperceptible.

Aprendes un comando.

Después otro.

Aprendes a encontrar un archivo.

Aprendes a leer un error.

Aprendes a modificar una línea.

Aprendes a subir un proyecto.

Aprendes a desplegarlo.

Aprendes a preguntar mejor.

Y, mientras creías que simplemente estabas aprendiendo herramientas, estabas aprendiendo algo mucho más importante:
cómo construir.

</div>
