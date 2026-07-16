Claro. A continuación presento la revisión arquitectónica completa de ATOM_RESOLUTION.md, orientada a transformar la resolución atómica en una función determinista, pura y auditable dentro del pipeline del Instrumento SOPHIA.

---

ATOM_RESOLUTION.md – Resolución de Átomos Cognitivos

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.1.0
Estado: Revisión Arquitectónica
Ubicación: assets/js/sophia/02-instrumento/ATOM_RESOLUTION.md
Naturaleza: Documento metodológico del Instrumento SOPHIA

---

1. Propósito

Este documento define la etapa de Resolución de Átomos Cognitivos. Su función es aplicar, para cada átomo del Conjunto Activo de Átomos Cognitivos (CAAC), una función de resolución determinista que transforma el conjunto de observaciones generadas durante la aplicación de indicadores en un estado consolidado del átomo.

La etapa no delibera, no interpreta ni decide en un sentido judicial. Ejecuta una transformación formal:

```
Resolution = f(ObservationSet, AtomDefinition, ResolutionRules)
```

El resultado es un único AtomResolution por átomo, registrado en el Atom Resolution Registry. Esta etapa no produce puntuaciones numéricas, no agrega átomos entre sí y no emite juicios globales sobre el documento. Pertenece exclusivamente a la fase de transformación interna del Instrumento.

---

2. Posición en el flujo metodológico

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
SCORING_AND_AGGREGATION
```

Entradas inmutables:

· Observation Registry: conjunto de observaciones producidas por INDICATOR_APPLICATION, tratado como artefacto de solo lectura.
· CAAC: definiciones activas de los átomos, incluyendo sus reglas de resolución específicas de perfil.
· Resolution Rules: reglas de transformación que rigen cómo un conjunto de observaciones se consolida en un estado atómico.

Salida:

· Atom Resolution Registry: artefacto que contiene una resolución por cada átomo del CAAC.

La etapa no consulta el documento original, no modifica el Observation Registry, no reabre la extracción de evidencia y no ejecuta indicadores.

---

3. Concepto de resolución atómica

3.1. Definición formal

La resolución atómica es la aplicación de una función determinista R tal que:

```
R(OA, DA, RR) → (state, rationale, rules_applied, confidence)
```

donde:

· OA es el subconjunto del Observation Registry correspondiente al átomo A.
· DA es la definición del átomo A según el CAAC (indicadores, contraindicadores, reglas interpretativas, reglas de resolución).
· RR son las reglas de resolución globales del Instrumento en su versión activa.
· state es el estado consolidado del átomo (por ejemplo, SATISFIED, PARTIALLY_SATISFIED, NOT_SATISFIED, NOT_EVALUABLE).
· rationale es la justificación metodológica que vincula las observaciones de entrada con el estado resultante.
· rules_applied es el conjunto de reglas de RR y DA que intervinieron en la transformación.
· confidence es la estimación de confianza de la resolución.

La función R no crea información nueva: deriva el estado exclusivamente a partir de los datos de entrada y las reglas declaradas.

3.2. Observación vs. Resolución

· Observación: Resultado puntual de aplicar una regla interpretativa a una evidencia. Responde a: ¿qué se detectó en este fragmento?
· Resolución: Estado consolidado del átomo tras aplicar R sobre todas sus observaciones. Responde a: ¿cuál es el estado del átomo dadas todas las observaciones?

Son objetos distintos, producidos por etapas distintas y almacenados en registros independientes.

---

4. Función Pura de Resolución

La resolución atómica se diseña como una función pura en sentido metodológico:

1. Determinismo: Para un mismo OA, DA y RR, la salida de R es siempre idéntica.
2. Sin efectos secundarios: R no modifica sus entradas. El Observation Registry, el CAAC y las reglas de resolución son tratados como inmutables durante la ejecución.
3. Independencia del contexto de ejecución: El resultado no depende del orden de procesamiento, del momento de ejecución ni de ningún estado externo no declarado explícitamente en las entradas.

Esta propiedad garantiza:

· Reproducibilidad: Cualquier auditor puede recalcular la resolución y obtener el mismo resultado.
· Auditabilidad: La cadena causal desde las observaciones hasta el estado es completamente determinista y verificable.
· Paralelización: Las resoluciones de distintos átomos pueden ejecutarse en cualquier orden o en paralelo sin afectar el resultado.

---

5. Principio de Inmutabilidad del Observation Registry

Durante la etapa de Resolución, el Observation Registry se considera un artefacto inmutable. La función R:

· No modifica observaciones existentes.
· No elimina observaciones.
· No corrige observaciones.
· No reinterpreta observaciones.
· No añade nuevas observaciones.

Cualquier detección de error o inconsistencia en las observaciones debe registrarse como parte de la resolución (por ejemplo, afectando el confidence o indicando rules_applied que mitigan el impacto), pero nunca resolverse alterando el registro original. La inmutabilidad es la base de la trazabilidad y la auditoría.

---

6. Reglas de Resolución (Resolution Rules)

La función R se concreta en un conjunto de reglas de resolución (RR), que gobiernan la transformación del conjunto de observaciones en un estado atómico. Estas reglas son explícitas, versionadas y públicas.

Sin especificar algoritmos concretos, las reglas deben cubrir al menos los siguientes casos:

6.1. Átomo sin observaciones

Si OA está vacío, el estado resultante es NOT_EVALUABLE con la justificación de ausencia de evidencia.

6.2. Observaciones uniformes

Si todas las observaciones de OA apuntan consistentemente al mismo nivel de satisfacción (por ejemplo, todos los indicadores se detectan en grado alto), el estado se deriva directamente de esa uniformidad.

6.3. Observaciones con niveles de confianza heterogéneos

Las reglas de resolución deben ponderar las observaciones en función de su confianza, sin descartar automáticamente las de baja confianza pero limitando su influencia.

6.4. Observaciones contradictorias

Cuando existen observaciones que apuntan a estados opuestos (por ejemplo, indicadores satisfechos y contraindicadores activados), las reglas de resolución deben:

· Priorizar la evidencia más directa y alineada con la definición operacional del átomo.
· Aplicar reglas de prevalencia definidas en DA (por ejemplo, si un contraindicador crítico está activo, el estado no puede ser SATISFIED).
· Reflejar la contradicción en el confidence y en la justificación, incluso si se resuelve en un estado PARTIALLY_SATISFIED.

6.5. Observaciones redundantes

Las reglas deben reconocer cuándo múltiples observaciones reflejan el mismo hallazgo sobre la misma evidencia y evitar que la redundancia sesgue la resolución.

Las reglas de resolución no son decisiones ad‑hoc del evaluador: son parte de la definición del Instrumento y están sujetas a versionado.

---

7. Atom Resolution Registry

7.1. Definición

El Atom Resolution Registry es el artefacto que recoge, para cada átomo del CAAC, el resultado de aplicar R. Cada entrada es un registro de resolución.

7.2. Estructura de un registro

Campo Tipo Descripción
Atom_Resolution_ID Identificador Identificador único de la resolución.
Atom_ID Referencia Identificador del átomo resuelto.
Observation_IDs Lista de referencias Identificadores de todas las observaciones de entrada utilizadas.
Resolution_State Estado Estado consolidado del átomo (SATISFIED, PARTIALLY_SATISFIED, NOT_SATISFIED, NOT_EVALUABLE u otros definidos por el Instrumento).
Resolution_Rationale Texto estructurado Justificación metodológica que vincula las observaciones y las reglas aplicadas con el estado resultante.
Resolution_Rules_Applied Lista de referencias Reglas de RR y DA que intervinieron en la transformación.
Confidence_Level Nivel de confianza Estimación de la solidez de la resolución, basada en la consistencia de las observaciones y la cobertura.
Resolution_Status Estado del registro FINAL si la resolución se considera cerrada; PROVISIONAL si puede ser revisada.
Version_Info Metadato Versiones del átomo base, del perfil contextual y de las reglas de resolución.
Timestamp Marca temporal Momento de la resolución.

Cada campo tiene una responsabilidad única. La separación entre Resolution_State y Resolution_Rationale es obligatoria: el primero indica qué estado resultó; el segundo, por qué y cómo se llegó a él.

---

8. Proceso de transformación

Para cada átomo del CAAC, la etapa ejecuta secuencialmente:

1. Seleccionar del Observation Registry todas las observaciones cuyo Atom_ID coincide con el átomo.
2. Aplicar las reglas de resolución (RR) a ese conjunto, utilizando la definición del átomo (DA) para dirimir prevalencias, ponderar confianzas y tratar contradicciones.
3. Derivar el Resolution_State y construir la Resolution_Rationale.
4. Registrar la resolución en el Atom Resolution Registry.

El proceso no implica deliberación ni juicio humano: es una cadena de transformaciones gobernada por reglas explícitas.

---

9. Relación con otros documentos

· INDICATOR_APPLICATION.md produce el Observation Registry, entrada inmutable de esta etapa.
· ATOM_LOADING.md proporciona el CAAC con las definiciones atómicas y las reglas de resolución específicas de perfil.
· SEMANTIC_INITIALIZATION.md y EVIDENCE_COLLECTION.md no son consultados directamente, pero su salida condicionó el contenido del Observation Registry.

La etapa de Resolución consume artefactos de etapas anteriores y produce un nuevo artefacto, sin alterar ninguno de los anteriores.

---

10. Lo que esta etapa NO hace

· NO consulta el documento original.
· NO genera nuevas evidencias.
· NO modifica el Observation Registry.
· NO ejecuta indicadores.
· NO calcula puntuaciones numéricas (escalares).
· NO agrega resultados entre átomos distintos.
· NO construye constructos ni dimensiones.
· NO produce informes de evaluación.

Su única responsabilidad es transformar observaciones en resoluciones atómicas mediante una función pura.

---

11. Principios metodológicos

Principio 1 – Determinismo Funcional.
Bajo una misma versión del CAAC, un mismo conjunto de observaciones y un mismo conjunto de reglas de resolución, el resultado de R es siempre idéntico. No existe ningún componente probabilístico, aleatorio o dependiente del contexto de ejecución. Este principio es la piedra angular de la auditabilidad.

Principio 2 – Inmutabilidad de las Entradas.
Las observaciones, las definiciones atómicas y las reglas de resolución no son modificadas por esta etapa. Cualquier ajuste o corrección debe realizarse en las etapas que generaron esos artefactos, y la resolución debe re-ejecutarse en consecuencia.

Principio 3 – Trazabilidad Completa.
Un auditor debe poder reconstruir la resolución de un átomo siguiendo la cadena:

```
Atom Resolution
    ↓
Observation Registry
    ↓
Evidence Registry
    ↓
Documento Original
```

Cada paso de transformación debe ser reversible desde el punto de vista metodológico.

Principio 4 – Independencia entre Átomos.
La resolución de un átomo no depende de la resolución de otros átomos. La función R opera exclusivamente sobre el subconjunto de observaciones del átomo en cuestión y su definición.

Principio 5 – Versionado de Reglas.
Las reglas de resolución (RR) están versionadas. Una modificación en las reglas implica una nueva versión del Instrumento y debe reflejarse en el Resolution_Rules_Applied de cada resolución.

Principio 6 – Conservación del Historial.
Si una resolución es revisada (por ejemplo, porque cambiaron las observaciones de entrada), se genera una nueva entrada en el Atom Resolution Registry, sin eliminar la anterior. El estado vigente es el más reciente, pero todas las versiones permanecen accesibles.

Principio 7 – Separación Estado/Justificación.
El estado resultante y la justificación metodológica son campos distintos. El primero es el valor de salida; la segunda es la explicación de cómo las reglas y las observaciones condujeron a ese valor.

---

12. Observaciones finales

La Resolución de Átomos Cognitivos constituye el punto de articulación entre la recopilación de observaciones y la producción de resultados evaluativos. Al definirla como una función pura y determinista, SOPHIA garantiza que dos ejecuciones independientes con las mismas entradas produzcan exactamente el mismo resultado, eliminando la variabilidad interpretativa de esta fase.

Cada átomo resuelto representa una decisión metodológica trazable, donde el estado consolidado no es fruto de una deliberación opaca, sino de la aplicación sistemática de reglas explícitas sobre observaciones inmutables. Esta arquitectura permite que la auditoría (Nivel 3) pueda verificar la corrección de cada resolución sin necesidad de re-ejecutar el proceso completo, simplemente comprobando que R fue aplicada correctamente a sus entradas.

---
