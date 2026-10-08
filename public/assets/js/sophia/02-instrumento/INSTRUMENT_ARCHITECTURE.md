
---

INSTRUMENT_ARCHITECTURE.md – Arquitectura del Instrumento SOPHIA

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.0.1
Estado: Fundacional (revisado)
Ubicación: assets/js/sophia/02-instrumento/INSTRUMENT_ARCHITECTURE.md
Naturaleza: Documento arquitectónico normativo del Instrumento SOPHIA

---

1. Propósito

Este documento constituye la arquitectura normativa del Instrumento SOPHIA. Es, para el Nivel 2, lo que SOPHIA_ARCHITECTURE_v1.md es para el proyecto completo: la especificación fundacional que define qué es el Instrumento, cómo se organiza, qué componentes lo integran, bajo qué contratos opera y qué propiedades garantiza.

Todo desarrollo, implementación, auditoría o modificación del Instrumento debe ser coherente con lo aquí dispuesto. Este documento no describe el pipeline operativo —eso corresponde a los documentos de cada etapa—, sino la arquitectura que gobierna la existencia, composición y evolución de dicho pipeline.

---

2. Alcance del Instrumento

El Instrumento SOPHIA define exclusivamente la metodología de evaluación de la robustez deliberativa. No define la ontología conceptual del sistema —eso corresponde al Nivel 1 (Estándar)—, no establece los procedimientos de auditoría —eso corresponde al Nivel 3—, ni prescribe una implementación tecnológica específica. Su dominio es la transformación de un documento de entrada en un Informe de Evaluación trazable, mediante una secuencia de etapas metodológicas con contratos explícitos.

Cualquier elemento ajeno a esa responsabilidad —criterios normativos, procedimientos de verificación, validación empírica, tecnologías de implementación— pertenece a otros niveles del proyecto y no es definido por este documento.

---

3. Definición del Instrumento SOPHIA

El Instrumento SOPHIA es el componente del Nivel 2 que operacionaliza el SOPHIA_STANDARD.md. Consiste en un conjunto estructurado de etapas metodológicas, cada una definida como una función pura sobre artefactos inmutables, que transforma un documento de entrada en un Informe de Evaluación trazable, reproducible y auditable.

El Instrumento no es un software, ni un algoritmo, ni un modelo de inteligencia artificial. Es una especificación metodológica que puede ser implementada en distintas plataformas, siempre que se respeten los contratos y las propiedades aquí definidas.

Responde a la pregunta:

¿Cómo se evalúa la robustez deliberativa de un documento de manera objetiva, reproducible y trazable?

---

4. Propósito del Instrumento

El Instrumento SOPHIA tiene por finalidad:

1. Operacionalizar el estándar, traduciendo cada criterio del SOPHIA_STANDARD.md en un procedimiento evaluativo concreto.
2. Garantizar la consistencia entre evaluaciones, minimizando la variabilidad atribuible al juicio no documentado del evaluador.
3. Producir resultados trazables, donde cada juicio evaluativo pueda ser vinculado a una evidencia textual y a un criterio del estándar.
4. Permitir la auditoría externa, proporcionando artefactos intermedios que hagan posible verificar la corrección del proceso sin reejecutarlo.
5. Ser reproducible, de modo que dos aplicaciones independientes del Instrumento sobre el mismo documento, con las mismas reglas, produzcan el mismo resultado.

---

5. Principios arquitectónicos

El Instrumento se rige por los siguientes principios arquitectónicos, que son vinculantes para todas sus etapas:

1. Determinismo. Cada etapa es una función determinista: para las mismas entradas, produce siempre la misma salida. No existe ningún componente probabilístico, aleatorio o dependiente del contexto de ejecución.
2. Inmutabilidad de artefactos. Los artefactos producidos por cada etapa no se modifican una vez generados. Cualquier ajuste produce una nueva versión del artefacto, conservando la anterior.
3. Trazabilidad completa. Desde el Informe de Evaluación final debe poder reconstruirse la cadena completa de transformaciones hasta el documento original, pasando por todos los registros intermedios.
4. Reproducibilidad. Dos ejecuciones independientes del Instrumento con las mismas entradas y las mismas versiones de reglas producen resultados idénticos.
5. Separación de responsabilidades. Cada etapa tiene una responsabilidad exclusiva y consume únicamente artefactos de etapas anteriores, sin modificarlos. Ninguna etapa realiza tareas que correspondan a otra.
6. Versionado explícito. Todo artefacto registra la versión de las reglas que lo produjeron y las versiones de los artefactos que consumió. Esto permite la comparabilidad entre evaluaciones realizadas en distintos momentos.
7. Independencia de implementación. La especificación del Instrumento es abstracta. No prescribe lenguajes, plataformas, arquitecturas de software ni tecnologías concretas.

---

6. Componentes del Instrumento

El Instrumento se compone de las siguientes etapas, cada una definida como una función metodológica pura:

Etapa Documento Función abstracta Artefacto producido
Configuración Semántica Inicial SEMANTIC_INITIALIZATION.md F_init(Document, Ontology, SemanticModel) Clasificación documental, perfiles activados
Carga de Átomos ATOM_LOADING.md F_load(Profiles, Ontology) Conjunto Activo de Átomos Cognitivos (CAAC)
Recopilación de Evidencia EVIDENCE_COLLECTION.md F_collect(Document, CAAC, CollectionRules) Evidence Registry
Aplicación de Indicadores INDICATOR_APPLICATION.md F_indicators(EvidenceRegistry, CAAC, IndicatorRules) Observation Registry
Resolución de Átomos ATOM_RESOLUTION.md F_resolve(ObservationRegistry, CAAC, ResolutionRules) Atom Resolution Registry
Puntuación y Agregación SCORING_AND_AGGREGATION.md F_aggregate(AtomResolutions, AggregationRules, ScoringRules) Artefactos de agregación y puntuación (Construct Resolution Registry, Criterion Resolution Registry, Score Registry, Evaluation Summary)
Generación del Informe EVALUATION_REPORT.md F_report(AllRegistries, ReportRules) Evaluation Report

Cada etapa:

· Consume exclusivamente artefactos de etapas anteriores o datos de configuración inicial.
· Aplica reglas versionadas explícitas.
· Produce uno o más artefactos de salida.
· No modifica sus entradas.
· Es determinista e idempotente.

---

7. Artefactos del Instrumento

El Instrumento produce los siguientes artefactos, organizados según la etapa que los genera:

1. Clasificación documental y perfiles activados – Resultado de la Configuración Semántica Inicial.
2. CAAC (Conjunto Activo de Átomos Cognitivos) – Conjunto de átomos instanciados con sus definiciones operacionales resueltas.
3. Evidence Registry – Registro de fragmentos textuales asociados a átomos.
4. Observation Registry – Registro de resultados de aplicar indicadores a las evidencias.
5. Atom Resolution Registry – Registro de resoluciones atómicas consolidadas.
6. Artefactos de agregación y puntuación – La etapa de Puntuación y Agregación produce uno o más artefactos internos, que incluyen el Construct Resolution Registry, el Criterion Resolution Registry, el Score Registry y el Evaluation Summary. La agrupación concreta de estos artefactos puede variar entre implementaciones, siempre que se preserve la trazabilidad completa.
7. Evaluation Report – Informe de evaluación completo.

Cada artefacto es inmutable una vez generado, está versionado, y conserva referencias a los artefactos que lo originaron.

---

8. Flujo de información y contratos metodológicos

El flujo de información sigue una cadena lineal estricta:

```
Documento Original
    ↓
[Configuración Semántica Inicial] → Clasificación, Perfiles
    ↓
[Carga de Átomos] → CAAC
    ↓
[Recopilación de Evidencia] → Evidence Registry
    ↓
[Aplicación de Indicadores] → Observation Registry
    ↓
[Resolución de Átomos] → Atom Resolution Registry
    ↓
[Puntuación y Agregación] → Construct/Criterion Registries, Scores, Summary
    ↓
[Generación del Informe] → Evaluation Report
```

El contrato metodológico entre etapas es:

· Cada etapa hereda todos los artefactos de las etapas anteriores.
· Cada etapa consume únicamente los artefactos que constituyen su entrada declarada.
· Cada etapa produce un artefacto nuevo sin alterar los previos.
· Ninguna etapa puede saltar hacia atrás para modificar o reinterpretar una decisión de una etapa anterior.

---

9. Invariantes arquitectónicos

Los siguientes invariantes deben preservarse en cualquier implementación del Instrumento:

1. Secuencialidad estricta. El orden de las etapas es fijo. No pueden introducirse nuevas etapas sin modificar formalmente esta arquitectura y versionar el Instrumento en consecuencia.
2. Inmutabilidad de artefactos previos. Ninguna etapa modifica un artefacto producido por una etapa anterior. Las correcciones se realizan generando nuevas versiones de los artefactos, nunca sobrescribiendo.
3. Unicidad de producción. Cada tipo de artefacto es producido por una única etapa. No hay dos etapas que generen el mismo tipo de artefacto.
4. Trazabilidad granular. Desde cualquier dato del Informe de Evaluación, es posible reconstruir el camino completo hasta el fragmento del documento original que lo sustenta.
5. Determinismo global. El Instrumento en su conjunto es determinista. Dos ejecuciones con las mismas entradas producen el mismo resultado final.
6. Independencia de artefactos coetáneos. La producción de artefactos de una misma etapa para distintos átomos, constructos o criterios puede realizarse en cualquier orden o en paralelo sin afectar la corrección.

---

10. Propiedades del Instrumento

El Instrumento SOPHIA garantiza las siguientes propiedades:

10.1. Determinismo

Cada etapa es determinista. El Instrumento completo lo es por composición: F_instrument = F_report ∘ F_aggregate ∘ F_resolve ∘ F_indicators ∘ F_collect ∘ F_load ∘ F_init.

10.2. Trazabilidad

Existe una cadena ininterrumpida de referencias desde el Evaluation Report hasta el documento original, pasando por cada registro intermedio. Cada eslabón está identificado y versionado.

10.3. Reproducibilidad

El determinismo garantiza la reproducibilidad. Un auditor con acceso a las mismas reglas versionadas puede reejecutar el Instrumento (o cualquier etapa aislada) y obtener exactamente los mismos resultados.

10.4. Versionado

Cada artefacto registra las versiones de las reglas y de los artefactos de entrada. Esto permite comparar evaluaciones realizadas con distintas versiones del Instrumento y reconstruir el estado del sistema en cualquier momento pasado.

10.5. Inmutabilidad

Todos los artefactos son inmutables una vez producidos. Las correcciones generan nuevas versiones sin destruir las anteriores. El historial completo de la evaluación es preservado.

10.6. Separación de responsabilidades

Cada etapa tiene una responsabilidad exclusiva. Esta separación permite auditar, modificar o reimplementar una etapa sin afectar al resto, siempre que se respete su contrato de entrada/salida.

---

11. Límites entre el Nivel 2 y el Nivel 3

El Nivel 2 (Instrumento) y el Nivel 3 (Auditoría) tienen responsabilidades diferenciadas:

· El Nivel 2 construye y ejecuta el Instrumento. Define las etapas, las reglas y los contratos. Produce artefactos.
· El Nivel 3 audita el Instrumento y sus resultados. Verifica que las reglas se aplicaron correctamente, que los contratos se respetaron y que los artefactos son consistentes entre sí y con el estándar.

El Nivel 2 proporciona los artefactos que el Nivel 3 utiliza como objeto de auditoría. El Nivel 3 no modifica el Instrumento ni sus artefactos: señala desviaciones, propone correcciones y emite juicios de conformidad.

---

12. Evolución del Instrumento

El Instrumento está sujeto a evolución controlada. Las modificaciones pueden afectar a:

· La estructura del pipeline (añadir, eliminar o reorganizar etapas).
· Las reglas de una etapa (cambios en las reglas de recopilación, indicadores, resolución, agregación, puntuación o composición del informe).

Toda modificación debe:

1. Ser documentada y justificada.
2. Respetar los principios arquitectónicos y los invariantes definidos en este documento.
3. Mantener la compatibilidad hacia atrás o declarar explícitamente la ruptura y sus consecuencias.
4. Generar una nueva versión del Instrumento y de los artefactos afectados.
5. Ser sometida a auditoría (Nivel 3) para verificar que no introduce inconsistencias.

El versionado del Instrumento sigue una política análoga a la del estándar: cambios mayores que alteran la estructura del pipeline o la semántica de los resultados incrementan la versión mayor; cambios en reglas específicas sin alterar la arquitectura incrementan la versión menor; correcciones que no afectan resultados incrementan la revisión.

---

13. Observaciones finales

El Instrumento SOPHIA es la materialización metodológica del estándar. Su arquitectura —un pipeline de funciones puras sobre artefactos inmutables— no es un capricho formal, sino la condición de posibilidad de la trazabilidad, la reproducibilidad y la auditabilidad que el proyecto exige.

Cada etapa, cada artefacto, cada invariante ha sido diseñado para que la evaluación de la robustez deliberativa no descanse en la autoridad del evaluador ni en la opacidad de un algoritmo, sino en reglas explícitas, públicas y verificables. Este documento constituye la referencia normativa de ese diseño. Cualquier implementación, presente o futura, deberá medirse contra él.

---

Versión: 1.0.1
Fecha: [A completar al momento de la aprobación]
Próximo documento relacionado: Documentos de especificación de cada etapa del pipeline (ya existentes) y documentación del Nivel 3 (Auditoría).
