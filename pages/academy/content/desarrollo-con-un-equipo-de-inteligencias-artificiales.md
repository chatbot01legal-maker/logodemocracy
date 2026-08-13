---
library: "Alfabetización Digital para humanistas"
folder: "Curso Inicial"
title: "Desarrollo-con-un-equipo-de-inteligencias-artificial"
tags:
  - alfabetizacion-digital
  - inteligencia-artificial
  - desarrollo
  - pensamiento-critico
  - auditoria
  - verificacion
  - colaboracion
  - agentes-ia
  - contratos
  - contexto
  - documentacion
  - humanidades-digitales
  - 
---

# Verificar, contrastar y auditar a una IA

## Pregunta central

¿Cómo podemos utilizar varias inteligencias artificiales para desarrollar software cuando nosotros mismos no poseemos todos los conocimientos técnicos necesarios?

## Idea central

Una de las mayores posibilidades que ofrece la inteligencia artificial para un humanista no consiste simplemente en pedirle que escriba código.

Consiste en poder construir un **sistema de colaboración entre diferentes inteligencias artificiales**, asignándoles funciones, responsabilidades y criterios distintos.

Una inteligencia artificial puede actuar como:

- jefe de proyecto;
- arquitecto;
- desarrollador;
- auditor;
- revisor;
- especialista;
- tester;
- documentador.

El humanista puede ocupar entonces una posición diferente.

No necesita saber realizar personalmente cada una de las tareas.

Necesita aprender a:

- definir qué quiere construir;
- dividir el problema;
- asignar responsabilidades;
- establecer acuerdos;
- entregar contexto;
- revisar resultados;
- detectar errores;
- decidir cuándo avanzar;
- decidir cuándo detenerse.

La inteligencia artificial puede compensar parte del déficit técnico del usuario.

Pero para que esa compensación funcione, necesitamos construir una **estructura de colaboración**.

La idea fundamental puede resumirse así:

> No necesitas que una sola inteligencia artificial sepa hacerlo todo. Necesitas aprender a organizar inteligencias artificiales diferentes alrededor de un problema.

---

## El problema del humanista frente al desarrollo

Una persona que proviene de las humanidades puede tener una idea perfectamente clara de lo que quiere construir.

Puede comprender:

- el problema;
- los usuarios;
- los objetivos;
- la experiencia que quiere producir;
- las preguntas que necesita resolver;
- las consecuencias que quiere generar.

Pero puede no conocer:

- la arquitectura necesaria;
- los lenguajes de programación;
- las APIs;
- las bases de datos;
- los protocolos;
- los servidores;
- los sistemas de autenticación;
- las herramientas de despliegue.

Tradicionalmente, esa diferencia obligaba a recurrir a un especialista.

La inteligencia artificial modifica parcialmente esta situación.

Ahora podemos decir:

> «Tengo esta idea y necesito convertirla en un sistema funcional. Ayúdame a descubrir qué conocimientos técnicos necesito.»

La IA puede transformar una intención humana en una serie de problemas técnicos.

Y después puede ayudarnos a resolverlos.

Esto no elimina la necesidad de aprender.

Cambia aquello que necesitamos aprender.

---

# El jefe de proyecto y el desarrollador

Una de las metodologías más útiles consiste en separar funciones.

Podemos pedirle a una inteligencia artificial que asuma el papel de **jefe de proyecto**.

A otra podemos asignarle el papel de **desarrollador**.

El proceso puede funcionar así:

```text
Humanista
    ↓
Define objetivo
    ↓
IA — Jefe de proyecto
    ↓
Diseña solución
    ↓
Produce instrucciones técnicas
    ↓
IA — Desarrollador
    ↓
Implementa código
    ↓
IA — Jefe de proyecto
    ↓
Revisa implementación
Esto resuelve un problema importante.
El humanista puede no saber escribir directamente:
"Modifica este endpoint, cambia este middleware y agrega esta validación..."
Pero sí puede explicar:
«Quiero que cuando el usuario pulse este botón, el documento que está viendo sea enviado automáticamente al tutor.»
El jefe de proyecto puede transformar esa intención en instrucciones técnicas.
Después, el desarrollador puede implementar esas instrucciones.
El usuario no necesita conocer previamente todos los detalles técnicos.
Necesita ser capaz de describir con claridad el resultado que quiere obtener y evaluar si el resultado efectivamente lo consigue.
La separación de roles
La separación de roles tiene una ventaja fundamental.
Reduce el riesgo de que una misma inteligencia artificial:
diseñe una solución;
escriba el código;
evalúe su propio código;
declare que todo está correcto.
Una IA que produce una solución tiene incentivos conversacionales para considerar que su solución es razonable.
Separar las funciones permite introducir una cierta distancia crítica.
Por ejemplo:
IA 1 — Jefe de proyecto
Su responsabilidad es:
comprender el objetivo;
analizar el problema;
definir la arquitectura;
establecer qué archivos deben modificarse;
producir instrucciones técnicas;
revisar el resultado.
IA 2 — Desarrollador
Su responsabilidad es:
interpretar las instrucciones;
modificar los archivos;
producir código;
explicar los cambios realizados;
informar posibles problemas.
IA 3 — Auditor
Su responsabilidad es diferente.
No debe intentar construir la solución.
Debe preguntar:
¿las instrucciones fueron correctamente interpretadas?
¿el código cumple el objetivo?
¿existen errores?
¿se rompió alguna funcionalidad existente?
¿se respetaron los contratos?
¿se introdujo complejidad innecesaria?
¿el resultado es suficientemente bueno para continuar?
No todas las IA deben buscar la perfección
Aquí aparece una cuestión especialmente importante.
Una inteligencia artificial puede ser extremadamente exigente cuando revisa código.
Puede encontrar:
pequeñas inconsistencias;
mejoras posibles;
refactorizaciones;
alternativas arquitectónicas;
problemas hipotéticos;
casos extremos.
Todas esas observaciones pueden ser técnicamente interesantes.
Pero eso no significa que todas sean importantes.
Existe una diferencia entre:
«El código podría mejorarse.»
y:
«El código no cumple su función.»
En un proyecto real, buscar permanentemente la solución perfecta puede impedir avanzar.
Por eso puede ser útil incorporar una tercera inteligencia artificial cuya función sea precisamente evaluar el criterio de suficiencia.
Podemos preguntarle:
«¿Este problema impide continuar o es simplemente una mejora posible?»
De esta manera tenemos tres perspectivas:
Jefe de proyecto
      ↓
¿qué necesitamos construir?

Desarrollador
      ↓
¿cómo podemos implementarlo?

Auditor
      ↓
¿funciona y cumple lo necesario?

Evaluador de suficiencia
      ↓
¿necesitamos corregirlo ahora o podemos continuar?
La pregunta no siempre es:
«¿Es perfecto?»
Puede ser:
«¿Es suficientemente bueno para el siguiente paso?»
El contrato entre inteligencias
Cuando varias inteligencias artificiales trabajan sobre un mismo proyecto aparece un problema fundamental:
necesitan compartir ciertas reglas.
Una IA puede recibir una instrucción.
Otra puede recibir otra.
Una tercera puede interpretar el proyecto de manera diferente.
Si cada una entiende el sistema de una manera distinta, pueden comenzar a producir código incompatible.
Aquí aparece el concepto de contrato.
Un contrato es un conjunto de acuerdos que establece cómo deben comportarse las diferentes partes de un sistema.
Puede especificar:
nombres;
estructuras;
formatos;
entradas;
salidas;
responsabilidades;
versiones;
interfaces;
reglas que no deben modificarse.
Por ejemplo:
El frontend enviará:

{
  "text": "...",
  "userId": "..."
}

El backend responderá:

{
  "IRD_global": 95,
  "riesgo": "Normal"
}
Mientras todas las partes respeten ese acuerdo, pueden comunicarse.
Si una inteligencia cambia:
IRD_global
por:
ird
sin actualizar el resto del sistema, otra parte puede dejar de funcionar.
El problema no necesariamente está en el código.
Está en que se rompió el contrato.
El contrato permite que los códigos conversen
Podemos pensar el contrato como un idioma común.
Imaginemos dos personas que deben trabajar juntas pero cada una utiliza palabras diferentes para referirse a las mismas cosas.
La coordinación se vuelve difícil.
En software ocurre algo parecido.
Un módulo puede decir:
userId
y otro esperar:
user_id
Un módulo puede devolver:
report
y otro esperar:
result
Un contrato establece:
«Así nos vamos a comunicar.»
Por eso, cuando trabajamos con varias inteligencias artificiales, el contrato no es solamente una cuestión técnica.
Es también una herramienta cognitiva.
Permite mantener una representación común del sistema.
El contrato como memoria externa
Aquí aparece otra dificultad fundamental de la inteligencia artificial.
Las inteligencias artificiales tienen límites respecto del contexto que pueden mantener disponible durante una interacción.
Una conversación puede crecer.
Un proyecto puede contener cientos de archivos.
Una sesión puede terminar.
Una nueva IA puede comenzar a trabajar sin conocer las decisiones anteriores.
Cuando falta contexto aparece un riesgo:
la IA puede comenzar a rellenar los espacios vacíos con suposiciones.
Puede inventar:
nombres de archivos;
estructuras;
funciones;
endpoints;
comportamientos;
decisiones arquitectónicas.
No necesariamente porque esté intentando engañarnos.
Simplemente no dispone de la información necesaria.
Por eso podemos utilizar documentos externos como una forma de memoria del proyecto.
Entre ellos, el contrato ocupa un lugar central.
La memoria de trabajo y el contexto
Podemos imaginar que una IA trabaja con una determinada cantidad de información disponible en cada momento.
Si le mostramos:
el objetivo;
la arquitectura;
el contrato;
los archivos relevantes;
las decisiones anteriores;
su capacidad para trabajar coherentemente aumenta.
Si eliminamos ese contexto, aumenta la posibilidad de que tenga que inferir cosas que nosotros ya habíamos decidido.
Por eso, una regla práctica es:
Si una decisión es importante, no confíes en que la IA la recordará indefinidamente.
Escríbela.
Si una regla es importante:
conviértela en un documento.
Si una estructura debe mantenerse:
conviértela en un contrato.
Si una función tiene una intención específica:
documenta esa intención.
La documentación se convierte así en una especie de memoria externa del proyecto.
Los documentos también son parte del sistema
Cuando desarrollamos un proyecto con inteligencia artificial, los documentos no son necesariamente accesorios.
Pueden convertirse en parte de la infraestructura cognitiva del desarrollo.
Podemos tener, por ejemplo:
/docs
   ├── arquitectura.md
   ├── contrato.md
   ├── decisiones.md
   ├── modulos.md
   ├── api.md
   └── instrucciones.md
Cada documento puede responder una pregunta diferente.
Arquitectura
¿Cómo está construido el sistema?
Contrato
¿Cómo deben comunicarse sus componentes?
Decisiones
¿Por qué se tomó determinada decisión?
Módulos
¿Qué responsabilidad tiene cada parte?
API
¿Qué entradas y salidas existen?
Instrucciones
¿Qué debe hacer la siguiente persona o IA?
Esto permite que una inteligencia artificial nueva pueda incorporarse al proyecto sin tener que reconstruir toda su historia desde cero.
Documentar la intención del código
Existe otra forma de documentación especialmente importante.
No solamente debemos explicar:
«¿Qué hace este código?»
También debemos explicar:
«¿Por qué existe este código?»
Estas dos preguntas no son iguales.
Por ejemplo:
if (user.isAuthenticated) {
    ...
}
Podemos documentar que este código:
«comprueba si el usuario está autenticado.»
Pero también puede ser importante documentar:
«Esta validación existe porque determinadas funciones solamente deben estar disponibles para usuarios autenticados.»
La segunda explicación contiene la intención.
Esto es importante porque una IA puede observar el código y concluir que una parte parece innecesaria.
Puede entonces eliminarla.
Pero si conoce la intención, puede comprender que esa parte cumple una función deliberada.
El código puede sobrevivir; la intención puede desaparecer
Los proyectos evolucionan.
Una persona escribe código.
Después otra persona lo modifica.
Después una IA lo revisa.
Después otra IA lo refactoriza.
Con el tiempo puede ocurrir algo peligroso:
el código permanece, pero nadie recuerda por qué fue diseñado de esa manera.
Por eso es útil conservar tres niveles:
¿Qué hace?
      ↓
¿Cómo lo hace?
      ↓
¿Por qué lo hace?
El primer nivel describe el comportamiento.
El segundo explica la implementación.
El tercero conserva la intención.
Los tres son útiles para trabajar con inteligencia artificial.
La documentación reduce las alucinaciones
Cuando una IA no conoce algo, puede intentar inferirlo.
Si nosotros le entregamos información explícita, reducimos la necesidad de inferencia.
Por ejemplo, en lugar de decir:
«Modifica el sistema de autenticación.»
podemos entregarle:
Contrato de autenticación v1.2

1. El usuario se identifica mediante userId.
2. El frontend nunca almacena la contraseña.
3. El backend valida la sesión.
4. El endpoint /api/auth devuelve...
5. No modificar estos nombres sin actualizar el contrato.
La IA tiene entonces menos espacio para inventar.
Esto no elimina completamente los errores.
Pero cambia las condiciones en las que trabaja.
La documentación funciona como una restricción sobre el espacio de posibles interpretaciones.
La IA necesita contexto, pero el contexto debe estar organizado
No se trata simplemente de entregarle a la IA enormes cantidades de información.
Más contexto no siempre significa mejor contexto.
Un proyecto puede contener miles de líneas de código.
Entregar todo indiscriminadamente puede dificultar la tarea.
Necesitamos seleccionar:
qué debe saber;
qué no necesita saber;
qué archivo debe modificar;
qué contrato debe respetar;
qué comportamiento no debe cambiar.
Por eso podemos pensar el contexto como una herramienta de diseño.
La pregunta no es:
«¿Cómo le doy toda la información?»
Sino:
«¿Cuál es la información mínima necesaria para que pueda tomar una buena decisión?»
El protocolo de colaboración
Podemos convertir todo esto en un procedimiento.
Paso 1 — Definir el objetivo
El humanista explica qué quiere conseguir.
Paso 2 — Consultar al jefe de proyecto
La IA analiza el problema y propone una solución.
Paso 3 — Establecer o actualizar el contrato
Se definen las reglas que las diferentes partes deberán respetar.
Paso 4 — Preparar el contexto
Se entregan a la IA:
objetivo;
arquitectura relevante;
contrato;
archivos necesarios;
restricciones;
decisiones anteriores.
Paso 5 — Generar instrucciones técnicas
El jefe de proyecto produce instrucciones concretas para el desarrollador.
Paso 6 — Implementar
El desarrollador modifica el código.
Paso 7 — Auditar
Otra IA revisa la implementación.
Paso 8 — Evaluar suficiencia
Una IA independiente determina si las observaciones encontradas requieren acción inmediata.
Paso 9 — Probar
El sistema se ejecuta.
Paso 10 — Documentar
Las decisiones importantes se incorporan a los documentos del proyecto.
Paso 11 — Continuar
El proyecto avanza hacia el siguiente problema.
Podemos representarlo así:
intención humana
       ↓
jefe de proyecto
       ↓
contrato + instrucciones
       ↓
desarrollador
       ↓
código
       ↓
auditor
       ↓
evaluador de suficiencia
       ↓
prueba
       ↓
documentación
       ↓
nuevo contexto
       ↓
siguiente ciclo
El humanista como director del sistema
Esta metodología cambia profundamente el papel del usuario.
El humanista no necesariamente se convierte en el programador principal.
Puede convertirse en el director del proceso de construcción.
Su responsabilidad consiste en mantener preguntas como:
¿Qué estamos intentando resolver?
¿Por qué lo estamos haciendo?
¿Qué parte del sistema estamos modificando?
¿Qué contrato debemos respetar?
¿Qué podría romperse?
¿Cómo sabemos que funciona?
¿Qué problema sigue después?
La IA aporta capacidades técnicas.
El humano aporta:
propósito;
criterio;
contexto;
prioridades;
valores;
decisiones.
La colaboración funciona cuando esas capacidades se complementan.
Verificar no significa desconfiar de todo
Auditar una inteligencia artificial no significa asumir que todo lo que produce está mal.
Significa reconocer que puede equivocarse.
Una IA puede:
interpretar mal una instrucción;
inventar una función;
utilizar una API incorrectamente;
modificar un archivo equivocado;
romper una dependencia;
olvidar una restricción;
asumir una decisión que nunca tomamos.
Por eso necesitamos verificación.
Pero tampoco debemos caer en el extremo contrario:
revisar infinitamente cada detalle hasta impedir que el proyecto avance.
La auditoría debe estar subordinada al objetivo.
El criterio de suficiencia
Una pregunta especialmente útil durante el desarrollo es:
«¿Qué necesitamos demostrar antes de continuar?»
Supongamos que estamos construyendo una función.
Podemos establecer:
Criterios para continuar:

✓ la función cumple el objetivo;
✓ no rompe las funciones existentes;
✓ respeta el contrato;
✓ pasa las pruebas;
✓ no introduce un problema de seguridad evidente.
Si esas condiciones se cumplen, podemos continuar.
Siempre será posible encontrar una mejora adicional.
Pero mejorar no es lo mismo que necesitar corregir.
El desarrollo requiere aprender a distinguir ambos casos.
Diferentes inteligencias, diferentes perspectivas
Una de las ventajas de utilizar varias IA es que podemos pedirles que observen el mismo problema desde perspectivas diferentes.
Por ejemplo:
IA arquitecta
«¿Esta solución es coherente con la arquitectura?»
IA desarrolladora
«¿Cómo implementamos esta solución?»
IA auditora
«¿Qué problemas tiene esta implementación?»
IA de seguridad
«¿Qué vulnerabilidades podría introducir?»
IA de experiencia de usuario
«¿Qué problemas podría encontrar el usuario?»
IA de suficiencia
«¿Alguno de estos problemas impide continuar?»
No necesitamos utilizar todas siempre.
Lo importante es comprender el principio:
una misma solución puede ser evaluada desde diferentes criterios.
La inteligencia artificial como equipo
Esto permite imaginar una nueva forma de desarrollo.
En lugar de:
humano → IA → código
podemos construir:
                  ┌── IA arquitecta
                  │
humano → objetivo ├── IA desarrolladora
                  │
                  ├── IA auditora
                  │
                  └── IA evaluadora
El humanista coordina.
Las inteligencias artificiales cumplen diferentes funciones.
Los contratos mantienen la coherencia.
Los documentos mantienen la memoria.
Las pruebas permiten comprobar el resultado.
La combinación produce un sistema de trabajo.
El error más peligroso: olvidar cómo se llegó hasta aquí
Cuando trabajamos de manera iterativa con IA puede aparecer un fenómeno extraño.
La IA modifica algo.
Después otra IA modifica otra cosa.
Después nosotros pedimos una nueva función.
Después aparece un error.
Y nadie recuerda exactamente por qué una determinada parte del sistema funciona de esa manera.
Por eso es importante conservar las decisiones relevantes.
Un documento de decisiones puede registrar:
Decisión #07

Fecha:
2026-08-13

Problema:
El frontend necesitaba enviar el documento actualmente cargado al tutor.

Decisión:
Utilizar el documento activo como cognitive asset por defecto.

Motivo:
Evitar que el usuario tenga que seleccionar nuevamente el archivo.

No modificar:
La interfaz de selección manual para otros flujos.
Esto puede parecer burocrático.
Pero cuando el proyecto crece, se convierte en memoria.
La documentación como puente entre inteligencias
Cuando una nueva IA entra al proyecto, no necesitamos contarle toda la historia de manera improvisada.
Podemos entregarle:
1. arquitectura.md
2. contrato.md
3. decisiones.md
4. módulo relevante
5. tarea actual
La documentación se convierte entonces en un puente entre diferentes agentes.
Una inteligencia artificial puede terminar una tarea.
Otra puede continuarla.
El proyecto mantiene continuidad aunque cambie el agente.
Esto es especialmente importante cuando trabajamos con servicios gratuitos o con sesiones que tienen límites de contexto.
Una nueva forma de programar
La programación asistida por IA introduce una transformación importante.
Antes, una persona necesitaba conocer una gran cantidad de sintaxis para comenzar.
Ahora puede comenzar desde una intención.
Por ejemplo:
«Quiero que cuando el usuario pulse este botón, el sistema envíe el documento activo al backend y muestre la respuesta del tutor.»
La IA puede ayudar a traducir esa intención a:
archivos;
funciones;
endpoints;
estructuras de datos;
comandos;
pruebas.
Pero el usuario necesita aprender a verificar que esa traducción corresponde realmente a lo que quería.
Por eso la nueva habilidad fundamental no es solamente:
escribir código.
Es también:
dirigir el proceso mediante el cual una intención se convierte en código.
Una herramienta para pensar críticamente
Cuando una IA nos entregue una solución, podemos preguntarnos:
Sobre el objetivo
¿Qué problema está resolviendo realmente?
Sobre el contexto
¿Qué información utilizó para llegar a esta solución?
Sobre el contrato
¿Qué acuerdos del sistema debe respetar?
Sobre la implementación
¿Qué archivos modificó?
¿Qué cambió exactamente?
Sobre la evidencia
¿Cómo sabemos que funciona?
Sobre la auditoría
¿Quién revisó la solución?
Sobre la suficiencia
¿El problema encontrado impide continuar?
Sobre la memoria
¿La decisión importante quedó documentada?
Sobre la continuidad
¿Otra persona o IA podría continuar el trabajo desde aquí?
Estas preguntas convierten la interacción con la IA en una metodología de desarrollo.
Implicaciones para los humanistas
La inteligencia artificial reduce algunas barreras técnicas de entrada.
Pero también introduce una nueva responsabilidad.
Si podemos construir sistemas sin dominar todos sus detalles técnicos, necesitamos aprender a coordinar conocimiento técnico que parcialmente no poseemos.
Eso requiere nuevas habilidades:
formular problemas;
asignar roles;
diseñar contratos;
proporcionar contexto;
interpretar resultados;
auditar;
documentar;
decidir prioridades;
reconocer límites.
Estas son habilidades profundamente compatibles con la formación humanista.
Un humanista puede no saber escribir una implementación compleja.
Pero puede saber preguntar:
«¿Qué estamos intentando hacer?»
«¿Por qué esta solución es adecuada?»
«¿Qué supuestos contiene?»
«¿Qué consecuencias puede producir?»
«¿Qué estamos olvidando?»
«¿Cómo sabemos que esto funciona?»
Esas preguntas pueden convertirse en una forma de dirección técnica.
Límite
Esta metodología no elimina la necesidad de conocimientos técnicos.
Una persona que desarrolla sistemas complejos deberá eventualmente comprender aspectos más profundos de:
programación;
arquitectura;
seguridad;
redes;
bases de datos;
infraestructura;
sistemas distribuidos;
pruebas;
operaciones.
La inteligencia artificial puede acelerar el aprendizaje y reducir algunas barreras iniciales.
Pero no convierte automáticamente en experto a quien la utiliza.
Tampoco garantiza que el código producido sea correcto.
La IA puede equivocarse incluso cuando recibe instrucciones claras, contratos y documentación.
Por eso:
delegar una tarea no significa delegar la responsabilidad de comprender su resultado.
Conexiones
Este documento se relaciona directamente con otros conceptos de Alfabetización Digital para humanistas:
Inteligencia artificial: qué es y qué no es: comprender las capacidades y límites de una IA permite utilizarla como colaboradora sin confundir generación de respuestas con comprensión.
Herramientas de Desarrollo: la colaboración con IA adquiere sentido cuando podemos utilizar terminales, Git, GitHub, servidores, CLI y otras herramientas para convertir las decisiones en acciones.
Conversar con una IA: del prompt a la colaboración: una buena interacción con IA no consiste solamente en formular preguntas, sino en construir progresivamente un contexto compartido de trabajo.
Pensar con IA sin dejar que la IA piense por ti: la delegación técnica no debe convertirse en delegación del criterio.
La diferencia que hace una diferencia: verificar implica distinguir entre una observación relevante y una mejora meramente posible.
Causalidad y retroalimentación: cada modificación del sistema produce consecuencias que pueden modificar las condiciones del siguiente ciclo de desarrollo.
Tipos lógicos y niveles de abstracción: una IA puede trabajar sobre diferentes niveles: objetivo, arquitectura, implementación, código y comportamiento observable.
Evolución, aprendizaje y cambio: un proyecto también aprende cuando registra errores, incorpora información y modifica sus estrategias de desarrollo.
Para recordar
La inteligencia artificial puede convertirse en mucho más que un generador de código.
Puede convertirse en un equipo de trabajo.
Podemos asignar roles diferentes:
jefe de proyecto
desarrollador
auditor
especialista
evaluador
Podemos establecer contratos para que las diferentes partes del sistema puedan comunicarse.
Podemos utilizar documentos para conservar:
arquitectura;
decisiones;
contratos;
intenciones;
instrucciones.
Podemos proporcionar contexto para reducir la necesidad de que la IA complete información desconocida mediante suposiciones.
Podemos auditar el resultado.
Y podemos utilizar una inteligencia artificial adicional para distinguir entre:
«esto está mal»
y
«esto podría estar mejor».
La idea fundamental puede resumirse así:
No necesitas que una inteligencia artificial piense por ti. Puedes utilizar varias inteligencias artificiales para ampliar aquello que eres capaz de construir.
Pero para hacerlo necesitas aprender algo nuevo.
No solamente a escribir prompts.
Necesitas aprender a organizar una conversación entre inteligencias.
Necesitas aprender a definir roles.
Necesitas establecer contratos.
Necesitas conservar memoria.
Necesitas documentar intenciones.
Necesitas verificar resultados.
Necesitas decidir cuándo corregir y cuándo avanzar.
Y, sobre todo, necesitas mantener algo que ninguna inteligencia artificial puede delegar completamente:
el criterio sobre qué vale la pena construir y por qué.
