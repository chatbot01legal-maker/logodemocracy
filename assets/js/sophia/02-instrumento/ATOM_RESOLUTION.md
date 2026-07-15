```markdown
# ATOM_RESOLUTION.md – Resolución de Átomos Cognitivos

**Proyecto:** SOPHIA  
**Nivel:** 2 · Instrumento SOPHIA  
**Versión del documento:** 1.0.0  
**Estado:** Fundacional  
**Ubicación:** `assets/js/sophia/02-instrumento/ATOM_RESOLUTION.md`  
**Naturaleza:** Documento metodológico del Instrumento SOPHIA  

---

## 1. Propósito

Este documento define la etapa de **Resolución de Átomos Cognitivos**, en la cual todas las observaciones generadas durante la aplicación de indicadores para un mismo átomo son analizadas conjuntamente con el fin de determinar un **estado consolidado del átomo**. Mientras que la fase de aplicación de indicadores produce observaciones puntuales —qué ocurrió al aplicar una regla interpretativa a una evidencia—, la resolución integra esas observaciones en una única decisión metodológica por átomo.

ATOM_RESOLUTION.md responde exclusivamente a la pregunta:

> *¿Cuál es el estado consolidado de un átomo cognitivo después de analizar todas las observaciones generadas durante la aplicación de indicadores?*

No calcula puntuaciones, no agrega resultados entre átomos, no produce índices compuestos ni informes globales. Su única salida es el **Registro de Resoluciones de Átomos (Atom Resolution Registry)**, que documenta, para cada átomo del Conjunto Activo de Átomos Cognitivos (CAAC), el estado resultante y la justificación metodológica que lo sustenta.

---

## 2. Posición en el flujo metodológico

La Resolución de Átomos se sitúa inmediatamente después de la Aplicación de Indicadores y antes de cualquier operación de agregación:

```

SEMANTIC_INITIALIZATION
↓
ATOM_LOADING
↓
EVIDENCE_COLLECTION
↓
INDICATOR_APPLICATION
↓
ATOM_RESOLUTION   ← ESTE DOCUMENTO
↓
SCORING_AND_AGGREGATION (etapa posterior)

```

**Entradas:**
- **Observation Registry:** Conjunto de observaciones generadas durante la aplicación de indicadores, cada una vinculada a un átomo, una evidencia y una regla interpretativa.
- **CAAC (Conjunto Activo de Átomos Cognitivos):** Listado de átomos activos con sus definiciones operacionales, indicadores y reglas interpretativas.

**Salida:**
- **Atom Resolution Registry:** Registro que contiene, para cada átomo del CAAC, un único estado consolidado y su justificación.

La etapa no vuelve a consultar el documento original, no extrae nuevas evidencias y no re-ejecuta indicadores. Opera exclusivamente sobre las observaciones ya registradas.

---

## 3. Concepto de resolución de un átomo

### 3.1. Definición

**Resolver un átomo** significa integrar todas las observaciones que pertenecen a dicho átomo —es decir, todas las instancias en que un indicador del átomo fue aplicado a una evidencia y produjo un resultado— para obtener un **único estado metodológico del átomo**. Ese estado refleja, de manera consolidada, el grado en que el documento satisface el criterio evaluativo representado por el átomo, a la luz de la evidencia recopilada y de las reglas interpretativas definidas en el perfil contextual activo.

La resolución no es una puntuación numérica, aunque puede traducirse posteriormente a una escala. Es una **determinación metodológica cualitativa**, fundamentada en las observaciones, que responde a la pregunta: *Considerando todo lo observado para este átomo, ¿cuál es su situación evaluativa?*

### 3.2. Diferencia entre observación y resolución

Es fundamental distinguir estos dos conceptos, que pertenecen a etapas diferentes del Instrumento:

- **Observación:** Es el resultado de aplicar una única regla interpretativa a una única evidencia. Responde a la pregunta: *¿Qué ocurrió cuando se aplicó una regla a una evidencia concreta?* Una observación registra, por ejemplo, si un indicador se detectó, si un contraindicador se activó, o el grado de presencia de una característica en un fragmento de texto.

- **Resolución:** Es el estado consolidado del átomo tras considerar todas sus observaciones. Responde a la pregunta: *Considerando todas las observaciones de este átomo, ¿cuál es el estado consolidado del átomo?* Una resolución puede indicar, por ejemplo, que el átomo se encuentra *satisfecho*, *parcialmente satisfecho*, *no satisfecho*, o *no evaluable por falta de evidencia*, junto con la justificación correspondiente.

Una observación es un dato puntual. Una resolución es una decisión metodológica integradora. No hay resolución sin observaciones previas.

---

## 4. Registro de Resoluciones de Átomos (Atom Resolution Registry)

### 4.1. Definición

El **Registro de Resoluciones de Átomos (Atom Resolution Registry)** es el producto estructurado de la fase de Resolución de Átomos. Contiene, para cada átomo del CAAC, un único registro que documenta su estado consolidado, las observaciones en las que se basa y la justificación metodológica que explica el paso de las observaciones a la resolución.

### 4.2. Estructura de un registro de resolución

Cada entrada del Registro de Resoluciones debe contener, como mínimo, los siguientes campos:

| Campo | Descripción |
|-------|-------------|
| `Atom_Resolution_ID` | Identificador único de la resolución. |
| `Atom_ID` | Identificador del átomo resuelto (coincide con el `Atom_ID` del CAAC). |
| `Observation_IDs` | Lista de identificadores de todas las observaciones del Observation Registry que fueron utilizadas para esta resolución. |
| `Estado del átomo` | Determinación cualitativa consolidada. Los estados posibles deben ser definidos por el Instrumento (por ejemplo: `SATISFECHO`, `PARCIALMENTE_SATISFECHO`, `NO_SATISFECHO`, `NO_EVALUABLE`). Esta lista no es exhaustiva en este documento. |
| `Justificación metodológica` | Explicación razonada de cómo las observaciones conducen al estado asignado, incluyendo la aplicación de reglas de resolución (herencia, prevalencia, manejo de conflictos). |
| `Nivel de confianza` | Grado de confianza asociado a la resolución, expresado como una estimación basada en la consistencia de las observaciones y la cobertura de la evidencia. |
| `Estado de la resolución` | `FINAL` si la resolución se considera cerrada para esta evaluación; `PROVISIONAL` si puede ser revisada. |
| `Versión del átomo` | Versión del átomo base y del perfil contextual utilizados. |
| `Fecha de resolución` | Momento en que se realizó la resolución. |

La resolución no incluye las evidencias originales ni las reglas interpretativas en sí mismas —esos datos permanecen en sus respectivos registros—, pero debe garantizar la trazabilidad hacia ellos a través de los identificadores.

---

## 5. Proceso de resolución

La resolución de un átomo sigue un proceso lógico que puede descomponerse en tres momentos:

### 5.1. Recopilación de observaciones del átomo

Se identifican todas las observaciones del Observation Registry cuyo `Atom_ID` coincide con el átomo que se está resolviendo. Si no existe ninguna observación para ese átomo (por ejemplo, porque no se encontró evidencia pertinente o los indicadores no produjeron resultados), el átomo se considera en estado `NO_EVALUABLE` por falta de datos, y la resolución se documenta en consecuencia.

### 5.2. Análisis de consistencia y conflictos

Las observaciones recopiladas pueden ser:
- **Compatibles:** Apuntan en la misma dirección evaluativa (por ejemplo, varias evidencias muestran el mismo nivel de satisfacción de un indicador).
- **Incompatibles o contradictorias:** Indican resultados opuestos (por ejemplo, una evidencia sugiere satisfacción plena y otra sugiere incumplimiento).
- **De baja confianza:** Observaciones con una estimación de confianza baja que deben ser ponderadas con menor peso.
- **Inválidas:** Observaciones que, por alguna razón metodológica, han sido descartadas o marcadas como no fiables (por ejemplo, por errores en la extracción de evidencia).
- **Redundantes:** Múltiples observaciones que reflejan esencialmente el mismo hallazgo sobre la misma evidencia.

La fase de resolución debe aplicar principios metodológicos (ver Sección 6) para integrar estas observaciones, resolviendo conflictos y determinando el estado consolidado.

### 5.3. Determinación del estado y justificación

A partir del análisis, se asigna un estado al átomo y se redacta una justificación que explique, en términos metodológicos, cómo se ha llegado a esa determinación. La justificación debe hacer referencia explícita a las observaciones clave (por sus `Observation_ID`) y a las reglas de resolución aplicadas. El resultado se registra en el Atom Resolution Registry.

---

## 6. Resolución de conflictos

La resolución de un átomo puede enfrentarse a situaciones de conflicto entre observaciones. Esta sección define los principios que rigen la resolución de esos conflictos, sin especificar algoritmos concretos.

### 6.1. Principio de prevalencia de la evidencia más robusta

Cuando dos observaciones del mismo átomo se contradicen, la resolución debe inclinarse hacia aquella que esté respaldada por evidencia más directa, más explícita o más alineada con la definición operacional del átomo en el perfil contextual activo. No se trata de una cuestión de cantidad, sino de calidad metodológica.

### 6.2. Principio de ponderación por confianza

Las observaciones con un nivel de confianza más alto tienen mayor peso en la resolución que aquellas con baja confianza. Una observación de baja confianza no se descarta automáticamente, pero su influencia en la determinación del estado consolidado debe ser proporcional a su fiabilidad.

### 6.3. Principio de tratamiento de observaciones invalidadas

Las observaciones que han sido marcadas como inválidas (por ejemplo, porque la evidencia fue posteriormente descartada o porque la regla interpretativa se aplicó incorrectamente) no deben ser consideradas en la resolución. Su exclusión debe quedar documentada.

### 6.4. Principio de resolución ante ausencia de observaciones

Si un átomo no tiene ninguna observación válida, el estado consolidado será `NO_EVALUABLE`, indicando que no ha sido posible obtener evidencia suficiente para aplicar los indicadores. Este estado es distinto de `NO_SATISFECHO`; el primero señala una limitación del proceso de evaluación, el segundo un resultado evaluativo.

### 6.5. Principio de resolución ante observaciones contradictorias de igual peso

Cuando dos o más observaciones válidas y de confianza similar apuntan en direcciones opuestas, y no es posible determinar una prevalencia clara, la resolución debe reflejar esa ambigüedad. Esto puede traducirse en un estado `PARCIALMENTE_SATISFECHO` con una nota de conflicto no resuelto, o en una indicación explícita de que el átomo no puede ser resuelto de forma concluyente. La decisión debe ser documentada.

### 6.6. Principio de integración de observaciones redundantes

Las observaciones redundantes que reflejan el mismo hallazgo sobre una misma evidencia no deben sesgar la resolución por acumulación. El Instrumento debe reconocer la redundancia y evitar que la repetición de una misma evidencia desde distintos indicadores se interprete como evidencia adicional independiente.

---

## 7. Carácter hipotético de la resolución

La resolución de un átomo, al igual que las observaciones y el Registro de Evidencias, tiene **carácter hipotético y revisable**. No es una verdad definitiva, sino la mejor determinación posible a partir de las observaciones disponibles en un momento dado.

La resolución puede cambiar si:
- Se modifica el CAAC (por ejemplo, por un cambio en el perfil contextual o en la versión del estándar).
- Se incorporan, descartan o modifican evidencias.
- Se añaden, invalidan o corrigen observaciones.

El sistema debe conservar el historial de resoluciones, de modo que pueda reconstruirse la evolución del estado de cada átomo a lo largo del proceso de evaluación. La trazabilidad exige que cualquier cambio en una resolución quede registrado, con indicación del motivo y la fecha.

---

## 8. Relación con documentos anteriores

ATOM_RESOLUTION.md depende directamente de los siguientes documentos del Nivel 2:

- **INDICATOR_APPLICATION.md:** Proporciona el Observation Registry, que contiene todas las observaciones generadas átomo por átomo. Sin este registro, no hay insumo para la resolución.
- **ATOM_LOADING.md:** Proporciona el CAAC, que define qué átomos deben ser resueltos y cuáles son sus definiciones operacionales, indicadores y reglas interpretativas de referencia.
- **SEMANTIC_INITIALIZATION.md y EVIDENCE_COLLECTION.md:** Aunque no son consultados directamente en esta fase, establecieron las condiciones (perfil contextual, evidencias) que determinan el contenido de las observaciones.

La Resolución de Átomos es el último paso antes de la agregación de resultados. Con ella se cierra el análisis individual de cada componente evaluativo y se prepara el terreno para la integración global.

---

## 9. Lo que esta fase NO hace

Para preservar la separación de responsabilidades, se declara explícitamente que la Resolución de Átomos:

- **NO calcula el IRD** (Índice de Robustez Deliberativa) ni ningún otro índice compuesto.
- **NO asigna puntuaciones numéricas** a los átomos (la traducción a escalas numéricas corresponde a la fase de scoring).
- **NO agrega resultados entre distintos átomos** (eso ocurre en la fase de agregación).
- **NO genera informes de evaluación** (el informe se construye en una etapa posterior).
- **NO evalúa el documento en su conjunto**, sino átomo por átomo.
- **NO reinterpreta las evidencias originales**, sino que trabaja exclusivamente sobre las observaciones.

---

## 10. Principios metodológicos

**Principio 1 – Unicidad de resolución por átomo.**  
Para un mismo átomo, en una misma evaluación, existe una única resolución consolidada. No pueden coexistir dos resoluciones contradictorias para el mismo átomo sin que una de ellas haya sido explícitamente reemplazada.

**Principio 2 – Dependencia exclusiva del Observation Registry.**  
La resolución se basa únicamente en las observaciones registradas. No recurre al documento original ni a nuevas extracciones de evidencia. Esto garantiza que la resolución sea reproducible a partir de los datos intermedios.

**Principio 3 – Trazabilidad completa.**  
La resolución debe indicar exactamente qué observaciones la sustentan. Cualquier auditor puede, a partir del Atom Resolution Registry, remontarse a las observaciones y, desde ellas, a las evidencias y reglas interpretativas originales.

**Principio 4 – Reversibilidad.**  
Toda resolución puede ser revisada si cambian las observaciones que la sustentan. El sistema debe conservar el historial de cambios y permitir la restauración del estado anterior.

**Principio 5 – Consistencia metodológica.**  
Las reglas de resolución deben ser uniformes para todos los átomos de una misma evaluación, y estar documentadas de manera explícita. No pueden aplicarse criterios ad‑hoc para átomos particulares.

**Principio 6 – Conservación del historial.**  
Cualquier modificación de una resolución genera un nuevo registro en el historial, sin eliminar el anterior. La versión vigente es la más reciente, pero todas las versiones anteriores permanecen accesibles.

**Principio 7 – Independencia entre átomos.**  
La resolución de un átomo no depende de la resolución de otros átomos. Cada átomo se resuelve exclusivamente a partir de sus propias observaciones. Las relaciones entre átomos se consideran en fases posteriores de agregación.

---

## 11. Observaciones finales

La Resolución de Átomos es el momento en que la multiplicidad de observaciones puntuales se transforma en una decisión metodológica por cada entidad evaluativa. Es el punto de articulación entre la recopilación de datos y la producción de resultados. Un error en esta fase —una integración incorrecta, un conflicto mal resuelto, una justificación insuficiente— compromete la validez de toda la evaluación, por mucho cuidado que se haya puesto en las fases anteriores.

La existencia de un Registro de Resoluciones explícito, trazable y revisable es lo que distingue una evaluación metodológicamente rigurosa de una mera acumulación de observaciones. La resolución no añade información nueva; ordena, pondera y decide. Y al hacerlo, asume la responsabilidad de transformar datos en juicios evaluativos, con todas las garantías de transparencia y auditabilidad que el proyecto SOPHIA exige.

---

**Versión:** 1.0.0  
**Fecha:** [A completar al momento de la aprobación]  
**Próximo documento en el flujo del Nivel 2:** `SCORING_AND_AGGREGATION.md` – Puntuación y Agregación de Resultados  
```
