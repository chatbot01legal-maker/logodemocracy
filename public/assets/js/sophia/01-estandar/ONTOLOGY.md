ONTOLOGY.md – Ontología Semántica Relacional SOPHIA

Proyecto: SOPHIA
Nivel: 1 · Estándar SOPHIA
Versión del documento: 1.0.0
Estado: Fundacional
Ubicación: assets/js/sophia/01-estandar/ONTOLOGY.md
Naturaleza: Documento arquitectónico fundacional


---

1. Propósito

Este documento establece la ontología formal del proyecto SOPHIA: el modelo conceptual que define qué tipo de entidades existen en el sistema, cómo adquieren su identidad y cómo se relacionan entre sí. Su función es responder a la pregunta:

> ¿Cómo adquieren significado las entidades cognitivas dentro del sistema SOPHIA?



ONTOLOGY.md no define criterios de evaluación, no especifica algoritmos, no asigna puntuaciones ni establece reglas de implementación. Su cometido es exclusivamente arquitectónico: fijar las condiciones de identidad y significado que harán posible, en niveles posteriores, la operacionalización consistente de los criterios del estándar.

La ontología aquí definida constituye el suelo conceptual sobre el que se edifican el Instrumento (Nivel 2), la Auditoría (Nivel 3) y la Validación (Nivel 4). Sin ella, los términos empleados en el protocolo carecerían de anclaje semántico estable, y la trazabilidad normativa —pilar del sistema— sería ilusoria.


---

2. Naturaleza ontológica de SOPHIA

SOPHIA no es una colección de reglas yuxtapuestas, sino una estructura conceptual relacional: un entramado de entidades cuyo significado no reside exclusivamente en sus propiedades internas, sino en la posición que ocupan dentro de la arquitectura del sistema.

Una entidad SOPHIA —un criterio, un constructo, un átomo cognitivo— no se define por su nombre aislado, sino por la red de relaciones que la vinculan con otras entidades. En términos ontológicos, la identidad es relacional, no sustantiva.

2.1. Identidad nominal vs. identidad relacional

La diferencia entre ambas formas de identidad es constitutiva del sistema:

Identidad nominal: Causalidad como palabra del lenguaje natural. Evoca una noción general, culturalmente situada, ambigua. No es evaluable.

Identidad relacional: Causalidad en tanto entidad situada en una ruta semántica precisa —dimensión, criterio— y activada bajo un perfil contextual determinado dentro de la arquitectura SOPHIA. Posee significado operacional y es evaluable.


La primera pertenece al dominio del lenguaje ordinario. La segunda, al dominio del sistema SOPHIA. La ontología del proyecto se ocupa exclusivamente de las entidades del segundo tipo.


---

3. Principio de identidad semántica por ruta

3.1. Formulación del principio

El principio ontológico central de SOPHIA es el siguiente:

> La ruta semántica determina el espacio de interpretación permitido de una entidad dentro del sistema SOPHIA.



Esta posición se expresa mediante una ruta semántica, que funciona simultáneamente como identificador único y como mecanismo de restricción del significado operacional de la entidad. La ruta no crea arbitrariamente el significado, sino que acota el universo de interpretaciones posibles que el sistema —o un modelo de lenguaje que opere como componente instrumental— puede asignar a una entidad.

3.2. Analogía fundacional

Una entidad SOPHIA se asemeja a una clase abstracta en un sistema orientado a objetos, dotada de una identidad base y de múltiples implementaciones contextuales.

La clase abstracta Causalidad define una estructura general: una relación donde una variable produce, condiciona o explica otra.

Las implementaciones contextuales —Causalidad_Científica, Causalidad_Histórica, Causalidad_Jurídica— heredan la estructura general pero especifican reglas de aplicación, indicadores y criterios de satisfacción distintos, adecuados a la naturaleza del documento evaluado.


La entidad evaluable no es la clase abstracta, sino la implementación contextual activada por el perfil documental correspondiente. La ruta semántica opera como el mecanismo que selecciona la implementación correcta.

3.3. Implicaciones del principio

1. No existen sinónimos operacionales automáticos. Dos ocurrencias del mismo significante en rutas o perfiles contextuales distintos designan entidades potencialmente diferentes.


2. La ruta semántica y el perfil contextual forman parte del identificador completo de la entidad operacional. No pueden omitirse sin pérdida de significado.


3. La modificación de cualquier segmento de la ruta o del perfil contextual altera la entidad operacional resultante.

3.4. Principio de no equivalencia semántica contextual
Dos entidades que comparten un mismo significante lingüístico no deben considerarse equivalentes dentro de SOPHIA si pertenecen a rutas semánticas o perfiles contextuales distintos.
La equivalencia nominal no implica equivalencia operacional.
Por ejemplo, el significante "Causalidad" puede aparecer en múltiples entidades del sistema:

SOPHIA → Nivel 2 → Inferencia → Criterio 2.2 → Artículo científico → Causalidad

SOPHIA → Nivel 2 → Inferencia → Criterio 2.2 → Discurso político → Causalidad

SOPHIA → Nivel 2 → Inferencia → Criterio 2.2 → Hipótesis → Causalidad

Aunque todas comparten el mismo nombre, constituyen entidades operacionales diferentes, ya que poseen definiciones operacionales, indicadores, reglas interpretativas y condiciones de evaluación distintas.

En consecuencia, la identidad de una entidad SOPHIA no puede inferirse únicamente a partir de su nombre, sino que requiere considerar su ruta semántica completa y el perfil contextual que la activa.


---

4. Jerarquía ontológica de SOPHIA

Las entidades del sistema SOPHIA se organizan en una jerarquía de niveles de abstracción, donde cada nivel hereda y concreta el significado de los niveles superiores. La jerarquía completa es la siguiente:

Naturaleza del documento (Perfil contextual)
│
↓
Ruta semántica
│
↓
SOPHIA
│
├── Nivel arquitectónico
│    │
│    └── Dominio evaluativo
│         │
│         └── Dimensión
│              │
│              └── Criterio
│                   │
│                   └── Constructo
│                        │
│                        └── Átomo cognitivo contextualizado
│                             │
│                             ├── Indicador
│                             ├── Evidencia
│                             └── Regla interpretativa

4.1. Definición de cada nivel

Naturaleza del documento (Perfil contextual): Categoría que define el tipo de documento evaluado (artículo científico, discurso político, ensayo filosófico, etc.). Actúa como el primer modulador semántico y determina qué perfil contextual del átomo cognitivo se activa.

SOPHIA: El sistema en su totalidad, como marco de referencia último. Todas las entidades heredan su pertenencia a este espacio ontológico.

Nivel arquitectónico: Uno de los cuatro niveles definidos en SOPHIA_ARCHITECTURE_v1.md (Estándar, Instrumento, Auditoría, Validación). Determina el tipo de operaciones que pueden realizarse sobre las entidades de ese nivel.

Dominio evaluativo: Ámbito temático o funcional dentro de un nivel. Por ejemplo, dentro del Instrumento, los dominios pueden coincidir con las dimensiones del estándar.

Dimensión: Aspecto distinguible de la robustez deliberativa, según la definición del SOPHIA_STANDARD.md (Sección 4). Ejemplo: "Explicitación de fundamentos".

Criterio: Condición evaluable definida por el estándar. Ejemplo: "CRI-1.1 – Identificación de supuestos".

Constructo: Unidad de análisis que el evaluador debe identificar en el documento para aplicar un criterio. Es la primera entidad plenamente operacional del sistema. Ejemplo: "Supuesto principal".

Átomo cognitivo contextualizado: Unidad semántica operacionalmente definida, resultante de la activación de un perfil contextual sobre un átomo base, cuya función es permitir la evaluación trazable de un criterio SOPHIA.

Indicador: Señal observable en el documento que orienta la determinación del grado de satisfacción de un criterio.

Evidencia: Pasaje concreto del documento que sustenta la evaluación de un criterio.

Regla interpretativa: Instrucción que vincula indicadores, evidencia y escala de evaluación para producir una decisión evaluativa.



---

5. Definición formal de Átomo Cognitivo

5.1. Definición

Un átomo cognitivo es una unidad semántica operacionalmente definida cuya función es permitir la evaluación trazable de un criterio SOPHIA. No representa una palabra o concepto aislado del lenguaje natural, sino una interpretación operacional contextualizada de un fenómeno semántico dentro de una ruta evaluativa determinada.

5.2. Modelo de átomo base y perfiles contextuales

El átomo cognitivo se organiza en dos niveles:

Átomo base: Identidad abstracta definida por su ruta semántica (ejemplo: SOPHIA.2.2.inferencia.causalidad). Define la clase general y sus propiedades relacionales.

Perfiles contextuales: Implementaciones concretas del átomo base, activadas por la naturaleza del documento evaluado. Definen la semántica operacional completa: qué significa, cómo se detecta, qué reglas rigen su interpretación.


Ejemplo:

Átomo base: SOPHIA.N2.CRI-2.2.causalidad

Perfiles contextuales:
├── Artículo científico
├── Hipótesis
├── Opinión
├── Discurso político
└── Ensayo filosófico

La entidad evaluable no es el átomo base, sino el átomo contextualizado resultante de aplicar un perfil.

5.3. Condiciones de completitud

Un átomo cognitivo contextualizado no está completo si carece de alguno de los siguientes elementos:

1. Ruta semántica completa: desde SOPHIA hasta el átomo base.


2. Perfil contextual: tipo de documento para el cual la definición operacional es válida.


3. Criterio asociado: referencia explícita al criterio del estándar que el átomo contribuye a evaluar.


4. Definición operacional: descripción precisa de qué significa el átomo en ese contexto y cómo se manifiesta en un texto.


5. Indicadores observables: lista de señales textuales que permiten identificar la presencia, ausencia o grado de satisfacción del átomo.


6. Contraindicadores: señales que, de estar presentes, indican que el átomo no debe considerarse satisfecho aunque concurran algunos indicadores positivos.


7. Reglas de interpretación: instrucciones para combinar indicadores y contraindicadores y producir una determinación evaluativa.




---

6. Contexto documental como modulador semántico

6.1. Principio de modulación contextual

El contexto documental no forma parte rígida de la identidad del átomo, sino que actúa como un mecanismo de activación de perfil. Un mismo átomo base puede instanciarse en múltiples perfiles, cada uno con su propia definición operacional, indicadores y reglas. Esta aproximación evita la explosión combinatoria de entidades y refleja con mayor fidelidad cómo operan las ontologías computacionales.

6.2. Categorías de contexto documental

SOPHIA reconoce, sin carácter exhaustivo, las siguientes categorías de contexto documental, cada una de las cuales puede activar perfiles distintos sobre los átomos base:

Artículo científico

Teoría científica

Hipótesis

Opinión

Discurso político

Ensayo filosófico

Metodología

Técnica aplicada

Obra artística


6.3. Implicaciones para la evaluación

SOPHIA no puede evaluar correctamente un documento sin conocer el tipo de objeto que está evaluando. La determinación del contexto documental es el primer paso del proceso evaluativo, porque activa los perfiles contextuales correctos en todos los átomos involucrados. Un perfil definido para "artículo científico" no puede aplicarse sin adaptación a un "discurso político", y viceversa.


---

7. Diferencia entre significante y entidad operacional

La distinción entre el significante lingüístico y la entidad operacional SOPHIA es una consecuencia directa del principio de identidad semántica por ruta y constituye una de las aportaciones ontológicas centrales del proyecto.

Significante lingüístico: La palabra Causalidad tal como existe en el lenguaje natural. Es polisémica, culturalmente dependiente y carece de significado evaluativo unívoco. Un modelo de lenguaje, ante este significante, activa una distribución probabilística de significados posibles (causalidad filosófica, científica, jurídica, estadística, coloquial).

Entidad operacional SOPHIA: La entidad resultante de aplicar un perfil contextual a un átomo base situado en una ruta semántica. Por ejemplo, el perfil Artículo científico aplicado al átomo base SOPHIA.N2.CRI-2.2.causalidad. Posee una definición operacional precisa, indicadores observables, reglas de interpretación y trazabilidad normativa.


Solo la segunda posee identidad evaluativa dentro del sistema. La confusión entre ambas —tratar un significante lingüístico como si fuera una entidad operacional— constituye un error ontológico que compromete la validez de cualquier evaluación. El propósito de SOPHIA no es decirle a un modelo de lenguaje "busca causalidad", sino especificar: "dentro de esta ruta semántica, bajo este perfil contextual, la entidad causalidad significa esto, se detecta así y se evalúa con estas reglas".


---

8. Relación con Inteligencia Artificial

8.1. Complementariedad, no sustitución

SOPHIA no elimina la naturaleza probabilística de los modelos de lenguaje, ni pretende sustituir los mecanismos internos de la inteligencia artificial por un sistema determinista de reglas. La IA, cuando se utilice como componente instrumental, seguirá realizando inferencias probabilísticas basadas en patrones estadísticos.

8.2. Función de la ontología

Lo que SOPHIA proporciona es una arquitectura conceptual explícita que restringe y organiza el espacio semántico dentro del cual la IA —o cualquier otro sistema de evaluación— debe operar. Esta restricción se logra mediante:

Ontología explícita: las entidades del sistema están definidas y relacionadas de manera formal.

Rutas semánticas: cada entidad posee una posición única en la arquitectura.

Perfiles contextuales: la naturaleza del documento activa la implementación semántica correcta de cada átomo.

Definiciones operacionales: el significado evaluativo de cada entidad contextualizada está documentado.

Reglas públicas: todos los criterios y procedimientos son accesibles y auditables.


La innovación metodológica de SOPHIA no reside en controlar el algoritmo interno de un modelo, sino en controlar la arquitectura conceptual desde la cual se interpretan sus resultados. La ontología es el instrumento de ese control.


---

9. Relación con niveles posteriores

La ontología definida en este documento establece el marco conceptual que gobierna la relación entre los cuatro niveles arquitectónicos:

Nivel 1 (Estándar): Define qué son las entidades y cuáles son sus condiciones de identidad. La ontología fija la arquitectura de rutas, átomos base y perfiles contextuales.

Nivel 2 (Instrumento): Define cómo se aplican las entidades. Implementa los perfiles contextuales, especificando indicadores, reglas de interpretación y procedimientos de evaluación para cada uno.

Nivel 3 (Auditoría): Verifica si las entidades fueron aplicadas correctamente. Comprueba que el perfil contextual activado corresponde a la naturaleza del documento y que el átomo contextualizado ha sido aplicado conforme a su definición operacional.

Nivel 4 (Validación): Evalúa si las entidades funcionan en la práctica. Analiza evidencia empírica sobre la consistencia, fiabilidad y utilidad de los perfiles contextuales tal como han sido definidos y aplicados.


El flujo metodológico es estrictamente descendente:

Ontología (Nivel 1)
↓
Instrumento (Nivel 2)
↓
Auditoría (Nivel 3)
↓
Validación (Nivel 4)

La consecuencia metodológica principal de esta ontología es que el orden correcto de evaluación es:

Naturaleza del documento
↓
Ruta semántica
↓
Criterio
↓
Constructo
↓
Átomo contextualizado
↓
Indicadores
↓
Reglas interpretativas
↓
Evaluación (humana o asistida por IA)


---

10. Requisitos metodológicos para nuevas entidades

Toda nueva entidad evaluativa que se incorpore al sistema SOPHIA debe satisfacer los siguientes requisitos:

1. ID único del átomo base: Identificador que distinga la entidad de cualquier otra, presente o futura.


2. Ruta semántica completa: Desde SOPHIA hasta el átomo base, especificando todos los segmentos intermedios.


3. Perfil contextual: Categoría documental para la cual se define la implementación.


4. Dimensión asociada: Referencia a la dimensión del estándar a la que pertenece.


5. Criterio asociado: Referencia al criterio del estándar que la entidad contribuye a evaluar.


6. Constructo asociado: Referencia al constructo del cual la entidad es una instancia o componente.


7. Definición operacional: Descripción precisa del significado evaluativo de la entidad en el perfil contextual especificado.


8. Indicadores: Lista de señales observables en el documento que permiten evaluar la entidad.


9. Contraindicadores: Lista de señales que, de estar presentes, contraindican la satisfacción de la entidad.


10. Reglas de interpretación: Instrucciones para combinar indicadores y contraindicadores en una determinación evaluativa.


11. Versión: Identificador de la versión de la entidad, conforme a la política de versionado del nivel correspondiente.



Una entidad que no cumpla estos requisitos no puede ser utilizada en evaluaciones oficiales SOPHIA.


---

11. Observaciones finales

La presente ontología constituye el marco conceptual dentro del cual deben interpretarse todos los términos, criterios, constructos y átomos del proyecto. Su función no es descriptiva, sino constitutiva: establece las condiciones que debe satisfacer una entidad para existir como tal dentro del sistema SOPHIA.

SOPHIA no evalúa palabras. Evalúa entidades semánticas contextualizadas cuya identidad depende de su posición dentro de una arquitectura relacional explícita, pública y auditable. La innovación del proyecto no consiste en inventar la noción de que los símbolos adquieren significado dentro de un sistema de relaciones —principio presente en la semántica estructural, las ontologías computacionales, los grafos de conocimiento y la teoría de marcos— sino en aplicar sistemáticamente ese principio al problema específico de hacer auditable la interpretación semántica de un modelo probabilístico cuando evalúa razonamiento humano.

Este principio es la condición de posibilidad de la trazabilidad normativa y, por tanto, de la integridad metodológica del proyecto en su conjunto.


---


