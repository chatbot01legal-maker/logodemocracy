
# EVALUATION_REPORT.md – Generación del Informe de Evaluación

**Proyecto:** SOPHIA  
**Nivel:** 2 · Instrumento SOPHIA  
**Versión del documento:** 1.0.0  
**Estado:** Fundacional  
**Ubicación:** `assets/js/sophia/02-instrumento/EVALUATION_REPORT.md`  
**Naturaleza:** Documento metodológico del Instrumento SOPHIA  

---

## 1. Propósito

Este documento define la etapa de **Generación del Informe de Evaluación**, última fase del pipeline del Instrumento SOPHIA. Su función es construir, a partir de todos los artefactos internos consolidados en las etapas anteriores, un documento estructurado —el **Informe de Evaluación**— que presenta de manera completa, trazable y reproducible los resultados de la evaluación de robustez deliberativa de un documento.

La etapa no analiza, no puntúa, no agrega y no interpreta. Transforma el conjunto de registros internos en una representación externa, organizada para ser leída por humanos y verificada por auditores. Responde exclusivamente a la pregunta:

> *¿Cómo se construye el Informe de Evaluación a partir de los artefactos producidos por las etapas anteriores?*

---

## 2. Posición en el flujo metodológico

La Generación del Informe de Evaluación se sitúa al final del pipeline del Instrumento, tras la Puntuación y Agregación:

```

SEMANTIC_INITIALIZATION
↓
ATOM_LOADING
↓
EVIDENCE_COLLECTION
↓
INDICATOR_APPLICATION
↓
ATOM_RESOLUTION
↓
SCORING_AND_AGGREGATION
↓
EVALUATION_REPORT   ← ESTE DOCUMENTO

```

**Entradas (artefactos inmutables):**
- Atom Resolution Registry
- Construct Resolution Registry
- Criterion Resolution Registry
- Score Registry
- Evaluation Summary
- Metadatos del documento evaluado (identificación, versión)
- Metadatos del Instrumento (versiones de ontología, modelo semántico, perfiles, CAAC, reglas de todas las etapas)

**Salida:**
- **Evaluation Report** – documento oficial de evaluación.

---

## 3. Contrato de transformación

La generación del informe se define como una función metodológica pura:

```

EvaluationReport = F_report(
AtomResolutionRegistry,
ConstructResolutionRegistry,
CriterionResolutionRegistry,
ScoreRegistry,
EvaluationSummary,
DocumentMetadata,
InstrumentMetadata,
ReportRules
)

```

Donde:
- Los registros de entrada son los producidos por las etapas previas y tratados como datos inmutables.
- `DocumentMetadata` incluye la identificación del documento original, su naturaleza documental, perfiles activados y confianza de clasificación.
- `InstrumentMetadata` contiene las versiones exactas de todos los artefactos del Nivel 1 y del Nivel 2 que intervinieron en la evaluación.
- `ReportRules` son reglas de composición que determinan la estructura, formato y contenido del informe.

`F_report` **no altera** ninguna de las entradas. Produce un nuevo artefacto —el informe— que las referencia de manera trazable.

---

## 4. Concepto del Informe de Evaluación

El **Informe de Evaluación SOPHIA** es la representación estructurada, inmutable y versionada del resultado de aplicar el Instrumento a un documento. Su función es triple:

1. **Comunicar** el resultado de la evaluación de manera comprensible para lectores humanos.
2. **Proveer trazabilidad** completa hacia los registros internos y, a través de ellos, hacia las evidencias originales.
3. **Servir como objeto de auditoría** para el Nivel 3, permitiendo verificar la corrección del proceso sin necesidad de reejecutarlo.

El informe no contiene nueva evidencia, no reinterpreta observaciones y no modifica resoluciones. Es un documento derivado, construido exclusivamente a partir de los registros consolidados.

---

## 5. Función metodológica de generación del informe

La función `F_report` aplica las reglas de composición (`ReportRules`) sobre los artefactos de entrada para producir un informe que:

- Incluye todos los elementos requeridos por el estándar (según `SOPHIA_STANDARD.md`, Sección 6).
- Conserva la jerarquía de resultados (átomo → constructo → criterio → puntuación → resumen).
- Asocia a cada resultado el identificador del registro que lo originó.
- Es determinista: los mismos datos de entrada y las mismas reglas de composición producen exactamente el mismo informe.
- Es inmutable una vez emitido, aunque puede ser objeto de revisiones que generen nuevas versiones del informe.

---

## 6. Artefacto "Evaluation Report"

El **Evaluation Report** es un artefacto del Nivel 2, de naturaleza documental, que cumple las siguientes propiedades:

- **Inmutabilidad:** una vez generado y firmado, no se modifica. Cualquier corrección o actualización produce una nueva versión.
- **Versionado:** el informe registra su propia versión y las versiones de todos los artefactos que lo componen.
- **Trazabilidad:** contiene identificadores y referencias que permiten a un auditor remontarse a cada átomo, evidencia y regla aplicada.
- **Autocontención:** toda la información necesaria para entender la evaluación está presente en el informe o referenciada de manera no ambigua.

---

## 7. Estructura del Informe

Sin prescribir un formato visual, el Informe de Evaluación SOPHIA debe contener, como mínimo, las siguientes secciones:

1. **Identificación del documento evaluado**  
   Título, autoría, fecha, fuente, versión (si aplica).

2. **Configuración de la evaluación**  
   - Naturaleza documental predominante y secundarias (si las hubiera), con confianza de clasificación.
   - Perfil primario y perfiles complementarios activados.
   - Versión del estándar SOPHIA utilizado.
   - Versiones de ontología (`ONTOLOGY.md`), modelo semántico (`SEMANTIC_MODEL.md`), y de todos los componentes del Instrumento (inicialización semántica, carga de átomos, reglas de resolución, agregación, puntuación y composición del informe).

3. **Resumen de la evaluación**  
   - Puntuación global (si el Instrumento la calcula).
   - Nivel de confianza global de la evaluación.
   - Breve descripción cualitativa del resultado.

4. **Resultados por criterio**  
   Para cada criterio del estándar:
   - Identificador del criterio.
   - Estado agregado del criterio (desde el Criterion Resolution Registry).
   - Puntuación asignada (desde el Score Registry).
   - Confianza del criterio.
   - Referencia al identificador del registro de resolución del criterio y, a través de él, a los constructos y átomos subyacentes.

5. **Desglose por constructo y átomo** (sección de trazabilidad)  
   Para cada constructo y para cada átomo, se incluye:
   - Identificador del átomo o constructo.
   - Estado resuelto y confianza.
   - Referencias a los identificadores del Atom Resolution Registry y del Construct Resolution Registry.

   Esta sección puede presentarse en forma tabular o jerárquica, siempre que mantenga la trazabilidad unívoca.

6. **Metadatos de la evaluación**  
   - Fecha y hora de generación del informe.
   - Identificador único del informe (`Report_ID`).
   - Versión del informe.
   - Firma o identificador del sistema/evaluador que realizó la evaluación.

7. **Anexos y referencias**  
   - Referencias a los registros internos (identificadores de los registries) para auditoría completa.
   - Notas sobre limitaciones detectadas durante la evaluación (por ejemplo, criterios no evaluables, confianza baja en clasificación documental, conflictos sin resolver).

---

## 8. Reglas de composición del informe

Las reglas de composición (`ReportRules`) determinan cómo se estructura y presenta la información. No se definen aquí fórmulas concretas, sino los principios que toda regla de composición debe satisfacer:

1. **Exhaustividad:** El informe debe incluir todos los criterios evaluados, aun aquellos que resultaron no evaluables, indicando explícitamente esa circunstancia.

2. **Trazabilidad de los resultados:** Cada resultado presentado (puntuación, estado, confianza) debe estar vinculado a un identificador único del registro que lo originó (Atom Resolution ID, Construct Resolution ID, Criterion Resolution ID, Score ID).

3. **Preservación de la jerarquía:** La presentación respeta la jerarquía ontológica: átomo → constructo → criterio → puntuación → resumen.

4. **Inmutabilidad de los datos fuente:** El informe no redondea, aproxima ni reinterpreta los valores contenidos en los registros de entrada. Si se requiere una representación abreviada, debe mantenerse la referencia al dato original.

5. **Determinismo en la representación:** La misma entrada produce la misma salida textual, garantizando que dos informes generados a partir de los mismos registros sean idénticos bit a bit (salvo marcas temporales, que deben estar claramente identificadas como metadatos de generación).

6. **Versionado de las reglas de composición:** Las `ReportRules` están versionadas, y el informe registra la versión exacta utilizada.

---

## 9. Lo que esta etapa NO hace

Se declara explícitamente que la Generación del Informe de Evaluación:

- **NO interpreta** evidencias ni observaciones.
- **NO modifica** resoluciones atómicas, de constructo ni de criterio.
- **NO recalcula** puntuaciones ni agregaciones.
- **NO ejecuta** indicadores.
- **NO consulta** nuevamente el documento original.
- **NO altera** ninguno de los artefactos de entrada.
- **NO introduce** juicios de valor adicionales a los ya contenidos en los registros.

Su única responsabilidad es componer un documento estructurado a partir de los resultados consolidados.

---

## 10. Principios metodológicos

**Principio 1 – Determinismo en la generación.**  
Con los mismos artefactos de entrada y las mismas reglas de composición, el informe generado es siempre idéntico (salvo los metadatos dinámicos explícitamente identificados).

**Principio 2 – Inmutabilidad del informe emitido.**  
Una vez emitido, el informe no se modifica. Las correcciones generan una nueva versión, permaneciendo la anterior accesible.

**Principio 3 – Trazabilidad completa.**  
Desde cualquier dato del informe, un auditor puede seguir la cadena de referencias hasta el registro atómico, la evidencia y el texto original.

**Principio 4 – Separación de responsabilidades.**  
La generación del informe está estrictamente separada de la evaluación. Cambios en el formato del informe no afectan a los resultados, y cambios en los resultados no requieren modificar las reglas de composición, solo regenerar el informe.

**Principio 5 – Idempotencia.**  
Ejecutar `F_report` múltiples veces con los mismos argumentos produce el mismo informe, sin efectos acumulativos.

**Principio 6 – Versionado explícito.**  
El informe registra su propia versión y las versiones de todos los artefactos y reglas que intervinieron en su generación.

**Principio 7 – Independencia de implementación.**  
La especificación del informe no prescribe tecnologías de generación, formatos de archivo ni plataformas. Cualquier implementación que produzca un informe conforme a esta especificación es válida.

---

## 11. Garantías arquitectónicas

La arquitectura de esta etapa proporciona las siguientes garantías:

- **Reproducibilidad:** Dos generaciones del informe a partir de los mismos registros y reglas producen el mismo resultado.
- **Trazabilidad completa de la evaluación:** El informe permite reconstruir la cadena que va desde la puntuación global hasta cada fragmento de evidencia, pasando por criterios, constructos y átomos.
- **Auditabilidad externa:** Un auditor puede verificar la corrección del informe sin acceso al sistema que lo generó, simplemente contrastando las referencias con los registros internos.
- **Independencia del pipeline:** La etapa de generación del informe puede modificarse (por ejemplo, para cambiar la presentación) sin afectar a ninguna etapa anterior.
- **Conservación histórica:** Los informes generados se conservan como documentos inmutables, permitiendo comparar evaluaciones realizadas en distintos momentos o con distintas versiones del Instrumento.

---

## 12. Observaciones finales

El Informe de Evaluación es el punto de contacto entre el sistema SOPHIA y sus usuarios, auditores y validadores. Por ello, su construcción no puede ser un acto editorial arbitrario, sino el resultado de aplicar una función determinista sobre los mismos artefactos que garantizan la integridad del proceso. La separación estricta entre el contenido evaluativo —producido por las etapas previas— y su presentación —responsabilidad de esta etapa— asegura que el informe pueda evolucionar en formato sin comprometer la sustancia de la evaluación.

Con este documento se completa la especificación metodológica del Instrumento SOPHIA (Nivel 2). Todas las etapas, desde la configuración semántica inicial hasta la emisión del informe, han sido definidas como transformaciones puras sobre artefactos inmutables, garantizando la trazabilidad, la reproducibilidad y la auditabilidad que constituyen los pilares del proyecto.

---


