SEMANTIC_MODEL.md – Modelo Semántico Formal SOPHIA

Proyecto: SOPHIA
Nivel: 1 · Estándar SOPHIA
Versión del documento: 1.0.0
Estado: Fundacional
Ubicación: assets/js/sophia/01-estandar/SEMANTIC_MODEL.md
Naturaleza: Documento arquitectónico fundacional – Modelo de representación semántica


---

1. Propósito

Este documento establece el modelo semántico formal de SOPHIA: la especificación estructurada de cómo se representan las entidades definidas en la ontología del sistema para que puedan ser comprendidas, aplicadas, auditadas y, eventualmente, implementadas en sistemas computacionales.

Mientras ONTOLOGY.md responde a la pregunta ¿qué entidades existen en SOPHIA y cómo adquieren su identidad?, el presente documento responde a la pregunta:

> ¿Cómo se representa una entidad semántica SOPHIA de manera estructurada, completa y trazable?



SEMANTIC_MODEL.md no define nuevos criterios de evaluación, no asigna puntuaciones, no especifica algoritmos y no contiene código. Su función es exclusivamente representacional: constituye el puente entre la arquitectura conceptual del Nivel 1 y la futura implementación instrumental del Nivel 2.


---

## 2. Modelo de identidad semántica SOPHIA

### 2.1. Axioma de identidad

El modelo parte del siguiente axioma:

> *Una entidad SOPHIA no está definida por su nombre, sino por la combinación de identidad semántica, ruta arquitectónica, contexto documental y reglas operacionales asociadas.*

La consecuencia inmediata es que el significante lingüístico —la palabra que nombra la entidad— es un componente necesario pero insuficiente de la identidad. La identidad completa reside en la agregación estructurada de todos los elementos que sitúan la entidad en el sistema.

---

### 2.2. Principio de no equivalencia semántica contextual

Del axioma anterior se deriva el siguiente principio metodológico:

> *Dos entidades SOPHIA que compartan el mismo significante lingüístico no deben considerarse semánticamente equivalentes mientras difieran en alguno de los componentes que constituyen su identidad operacional.*

En consecuencia, la equivalencia entre entidades no puede establecerse únicamente sobre la coincidencia del nombre del átomo cognitivo o del término utilizado en el lenguaje natural.

La identidad operacional depende de la combinación completa de los siguientes elementos:

- Ruta semántica.
- Tipo de entidad.
- Perfil contextual.
- Relaciones con otras entidades.
- Definición operacional.
- Reglas interpretativas.
- Versión de la entidad.

La modificación de cualquiera de estos componentes genera una entidad operacional diferente, aunque el significante lingüístico permanezca idéntico.

Por ello, afirmaciones como:

> *"Ambos documentos hablan de causalidad."*

carecen de significado metodológico dentro de SOPHIA.

La formulación correcta es:

> *"Ambos documentos activan el mismo átomo cognitivo contextualizado."*

Sólo en ese caso puede afirmarse que dos entidades poseen equivalencia semántica operacional.

Este principio constituye uno de los mecanismos fundamentales mediante los cuales SOPHIA reduce la ambigüedad inherente al lenguaje natural y hace posible una evaluación trazable, reproducible y auditable.

---

### 2.3. Composición de la identidad

Formalmente, la identidad de una entidad SOPHIA se compone de cinco elementos:

```
Entidad SOPHIA =
Ruta semántica
+ Tipo de entidad
+ Contexto
+ Relaciones
+ Definición operacional
```

Donde:

- **Ruta semántica:** posición de la entidad en la arquitectura del sistema, expresada según la sintaxis definida en la Sección 6.
- **Tipo de entidad:** clase ontológica a la que pertenece (dimensión, criterio, constructo, átomo cognitivo, indicador, etc.).
- **Contexto:** perfil contextual activado por la naturaleza del documento evaluado.
- **Relaciones:** vínculos explícitos con otras entidades del sistema (pertenencia, asociación, modulación, detección).
- **Definición operacional:** especificación del significado evaluativo de la entidad en ese contexto.

---

### 2.4. Ejemplo de identidad completa

**Incorrecto (identidad nominal):**

```
Causalidad
```

**Correcto (identidad relacional completa):**

```
SOPHIA
└── Nivel 2
    └── Dimensión: Inferencia
        └── Criterio 2.2: Causalidad Rigurosa
            └── Constructo: Nexo causal
                └── Átomo base: causalidad
                    └── Perfil: artículo científico
                        └── Átomo contextualizado: causalidad_científica
```

La primera forma es ambigua y no evaluable. La segunda constituye una entidad operacional completa, cuya identidad puede ser interpretada, aplicada y auditada sin ambigüedad dentro del sistema SOPHIA.


---

3. Modelo jerárquico de entidades

3.1. Jerarquía formal

El sistema SOPHIA organiza sus entidades en la siguiente jerarquía de representación:

Sistema SOPHIA
│
└── Nivel arquitectónico
│
└── Dimensión
│
└── Criterio
│
└── Constructo
│
└── Átomo base (entidad abstracta)
│
└── Perfil contextual
│
└── Átomo contextualizado (entidad evaluable)
│
├── Indicadores
├── Contraindicadores
├── Evidencias
└── Reglas interpretativas

3.2. Distinción entre niveles de concreción

El modelo distingue tres niveles de concreción para cada entidad atómica:

Entidad abstracta (átomo base): Define la clase general y su posición en la arquitectura. No es directamente evaluable. Ejemplo: causalidad como átomo base en la ruta SOPHIA.N2.INFERENCIA.CRI-2.2.

Entidad contextualizada (átomo con perfil): Resulta de aplicar un perfil contextual al átomo base. Posee definición operacional, pero aún no ha sido aplicada a un documento concreto. Ejemplo: causalidad perfil artículo científico.

Entidad evaluable (átomo aplicado): Resulta de la aplicación del átomo contextualizado a un documento específico. Incluye evidencia textual y determinación de satisfacción. Pertenece al dominio del Instrumento (Nivel 2) y del informe de evaluación.



---

4. Modelo formal del átomo cognitivo

4.1. Definición

Un átomo cognitivo es la unidad mínima de representación semántica evaluable dentro del sistema SOPHIA. No representa una palabra del lenguaje natural, sino una entidad operacional contextualizada, completamente especificada en todos los campos requeridos por el modelo.

4.2. Estructura mínima obligatoria

Todo átomo cognitivo definido en SOPHIA debe contener los siguientes campos:

Campo	Descripción	Ejemplo

Atom_ID	Identificador único del átomo contextualizado	SOPHIA.N2.INF.CRI-2.2.CAUSALIDAD.PROFILE_CIENTIFICO
Ruta semántica	Ruta completa desde SOPHIA hasta el átomo base	SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD
Nombre del significante	Significante lingüístico asociado	Causalidad
Tipo de átomo	Clase ontológica	cognitive_atom
Criterio asociado	Referencia al criterio del estándar	CRI-2.2
Constructo asociado	Referencia al constructo	Nexo causal
Contexto documental	Perfil contextual activado	Artículo científico
Definición operacional	Significado evaluativo en ese contexto	Texto descriptivo preciso
Indicadores	Señales observables de satisfacción	Lista estructurada
Contraindicadores	Señales que contraindican satisfacción	Lista estructurada
Reglas interpretativas	Instrucciones para la decisión evaluativa	Texto procedimental
Versión	Versión del átomo según política de versionado	1.0.0


Un átomo que carezca de cualquiera de estos campos es un átomo incompleto y no puede ser utilizado en una evaluación oficial SOPHIA.


---

5. Modelo átomo base / perfil contextual

5.1. Principio de separación

El modelo semántico de SOPHIA separa formalmente dos niveles de representación para cada entidad atómica:

Átomo base: Entidad abstracta que define la estructura conceptual general asociada a un criterio del estándar. No es directamente evaluable. Contiene la ruta semántica, el tipo de entidad y las relaciones estructurales con otras entidades.

Perfil contextual: Implementación concreta del átomo base para una categoría documental específica. Contiene la definición operacional, los indicadores, los contraindicadores y las reglas interpretativas.


5.2. Ejemplo de perfiles contextuales

Átomo base: SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD


---

Perfil: Artículo científico

Definición operacional: Relación entre variables donde se establece un mecanismo causal respaldado por evidencia empírica, con control de variables alternativas y consideración de temporalidad.

Indicadores: presencia de hipótesis causal explícita; identificación de variable independiente y dependiente; mención de mecanismo causal; control de variables confusoras; evidencia empírica o referencias a estudios; consideración de dirección temporal.

Contraindicadores: atribución causal sin evidencia; confusión entre correlación y causalidad; omisión de variables alternativas plausibles.

Reglas interpretativas: evaluar presencia y calidad de cada indicador; la omisión de mecanismo o de control de alternativas reduce el nivel de satisfacción; la presencia de contraindicadores sin abordaje explícito impide la satisfacción plena.



---

Perfil: Discurso político

Definición operacional: Estructura de atribución causal utilizada para asignar responsabilidad, explicar situaciones o justificar cursos de acción, con atención a la evidencia invocada y a las simplificaciones realizadas.

Indicadores: presencia de atribuciones causales explícitas; identificación de agentes causales; invocación de evidencia (datos, ejemplos, fuentes); reconocimiento de complejidad o multicausalidad.

Contraindicadores: atribución causal sin fundamento; simplificación extrema (causa única para fenómeno complejo); atribución interesada sin evidencia; omisión de factores causales evidentes.

Reglas interpretativas: evaluar si las atribuciones causales están respaldadas por algún tipo de evidencia; la presencia de simplificaciones no invalida automáticamente si se reconocen como tales; la atribución interesada sin fundamento reduce significativamente la satisfacción.



---

El mismo átomo base genera entidades operacionales distintas según el perfil contextual activado.


---

6. Modelo de rutas semánticas

6.1. Sintaxis oficial

La ruta semántica de una entidad SOPHIA se expresa mediante la siguiente sintaxis normalizada:

SOPHIA.{NIVEL}.{DIMENSION}.{CRITERIO}.{ATOMO_BASE}.PROFILE_{PERFIL}

6.2. Especificación de segmentos

Segmento	Significado	Formato	Ejemplo

SOPHIA	Sistema raíz	Fijo	SOPHIA
{NIVEL}	Nivel arquitectónico	N1, N2, N3, N4	N2
{DIMENSION}	Dimensión del estándar	Nombre normalizado en mayúsculas	INFERENCIA
{CRITERIO}	Criterio del estándar	CRI-X.Y según numeración del estándar	CRI-2.2
{ATOMO_BASE}	Nombre del átomo base	Nombre normalizado en mayúsculas	CAUSALIDAD
PROFILE_{PERFIL}	Perfil contextual	PROFILE_ seguido del nombre del perfil en mayúsculas	PROFILE_ARTICULO_CIENTIFICO


6.3. Ejemplos de rutas completas

SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD.PROFILE_ARTICULO_CIENTIFICO
SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD.PROFILE_DISCURSO_POLITICO
SOPHIA.N2.FUNDAMENTOS.CRI-1.1.SUPUESTOS.PROFILE_ENSAYO_FILOSOFICO
SOPHIA.N2.COHERENCIA.CRI-5.1.NO_CONTRADICCION.PROFILE_OPINION

6.4. Reglas de formación

1. Todos los segmentos son obligatorios. Una ruta incompleta no identifica una entidad válida.


2. Los segmentos se separan por punto (.).


3. Los nombres de dimensiones, átomos base y perfiles se escriben en mayúsculas, sin espacios, con guiones bajos como sustitutos de espacios.


4. El perfil contextual se introduce con el prefijo fijo PROFILE_.


5. La ruta es inmutable para una versión dada de la entidad. Si la entidad cambia de posición en la arquitectura, se trata de una entidad diferente.




---

7. Modelo relacional

7.1. SOPHIA como grafo semántico

El sistema SOPHIA debe ser entendido, desde el punto de vista representacional, como un grafo semántico dirigido donde:

Los nodos son entidades del sistema (dimensiones, criterios, constructos, átomos base, átomos contextualizados, indicadores).

Las aristas son relaciones tipificadas que vinculan unas entidades con otras.


7.2. Tipos de relaciones

El modelo reconoce las siguientes relaciones canónicas:

Relación	Significado	Dirección

pertenece_a	Una entidad es parte de una entidad de nivel superior	Átomo → Dimensión
evalúa	Un átomo contextualizado operacionaliza un criterio	Átomo contextualizado → Criterio
modulado_por	Un átomo contextualizado es activado por un perfil contextual	Átomo contextualizado → Perfil
detecta	Un indicador señala la presencia de un fenómeno	Indicador → Fenómeno
contraindica	Un contraindicador señala la ausencia o negación	Contraindicador → Fenómeno
referencia	Una entidad remite a otra por relación conceptual	Entidad → Entidad
hereda_de	Un perfil contextual hereda estructura del átomo base	Perfil → Átomo base


7.3. Ejemplo de grafo relacional

Causalidad (átomo base)
│
├── pertenece_a → Inferencia (dimensión)
├── evalúa → CRI-2.2 (criterio)
│
└── modulado_por → Artículo científico (perfil)
│
└── Causalidad_científica (átomo contextualizado)
├── detecta → Mecanismo causal explícito
├── detecta → Control de variables
├── contraindica → Confusión correlación/causalidad
└── referencia → Evidencia empírica (otro átomo)


---

8. Representación computacional conceptual

8.1. Propósito

Esta sección presenta, con fines exclusivamente conceptuales, una posible estructura de representación para las entidades SOPHIA. No constituye una implementación, ni prescribe un formato técnico concreto. Su función es ilustrar cómo la especificación semántica definida en este documento puede traducirse a una estructura de datos comprensible para un sistema computacional.

8.2. Estructura conceptual de representación

{
"atom_id": "SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD.PROFILE_ARTICULO_CIENTIFICO",
"type": "cognitive_atom",
"version": "1.0.0",
"base": {
"atom_name": "CAUSALIDAD",
"route": "SOPHIA.N2.INFERENCIA.CRI-2.2.CAUSALIDAD"
},
"profile": {
"profile_name": "ARTICULO_CIENTIFICO",
"document_type": "scientific_article"
},
"semantic_identity": {
"dimension": "INFERENCIA",
"criterion": "CRI-2.2",
"construct": "Nexo causal"
},
"operational_definition": "Relación entre variables donde se establece un mecanismo causal respaldado por evidencia empírica, con control de variables alternativas y consideración de temporalidad.",
"indicators": [
"Presencia de hipótesis causal explícita",
"Identificación de variable independiente y dependiente",
"Mención de mecanismo causal",
"Control de variables confusoras",
"Evidencia empírica o referencias a estudios",
"Consideración de dirección temporal"
],
"counter_indicators": [
"Atribución causal sin evidencia",
"Confusión entre correlación y causalidad",
"Omisión de variables alternativas plausibles"
],
"interpretation_rules": [
"Evaluar presencia y calidad de cada indicador",
"La omisión de mecanismo o de control de alternativas reduce el nivel de satisfacción",
"La presencia de contraindicadores sin abordaje explícito impide la satisfacción plena"
],
"relations": {
"belongs_to": "INFERENCIA",
"evaluates": "CRI-2.2",
"modulated_by": "PROFILE_ARTICULO_CIENTIFICO",
"detects": ["Mecanismo causal explícito", "Control de variables"],
"references": ["Evidencia empírica"]
}
}

Esta representación es puramente ilustrativa. La implementación real en el Nivel 2 podrá adoptar cualquier formato —JSON, YAML, estructuras de base de datos, grafos— siempre que preserve íntegramente la semántica aquí especificada.


---

9. Principios de integridad semántica

El modelo semántico de SOPHIA se rige por los siguientes principios de integridad:

Principio 1 – Identidad relacional.
Dos entidades con el mismo nombre de significante pueden ser entidades distintas si difieren en su ruta semántica o en su perfil contextual. La identidad reside en la agregación de todos los campos, no en el nombre aislado.

Principio 2 – Modulación contextual.
Cambiar el contexto documental puede cambiar la entidad operacional resultante. Un átomo base con perfil artículo científico y el mismo átomo base con perfil discurso político son entidades diferentes, con definiciones operacionales, indicadores y reglas potencialmente distintos.

Principio 3 – Integridad de ruta.
Eliminar un segmento de la ruta semántica produce pérdida de significado y puede hacer que la entidad deje de ser evaluable. Una ruta incompleta no identifica una entidad válida en el sistema.

Principio 4 – Trazabilidad.
Toda evaluación realizada por el Instrumento debe poder rastrearse hasta la entidad semántica que la originó. El atom_id completo —incluyendo ruta, átomo base y perfil contextual— debe figurar en el informe de evaluación.

Principio 5 – Inmutabilidad de versión.
Una entidad identificada por un atom_id y una versión es inmutable. Cualquier modificación en su definición operacional, indicadores o reglas interpretativas genera una nueva versión de la entidad.


---

10. Relación con niveles posteriores

El modelo semántico definido en este documento establece las condiciones de representación que gobiernan la relación entre los cuatro niveles arquitectónicos:

Nivel 1 (Estándar): Define las entidades (ONTOLOGY.md) y su modelo de representación (SEMANTIC_MODEL.md). Especifica qué campos debe contener cada entidad y cómo se expresa su identidad.

Nivel 2 (Instrumento): Implementa las entidades conforme al modelo. Crea los átomos contextualizados, define sus indicadores y reglas interpretativas, y los aplica a documentos concretos. Utiliza los identificadores y rutas definidos en este modelo.

Nivel 3 (Auditoría): Verifica que las entidades implementadas en el Nivel 2 respetan el modelo semántico: que los atom_id son correctos, que los perfiles contextuales están definidos para todos los átomos aplicables, y que las definiciones operacionales son completas.

Nivel 4 (Validación): Evalúa empíricamente si las entidades, tal como han sido representadas e implementadas, producen resultados consistentes y significativos.



---

11. Observaciones finales

El modelo semántico aquí definido no es un ejercicio de formalización abstracta, sino la condición de posibilidad de la trazabilidad, la auditabilidad y la implementación consistente del sistema SOPHIA. Cada campo especificado, cada regla de formación de rutas, cada relación tipificada tiene por finalidad garantizar que una entidad SOPHIA pueda ser identificada sin ambigüedad, aplicada de manera reproducible y auditada en su integridad.

Este documento completa, junto con ONTOLOGY.md, el núcleo arquitectónico del Nivel 1. Sobre esta base podrá edificarse el Instrumento (Nivel 2) con la certeza de que cada entidad que lo compone posee una identidad precisa, una representación normalizada y una trazabilidad garantizada.


---

Versión: 1.0.0
Fecha: [A completar al momento de la aprobación]
Próximo paso en el flujo del Nivel 1: Cierre formal del nivel mediante CHECKLIST.md y CIERRE.md
