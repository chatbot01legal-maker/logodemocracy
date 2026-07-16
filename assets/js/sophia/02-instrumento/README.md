El README actual contiene documentos proyectados que ya fueron absorbidos, términos obsoletos y omite los dos nuevos documentos. Lo reescribo por completo para que coincida exactamente con la arquitectura vigente.

---

README.md – Nivel 2: Instrumento SOPHIA

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.1.0
Estado: Actualizado (consistente con arquitectura vigente)
Ubicación: assets/js/sophia/02-instrumento/README.md
Naturaleza: Documento de navegación arquitectónica del Nivel 2

---

1. Qué es el Instrumento SOPHIA

El Instrumento SOPHIA es el componente del Nivel 2 que operacionaliza el SOPHIA_STANDARD.md. Consiste en un pipeline de etapas metodológicas —cada una definida como una función pura sobre artefactos inmutables— que transforma un documento de entrada en un Informe de Evaluación trazable, reproducible y auditable.

El Instrumento no es un software ni un algoritmo. Es una especificación metodológica que puede implementarse en distintas plataformas, siempre que se respeten los contratos y las propiedades definidas en INSTRUMENT_ARCHITECTURE.md.

---

2. Relación con otros niveles

· Nivel 1 (Estándar): Define qué entidades existen y qué criterios deben evaluarse. El Instrumento toma ese estándar como única fuente normativa y lo traduce en procedimientos.
· Nivel 3 (Auditoría): Verifica que el Instrumento se ha aplicado correctamente, utilizando los artefactos intermedios que el propio Instrumento produce.
· Nivel 4 (Validación): Evalúa empíricamente si el Instrumento, cuando se aplica a documentos reales, produce resultados significativos.

---

3. Documento rector

La arquitectura completa del Instrumento está definida en:

· INSTRUMENT_ARCHITECTURE.md – Constitución del Nivel 2. Establece los principios arquitectónicos, los contratos metodológicos, los invariantes, las propiedades (determinismo, trazabilidad, inmutabilidad, versionado) y las reglas de evolución del Instrumento.

El resto de los documentos describen cada etapa particular del pipeline. Cualquier desarrollo, modificación o auditoría debe realizarse en coherencia con INSTRUMENT_ARCHITECTURE.md.

---

4. Pipeline metodológico

El flujo de evaluación sigue una cadena lineal de etapas. Cada etapa consume artefactos de las etapas anteriores, aplica reglas versionadas y produce un nuevo artefacto sin alterar los previos.

```
Documento Original
        │
        ▼
SEMANTIC_INITIALIZATION
        │
        ▼
ATOM_LOADING
        │
        ▼
EVIDENCE_COLLECTION
        │
        ▼
INDICATOR_APPLICATION
        │
        ▼
ATOM_RESOLUTION
        │
        ▼
SCORING_AND_AGGREGATION
        │
        ▼
EVALUATION_REPORT
```

---

5. Documentos del Nivel 2

Documento Etapa Entrada principal Artefacto producido
INSTRUMENT_ARCHITECTURE.md Arquitectura (no es etapa del pipeline) – –
SEMANTIC_INITIALIZATION.md Configuración Semántica Inicial Documento, Ontología, Modelo Semántico Clasificación documental, perfiles activados
ATOM_LOADING.md Carga de Átomos Perfiles activados, Ontología Conjunto Activo de Átomos Cognitivos (CAAC)
EVIDENCE_COLLECTION.md Recopilación de Evidencia Documento segmentado, CAAC Evidence Registry
INDICATOR_APPLICATION.md Aplicación de Indicadores Evidence Registry, CAAC Observation Registry
ATOM_RESOLUTION.md Resolución de Átomos Observation Registry, CAAC Atom Resolution Registry
SCORING_AND_AGGREGATION.md Puntuación y Agregación Atom Resolution Registry Construct/Criterion Resolution Registries, Scores, Evaluation Summary
EVALUATION_REPORT.md Generación del Informe Todos los registros previos Evaluation Report

---

6. Cómo leer estos documentos

· Si necesita entender qué es el Instrumento y bajo qué reglas opera, comience por INSTRUMENT_ARCHITECTURE.md.
· Si necesita conocer el detalle de una etapa, consulte el documento correspondiente en el orden del pipeline.
· Si necesita auditar una evaluación, siga la cadena de artefactos desde EVALUATION_REPORT.md hacia atrás, utilizando los identificadores de cada registro.

---

7. Observaciones

· Todos los artefactos producidos por el Instrumento son inmutables una vez generados.
· Cada etapa es determinista: con las mismas entradas y reglas, produce siempre la misma salida.
· La trazabilidad es completa: desde cualquier dato del informe final puede llegarse hasta el fragmento original del documento.
· Las reglas de cada etapa están versionadas, permitiendo la comparabilidad entre evaluaciones realizadas en distintos momentos.

---

