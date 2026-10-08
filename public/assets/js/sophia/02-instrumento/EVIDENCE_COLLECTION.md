# EVIDENCE_COLLECTION.md – Recopilación de Evidencia  
  
**Proyecto:** SOPHIA    
**Nivel:** 2 · Instrumento SOPHIA    
**Versión del documento:** 1.0.0    
**Estado:** Fundacional    
**Ubicación:** `assets/js/sophia/02-instrumento/EVIDENCE_COLLECTION.md`    
**Naturaleza:** Documento metodológico del Instrumento SOPHIA    
  
---  
  
## 1. Propósito  
  
Este documento define la etapa de **Recopilación de Evidencia** del Instrumento SOPHIA. Su función es construir, a partir del documento original y del Conjunto Activo de Átomos Cognitivos (CAAC), un **Registro de Evidencias** que contenga todos los fragmentos textuales potencialmente relevantes para la evaluación, debidamente identificados, localizados y asociados a los átomos correspondientes.  
  
La etapa no evalúa, no interpreta, no aplica indicadores y no emite juicio alguno sobre la calidad o suficiencia de la evidencia. Su única responsabilidad es recopilar y organizar referencias textuales trazables que servirán como insumo inmutable para la fase de Aplicación de Indicadores.  
  
Esta etapa responde exclusivamente a la pregunta:  
  
> *¿Qué fragmentos del documento constituyen evidencia relevante para la evaluación posterior?*  
  
---  
  
## 2. Problema metodológico que resuelve  
  
El documento original es un flujo textual continuo, no estructurado en función de los criterios de evaluación. Antes de aplicar indicadores, es necesario identificar, segmentar y vincular aquellas porciones del texto que guardan relación con cada átomo cognitivo activo.  
  
Sin esta etapa, la aplicación de indicadores operaría sobre un espacio textual no delimitado, lo que comprometería la trazabilidad, la reproducibilidad y la auditabilidad de la evaluación. La Recopilación de Evidencia resuelve este problema al transformar el texto en un conjunto finito y estructurado de referencias, cada una asociada a un átomo específico y localizable de manera unívoca.  
  
---  
  
## 3. Concepto de evidencia  
  
### 3.1. Definición  
  
En el marco de SOPHIA, se entiende por **evidencia** todo fragmento del documento original —oración, párrafo, dato, cita, tabla, figura o segmento textual— que, por su contenido y posición, constituye un soporte potencial para la aplicación de uno o varios indicadores definidos en un átomo cognitivo.  
  
La evidencia no es una interpretación ni una valoración. Es el dato textual bruto, preservado en su literalidad, sobre el cual recaerán posteriormente las reglas interpretativas.  
  
### 3.2. Tipos de evidencia admitidos  
  
Sin carácter exhaustivo, el Instrumento reconoce los siguientes tipos de evidencia:  
  
- Oración declarativa.  
- Párrafo argumentativo.  
- Cita textual (interna o externa).  
- Dato numérico o estadístico.  
- Tabla estructurada.  
- Figura o gráfico (referenciado por su ubicación y descripción).  
- Referencia bibliográfica.  
- Segmento discursivo extenso (sección, capítulo, apartado).  
  
El tipo de evidencia se registra como metadato asociado al fragmento.  
  
### 3.3. Unidad mínima de evidencia  
  
La unidad mínima de evidencia es la **oración**, entendida como la menor unidad textual con sentido completo y delimitable sintácticamente. Sin embargo, el Instrumento puede agrupar oraciones contiguas en una misma entrada del Registro cuando formen un bloque argumental indivisible, siempre que se conserve la posibilidad de localizar cada oración individualmente.  
  
---  
  
## 4. Registro de Evidencias  
  
### 4.1. Definición  
  
El **Registro de Evidencias (Evidence Registry)** es el artefacto producido por esta etapa. Consiste en un conjunto estructurado de entradas, cada una de las cuales vincula un fragmento del documento original con uno o varios átomos cognitivos del CAAC, proporcionando los metadatos necesarios para su trazabilidad, localización y posterior procesamiento.  
  
### 4.2. Propiedades del Registro  
  
- **Inmutabilidad:** Una vez generado, el Registro no se modifica. Cualquier ajuste posterior (por ejemplo, descarte de una evidencia) se registra en etapas subsecuentes sin alterar el registro original.  
- **Trazabilidad:** Cada entrada contiene una referencia precisa al documento original (sección, párrafo, oración) que permite a un auditor localizar el fragmento sin ambigüedad.  
- **Completitud respecto al CAAC:** El proceso de recopilación debe cubrir todos los átomos del CAAC para los cuales sea razonable esperar evidencia en el documento, registrando explícitamente los casos en que no se encuentra evidencia para un átomo (ausencia de evidencia como dato).  
- **No redundancia:** Cada fragmento textual se registra una sola vez, aunque pueda estar asociado a múltiples átomos.  
- **Versionado:** El Registro incluye la versión del Instrumento y de las reglas de recopilación utilizadas.  
  
### 4.3. Estructura de una entrada del Registro  
  
Cada entrada del Evidence Registry debe contener, como mínimo:  
  
| Campo | Descripción |  
|-------|-------------|  
| `Evidence_ID` | Identificador único de la entrada de evidencia. |  
| `Atom_IDs` | Lista de identificadores de los átomos del CAAC a los que se asocia esta evidencia. |  
| `Text_Fragment` | Transcripción literal del fragmento. No se admite paráfrasis ni resumen. |  
| `Location` | Ubicación precisa en el documento (sección, párrafo, número de oración o equivalente). |  
| `Evidence_Type` | Tipo de evidencia según la clasificación definida en 3.2. |  
| `Extraction_Confidence` | Grado de confianza con que el Instrumento asocia este fragmento a cada átomo. |  
| `Version` | Versión de las reglas de recopilación y del Instrumento. |  
| `Timestamp` | Momento de extracción. |  
  
---  
  
## 5. Contrato de entrada  
  
La etapa recibe como entradas inmutables:  
  
1. **Documento original segmentado:** El texto del documento, preprocesado en unidades localizables (secciones, párrafos, oraciones) durante la Configuración Semántica Inicial o en una sub-etapa previa.  
2. **CAAC:** Conjunto Activo de Átomos Cognitivos, tal como fue producido por ATOM_LOADING, con sus definiciones operacionales completas.  
3. **Metadatos de configuración:** Perfiles contextuales activados, clasificación documental y confianza de clasificación, heredados de SEMANTIC_INITIALIZATION.  
  
---  
  
## 6. Contrato de salida  
  
La etapa produce un único artefacto:  
  
- **Evidence Registry:** Registro de Evidencias completo, que contiene todas las entradas de evidencia asociadas a átomos del CAAC, así como las declaraciones de ausencia de evidencia para átomos no cubiertos.  
  
---  
  
## 7. Función abstracta de recopilación  
  
La Recopilación de Evidencia se define como una función metodológica pura:

EvidenceRegistry = F_collect(SegmentedDocument, CAAC, CollectionRules)

Donde:  
  
- `SegmentedDocument` es el documento original segmentado en unidades localizables.  
- `CAAC` es el Conjunto Activo de Átomos Cognitivos con sus definiciones operacionales.  
- `CollectionRules` son las reglas de recopilación versionadas que gobiernan la detección de fragmentos relevantes y su asociación a átomos.  
  
**Propiedades de `F_collect`:**  
  
- **Determinista:** Para las mismas entradas y reglas, produce siempre el mismo Evidence Registry.  
- **Pura:** No modifica las entradas ni genera efectos secundarios.  
- **Idempotente:** Ejecutar `F_collect` múltiples veces con los mismos argumentos produce el mismo resultado.  
  
---  
  
## 8. Conservación de referencias al documento original  
  
Cada fragmento registrado conserva una referencia unívoca al documento original mediante su ubicación (sección, párrafo, oración). El documento original permanece inalterado: el Evidence Registry no es una copia modificada del texto, sino un índice estructurado de referencias hacia él.  
  
Esta propiedad es esencial para la trazabilidad: un auditor puede, a partir de un `Evidence_ID`, localizar el fragmento en el documento original y verificar su literalidad.  
  
---  
  
## 9. Relación con la Configuración Semántica Inicial  
  
SEMANTIC_INITIALIZATION determina la naturaleza documental y activa los perfiles contextuales. Estos perfiles condicionan qué átomos se cargan en el CAAC y, por tanto, qué tipos de evidencia son pertinentes. La Recopilación de Evidencia hereda esa configuración y la utiliza para orientar la búsqueda de fragmentos relevantes, pero no la modifica.  
  
---  
  
## 10. Relación con ATOM_LOADING  
  
ATOM_LOADING produce el CAAC, que define el universo de átomos para los cuales debe recopilarse evidencia. La Recopilación de Evidencia recorre el CAAC y asocia fragmentos del documento a los átomos correspondientes. Si un átomo no recibe ninguna evidencia, esa circunstancia se registra explícitamente.  
  
---  
  
## 11. Relación con INDICATOR_APPLICATION  
  
INDICATOR_APPLICATION consume el Evidence Registry como entrada inmutable. Aplica los indicadores definidos en cada átomo sobre las evidencias asociadas, produciendo el Observation Registry. La Recopilación de Evidencia no se reejecuta durante la aplicación de indicadores.  
  
---  
  
## 12. Invariantes  
  
Durante toda la etapa de Recopilación de Evidencia se mantienen los siguientes invariantes:  
  
1. **Inmutabilidad del documento original.** El texto del documento no se modifica, resume ni reescribe.  
2. **Asociación exclusiva a átomos del CAAC.** Ningún fragmento se asocia a un átomo que no esté presente en el CAAC.  
3. **Determinismo de la función.** `F_collect` produce siempre la misma salida para las mismas entradas.  
4. **Independencia de la interpretación.** La evidencia se registra sin evaluar su significado, suficiencia o corrección.  
5. **Trazabilidad completa.** Cada evidencia está vinculada a su ubicación exacta en el documento y a los átomos asociados.  
  
---  
  
## 13. Principios metodológicos  
  
**Principio 1 – Determinismo.**    
Con el mismo documento, el mismo CAAC y las mismas reglas de recopilación, el Evidence Registry es siempre idéntico.  
  
**Principio 2 – Inmutabilidad del registro.**    
Una vez generado, el Evidence Registry no se modifica. Cualquier corrección posterior produce una nueva versión del registro.  
  
**Principio 3 – Trazabilidad.**    
Cada entrada del registro permite localizar el fragmento en el documento original sin ambigüedad.  
  
**Principio 4 – Separación de responsabilidades.**    
La Recopilación de Evidencia está estrictamente separada de la aplicación de indicadores. No los aplica, no los condiciona, no los prejuzga.  
  
**Principio 5 – Completitud.**    
Todos los átomos del CAAC deben ser considerados en la recopilación. La ausencia de evidencia para un átomo se registra como dato.  
  
**Principio 6 – No interpretación.**    
Esta etapa no decide si una evidencia es buena, suficiente o pertinente. Esa determinación corresponde a la aplicación de indicadores.  
  
**Principio 7 – Versionado.**    
El registro incluye la versión de las reglas de recopilación utilizadas.  
  
---  
  
## 14. Lo que esta etapa NO hace  
  
Se declara explícitamente que la Recopilación de Evidencia:  
  
- **NO aplica indicadores.**  
- **NO interpreta** el contenido de los fragmentos.  
- **NO evalúa** la calidad de la evidencia.  
- **NO puntúa** átomos ni criterios.  
- **NO calcula** estados ni confianzas de resolución.  
- **NO modifica** evidencias previamente registradas.  
- **NO agrega** resultados entre átomos.  
- **NO depende** de una implementación tecnológica específica.  
  
---  
  
## 15. Garantías arquitectónicas  
  
La arquitectura de esta etapa proporciona las siguientes garantías:  
  
- **Reproducibilidad:** Dos ejecuciones independientes de `F_collect` con las mismas entradas producen el mismo Evidence Registry.  
- **Auditabilidad:** Un auditor puede verificar cada entrada del registro contrastándola con el documento original.  
- **Paralelización:** La recopilación de evidencia para distintos átomos puede ejecutarse en paralelo sin afectar el resultado.  
- **Independencia de implementación:** La especificación es abstracta y no prescribe tecnologías, formatos ni plataformas.  
  
---  
  
## 16. Observaciones finales  
  
La Recopilación de Evidencia transforma el documento original en un conjunto estructurado de referencias textuales, preparando el terreno para la aplicación sistemática de indicadores. Al mantener esta etapa como una función pura sobre artefactos inmutables, SOPHIA garantiza que la base empírica de la evaluación sea completamente trazable, reproducible y auditable. Sin un Registro de Evidencias sólido, el resto del pipeline carecería de anclaje en el texto original; con él, cada juicio evaluativo puede ser rastreado hasta el fragmento que lo sustenta.  
  
---  

