```markdown
# SCORING_AND_AGGREGATION.md – Puntuación y Agregación de Resultados

**Proyecto:** SOPHIA  
**Nivel:** 2 · Instrumento SOPHIA  
**Versión del documento:** 1.0.0  
**Estado:** Fundacional  
**Ubicación:** `assets/js/sophia/02-instrumento/SCORING_AND_AGGREGATION.md`  
**Naturaleza:** Documento metodológico del Instrumento SOPHIA  

---

## 1. Propósito

Este documento define la etapa de **Puntuación y Agregación** del Instrumento SOPHIA. Su función es transformar las resoluciones individuales de los átomos cognitivos —contenidas en el Atom Resolution Registry— en resultados agregados, estructurados en niveles sucesivos: constructos, criterios, puntuaciones y, finalmente, un resumen de evaluación.

La etapa opera exclusivamente sobre artefactos internos ya consolidados. No accede al documento original, no reexamina evidencias, no ejecuta indicadores y no modifica ninguna resolución atómica previa. Su responsabilidad es exclusivamente composicional: derivar, mediante funciones deterministas, los resultados de niveles superiores a partir de los resultados atómicos, preservando en todo momento la trazabilidad completa.

La transformación sigue la secuencia conceptual:

```

Atom Resolution Registry
↓
Construct Resolution
↓
Criterion Resolution
↓
Scores
↓
Evaluation Output

```

Cada paso es una función pura que consume exclusivamente el artefacto precedente y las reglas de agregación y puntuación definidas por el Instrumento.

---

## 2. Posición en el flujo metodológico

La Puntuación y Agregación se sitúa inmediatamente después de la Resolución de Átomos y constituye la última fase de transformación interna antes de la emisión del informe de evaluación.

```

ATOM_RESOLUTION
↓
SCORING_AND_AGGREGATION   ← ESTE DOCUMENTO
↓
Informe de Evaluación (etapa posterior)

```

**Entradas:**
- **Atom Resolution Registry:** conjunto de resoluciones, una por cada átomo del CAAC, cada una con su estado, justificación, reglas aplicadas y confianza.
- **Construct Definitions:** definiciones de los constructos, que agrupan uno o varios átomos y especifican cómo se compone su estado agregado.
- **Criterion Definitions:** definiciones de los criterios del estándar, que agrupan constructos y establecen las reglas para derivar su estado a partir de ellos.
- **Aggregation Rules:** reglas explícitas que gobiernan la transformación de resoluciones de átomos en estados de constructos y de constructos en estados de criterios.
- **Scoring Rules:** reglas que transforman los estados de los criterios en puntuaciones y éstas en un resumen global.

**Salidas (artefactos producidos):**
- **Construct Resolution Registry**
- **Criterion Resolution Registry**
- **Score Registry**
- **Evaluation Summary**

Ninguna de estas salidas modifica las entradas. Cada una es un artefacto nuevo, inmutable y trazable.

---

## 3. Contrato de transformación

La etapa se define como una composición de funciones metodológicas puras. Cada función recibe un conjunto de entradas bien definido y produce exactamente una salida estructurada.

**Funciones abstractas:**

```

ConstructResolution = F_construct(AtomResolutionSet, ConstructDefinition, AggregationRules)
CriterionResolution = F_criterion(ConstructResolutionSet, CriterionDefinition, AggregationRules)
Scores              = F_score(CriterionResolutionSet, ScoringRules)
EvaluationSummary   = F_summary(Scores, ScoringRules)

```

Donde:

- `F_construct` agrega las resoluciones de los átomos pertenecientes a un mismo constructo, aplicando las reglas de agregación definidas para ese constructo.
- `F_criterion` agrega las resoluciones de los constructos que componen un mismo criterio, conforme a las reglas de agregación del criterio.
- `F_score` asigna a cada criterio una puntuación abstracta derivada de su estado agregado, de acuerdo con las reglas de puntuación.
- `F_summary` integra las puntuaciones en un resumen de evaluación, aplicando las reglas de resumen global.

Todas las funciones son deterministas: para las mismas entradas y las mismas versiones de las reglas, producen exactamente la misma salida.

---

## 4. Funciones puras

Todas las transformaciones de esta etapa cumplen las propiedades de funciones puras en el sentido metodológico:

1. **Determinismo:** el resultado depende exclusivamente de los valores de entrada y de las reglas versionadas. No intervienen estados ocultos, aleatoriedad ni criterios dependientes del contexto de ejecución.
2. **Inmutabilidad de entradas:** ninguna función altera los registros de entrada. Los artefactos previos (Atom Resolution Registry, definiciones de constructos y criterios) se tratan como datos de solo lectura.
3. **Idempotencia:** ejecutar la misma función con los mismos argumentos produce el mismo resultado, sin efectos acumulativos.
4. **Independencia del orden de evaluación:** los constructos pueden resolverse en cualquier orden, e incluso en paralelo, sin afectar los resultados finales.

Estas propiedades garantizan la reproducibilidad completa de los resultados agregados y permiten que la auditoría (Nivel 3) verifique cada paso de agregación de forma aislada.

---

## 5. Invariantes

Durante toda la etapa de Puntuación y Agregación se mantienen los siguientes invariantes:

1. **Pertenencia exclusiva.** Un átomo pertenece exactamente a un constructo; un constructo pertenece exactamente a un criterio. No existen ambigüedades de adscripción.
2. **Inmutabilidad de las resoluciones atómicas.** Ningún paso de agregación modifica el Atom Resolution Registry. Los estados y justificaciones atómicas permanecen inalterados.
3. **Trazabilidad completa.** Cada resultado agregado (estado de constructo, estado de criterio, puntuación) conserva referencias explícitas a los identificadores de los átomos que lo originaron.
4. **Conservación de la confianza.** La confianza de una resolución agregada se deriva de las confianzas de las resoluciones de entrada, sin introducir sesgos externos.
5. **No pérdida de información.** Ningún resultado agregado omite información relevante de las resoluciones de entrada. Los casos de datos faltantes o átomos no evaluables se reflejan explícitamente en los niveles superiores.

---

## 6. Registros de resultados

La etapa produce los siguientes artefactos inmutables:

### 6.1. Construct Resolution Registry

Contiene una entrada por cada constructo definido en el Instrumento. Cada entrada incluye:

- Identificador del constructo.
- Lista de átomos que lo componen y referencias a sus resoluciones.
- Estado agregado del constructo (derivado de los estados atómicos según las reglas de agregación).
- Justificación metodológica de la agregación.
- Confianza agregada del constructo.
- Versión de las reglas de agregación utilizadas.

### 6.2. Criterion Resolution Registry

Contiene una entrada por cada criterio del estándar. Cada entrada incluye:

- Identificador del criterio.
- Lista de constructos que lo componen y referencias a sus resoluciones.
- Estado agregado del criterio (derivado de los estados de los constructos según las reglas de agregación).
- Justificación metodológica de la agregación.
- Confianza agregada del criterio.
- Versión de las reglas de agregación utilizadas.

### 6.3. Score Registry

Contiene una entrada por cada criterio evaluado, con la puntuación asignada. Cada entrada incluye:

- Identificador del criterio.
- Puntuación abstracta (representación ordenada, sin prescribir una escala concreta).
- Referencia al estado agregado del criterio que le dio origen.
- Versión de las reglas de puntuación aplicadas.

### 6.4. Evaluation Summary

Resumen global de la evaluación. Incluye:

- Identificación del documento evaluado.
- Versiones de todos los artefactos y reglas utilizados.
- Puntuaciones por criterio (referencia al Score Registry).
- Resultado global (si el Instrumento define una función de resumen).
- Nivel de confianza global de la evaluación.
- Indicación de limitaciones o condiciones aplicables.

---

## 7. Reglas de agregación

Las reglas de agregación son especificaciones normativas que determinan cómo se combinan los estados atómicos en estados de constructo, y los estados de constructo en estados de criterio. No se definen aquí fórmulas concretas, sino los principios que toda regla de agregación debe satisfacer.

### 7.1. Agregación de estados

Cada regla de agregación toma un conjunto de estados de entrada (con sus respectivas confianzas y justificaciones) y produce un único estado de salida. La regla debe:

- Estar definida explícitamente para cada constructo y criterio.
- Ser determinista.
- Respetar la semántica cualitativa de los estados (no reducirlos a promedios aritméticos si eso contradice la definición del constructo).

### 7.2. Conservación de la trazabilidad

El estado agregado conserva las referencias a los estados de entrada. Un auditor debe poder reconstruir, desde un estado de criterio, los constructos y átomos que lo sustentan.

### 7.3. Herencia y propagación de confianzas

La confianza de un resultado agregado se calcula a partir de las confianzas de los resultados de entrada, aplicando reglas explícitas de propagación. La regla debe considerar tanto la magnitud de las confianzas individuales como la completitud del conjunto (por ejemplo, si hay átomos no evaluables).

### 7.4. Propagación de incertidumbres

Cuando las resoluciones de entrada presentan discrepancias o conflictos no resueltos, esa incertidumbre se traslada al estado agregado, reflejándose tanto en la confianza resultante como en la justificación.

### 7.5. Manejo de datos faltantes

Si un átomo no pudo ser resuelto (estado `NOT_EVALUABLE` o similar), esa circunstancia se refleja en el nivel de constructo y, en consecuencia, en el criterio. Las reglas de agregación deben especificar cómo afecta la falta de información a la confianza y al estado agregado.

---

## 8. Lo que esta etapa NO hace

Se declara explícitamente que la Puntuación y Agregación:

- **NO interpreta** evidencias.
- **NO modifica** resoluciones atómicas.
- **NO ejecuta** indicadores.
- **NO altera** observaciones.
- **NO consulta** nuevamente el documento original.
- **NO modifica** el CAAC ni las definiciones de constructos o criterios.
- **NO sustituye** el juicio metodológico de las fases anteriores.

Su única responsabilidad es transformar, mediante funciones puras y deterministas, los resultados atómicos en resultados agregados.

---

## 9. Principios metodológicos

**Principio 1 – Determinismo.**  
Con las mismas entradas y las mismas versiones de reglas de agregación y puntuación, el resultado de esta etapa es siempre idéntico.

**Principio 2 – Reproducibilidad.**  
Cualquier evaluador o auditor puede reejecutar la etapa y obtener exactamente los mismos artefactos de salida, dado el acceso al Atom Resolution Registry y a las reglas versionadas.

**Principio 3 – Idempotencia.**  
La ejecución repetida de la etapa sobre las mismas entradas no altera los resultados ni produce efectos secundarios.

**Principio 4 – Trazabilidad.**  
Cada resultado agregado mantiene vínculos explícitos con los átomos que lo originaron, permitiendo la auditoría granular.

**Principio 5 – Conservación del historial.**  
Si las reglas de agregación o puntuación cambian, una nueva ejecución genera nuevos registros sin eliminar los anteriores. El historial completo de evaluaciones pasadas permanece accesible.

**Principio 6 – Separación de responsabilidades.**  
La agregación está estrictamente separada de la resolución atómica. Cambios en las reglas de agregación no afectan a las resoluciones atómicas ya registradas.

**Principio 7 – Independencia de implementación.**  
La especificación de esta etapa no prescribe plataformas, lenguajes ni formatos técnicos. Cualquier implementación que respete las funciones y contratos aquí definidos es conforme.

**Principio 8 – Versionado.**  
Las reglas de agregación y puntuación están versionadas. Cada artefacto de salida registra la versión exacta de las reglas con las que fue generado.

**Principio 9 – Auditabilidad.**  
Un auditor puede verificar la corrección de cada paso comprobando que la función de agregación se aplicó correctamente a sus entradas, sin necesidad de reejecutar etapas previas.

---

## 10. Garantías arquitectónicas

La arquitectura de esta etapa proporciona las siguientes garantías formales:

- **Reproducibilidad total.** Dos ejecuciones independientes de la etapa con las mismas entradas y reglas producen bit a bit los mismos registros de salida.
- **Paralelización.** La resolución de constructos y criterios puede realizarse en cualquier orden o concurrentemente sin afectar la corrección.
- **Ausencia de efectos secundarios.** Ningún artefacto externo a la etapa es modificado.
- **Trazabilidad completa.** La cadena causal desde el resultado global hasta cada átomo es verificable.
- **Auditoría histórica.** Es posible comparar evaluaciones realizadas con distintas versiones de las reglas, porque los artefactos antiguos se conservan íntegros.
- **Consistencia entre evaluaciones.** Dos evaluaciones de documentos distintos que utilicen la misma versión del Instrumento aplican exactamente las mismas transformaciones de agregación y puntuación, garantizando comparabilidad.
- **Independencia de implementación.** La corrección metodológica depende únicamente de la conformidad con las funciones abstractas y las reglas versionadas, no de la tecnología subyacente.

---

## 11. Observaciones finales

La Puntuación y Agregación cierra el proceso interno de transformación del Instrumento SOPHIA. Desde la clasificación inicial del documento hasta este punto, cada etapa ha operado como una función pura sobre artefactos inmutables, preservando la trazabilidad y la auditabilidad en cada paso. Esta etapa no introduce nueva evidencia ni reinterpreta los hallazgos previos: se limita a componer los juicios ya consolidados en una estructura de resultados que responde a la pregunta evaluativa formulada por el estándar.

Al mantener la agregación y la puntuación como funciones deterministas y versionadas, SOPHIA asegura que el tránsito desde las observaciones puntuales hasta el resumen global sea completamente transparente, verificable y reproducible. La arquitectura resultante es la de un pipeline de compilación epistemológica, donde cada fase transforma datos respetando contratos explícitos, y donde la corrección puede ser verificada de manera independiente en cada nivel.

---

