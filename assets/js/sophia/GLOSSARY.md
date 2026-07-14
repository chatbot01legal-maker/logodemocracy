# GLOSSARY.md

**Proyecto:** SOPHIA
**Nivel:** 1 · Estándar SOPHIA
**Versión del documento:** 1.0.0
**Estado:** Fundacional
**Ubicación:** `assets/js/sophia/01-estandar/GLOSSARY.md`
**Naturaleza:** Glosario normativo del estándar SOPHIA

---

## 1. Propósito del glosario

Este documento establece las definiciones oficiales y vinculantes de los términos fundamentales del Estándar SOPHIA. Forma parte integral del Nivel 1 y constituye la referencia terminológica única para la interpretación del SOPHIA_STANDARD.md y de todos los documentos del proyecto, únicamente en aquello que concierne a la terminología normativa derivada del estándar. Los niveles posteriores podrán incorporar terminología técnica propia de su ámbito de competencia, siempre que esta no modifique, contradiga ni sustituya las definiciones normativas establecidas en el presente glosario.

Las definiciones aquí contenidas tienen carácter **normativo**. Cualquier interpretación del protocolo, cualquier implementación, auditoría o validación realizada en los niveles posteriores deberá ajustarse al significado preciso que este glosario asigna a cada término. En caso de discrepancia entre el uso de un término en un documento técnico y su definición en este glosario, prevalecerá la definición aquí consignada.

La existencia de un glosario normativo desde el Nivel 1 responde a un principio arquitectónico fundamental: **la trazabilidad del razonamiento evaluativo exige que los conceptos sobre los que se asienta el estándar posean un significado estable, explícito y auditables.** Sin esta estabilidad conceptual, ninguna evaluación puede considerarse reproducible ni sometible a escrutinio.

---

## 2. Principios terminológicos

Los siguientes principios rigen la elaboración, interpretación y evolución del presente glosario:

1. **Significado oficial.** Los términos definidos en este documento poseen un significado oficial dentro del proyecto SOPHIA. Este significado no depende de acepciones externas, usos coloquiales ni tradiciones disciplinares ajenas al estándar.

2. **Interpretación vinculante.** La interpretación de cualquier término utilizado en el estándar o en documentos derivados debe realizarse exclusivamente según la definición aquí contenida. No se admite la apelación a usos externos para resolver ambigüedades.

3. **Modificación controlada.** Toda modificación, adición o supresión de una definición deberá seguir la política de versionado del estándar (`VERSIONING.md`). Ningún cambio terminológico puede introducirse sin registro, justificación y trazabilidad.

4. **Estabilidad conceptual.** La estabilidad de las definiciones es requisito para la trazabilidad del protocolo. Las modificaciones frecuentes o no justificadas comprometen la integridad del sistema evaluativo.

5. **Autocontención.** Cada definición debe ser comprensible a partir de los propios términos definidos en este glosario, sin requerir conocimiento externo no explicitado.

6. **Consistencia interna.** Las definiciones no pueden contradecirse entre sí. Toda propuesta de nuevo término debe verificar su compatibilidad con las definiciones existentes.

---

## 3. Alcance terminológico

Este glosario define únicamente:

- términos propios del sistema SOPHIA;
- términos creados específicamente por el protocolo;
- términos externos cuando su ambigüedad pueda afectar la interpretación normativa del estándar.

No pretende reemplazar glosarios técnicos, científicos o disciplinares utilizados en niveles posteriores.

## 4. Definiciones fundamentales

### 4.1. SOPHIA

SOPHIA es un proyecto orientado a la evaluación de la robustez deliberativa de documentos que abordan cuestiones del mundo humano. Su núcleo es un protocolo público, explícito y auditable que especifica las condiciones que debe satisfacer un proceso de razonamiento deliberativo para ser considerado robusto. SOPHIA no certifica la verdad de un documento, ni garantiza la corrección de sus conclusiones: evalúa exclusivamente el grado de conformidad con el Protocolo SOPHIA de Robustez Deliberativa.

El proyecto se organiza en cuatro niveles arquitectónicos —Estándar, Instrumento, Auditoría y Validación— y se rige por una Constitución (`SOPHIA_ARCHITECTURE_v1.md`) que establece la jerarquía normativa, el flujo metodológico y las reglas de gobernanza.

---

### 4.2. Protocolo SOPHIA de Robustez Deliberativa

Conjunto normativo de principios, reglas y criterios que establece cómo se evalúa la robustez deliberativa de un documento. El protocolo define:

- Las condiciones que un documento debe satisfacer para ser considerado evaluable.
- Las dimensiones que serán objeto de evaluación.
- Los criterios que operacionalizan cada dimensión.
- Las reglas de aplicación que rigen la evaluación.

El protocolo es independiente de cualquier implementación concreta. Constituye la especificación pura del estándar, expresada en `SOPHIA_STANDARD.md`. Su modificación sigue el procedimiento definido en `VERSIONING.md` y debe mantener trazabilidad documental completa.

---

### 4.3. Robustez deliberativa

Propiedad de un documento que refleja el grado en que el proceso de razonamiento que lo sustenta satisface las condiciones establecidas por el Protocolo SOPHIA. La robustez deliberativa no equivale a:

- Verdad del contenido.
- Corrección lógica absoluta.
- Consenso social.
- Autoridad del autor.
- Coherencia retórica.

La robustez deliberativa es una propiedad multidimensional, graduable y evaluable mediante criterios explícitos. Un documento puede exhibir alta robustez deliberativa y, sin embargo, contener afirmaciones fácticamente erróneas. Recíprocamente, un documento puede ser veraz y presentar baja robustez deliberativa. La evaluación SOPHIA no se pronuncia sobre la primera cuestión; se limita a la segunda.

La noción de robustez deliberativa se inspira en la analogía fundacional del proyecto: así como la ciencia desarrolló métodos para evaluar la confiabilidad de nuestras observaciones sobre el mundo físico, SOPHIA propone un protocolo para evaluar la confiabilidad de nuestros procesos de razonamiento cuando deliberamos sobre el mundo humano.

---

### 4.4. Estándar SOPHIA

Especificación normativa que contiene la totalidad de los criterios que deben ser implementados por los niveles posteriores. El estándar es la expresión canónica y autoritativa del Protocolo SOPHIA de Robustez Deliberativa.

El estándar:

- Establece los principios que definen la robustez deliberativa.
- Formula los criterios de evaluación de manera explícita y no ambigua.
- Especifica las reglas de aplicación del protocolo.
- Define los requisitos que un documento debe cumplir para ser evaluable.

El estándar no contiene algoritmos, métricas computacionales, constructos operacionales ni instrucciones de implementación. Estos elementos pertenecen al Nivel 2 y deben derivarse del estándar, no sustituirlo ni modificarlo.

El Estándar SOPHIA constituye la **única fuente normativa del proyecto**. Todo criterio utilizado por los niveles posteriores debe poder rastrearse hasta una disposición explícita del estándar.

---

### 4.5. Documento evaluable

Objeto textual, estructurado o no estructurado, que es sometido al Protocolo SOPHIA para la evaluación de su robustez deliberativa.

Un documento es evaluable cuando satisface las condiciones de evaluabilidad establecidas por el Estándar SOPHIA.

La noción de "documento" no se limita a formatos específicos ni a soportes particulares. El estándar define los criterios de evaluabilidad; el Instrumento los operacionaliza.

---

### 4.6. Criterio SOPHIA

Disposición explícita del estándar que establece una condición evaluable en un documento. Un criterio:

- Está formulado en el lenguaje del estándar, no en el de la implementación.
- Admite una determinación de cumplimiento (total, parcial o nulo) mediante procedimientos definidos en el Instrumento.
- Pertenece a una dimensión de la robustez deliberativa.
- Es trazable: toda aplicación del criterio en el Instrumento debe poder referirse unívocamente a la disposición del estándar que lo origina.

Los criterios son las unidades mínimas de evaluación normativa. El estándar los define; el Instrumento los implementa; la Auditoría verifica su correcta implementación; la Validación evalúa su comportamiento empírico.

---

### 4.7. Regla del estándar

Enunciado normativo contenido en el `SOPHIA_STANDARD.md` que establece una obligación, una prohibición o una condición. Las reglas se distinguen de las consideraciones descriptivas o explicativas, las cuales no generan obligaciones de cumplimiento.

Una regla del estándar:

- Impone un requisito evaluable.
- Es vinculante para la implementación.
- Puede ser verificada por la Auditoría.

Una consideración descriptiva, en cambio:

- Proporciona contexto, motivación o ejemplos.
- No impone requisitos.
- No es directamente evaluable.

La distinción entre regla y consideración debe ser clara en el texto del estándar. La Auditoría verifica que el Instrumento no haya tratado consideraciones como reglas ni omitido reglas por confundirlas con consideraciones.

---

### 4.8. Nivel arquitectónico

Cada una de las cuatro capas independientes y jerárquicamente ordenadas en que se organiza el proyecto SOPHIA. La arquitectura de niveles está definida en `SOPHIA_ARCHITECTURE_v1.md` y responde al siguiente esquema:

| Nivel | Nombre | Pregunta que responde |
|-------|--------|------------------------|
| 1 | Estándar SOPHIA | ¿Cuál es el Protocolo SOPHIA de Robustez Deliberativa? |
| 2 | Instrumento SOPHIA | ¿Cómo implementamos computacionalmente el estándar? |
| 3 | Auditoría del Instrumento | ¿El instrumento implementa correctamente el estándar? |
| 4 | Validación del Instrumento | ¿Qué evidencia tenemos de que el instrumento funciona correctamente con documentos reales? |

Cada nivel posee responsabilidades exclusivas, documentos propios y criterios de cierre independientes. La relación entre niveles es estrictamente secuencial y unidireccional: el flujo metodológico canónico es Estándar → Instrumento → Auditoría → Validación, y nunca debe invertirse.

---

### 4.9. Instrumento SOPHIA

Implementación computacional del Estándar SOPHIA. El Instrumento traduce los criterios, reglas y condiciones definidos en el Nivel 1 a un sistema ejecutable capaz de analizar documentos y producir evaluaciones de robustez deliberativa.

El Instrumento:

- Pertenece exclusivamente al Nivel 2.
- Debe mantener trazabilidad completa respecto del estándar.
- No puede crear, modificar ni omitir criterios definidos en el estándar.
- Está sujeto a auditoría (Nivel 3) y validación (Nivel 4).

La presente definición no describe la arquitectura interna del Instrumento, sus algoritmos, sus constructos ni sus métricas. Esos elementos se definen en la documentación propia del Nivel 2.

---

### 4.10. Auditoría SOPHIA

Proceso sistemático, documentado y verificable cuyo objetivo es determinar si el Instrumento SOPHIA implementa correctamente el Estándar SOPHIA. La Auditoría:

- Pertenece exclusivamente al Nivel 3.
- No evalúa documentos, sino el propio Instrumento.
- Verifica la cobertura semántica, la integridad, la consistencia y la trazabilidad de la implementación.
- Puede componerse de auditorías específicas organizadas por dimensiones de implementación.
- Produce evidencia documentada sobre la fidelidad del Instrumento al estándar.

Una auditoría favorable indica que el Instrumento es internamente coherente y está alineado con la especificación normativa. No garantiza que el Instrumento funcione correctamente en la práctica; esa es la tarea de la Validación (Nivel 4).

---

### 4.11. Validación SOPHIA

Proceso sistemático, documentado y verificable cuyo objetivo es evaluar el funcionamiento del Instrumento SOPHIA mediante evidencia empírica obtenida del análisis de documentos reales. La Validación:

- Pertenece exclusivamente al Nivel 4.
- No verifica la fidelidad al estándar (tarea de la Auditoría), sino la calidad de los resultados producidos por el Instrumento.
- Emplea corpus de prueba, documentos de referencia, estudios comparativos y experimentos controlados.
- Produce evidencia acumulada sobre el desempeño del Instrumento en condiciones reales de uso.

La Validación constituye la validación científica del Instrumento. Una validación favorable proporciona confianza razonable en que el Instrumento produce evaluaciones significativas, estables y reproducibles.

---

### 4.12. Trazabilidad normativa

Propiedad del sistema SOPHIA por la cual toda decisión del Instrumento —todo resultado, toda puntuación, toda clasificación— puede vincularse de manera verificable a una disposición explícita del Estándar SOPHIA.

La trazabilidad normativa es una exigencia arquitectónica y metodológica. Garantiza que:

- Ningún resultado de SOPHIA es arbitrario.
- Toda evaluación puede ser auditada en sus fundamentos normativos.
- Las discrepancias entre evaluaciones pueden resolverse remitiéndose al estándar, no a preferencias del implementador.

La Auditoría (Nivel 3) tiene entre sus funciones principales verificar que el Instrumento satisface el requisito de trazabilidad normativa.

---

### 4.13. Versión del estándar

Estado identificado, documentado e inmutable del `SOPHIA_STANDARD.md` en un momento dado de su evolución. Cada versión:

- Posee un identificador único conforme a la política definida en `VERSIONING.md`.
- Está acompañada de un registro de cambios en `CHANGELOG.md`.
- Puede ser referenciada de manera inequívoca por los niveles posteriores.
- Determina la base normativa contra la cual se audita y valida el Instrumento.

El versionado del estándar permite que el proyecto evolucione sin perder la capacidad de reconstruir el fundamento normativo de evaluaciones pasadas.

---

## 5. Términos excluidos de este glosario

El presente glosario define exclusivamente la terminología propia del sistema SOPHIA y aquellos términos cuya ambigüedad comprometería la interpretación del estándar. No es un glosario general de epistemología, filosofía, metodología científica, inteligencia artificial ni disciplinas afines.

En particular, este documento **no define**:

- Conceptos epistemológicos generales (verdad, justificación, creencia, conocimiento).
- Categorías psicológicas (sesgo, heurístico, razonamiento motivado).
- Métricas computacionales (precisión, exhaustividad, puntuación F).
- Algoritmos, estructuras de datos o patrones de implementación.
- Constructos operacionales del Instrumento (átomos cognitivos, vectores de características, modelos de evaluación).
- Parámetros técnicos (umbrales, pesos, constantes de calibración).
- Tecnologías, plataformas o lenguajes de programación.

Estos elementos pertenecen a los niveles 2, 3 y 4, y serán definidos en sus respectivas documentaciones. Su inclusión en este glosario violaría el principio arquitectónico de separación entre estándar e implementación.

---

## 6. Evolución terminológica

El presente glosario no es estático. La evolución del proyecto, la experiencia acumulada en la aplicación del estándar y los hallazgos de la auditoría y la validación pueden motivar la necesidad de nuevas definiciones o la modificación de las existentes.

Toda modificación terminológica deberá:

1. **Registrarse** en `CHANGELOG.md`, indicando el término afectado, la naturaleza del cambio y la versión resultante.
2. **Justificarse** mediante evidencia o razonamiento documentado. No se admiten modificaciones arbitrarias o puramente estilísticas.
3. **Mantener trazabilidad**, vinculando el cambio a la disposición del estándar que lo motiva o al hallazgo empírico que lo recomienda.
4. **Respetar la política de versionado** definida en `VERSIONING.md`, incluyendo la evaluación del impacto sobre los niveles posteriores (¿requiere reauditoría? ¿requiere revalidación?).

La incorporación de nuevos términos sigue el mismo procedimiento. Ningún término puede emplearse en el estándar sin estar definido previamente en este glosario o ser introducido simultáneamente con su definición oficial.

La estabilidad conceptual es un valor del proyecto. Las modificaciones deben equilibrar la necesidad de precisión con el principio de mínima perturbación: un término bien definido no debe modificarse sin una razón sustantiva.

---

**Versión:** 1.0.0
**Fecha:** [A completar al momento de la aprobación]
**Próximo documento en el flujo del Nivel 1:** `VERSIONING.md`

