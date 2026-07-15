SEMANTIC_INITIALIZATION.md – Configuración Semántica Inicial

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.0.0
Estado: Fundacional
Ubicación: assets/js/sophia/02-instrumento/SEMANTIC_INITIALIZATION.md
Naturaleza: Documento metodológico del Instrumento SOPHIA


---

1. Propósito

Este documento define la Configuración Semántica Inicial, primera operación metodológica del Instrumento SOPHIA. Describe el procedimiento mediante el cual el Instrumento, antes de iniciar cualquier evaluación, determina la naturaleza documental del texto que va a ser analizado —reconociendo su posible carácter híbrido—, activa los perfiles contextuales correspondientes y establece el marco semántico dentro del cual se interpretarán todos los átomos cognitivos durante la evaluación.

La Configuración Semántica Inicial no evalúa. No asigna puntuaciones, no detecta falacias, no produce observaciones ni genera informes. Su función exclusiva es preparar el sistema para que la evaluación posterior sea semánticamente coherente con la naturaleza del documento evaluado.


---

2. Problema metodológico que resuelve

2.1. Heterogeneidad e hibridación documental

Todo documento pertenece a una o varias naturalezas. Un artículo científico puede contener hipótesis, discusión y opinión; un discurso político puede combinar datos, propuestas y valoraciones; una sentencia judicial puede articular exposición de hechos, razonamiento jurídico y consideraciones doctrinales. Los textos reales rara vez son puros.

El Instrumento SOPHIA debe reconocer esta complejidad. Aplicar un perfil contextual único a un documento híbrido puede distorsionar la evaluación en aquellas secciones que pertenecen a una naturaleza distinta de la predominante. Ignorar la hibridación es una fuente de error metodológico.

2.2. Ambigüedad semántica inherente

La misma palabra —"causalidad", "evidencia", "demostración", "verdad", "explicación"— posee significados distintos según el contexto documental en que aparece. Los modelos de lenguaje, como sistemas probabilísticos, no poseen una comprensión intrínseca del contexto documental: cuando reciben un texto, activan distribuciones de significado basadas en patrones estadísticos, sin saber si están procesando una teoría, una opinión o una sentencia judicial.

Por esta razón, la evaluación no puede comenzar leyendo criterios. Debe comenzar identificando la naturaleza del documento —en toda su complejidad— para restringir el espacio semántico antes de que los átomos cognitivos sean interpretados.


---

3. Concepto de Configuración Semántica Inicial

3.1. Definición formal

La Configuración Semántica Inicial es la fase preliminar del Instrumento mediante la cual SOPHIA:

1. Clasifica la naturaleza documental del texto, identificando su naturaleza predominante y, cuando proceda, sus naturalezas secundarias, con un grado de confianza asociado a cada determinación.


2. Activa el perfil contextual primario y, si corresponde, los perfiles complementarios.


3. Establece el conjunto de interpretaciones operacionales permitidas para todos los átomos cognitivos que serán utilizados durante la evaluación.



Su producto no es una puntuación ni un juicio, sino un sistema semántico preparado para interpretar correctamente el documento, acompañado de un registro completo de la clasificación que lo sustenta.

3.2. Dos operaciones distintas

La Configuración Semántica Inicial se compone de dos operaciones metodológicamente diferenciadas:

1. Clasificación documental: Determinación de la naturaleza predominante del documento, detección de naturalezas secundarias significativas y asignación de grados de confianza a cada determinación.


2. Configuración del espacio semántico: Activación de perfiles contextuales (primario y complementarios) y restricción del espacio de interpretación para todos los átomos cognitivos.



Separar explícitamente estas dos operaciones permite que el mecanismo de clasificación evolucione o sea reemplazado sin afectar al resto del Instrumento, siempre que el resultado —un perfil documental bien definido— se mantenga como entrada de la configuración semántica.

3.3. Posición en el flujo metodológico

Documento
↓
Configuración Semántica Inicial   ← ESTE DOCUMENTO
├── Clasificación documental
│    ├── Naturaleza predominante
│    ├── Naturalezas secundarias
│    └── Confianza de clasificación
└── Configuración del espacio semántico
├── Perfil primario
├── Perfiles complementarios
└── Espacio semántico permitido
↓
Activación de átomos cognitivos
↓
Carga de indicadores
↓
Aplicación de criterios
↓
Evaluación
↓
Informe


---

4. Clasificación documental

4.1. Principio de clasificación

La clasificación documental no es un acto binario, sino una determinación estructurada que reconoce la posible hibridación de los textos reales. SOPHIA no asume que un documento pertenece a una única naturaleza; determina cuál es su naturaleza predominante y si existen naturalezas secundarias significativas que deban ser consideradas en la evaluación.

4.2. Naturaleza predominante y naturalezas secundarias

Naturaleza documental predominante: Categoría que mejor caracteriza el documento en su conjunto. Determina el perfil contextual primario y, por tanto, la configuración principal del espacio semántico.

Naturalezas documentales secundarias: Categorías adicionales que están presentes en secciones o aspectos del documento de manera significativa. Pueden activar perfiles complementarios que habiliten átomos adicionales o ajusten interpretaciones en segmentos específicos del texto.


Ejemplo:

Documento: Paper que propone una hipótesis, la discute y emite una opinión final

Naturaleza predominante: Artículo científico
Naturalezas secundarias: Hipótesis, Discusión, Opinión del autor

4.3. Criterios de clasificación

La determinación de la naturaleza documental se realiza considerando conjuntamente:

Propósito del documento: Qué pretende el autor (informar, persuadir, demostrar, ordenar, expresar, describir).

Género discursivo: Forma textual reconocible (paper, ensayo, discurso, sentencia, informe, artículo de opinión).

Estructura textual: Organización interna (secciones normalizadas, desarrollo argumental libre, formato institucional).

Intención comunicativa: Relación que el texto establece con su audiencia (convencer, instruir, movilizar, explicar).

Tipo predominante de afirmaciones: Descriptivas, normativas, predictivas, valorativas, hipotéticas.

Criterios de validación declarados: Estándares que el propio documento invoca para evaluar sus afirmaciones (evidencia empírica, coherencia lógica, autoridad, consenso).

Contexto de publicación: Medio, ámbito académico o social, audiencia prevista.


La clasificación no es un acto de intuición del evaluador, sino la aplicación de estos criterios de manera sistemática y documentada.

4.4. Confianza de clasificación

Toda determinación de naturaleza documental lleva asociado un grado de confianza, expresado como una estimación de la certeza con que el Instrumento asigna dicha categoría.

Ejemplo:

Documento: Paper que propone una hipótesis, la discute y emite una opinión final

Naturaleza predominante: Artículo científico
Naturalezas secundarias: Hipótesis, Discusión, Opinión del autor

4.3. Criterios de clasificación

La determinación de la naturaleza documental se realiza considerando conjuntamente:

Propósito del documento: Qué pretende el autor (informar, persuadir, demostrar, ordenar, expresar, describir).

Género discursivo: Forma textual reconocible (paper, ensayo, discurso, sentencia, informe, artículo de opinión).

Estructura textual: Organización interna (secciones normalizadas, desarrollo argumental libre, formato institucional).

Intención comunicativa: Relación que el texto establece con su audiencia (convencer, instruir, movilizar, explicar).

Tipo predominante de afirmaciones: Descriptivas, normativas, predictivas, valorativas, hipotéticas.

Criterios de validación declarados: Estándares que el propio documento invoca para evaluar sus afirmaciones (evidencia empírica, coherencia lógica, autoridad, consenso).

Contexto de publicación: Medio, ámbito académico o social, audiencia prevista.


La clasificación no es un acto de intuición del evaluador, sino la aplicación de estos criterios de manera sistemática y documentada.

4.4. Confianza de clasificación

Toda determinación de naturaleza documental lleva asociado un grado de confianza, expresado como una estimación de la certeza con que el Instrumento asigna dicha categoría.

Ejemplo:

Naturaleza predominante: Artículo científico
Confianza: 96%

Naturalezas secundarias:

· Hipótesis: 32%
· Opinión: 14%

La confianza de clasificación cumple tres funciones:

1. Informa al evaluador y al auditor sobre la solidez de la base sobre la que se construye la evaluación.


2. Permite establecer umbrales por debajo de los cuales una clasificación se considera insuficientemente fiable y requiere revisión humana.


3. Se propaga a la confianza global de la evaluación, ya que un error en la clasificación vicia todas las operaciones posteriores.


4.5. Naturaleza documental como hipótesis de trabajo

La clasificación documental realizada durante la Configuración Semántica Inicial no constituye una afirmación ontológica acerca de lo que el documento "es" en sentido absoluto. Constituye una hipótesis metodológica de trabajo, adoptada con el propósito de seleccionar el marco semántico más adecuado para la evaluación.
En consecuencia, cuando SOPHIA determina que un documento posee naturaleza predominante de artículo científico, no afirma que dicho documento pertenezca necesariamente a esa categoría desde una perspectiva bibliográfica, editorial o jurídica. Afirma únicamente que, para los fines del Instrumento, la interpretación más consistente es aquella que activa el perfil contextual correspondiente.
Esta distinción tiene importantes consecuencias metodológicas:

La clasificación puede revisarse si aparece nueva información relevante.
Diferentes implementaciones del mecanismo de clasificación pueden llegar al mismo perfil mediante procedimientos distintos.
La validez de la evaluación depende de la adecuación de la hipótesis metodológica adoptada, no de una pretendida clasificación absoluta del documento.
Por ello, la Configuración Semántica Inicial registra siempre la clasificación realizada, el grado de confianza asociado y el procedimiento mediante el cual dicha clasificación fue obtenida.


---

5. Perfil contextual

5.1. Concepto

La clasificación documental activa uno o más perfiles contextuales, definidos en el Nivel 1 como las implementaciones concretas de los átomos base para categorías documentales específicas. El perfil contextual:

No redefine la ontología del sistema.

No crea nuevos átomos base.

Simplemente selecciona la implementación operacional adecuada para la naturaleza del documento evaluado.


5.2. Perfil primario y perfiles complementarios

Perfil primario: Activado por la naturaleza documental predominante. Proporciona la configuración principal del espacio semántico y las definiciones operacionales por defecto para todos los átomos cognitivos.

Perfiles complementarios: Activados por las naturalezas secundarias cuando su presencia es significativa. No sustituyen al perfil primario, sino que habilitan átomos adicionales o ajustan interpretaciones en segmentos específicos del documento donde la naturaleza secundaria es pertinente.


Documento: Paper con hipótesis y opinión final

Perfil primario: Artículo científico
→ Átomos principales cargados desde este perfil.

Perfiles complementarios:

Hipótesis

Opinión
→ Átomos adicionales o ajustes locales habilitados en secciones pertinentes.


Este modelo permite que el Instrumento capture la complejidad de los textos reales sin perder la coherencia que proporciona un marco de interpretación principal.

5.3. Determinación del perfil

La naturaleza documental se determina mediante el análisis de las características textuales y contextuales del documento, aplicando los criterios definidos en la Sección 4.3. La determinación debe quedar registrada en el informe de evaluación con todos sus componentes: naturaleza predominante, confianza, naturalezas secundarias, perfiles activados y versiones de todos los artefactos utilizados.


---

6. Espacio Semántico Permitido

6.1. Concepto

Una vez activados el perfil primario y, si procede, los perfiles complementarios, el sistema restringe automáticamente qué interpretaciones son válidas para cada átomo cognitivo. Este conjunto de interpretaciones permitidas constituye el Espacio Semántico Permitido.

No todas las acepciones del lenguaje natural permanecen disponibles. Solo aquellas que son compatibles con:

La ruta semántica del átomo.

El criterio del estándar que el átomo contribuye a evaluar.

El constructo asociado.

El perfil contextual activado (primario o complementario, según la sección del documento).


6.2. Implicaciones

El Espacio Semántico Permitido opera como un filtro que excluye interpretaciones semánticamente posibles pero metodológicamente inadecuadas para el contexto documental. Por ejemplo:

En un perfil artículo científico, la noción de "evidencia" se restringe a evidencia empírica, datos observables, referencias a estudios previos o replicabilidad.

En un perfil ensayo filosófico, la misma noción de "evidencia" puede admitir argumentos conceptuales, coherencia lógica o ejemplificación ilustrativa.


El átomo base es el mismo. El significante lingüístico es el mismo. Pero el espacio de interpretación ha sido delimitado por el perfil contextual.


---

7. Lo que la Configuración Semántica Inicial NO hace

Para evitar confusiones metodológicas, se declara explícitamente que la Configuración Semántica Inicial:

NO produce puntuaciones de ningún tipo.

NO genera observaciones sobre el contenido del documento.

NO detecta falacias ni errores argumentativos.

NO identifica sesgos ni limitaciones.

NO calcula el IRD (Índice de Robustez Deliberativa) ni ningún otro indicador compuesto.

NO emite juicios sobre la calidad, veracidad o relevancia del documento.


Su único producto es un sistema semántico preparado para interpretar correctamente el documento. Es una operación habilitante, no evaluativa.


---

8. Relación con el Nivel 1

La Configuración Semántica Inicial consume la arquitectura definida en el Nivel 1. La relación puede expresarse así:

ONTOLOGY.md define qué entidades existen, cómo adquieren identidad y cómo se relacionan.

SEMANTIC_MODEL.md define cómo se representan esas entidades de manera estructurada.

La Configuración Semántica Inicial determina, para un documento concreto, qué entidades deben activarse y bajo qué perfiles contextuales.


En otras palabras:

> El Nivel 1 responde: ¿Qué entidades existen?
El Nivel 2, a través de la Configuración Semántica Inicial, responde: ¿Qué entidades deben activarse para este documento?




---

9. Relación con el resto del Instrumento

La Configuración Semántica Inicial es la primera operación del Instrumento. Una vez completada, habilita el resto de las fases:

Fase	Dependencia de la CSI

CSI – Configuración Semántica Inicial	—
Fase 1 – Estructura lógica	Requiere perfil primario activado
Fase 2 – Inferencia	Requiere perfil primario activado
Fase 3 – Calibración	Requiere perfil primario activado
Fase 4 – Transparencia	Requiere perfil primario activado
Fase 5 – Pertinencia	Requiere perfil primario activado


Ninguna fase posterior puede ejecutarse correctamente si la Configuración Semántica Inicial no ha determinado la clasificación documental, activado los perfiles y restringido el espacio semántico.


---

10. Principios metodológicos de la Configuración Semántica Inicial

Principio 1 – Primacía de la clasificación documental.
La determinación de la naturaleza del documento —en su complejidad, reconociendo hibridación— es la primera operación del Instrumento y condiciona todas las operaciones posteriores. No es un paso accesorio ni opcional: es condición necesaria para la validez de la evaluación.

Principio 2 – Reconocimiento de hibridación.
Los documentos reales rara vez son puros. El Instrumento debe identificar tanto la naturaleza predominante como las naturalezas secundarias significativas, activando perfiles complementarios cuando sea metodológicamente pertinente.

Principio 3 – Graduación de la confianza.
Toda clasificación documental lleva asociado un grado de confianza. Esta confianza se registra y se propaga a la evaluación global. Una clasificación con baja confianza debe ser señalada como tal.

Principio 4 – Restricción del espacio semántico.
La activación de los perfiles contextuales restringe el conjunto de interpretaciones operacionales válidas para cada átomo cognitivo. Las interpretaciones no compatibles con el perfil activado quedan excluidas, aunque sean lingüísticamente posibles.

Principio 5 – Conservación de la identidad ontológica.
Los perfiles contextuales no modifican la identidad del átomo base ni su posición en la arquitectura del sistema. La ruta semántica permanece invariante. Lo que cambia es la implementación operacional.

Principio 6 – Trazabilidad de la configuración.
La naturaleza documental determinada, los perfiles contextuales activados, la confianza de clasificación y las versiones de la ontología y del modelo semántico utilizadas deben quedar registradas en el informe de evaluación. Sin este registro, la evaluación no es reproducible.

Principio 7 – Reproducibilidad de la interpretación.
Dos evaluadores que apliquen la Configuración Semántica Inicial sobre el mismo documento deben obtener clasificaciones sustancialmente equivalentes y activar los mismos perfiles contextuales. Si existe discrepancia, debe ser resoluble mediante las reglas explícitas del Instrumento.


---

11. Consecuencias para la implementación

Sin perjuicio de que la implementación concreta corresponde al desarrollo técnico, el presente documento establece requisitos metodológicos que toda implementación del Instrumento debe satisfacer:

1. Registro obligatorio de la configuración. Toda evaluación SOPHIA debe registrar, como paso previo a cualquier otra operación:

Naturaleza documental predominante y confianza asociada.

Naturalezas secundarias detectadas y su confianza (cuando proceda).

Perfil primario activado.

Perfiles complementarios activados (cuando proceda).

Versiones de los perfiles contextuales, de la ontología y del modelo semántico de referencia.



2. Determinación documentada de la clasificación. El procedimiento por el cual el Instrumento determina la naturaleza documental debe estar documentado y ser reproducible. No puede basarse en criterios implícitos o en el juicio no fundamentado del evaluador. Debe aplicar los criterios definidos en la Sección 4.3.


3. Catálogo de perfiles contextuales. El Instrumento debe mantener un catálogo de los perfiles contextuales disponibles, con indicación de para qué naturalezas documentales están definidos y qué átomos base cubren.


4. Trazabilidad completa. Desde el informe de evaluación debe poder reconstruirse la configuración semántica inicial, incluyendo la clasificación documental, los perfiles activados y la confianza de clasificación, de modo que un auditor pueda verificar si la evaluación fue realizada bajo el marco semántico correcto.


5. Versionado de perfiles. Los perfiles contextuales están sujetos a versionado, de acuerdo con la política definida en el Nivel 1. Una modificación en la definición operacional de un perfil genera una nueva versión del mismo.


6. Umbrales de confianza. El Instrumento debe definir umbrales de confianza por debajo de los cuales una clasificación se considera insuficientemente fiable y se recomienda revisión humana o se activa un procedimiento de verificación adicional.




---

12. Observaciones finales

La Configuración Semántica Inicial es la respuesta metodológica de SOPHIA a un problema que afecta a todo sistema de evaluación documental: la heterogeneidad irreductible —y a menudo híbrida— de los textos humanos. No existe un conjunto universal de criterios que pueda aplicarse de manera uniforme a un artículo científico, un discurso político y un ensayo filosófico sin generar distorsiones. La solución no es renunciar a la evaluación, sino hacer explícito el marco semántico bajo el cual se evalúa, reconociendo la complejidad del documento real.

SOPHIA no comienza preguntando si un documento es correcto o incorrecto. Comienza determinando bajo qué marco semántico puede ser interpretado, con qué grado de confianza se realiza esa determinación y qué otras naturalezas conviven en el texto. Toda evaluación posterior depende de la validez de esa configuración inicial. Si la clasificación documental es incorrecta, la evaluación será incorrecta, por muy rigurosa que sea la aplicación de los criterios. Si la clasificación es correcta y reconoce adecuadamente la hibridación, la evaluación podrá ser auditada, reproducida y validada en sus propios términos.


---


