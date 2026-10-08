INSTRUMENT SPECIFICATION — SOPHIA v4.0 (Corregida)

Especificación del Instrumento con Arquitectura Contextual y Perfiles Epistemológicos

Documento normativo del contenido metodológico del Instrumento SOPHIA, versión 4.0. Esta versión incorpora una capa de interpretación contextual de los átomos cognitivos, manteniendo su identidad semántica estable y ajustando su evaluación según la naturaleza del documento.


---

PREÁMBULO

La presente especificación describe el Instrumento SOPHIA v4.0, una evolución del protocolo original que introduce una capa de interpretación contextual entre el documento y los átomos cognitivos. Esta evolución no crea nuevos tipos de átomos, sino que reconoce que el significado y la exigencia epistemológica de cada átomo cognitivo varían según la naturaleza del documento evaluado.

El Instrumento v3.0 (documentado en INSTRUMENT_SPECIFICATION.md) operaba bajo el supuesto de que los átomos cognitivos poseen un significado estable e independiente del contexto. La experiencia y el análisis epistemológico demuestran que conceptos como "causalidad", "evidencia" o "incertidumbre" adquieren exigencias distintas en un paper científico, un discurso político o un ensayo filosófico.

La arquitectura contextual aquí definida transforma el Instrumento en un protocolo de auditoría epistemológica donde:

Cada documento es clasificado según su naturaleza (científica, informativa, argumentativa, política deliberativa, normativa/propositiva).

A cada naturaleza le corresponde un perfil epistemológico que modifica: la relevancia de los átomos, la severidad de las infracciones, la evidencia esperada y los umbrales de incertidumbre aceptables.

El átomo cognitivo conserva su identidad semántica única; lo que cambia es su interpretación operacional según el perfil activo.

Se evalúan rutas inferenciales como secuencias de átomos que deben estar justificadas.

La detección se basa en la función semántica que las expresiones cumplen en el argumento, no únicamente en patrones lingüísticos.


Este documento constituye la especificación normativa completa del nuevo Instrumento. Describe su ontología, sus entidades, sus reglas y sus relaciones, sin entrar en detalles de implementación computacional. Es la fuente única de verdad para el desarrollo futuro del Instrumento y para la auditoría (Nivel 3) y validación (Nivel 4).


---

1. PRINCIPIOS GENERALES DE LA ARQUITECTURA CONTEXTUAL

Principio 1 – Identidad semántica estable del átomo.
El átomo cognitivo es una unidad mínima de significado lingüístico relevante para la evaluación epistemológica. Su identidad es única e independiente del contexto. Por ejemplo, el átomo CAUSALIDAD designa siempre la noción de relación explicativa entre fenómenos, aunque su interpretación operacional pueda diferir según el tipo de documento.

Principio 2 – Interpretación contextual.
El significado evaluativo de un átomo no es fijo, sino que se modula mediante perfiles semánticos contextuales que definen qué aspectos del concepto son relevantes, qué evidencia se exige y qué estándares de corrección se aplican. No se crean átomos distintos para cada contexto, sino que el mismo átomo se interpreta de manera distinta.

Principio 3 – Clasificación documental como primer paso.
Antes de cualquier evaluación, el Instrumento debe determinar la naturaleza del documento (científico, informativo, argumentativo, político deliberativo, normativo/propositivo) y, en su caso, naturalezas secundarias. Esta clasificación activa el perfil epistemológico correspondiente.

Principio 4 – Perfiles epistemológicos.
Cada naturaleza documental posee un perfil que define:

La relevancia (peso) de cada átomo en la evaluación.

La severidad base de las infracciones para cada átomo.

La evidencia esperada (tipo y cantidad).

El umbral de incertidumbre aceptable.

Las reglas interpretativas específicas.


Principio 5 – Función semántica como unidad de detección.
La detección de un átomo no se activa únicamente por la presencia de una palabra clave, sino por la función que esa expresión desempeña en el argumento. La unidad de análisis es el significado activado dentro del contexto, no el significante aislado.

Principio 6 – Rutas inferenciales.
La evaluación no se limita a átomos aislados, sino que considera cadenas de razonamiento (dato → interpretación → causalidad → generalización → propuesta). El Instrumento evalúa si cada paso de la ruta está justificado y si la ruta completa es coherente.


---

2. ONTOLOGÍA DEL ÁTOMO COGNITIVO

2.1. Definición formal

Un átomo cognitivo es la unidad mínima de significado epistemológicamente relevante presente en un discurso. Corresponde a un concepto, relación o noción que, al ser activada dentro de una proposición, modifica la interpretación, evaluación o justificación del contenido comunicado.

El átomo cognitivo no es una categoría evaluativa ni una relación argumentativa completa. Es una entidad semántica que el Instrumento utiliza para analizar el discurso.

2.2. Ejemplos de átomos cognitivos

Átomo	Definición base

CAUSALIDAD	Relación explicativa entre un fenómeno antecedente y un fenómeno consecuente.
EVIDENCIA	Información que respalda una afirmación.
INCERTIDUMBRE	Grado de duda o falta de certeza asociado a una afirmación.
CONSENSO	Acuerdo o convergencia entre múltiples actores o fuentes.
EXPERTO	Persona o entidad con autoridad reconocida en un dominio.
RIESGO	Posibilidad de que ocurra un evento no deseado.
NECESIDAD	Condición que se considera indispensable o inevitable.
LIBERTAD	Capacidad de actuar sin restricciones externas.
JUSTICIA	Principio de equidad o corrección en el trato.
MAYORÍA	Conjunto de personas que supera la mitad de un grupo.
PROGRESO	Mejora o avance hacia una meta deseable.


2.3. Identidad y versión

Cada átomo posee un identificador único (ej. ATOMO_CAUSALIDAD) y una versión. La definición base es estable; las interpretaciones contextuales se documentan como perfiles semánticos asociados al átomo, pero no alteran su identidad.


---

3. CLASIFICACIÓN DE NATURALEZAS DOCUMENTALES

El Instrumento reconoce cinco naturalezas documentales primarias, que pueden combinarse en documentos híbridos (perfil primario + perfiles secundarios).

3.1. Científica (SC)

Descripción: Documentos que presentan resultados de investigación, análisis empírico o revisiones sistemáticas. Incluyen papers académicos, informes técnicos, revisiones de literatura, estudios de caso con metodología explícita.

Características epistemológicas:

Alta exigencia de trazabilidad y replicabilidad.

Lenguaje probabilístico y cuantitativo.

Metodología explícita y controles.

Separación clara entre datos, inferencias y juicios.

Referencias a fuentes verificables.


3.2. Informativa (INF)

Descripción: Documentos que comunican hechos, eventos o divulgación de conocimiento, sin pretensión de investigación original. Incluyen noticias, reportajes, artículos divulgativos, resúmenes ejecutivos.

Características epistemológicas:

Distinción entre hechos y opiniones.

Fuentes identificables y contrastables.

Representación justa de distintas perspectivas.

Lenguaje accesible, pero preciso.


3.3. Argumentativa (ARG)

Descripción: Documentos cuyo fin principal es persuadir mediante razones, sin basarse necesariamente en datos empíricos. Incluyen ensayos, columnas de opinión, artículos de análisis, propuestas filosóficas.

Características epistemológicas:

Coherencia lógica interna.

Claridad conceptual y definición de términos.

Consistencia inferencial.

Puede prescindir de evidencia empírica, pero debe ofrecer razones sólidas.


3.4. Política Deliberativa (POL)

Descripción: Documentos que intervienen en el debate público, con intención de influir en decisiones colectivas. Incluyen discursos, programas políticos, intervenciones en foros, manifiestos.

Características epistemológicas:

Evitar manipulación emocional excesiva.

Reconocimiento de incertidumbre y complejidad.

Simetría argumentativa (tratar posiciones contrarias con respeto).

Consecuencias previsibles de las propuestas.


3.5. Normativa/Propositiva (NORM)

Descripción: Documentos que proponen reglas, leyes, políticas públicas o cursos de acción. Incluyen proyectos de ley, reglamentos, planes de gobierno, guías de actuación.

Características epistemológicas:

Relación medios-fines explícita.

Evaluación de alternativas.

Identificación de efectos colaterales y riesgos.

Justificación basada en evidencia o en valores declarados.



---

4. PERFILES SEMÁNTICOS CONTEXTUALES

Cada átomo cognitivo posee una definición base y, opcionalmente, interpretaciones contextuales para cada perfil. El perfil no crea un átomo nuevo, sino que especifica cómo debe interpretarse y evaluarse ese átomo en un contexto documental determinado.

4.1. Estructura de un perfil semántico

Para cada átomo y para cada perfil, se definen:

Definición contextual: adaptación de la definición base al dominio del perfil.

Indicadores: señales textuales (patrones o funciones semánticas) que sugieren la presencia del átomo.

Contraindicadores: señales que sugieren una interpretación incorrecta o insuficiente.

Relevancia (peso): importancia del átomo en la evaluación global para ese perfil (escala 0–1).

Severidad base: severidad por defecto de las infracciones de este átomo en este perfil.

Evidencia esperada: tipo de evidencia mínima requerida.

Umbral de incertidumbre: rango de tolerancia a la incertidumbre expresada.


4.2. Ejemplo: Átomo CAUSALIDAD

Definición base: Relación explicativa entre un fenómeno antecedente y un fenómeno consecuente.

Interpretación para perfil Científico (SC):

Definición contextual: Relación causal demostrada mediante diseño metodológico, con control de variables alternativas, direccionalidad y replicabilidad.

Indicadores: Hipótesis causal explícita; identificación de variable independiente y dependiente; mención de mecanismo; control de confusores; evidencia empírica o referencias; consideración de temporalidad.

Contraindicadores: Atribución causal sin datos; confusión correlación/causalidad; omisión de variables alternativas plausibles; ausencia de controles.

Relevancia: 1.0

Severidad base: 25

Evidencia esperada: Datos empíricos, estudios previos, metodología.

Umbral de incertidumbre: Bajo (debe declararse con precisión).


Interpretación para perfil Político (POL):

Definición contextual: Atribución causal utilizada para justificar políticas o decisiones, con base en datos históricos, comparaciones o mecanismos plausibles.

Indicadores: Atribución causal explícita; identificación de agente causal; invocación de datos o ejemplos; reconocimiento de multicausalidad.

Contraindicadores: Atribución causal sin fundamento; simplificación extrema (causa única); atribución interesada sin evidencia; omisión de factores relevantes.

Relevancia: 0.8

Severidad base: 12.5

Evidencia esperada: Datos históricos, comparaciones, plausibilidad.

Umbral de incertidumbre: Medio-Alto (se tolera cierta incertidumbre).


Interpretación para perfil Filosófico (ARG):

Definición contextual: Relación conceptual o explicativa que conecta ideas en un marco teórico.

Indicadores: Conexiones lógicas, argumentos de dependencia, relaciones de fundamentación.

Contraindicadores: Incoherencia interna, saltos lógicos no justificados.

Relevancia: 0.5

Severidad base: 5

Evidencia esperada: Coherencia conceptual.

Umbral de incertidumbre: Alto (se acepta como parte del debate).


(Los demás perfiles se definen de manera análoga.)


---

5. RUTAS INFERENCIALES

Los átomos cognitivos no se evalúan aisladamente; el Instrumento considera rutas inferenciales, que son secuencias de átomos que deben estar encadenadas lógicamente en el discurso. Una ruta típica es:

Dato → Interpretación → Causalidad → Generalización → Propuesta normativa

Cada nodo de la ruta puede contener diferentes átomos cognitivos. La evaluación de una ruta comprueba:

1. Continuidad: Cada paso está presente y conectado al siguiente.


2. Justificación: Cada paso está respaldado por evidencia o razones.


3. Proporcionalidad: El salto entre pasos no es excesivo (ej. de un dato a una propuesta normativa sin mediación).


4. Consistencia: La ruta no contiene contradicciones internas.



Cada perfil define las rutas esperadas y las penalizaciones por saltos injustificados. Las rutas se evalúan mediante la detección de patrones semánticos de encadenamiento (conectores lógicos, estructuras argumentativas) y la coherencia global.


---

6. FLUJO METODOLÓGICO DEL INSTRUMENTO CONTEXTUAL

El flujo del Instrumento v4.0 se compone de las siguientes etapas:

1. Clasificación documental
├── Determinación de naturaleza primaria (SC, INF, ARG, POL, NORM)
├── Identificación de naturalezas secundarias (híbridas)
└── Asignación de perfiles epistemológicos


2. Configuración semántica inicial
├── Activación de perfiles primario y secundarios
└── Carga del Conjunto Activo de Átomos (CAAC) con sus perfiles semánticos


3. Segmentación semántica
├── División del texto en unidades de significado (no solo oraciones)
└── Identificación de funciones argumentativas (dato, inferencia, juicio, etc.)


4. Detección de átomos cognitivos
├── Aplicación de indicadores (patrones + funciones semánticas) según perfil activo
└── Generación de Observaciones (Observation Registry)


5. Resolución de átomos
├── Consolidación de observaciones por átomo (reglas de resolución según perfil)
└── Generación de Atom Resolution Registry


6. Evaluación de rutas inferenciales
├── Identificación de encadenamientos de átomos
└── Evaluación de continuidad, justificación y proporcionalidad


7. Agregación por constructos y criterios
├── Combinación de resoluciones atómicas según pesos y perfiles
└── Generación de Construct Resolution y Criterion Resolution


8. Puntuación y agregación global
├── Aplicación de severidades ajustadas por perfil
├── Cálculo de IRD contextual (ponderado por relevancia)
└── Generación de puntuaciones finales


9. Generación del Informe de Evaluación Contextual
├── Incluye clasificación, perfiles, rutas evaluadas
└── Evidencia textual y trazabilidad




---

7. FÓRMULAS Y ALGORITMOS ACTUALIZADOS

7.1. Frecuencia de activación contextual

La frecuencia de un átomo se calcula a partir de la detección de su función semántica en los segmentos del documento, utilizando los indicadores definidos para el perfil activo. Se define una función F(segmento, átomo, perfil) que retorna 1 si el segmento activa el átomo según ese perfil, 0 en caso contrario. La frecuencia es la suma sobre segmentos.

7.2. Penalización de átomo

penalizacion_atomo = severidad_base(perfil) × frecuencia_atomo × peso_relevancia(perfil)

Donde severidad_base es la severidad del criterio ajustada por perfil (puede ser distinta de la severidad estándar), y peso_relevancia es el factor de relevancia (entre 0 y 1).

7.3. Penalización de criterio (con tope)

penalizacion_criterio = min( Σ penalizacion_atomo , 25 )

El tope sigue siendo 25, pero la severidad base puede ser menor o mayor según perfil.

7.4. Penalización por ruta inferencial

Se añade una penalización adicional penalizacion_ruta por cada salto injustificado o ruta rota. Esta penalización se suma a la fase correspondiente (normalmente Inferencia o Pertinencia Deliberativa).

7.5. Puntuación de fase y IRD

El cálculo de puntuación de fase y el IRD global sigue la misma lógica que en v3.0, pero incorporando los pesos y penalizaciones contextuales.


---

8. INVENTARIO COMPLETO DEL INSTRUMENTO CONTEXTUAL

Entidad	Cantidad

Naturalezas documentales primarias	5
Perfiles epistemológicos	5
Átomos cognitivos (base)	53
Perfiles semánticos por átomo (máximo)	5
Indicadores (patrones + funciones)	Variable (más de 500)
Contraindicadores	Variable
Rutas inferenciales esperadas	5 (una por perfil)
Meta‑reglas	6 (heredadas, más contextuales)
Fases	5
Criterios	20


Nota: El inventario exacto de indicadores y contraindicadores se detalla en el Anexo 1.


---

9. RELACIONES Y CARDINALIDADES

Relación	Cardinalidad

Un documento → una naturaleza primaria (puede tener secundarias)	1 a N (N≥0)
Una naturaleza → un perfil epistemológico	1 a 1
Un átomo cognitivo → múltiples perfiles semánticos	1 a N (hasta 5)
Un perfil semántico → indicadores y contraindicadores	0 a N
Una ruta inferencial → varios átomos en secuencia	N a N (secuencia)
Un átomo cognitivo → un criterio (a través del constructo)	1 a 1
Un criterio → una fase	1 a 1



---

10. REGLAS ESTRUCTURALES CONTEXTUALES

1. Clasificación obligatoria: Ningún documento puede ser evaluado sin clasificación de naturaleza.


2. Perfil primario: Siempre existe un perfil primario. Los secundarios son opcionales.


3. Herencia y sobrescritura: Las interpretaciones contextuales sobrescriben la definición base para el perfil correspondiente. Si un perfil no define una interpretación para un átomo, se utiliza la definición base (la menos exigente).


4. Resolución de conflictos entre perfiles: En documentos híbridos, prevalece el perfil primario; los secundarios se aplican solo a segmentos donde su naturaleza es predominante.


5. Las rutas inferenciales se evalúan por separado: Una ruta deficiente afecta a la fase de Inferencia o a la de Pertinencia, según el tipo de salto.




---

11. META‑REGLAS CONTEXTUALES

Además de las meta‑reglas v3.0 (MR‑001, MR‑002, MR‑003), se añaden:

MR‑004 – Contextualización automática: Si el documento no se ajusta claramente a ninguna naturaleza primaria, se aplica el perfil "genérico" (el menos exigente) y se registra la incertidumbre.

MR‑005 – Ponderación por relevancia: La puntuación final se corrige según la cobertura de átomos relevantes para el perfil. Si un átomo de alta relevancia no se evalúa (por falta de evidencia), se penaliza.

MR‑006 – Umbral de incertidumbre dinámico: Si la incertidumbre declarada supera el umbral aceptable para el perfil, se incrementa la penalización del criterio correspondiente.


---

12. ESTADOS INTERNOS DEL INSTRUMENTO CONTEXTUAL

naturaleza_documental: (SC, INF, ARG, POL, NORM, HIBRIDO)

perfil_primario: perfil activo principal

perfiles_secundarios: lista de perfiles adicionales

caac: Conjunto Activo de Átomos con sus perfiles semánticos

observaciones: Observation Registry contextual

rutas_evaluadas: registro de evaluación de rutas

penalizacion_ruta: penalización acumulada por saltos injustificados



---

13. AUDITORÍA DE INTEGRIDAD DEL INSTRUMENTO CONTEXTUAL

A partir de la especificación v4.0 corregida, se detectan las siguientes áreas de atención:

Tipo	Descripción

Entidades duplicadas	Ninguna (identificadores únicos).
Entidades huérfanas	Átomos sin definición de perfil para algunas naturalezas (deben completarse).
Referencias inexistentes	Algunas rutas inferenciales no tienen átomos definidos (se documentan).
Reglas contradictorias	Posible conflicto entre MR-001 y MR-006 en perfiles de alta incertidumbre.
Configuraciones incompletas	No todos los átomos tienen definidos los 5 perfiles (algunos solo 1 o 2).
Elementos declarados no implementados	Las funciones semánticas (no patrones) están pendientes de especificación.
Diferencias con la arquitectura previa	Se añaden perfiles, rutas y funciones semánticas; cambia el flujo.



---

14. OBSERVACIONES FINALES

La versión corregida de SOPHIA v4.0 representa una evolución coherente del protocolo, en la que el átomo cognitivo conserva su identidad semántica y los perfiles contextuales determinan su interpretación operacional. Esta arquitectura permite una evaluación epistemológica más fina, ajustada a la naturaleza de cada documento, sin perder la trazabilidad ni la estabilidad conceptual.

El Anexo 1 (Inventario completo de átomos con sus perfiles semánticos) y el Anexo 2 (Indicadores y contraindicadores detallados) se entregarán como documentos complementarios.


---

Fin del documento maestro.

Este documento ha sido generado como especificación normativa del Instrumento SOPHIA v4.0 (corregida), basada en la arquitectura contextual y los perfiles semánticos. Su contenido es la fuente única de verdad para el desarrollo, auditoría y validación del sistema.
