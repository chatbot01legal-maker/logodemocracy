ATOM_LOADING.md – Carga y Resolución de Átomos Cognitivos

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.0.0
Estado: Fundacional
Ubicación: assets/js/sophia/02-instrumento/ATOM_LOADING.md
Naturaleza: Documento metodológico del Instrumento SOPHIA


---

1. Propósito

Este documento define el procedimiento mediante el cual el Instrumento SOPHIA construye el Conjunto Activo de Átomos Cognitivos que serán utilizados durante una evaluación. Esta operación se ejecuta una vez finalizada la Configuración Semántica Inicial, y su propósito es determinar, de entre todos los átomos definidos en el sistema, cuáles deben participar en el análisis del documento concreto, bajo qué perfil contextual y con qué definiciones operacionales, indicadores y reglas interpretativas.

ATOM_LOADING.md no evalúa documentos, no aplica indicadores, no recoge evidencia ni produce puntuaciones. Responde exclusivamente a la pregunta:

> Una vez identificado el perfil documental, ¿cómo sabe SOPHIA qué versión de cada átomo utilizar?




---

2. Posición en el flujo metodológico

La carga de átomos se sitúa inmediatamente después de la Configuración Semántica Inicial y antes de cualquier operación evaluativa:

Documento
↓
Configuración Semántica Inicial
├── Clasificación documental
└── Activación de perfiles contextuales
↓
ATOM_LOADING   ← ESTE DOCUMENTO
↓
Conjunto Activo de Átomos Cognitivos (CAAC)
↓
Aplicación de indicadores y obtención de evidencia
↓
Evaluación

La Configuración Semántica Inicial determina bajo qué marco se evalúa; ATOM_LOADING determina con qué herramientas conceptuales se realiza esa evaluación.


---

3. Conjunto Activo de Átomos Cognitivos

3.1. Definición

El Conjunto Activo de Átomos Cognitivos (CAAC) es el subconjunto del universo total de átomos definidos en la ontología SOPHIA que resulta seleccionado, instanciado y resuelto para una evaluación concreta.

Durante una evaluación no están presentes todos los átomos del sistema, sino únicamente aquellos que:

Están asociados a los criterios del estándar.

Son pertinentes para la naturaleza documental determinada.

Han sido activados por el perfil primario o por algún perfil complementario.


El CAAC no existe previamente: se construye de manera dinámica al inicio de cada evaluación, aplicando las reglas que este documento establece.

3.2. Propiedades del CAAC

Determinista: una misma configuración (misma clasificación documental, mismos perfiles activados, mismas versiones de ontología y perfiles) produce exactamente el mismo CAAC.

Trazable: para cada átomo del conjunto, puede reconstruirse el camino que llevó a su inclusión y la fuente de cada una de sus propiedades.

Completo respecto al estándar: todos los criterios del estándar que sean aplicables deben estar representados por al menos un átomo en el CAAC.

Resuelto: no contiene ambigüedades ni conflictos sin resolver entre definiciones operacionales, indicadores o reglas interpretativas.



---

4. Proceso de carga de átomos

La construcción del CAAC sigue un proceso estructurado en cinco pasos:

Paso 1: Selección del perfil primario

Se identifica el perfil contextual correspondiente a la naturaleza documental predominante, determinado durante la Configuración Semántica Inicial. Este perfil actuará como fuente principal de definiciones operacionales.

Paso 2: Selección de perfiles secundarios

Se identifican los perfiles contextuales asociados a las naturalezas secundarias que la Configuración Semántica Inicial haya considerado significativas. Estos perfiles podrán aportar átomos complementarios o definiciones alternativas para secciones específicas del documento.

Paso 3: Recuperación de átomos asociados

Para cada perfil activo (primario y secundarios), se recuperan todos los átomos cognitivos que ese perfil define o referencia. Cada átomo se identifica por su ruta semántica base y por el perfil que lo activa.

Paso 4: Resolución de herencia y conflictos

Se aplican las reglas de herencia y prioridad definidas en las secciones 5 y 6 para determinar, para cada átomo, qué definición operacional, qué indicadores, qué contraindicadores y qué reglas interpretativas prevalecen.

Paso 5: Construcción del conjunto activo

Con todas las resoluciones completadas, se ensambla el CAAC. Cada átomo del conjunto incorpora sus propiedades resueltas y se registra con su identificador completo, incluyendo la versión del átomo base y del perfil del que procede.


---

5. Herencia y sobrescritura (override)

5.1. Principio de herencia

Los perfiles contextuales no necesitan redefinir todos los aspectos de un átomo. Un perfil puede limitarse a especificar aquello que es específico de la naturaleza documental que representa, heredando el resto de las propiedades desde un nivel superior.

La cadena de herencia sigue el siguiente orden:

Átomo base (definición genérica)
↓
Perfil contextual (definición especializada)

Si el perfil contextual no redefine explícitamente una propiedad —por ejemplo, un indicador concreto—, esa propiedad se hereda del átomo base. Esto garantiza la economía de la especificación y evita la duplicación innecesaria.

Ejemplo:

Átomo base CAUSALIDAD: define un indicador genérico: "presencia de relación causal".

Perfil ARTÍCULO CIENTÍFICO: redefine ese indicador como "presencia de mecanismo causal explícito con control de variables".

Perfil DISCURSO POLÍTICO: redefine ese mismo indicador como "atribución causal explícita con identificación de agente responsable".

Todos los perfiles heredan del átomo base aquellos indicadores que no han sido redefinidos.


5.2. Propiedades sometidas a herencia

Las siguientes propiedades de un átomo cognitivo están sujetas a herencia y pueden ser sobrescritas por un perfil contextual:

Definición operacional.

Indicadores.

Contraindicadores.

Reglas interpretativas.


Las propiedades estructurales —ruta semántica, criterio asociado, constructo asociado— no son heredables ni sobrescribibles: pertenecen a la identidad del átomo base y son invariantes.

5.3. Regla de sobrescritura

Cuando un perfil contextual redefine una propiedad, la nueva definición sustituye completamente a la heredada. No hay combinación parcial ni fusión de indicadores: la versión del perfil prevalece sobre cualquier versión superior para esa propiedad concreta.


---

6. Prioridades entre perfiles

Cuando un mismo átomo es referenciado por más de un perfil activo —situación que ocurre típicamente en documentos híbridos con perfil primario y perfiles complementarios—, debe existir una jerarquía explícita que determine qué definición prevalece.

La jerarquía de prioridades es la siguiente:

1. Perfil primario: máxima prioridad. Sus definiciones prevalecen sobre cualquier otra para el documento en su conjunto.


2. Perfil secundario: prioridad intermedia. Sus definiciones pueden aplicarse en segmentos del documento donde la naturaleza secundaria es pertinente, pero no contradicen al perfil primario en el marco general de la evaluación.


3. Perfil heredado del átomo base: prioridad por defecto. Se aplica cuando ningún perfil contextual ha redefinido la propiedad.


4. Perfil genérico: definición mínima aplicable cuando no existe ningún perfil contextual específico para la naturaleza documental detectada.



Esta jerarquía garantiza que el perfil primario —aquel que mejor caracteriza el documento— tenga siempre la última palabra en caso de conflicto.


---

7. Resolución de conflictos

7.1. Tipos de conflicto

Un conflicto se produce cuando dos perfiles activos proporcionan definiciones incompatibles para el mismo átomo. Por ejemplo:

El perfil ARTÍCULO CIENTÍFICO define el indicador "evidencia" como "datos empíricos replicables".

El perfil ENSAYO FILOSÓFICO define el mismo indicador como "consistencia argumental y coherencia conceptual".

Un documento clasificado como científico con componentes filosóficos activa ambos perfiles.


7.2. Mecanismo de resolución

El conflicto se resuelve aplicando la jerarquía de prioridades:

1. Se verifica si el conflicto afecta al marco general del documento o a un segmento específico.


2. Si afecta al marco general, prevalece la definición del perfil primario.


3. Si afecta a un segmento donde la naturaleza secundaria es claramente predominante, puede aplicarse la definición del perfil secundario para ese segmento, siempre que no contradiga criterios estructurales del perfil primario.


4. La decisión debe quedar documentada en el registro de carga del átomo, indicando qué perfil prevaleció y por qué.



7.3. Principio de resolución explícita

Nunca pueden coexistir dos versiones incompatibles del mismo átomo en el CAAC sin que exista una regla explícita —derivada de la jerarquía de prioridades y documentada en el registro de carga— que determine cuál prevalece. La ambigüedad no resuelta invalida la evaluación.


---

8. Estructura de un átomo en el CAAC

Cada átomo del Conjunto Activo de Átomos Cognitivos debe contener, como mínimo, la siguiente información:

Campo	Descripción

Atom_ID	Identificador único del átomo contextualizado, incluyendo el perfil activo.
Ruta semántica	Ruta completa desde SOPHIA hasta el átomo base.
Perfil activo	Perfil contextual del que procede la definición (primario, secundario, heredado).
Versión del átomo base	Versión del átomo base según la ontología.
Versión del perfil	Versión del perfil contextual desde el cual se cargó.
Definición operacional	Definición resuelta tras aplicar herencia y prioridades.
Indicadores	Lista resuelta de indicadores.
Contraindicadores	Lista resuelta de contraindicadores.
Reglas interpretativas	Reglas resueltas.
Estado de carga	Indicación de si el átomo fue cargado desde perfil primario, secundario, heredado o genérico, y si existió conflicto resuelto.


Hasta este punto, ningún átomo contiene evidencia concreta del documento. La evidencia se incorporará en fases posteriores, cuando los indicadores sean aplicados al texto.


---

9. Carácter hipotético del Conjunto Activo de Átomos Cognitivos
El Conjunto Activo de Átomos Cognitivos (CAAC) se construye a partir de la Configuración Semántica Inicial y, por tanto, hereda su naturaleza metodológica.
Dado que la clasificación documental constituye una hipótesis de trabajo —tal como establece SEMANTIC_INITIALIZATION.md—, el CAAC debe entenderse también como una configuración semántica provisional, válida mientras no aparezca evidencia suficiente que justifique una reclasificación del documento.
En consecuencia, el CAAC no representa una verdad ontológica sobre el documento, sino la mejor configuración operacional disponible según la información conocida al inicio de la evaluación.
Si durante fases posteriores del Instrumento aparecen evidencias incompatibles con la clasificación inicial —por ejemplo, una naturaleza documental distinta de la inicialmente determinada o una hibridación significativamente mayor que la estimada—, el Instrumento podrá iniciar un proceso formal de reconfiguración semántica, reconstruyendo el CAAC bajo una nueva hipótesis documental.
Esta posibilidad no invalida la evaluación inicial. Por el contrario, constituye un mecanismo de autocorrección metodológica coherente con el principio de falibilidad científica adoptado por SOPHIA.
La reconstrucción del CAAC deberá quedar completamente registrada, indicando:
La hipótesis documental original.
La evidencia que motivó la reconsideración.
La nueva hipótesis documental.
Las diferencias entre ambos conjuntos activos.
El impacto de la reconfiguración sobre las fases ya ejecutadas.
De este modo, el Instrumento mantiene la coherencia entre clasificación documental, carga de átomos y evaluación, garantizando que toda modificación del marco semántico sea explícita, trazable y reproducible.


---


10. Principios metodológicos

Principio 1 – Carga determinista.
La misma configuración de entrada —misma clasificación documental, mismos perfiles activados, mismas versiones de ontología y perfiles— debe producir exactamente el mismo CAAC. La carga de átomos no puede depender de factores aleatorios o del criterio no documentado del evaluador.

Principio 2 – Trazabilidad de la carga.
Debe poder reconstruirse, para cada átomo del CAAC, por qué fue incluido, de qué perfil procede cada una de sus propiedades y cómo se resolvieron los eventuales conflictos. El registro de carga forma parte del informe de evaluación.

Principio 3 – Herencia controlada.
Los perfiles contextuales heredan del átomo base todas las propiedades que no redefinen explícitamente. La sobrescritura es total: no hay combinación parcial de propiedades heredadas y redefinidas.

Principio 4 – Resolución explícita de conflictos.
No pueden coexistir en el CAAC dos definiciones incompatibles para el mismo átomo sin una regla de prioridad que determine cuál prevalece. Toda resolución debe quedar documentada.

Principio 5 – Versionado.
Todo átomo cargado debe registrar la versión del átomo base y del perfil contextual desde el cual fue construido. Esto garantiza que evaluaciones realizadas en distintos momentos puedan ser comparadas y auditadas.

Principio 6 – Completitud respecto al estándar.
El CAAC debe contener al menos un átomo por cada criterio del estándar que sea aplicable al documento. La ausencia de átomos para un criterio aplicable debe ser justificada o considerarse una carga incompleta.


---

11. Relación con documentos anteriores

ATOM_LOADING.md se apoya directamente en la arquitectura definida por los siguientes documentos del Nivel 1 y del Nivel 2:

ONTOLOGY.md: Define qué es un átomo cognitivo, su identidad relacional, la distinción entre átomo base y perfil contextual, y los requisitos de completitud de un átomo. ATOM_LOADING.md operacionaliza esa ontología al construir instancias concretas de átomos contextualizados.

SEMANTIC_MODEL.md: Define la representación estructurada de las entidades SOPHIA, incluyendo la sintaxis de rutas semánticas y la composición de la identidad. ATOM_LOADING.md utiliza ese modelo para identificar y versionar cada átomo cargado.

SEMANTIC_INITIALIZATION.md: Define la clasificación documental y la activación de perfiles contextuales. ATOM_LOADING.md toma como entrada exactamente los perfiles activados por la Configuración Semántica Inicial.



---

12. Relación con documentos posteriores

La construcción del CAAC es la última operación preparatoria del Instrumento. Una vez completada:

El sistema dispone de un conjunto completo, resuelto y trazable de átomos cognitivos.

Cada átomo contiene sus indicadores, contraindicadores y reglas interpretativas listos para ser aplicados.

La siguiente fase —aplicación de indicadores y obtención de evidencia— puede iniciarse sobre una base semántica sólida, sin ambigüedades pendientes.


El CAAC constituye el puente entre la arquitectura conceptual del Nivel 1 y la operación evaluativa concreta que desarrollarán las fases subsiguientes del Instrumento.


---

13. Observaciones finales

La carga de átomos no es un trámite administrativo ni una operación trivial: es el momento en que la arquitectura ontológica de SOPHIA se particulariza para un documento concreto. La calidad de esta operación determina la coherencia semántica de toda la evaluación posterior. Un error en la carga —un perfil mal seleccionado, un conflicto mal resuelto, una herencia incorrecta— se propagará a todas las fases siguientes, por rigurosa que sea la aplicación de los indicadores.

Por ello, ATOM_LOADING.md establece reglas explícitas, deterministas y auditables para una operación que, en otros sistemas, suele permanecer implícita. La trazabilidad de la carga es la condición de posibilidad de la trazabilidad de la evaluación.
