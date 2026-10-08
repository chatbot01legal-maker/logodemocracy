# INDICATOR_APPLICATION.md – Aplicación de Indicadores

**Proyecto:** SOPHIA  
**Nivel:** 2 · Instrumento SOPHIA  
**Versión del documento:** 1.0.0  
**Estado:** Fundacional  
**Ubicación:** `assets/js/sophia/02-instrumento/INDICATOR_APPLICATION.md`  
**Naturaleza:** Documento metodológico del Instrumento SOPHIA  

---

## 1. Propósito

Este documento define la etapa de Aplicación de Indicadores del Instrumento SOPHIA, que constituye la etapa en la que los indicadores definidos por el CAAC son aplicados sistemáticamente a la evidencia recopilada. Su función consiste en contrastar de manera estructurada las reglas de verificación (indicadores y contraindicadores) con las unidades textuales compiladas en el Registro de Evidencias.

`INDICATOR_APPLICATION.md` no realiza ponderaciones, no acumula notas ni calcula el Índice de Robustez Deliberativa (IRD). Responde exclusivamente a la pregunta:

> ¿Qué observación metodológica resulta de la aplicación sistemática de un indicador a una evidencia determinada?

Su único producto es el **Registro de Observaciones (Observation Registry)**, estructura oficial que consolida las constataciones descriptivas preliminares que servirán de insumo para la posterior resolución de los átomos.

---

## 2. Posición en el flujo metodológico

La Aplicación de Indicadores es la primera operación de contraste metodológico del Instrumento, situándose después de la recolección de evidencias y antes de la síntesis valorativa:

`SEMANTIC_INITIALIZATION`
↓
`ATOM_LOADING`
↓
`EVIDENCE_COLLECTION`
↓
`INDICATOR_APPLICATION`   ← ESTE DOCUMENTO
↓
`ATOM_RESOLUTION`
↓
`SCORING_AND_AGGREGATION`

**Entradas:**
- Registro de Evidencias (desde `EVIDENCE_COLLECTION.md`).
- Conjunto Activo de Átomos Cognitivos (desde `ATOM_LOADING.md`).

**Salida:**
- Registro de Observaciones (Observation Registry): conjunto descriptivo de interacciones resueltas entre indicadores y evidencias.

---

## 3. El concepto de Observación

### 3.1. Distinción Epistemológica
Para asegurar la auditabilidad y neutralidad de SOPHIA, el Instrumento establece una separación tajante entre tres entidades correlacionadas pero funcionalmente independientes, las cuales constituyen los pilares de su arquitectura de datos:

| Entidad | Naturaleza | Ejemplo |
|---|---|---|
| **Evidencia** | El fragmento de texto literal extraído del documento original (inmutable). | *"La temperatura aumentó 2 °C durante el período 1980-2020."* |
| **Indicador** | La regla o patrón lógico de verificación definido dentro del átomo. | *Verificar si la afirmación cuantitativa cuenta con una referencia o mención a su fuente de datos.* |
| **Observación** | La constatación metodológica resultante de aplicar el Indicador a la Evidencia. | *La afirmación de la variación térmica carece de una referencia explícita a la base de datos o estudio de origen.* |

### 3.2. Características de una Observación
Una observación en SOPHIA es una constatación de compatibilidad metodológica. No expresa un juicio de valor sobre la verdad del texto ni una calificación numérica:
- **Es atómica:** Vincula un indicador específico con una evidencia delimitada.
- **Es descriptiva:** Se limita a registrar si el patrón del indicador se cumple, se contradice o resulta indeterminado en el texto.
- **Es provisional:** Mantiene el carácter de hipótesis operacional y puede ser revisada.

---

## 4. Registro de Observaciones (Observation Registry)

El Registro de Observaciones es la estructura formal que documenta de manera auditable los resultados de esta fase, situándose al mismo nivel arquitectónico que el CAAC y el Registro de Evidencias. Cada entrada debe contener, como mínimo, los siguientes campos:

| Campo | Descripción |
|---|---|
| **Observation_ID** | Identificador unívoco del registro de observación. |
| **Evidence_ID** | Puntero directo al registro de evidencia de origen. |
| **Atom_ID** | Identificador del átomo del CAAC que provee el indicador. |
| **Indicator_ID** | Código de la regla específica aplicada (indicador o contraindicador). |
| **Resultado de la Aplicación** | Estado resultante (Compatible, No compatible, No concluyente, No evaluable). |
| **Descripción de la Observación** | Argumentación técnica que fundamenta el resultado de la aplicación. |
| **Nivel de Confianza** | Valor estimado según el procedimiento definido por el Instrumento, cuyo cálculo específico se delegará a protocolos posteriores. |
| **Estado** | Estado operacional de la observación (Preliminar, Confirmada, Invalidada por Reconfiguración). |

---

## 5. Resultados de la Aplicación

Para evitar valoraciones interpretativas prematuras durante esta fase, la aplicación de un indicador sobre una evidencia se clasificará exclusivamente bajo uno de los siguientes estados neutrales:

1. **Compatible:** La evidencia analizada presenta correspondencia clara con el patrón o requisito lógico definido en el indicador.
2. **No compatible:** La aplicación del indicador o contraindicador produce un resultado incompatible con las condiciones establecidas por la regla evaluada.
3. **No concluyente:** El texto de la evidencia contiene elementos asociados al indicador, pero su nivel de ambigüedad o falta de precisión impide determinar compatibilidad o incompatibilidad de manera fehaciente.
4. **No evaluable:** El fragmento de evidencia seleccionado, tras un análisis detallado, no ofrece la sustancia semántica mínima necesaria para que la regla del indicador sea proyectada sobre él, o el indicador ha perdido pertinencia contextual.

---

## 6. Proceso metodológico de aplicación

La generación de observaciones se realiza de manera sistemática y secuencial:

**Paso 1: Mapeo y selección**
El Instrumento selecciona un átomo del CAAC y recupera desde el Registro de Evidencias todos los fragmentos asociados a su `Atom_ID`.

**Paso 2: Aplicación de Reglas (Indicadores y Contraindicadores)**
Para cada fragmento, se aplican de forma iterativa y autónoma las reglas descriptoras del átomo, buscando contrastar el patrón lógico exigido contra la sustancia del texto.

**Paso 3: Registro y Documentación**
Cada aplicación resuelta se inscribe en el *Observation Registry* detallando el análisis técnico, el nivel de confianza y el estado correspondiente, sin realizar ponderaciones numéricas ni deducciones sobre el impacto global en el átomo.

---

## 7. Carácter hipotético del Registro de Observaciones

En consonancia con la filosofía metodológica de SOPHIA, las observaciones registradas no constituyen verdades empíricas definitivas, sino hipótesis operacionales sujetas a revisión.

Dado que tanto la clasificación documental como la carga de átomos (CAAC) y la extracción de evidencias tienen carácter provisional, el Registro de Observaciones hereda esta misma condición:
- Si se produce una reclasificación documental en fases posteriores, el CAAC puede modificarse, lo que obligará a recalcular, refinar o invalidar las observaciones afectadas.
- Si un análisis en fases posteriores determina que un fragmento de evidencia fue mal asignado a un átomo, las observaciones derivadas de ese cruce deberán cambiar su estado a *Invalidada por Reconfiguración*.
- El sistema conservará siempre el historial de observaciones invalidadas o modificadas para permitir una auditoría transparente del proceso de refinamiento analítico.

---

## 8. Manejo de excepciones

### 8.1. Evidencias Huérfanas
Si un fragmento de evidencia extraído previamente no logra ser procesado por ninguna regla (indicador ni contraindicador) del átomo asignado, la observación se registrará con el resultado *No evaluable*. Esto documenta la interacción sin forzar interpretaciones artificiales.

### 8.2. Observaciones bajo condiciones de incertidumbre
Cuando durante la aplicación de una regla el Instrumento detecte condiciones que reduzcan la certeza metodológica del resultado obtenido, la observación deberá registrar dicha circunstancia mediante el mecanismo de estimación de confianza definido por los protocolos correspondientes.

---

## 9. Relación con documentos anteriores

`INDICATOR_APPLICATION.md` opera consumiendo los recursos metodológicos consolidados por los documentos precedentes:
- `SEMANTIC_INITIALIZATION.md`: Proporciona la naturaleza y el contexto que justifican el marco general del análisis.
- `ATOM_LOADING.md`: Proporciona el Conjunto Activo de Átomos Cognitivos (CAAC), que define las reglas precisas (indicadores y contraindicadores) que deben ser proyectadas sobre el texto.
- `EVIDENCE_COLLECTION.md`: Proporciona el Registro de Evidencias, que contiene los fragmentos literales del documento que se someterán a prueba.

---

## 10. Relación con documentos posteriores

El Registro de Observaciones constituirá el insumo exclusivo del cual se nutrirán las fases que ejecutan el cierre valorativo y la síntesis:
- `ATOM_RESOLUTION.md`: Tomará las observaciones de cada átomo, resolverá las posibles contradicciones, y determinará el estado final de cumplimiento de cada unidad cognitiva.
- `SCORING_AND_AGGREGATION.md`: Convertirá las resoluciones cualitativas de los átomos en índices numéricos ponderados para calcular las dimensiones y el Índice de Robustez Deliberativa (IRD) final del documento.

---

## 11. Lo que esta fase NO hace

Para resguardar la pureza de esta etapa analítica, se declara explícitamente que la Aplicación de Indicadores:
- NO asigna puntuaciones numéricas.
- NO calcula promedios ni ponderaciones de importancia.
- NO emite juicios sobre el comportamiento ético o la intención del autor.
- NO resuelve el estado definitivo del átomo (acción exclusiva de `ATOM_RESOLUTION.md`).
- NO genera conclusiones agregadas sobre la calidad deliberativa global del documento.

---

## 12. Principios metodológicos

1. **Principio de Neutralidad Descriptiva:** Las observaciones deben centrarse estrictamente en contrastar la evidencia contra las reglas lógicas del indicador, evitando adjetivos subjetivos no tipificados.
2. **Principio de Trazabilidad Cruzada:** Toda observación debe ser un puente bidireccional que conecte inequívocamente un `Evidence_ID` del Registro de Evidencias con un `Indicator_ID` del CAAC.
3. **Principio de Conservación del Historial:** Las observaciones modificadas o invalidadas debido a cambios en fases tempranas no se eliminan físicamente del registro; se marcan como inactivas para resguardar la trazabilidad de la auditoría.
4. **Principio de Dependencia Epistémica:** El Registro de Observaciones hereda el carácter de hipótesis provisional de todas sus fases precedentes, permaneciendo abierto al refinamiento recursivo.
5. **Principio de Independencia entre Observaciones:** Cada observación constituye una unidad elemental de procesamiento. Ninguna observación requiere conocer el resultado de otra para ser generada. Esto garantiza que la función algorítmica de contraste sea auditable, reproducible y computacionalmente paralelizable. Las relaciones, agrupaciones o posibles contradicciones entre observaciones serán establecidas y resueltas únicamente durante la fase posterior de resolución del átomo.

---

