
---

ATOM_LOADING.md – Carga y Resolución de Átomos Cognitivos

Proyecto: SOPHIA
Nivel: 2 · Instrumento SOPHIA
Versión del documento: 1.1.0
Estado: Actualizado (consistente con arquitectura vigente)
Ubicación: assets/js/sophia/02-instrumento/ATOM_LOADING.md
Naturaleza: Documento metodológico del Instrumento SOPHIA


---

1. Propósito



Este documento define la etapa de Carga de Átomos Cognitivos del Instrumento SOPHIA. Su función es construir, a partir de los perfiles contextuales activados durante la Configuración Semántica Inicial, el Conjunto Activo de Átomos Cognitivos (CAAC) que será utilizado en todas las etapas posteriores de la evaluación.

La carga de átomos no evalúa documentos, no aplica indicadores y no recopila evidencia. Responde exclusivamente a la pregunta:

Dados los perfiles contextuales activados, ¿qué átomos cognitivos deben participar en esta evaluación y con qué definiciones operacionales?


---

2. Posición en el flujo metodológico



La Carga de Átomos se sitúa inmediatamente después de la Configuración Semántica Inicial y antes de la Recopilación de Evidencia:

SEMANTIC_INITIALIZATION  
    ↓  
ATOM_LOADING   ← ESTE DOCUMENTO  
    ↓  
EVIDENCE_COLLECTION  
    ↓  
INDICATOR_APPLICATION  
    ↓  
...

Entradas (artefactos inmutables):

· Clasificación documental y perfiles contextuales activados (primario y complementarios), generados por SEMANTIC_INITIALIZATION.
· Ontología del sistema (ONTOLOGY.md) y Modelo Semántico (SEMANTIC_MODEL.md), que definen los átomos base, sus rutas y sus posibles perfiles contextuales.

Salida:

· Conjunto Activo de Átomos Cognitivos (CAAC) – artefacto inmutable que contiene todos los átomos que serán utilizados en la evaluación, completamente instanciados con sus definiciones operacionales, indicadores, contraindicadores y reglas interpretativas resueltas.


---

3. Conjunto Activo de Átomos Cognitivos (CAAC)



3.1. Definición

El Conjunto Activo de Átomos Cognitivos (CAAC) es el subconjunto del universo de átomos definidos en la ontología SOPHIA que resulta seleccionado, instanciado y resuelto para una evaluación concreta. Es el inventario completo de entidades evaluativas que el Instrumento utilizará desde la Recopilación de Evidencia hasta la Resolución de Átomos.

El CAAC es un artefacto inmutable: una vez generado, no se modifica durante el resto de la evaluación.

3.2. Propiedades del CAAC

· Determinista: para los mismos perfiles activados y las mismas versiones de ontología y modelo semántico, el CAAC producido es siempre idéntico.
· Trazable: cada átomo del CAAC conserva la ruta desde la que fue cargado y las versiones de las definiciones utilizadas.
· Completo respecto a los perfiles: el CAAC incluye todos los átomos que los perfiles activados definen o referencian, cubriendo todos los criterios del estándar aplicables en esta evaluación.
· Inmutable: ninguna etapa posterior puede modificar el CAAC. Si se detecta un error en la configuración semántica que lo originó, no se corrige el CAAC; se invalida la evaluación completa y se inicia una nueva ejecución del Instrumento desde SEMANTIC_INITIALIZATION.


---

4. Proceso de carga



La construcción del CAAC sigue un proceso determinista basado en los perfiles activados:

1. Seleccionar el perfil primario correspondiente a la naturaleza documental predominante.


2. Seleccionar los perfiles complementarios asociados a naturalezas secundarias significativas (si las hubiera).


3. Recuperar todos los átomos definidos o referenciados por esos perfiles, a partir de la ontología.


4. Resolver la herencia y las prioridades (ver Sección 5), determinando para cada átomo su definición operacional, indicadores y reglas interpretativas finales.


5. Ensamplar el CAAC como un conjunto inmutable de átomos completamente especificados.



Este proceso no involucra interpretación del documento original ni acceso a evidencias; opera exclusivamente sobre las definiciones ontológicas y los perfiles.


---

5. Herencia, perfiles y resolución de definiciones



5.1. Principio de herencia

Los perfiles contextuales heredan del átomo base todas las propiedades que no redefinen explícitamente. Un perfil puede limitarse a especificar aquello que es distintivo de la naturaleza documental que representa, dejando el resto de las propiedades con los valores por defecto del átomo base.

La cadena de herencia es:

Átomo base (definición genérica)  
    ↓  
Perfil contextual (definición especializada)

5.2. Jerarquía de prioridades

Cuando un mismo átomo es referenciado por más de un perfil activo, se aplica la siguiente jerarquía:

1. Perfil primario – máxima prioridad. Sus definiciones prevalecen sobre cualquier otra.


2. Perfil secundario – prioridad intermedia. Sus definiciones pueden aplicarse en segmentos específicos del documento cuando la naturaleza secundaria sea pertinente, pero no pueden contradecir al perfil primario en el marco general de la evaluación.


3. Definición heredada del átomo base – valor por defecto cuando ningún perfil la ha redefinido.



5.3. Resolución de conflictos

Si dos perfiles activos proporcionan definiciones incompatibles para una misma propiedad de un átomo, la jerarquía de prioridades determina cuál prevalece. La resolución es determinista y queda documentada en el registro de carga del átomo. No existen ambigüedades sin resolver en el CAAC.


---

6. Invariantes



Durante la generación del CAAC se mantienen los siguientes invariantes:

1. Inmutabilidad de las entradas. Los perfiles activados y la ontología de referencia no se modifican durante la carga. El proceso es de solo lectura sobre estos artefactos.


2. Determinismo. La función F_load es determinista. Para las mismas entradas, produce el mismo CAAC.


3. Independencia del documento original. La carga de átomos no consulta el documento que será evaluado. Solo utiliza los perfiles activados y la ontología.


4. Completitud respecto a los perfiles. Todos los átomos definidos en los perfiles activados están presentes en el CAAC, ya sea con definiciones propias o heredadas.


5. Unicidad. Cada átomo aparece una sola vez en el CAAC, con una única definición operacional resuelta.




---

7. Relación con otros documentos



· SEMANTIC_INITIALIZATION.md proporciona los perfiles contextuales activados que constituyen la entrada principal de esta etapa.
· ONTOLOGY.md y SEMANTIC_MODEL.md (Nivel 1) definen el universo de átomos base y sus posibles perfiles.
· EVIDENCE_COLLECTION.md consume el CAAC como entrada para determinar para qué átomos debe buscar evidencia en el documento.
· INDICATOR_APPLICATION.md, ATOM_RESOLUTION.md y etapas posteriores también utilizan el CAAC como referencia para conocer los indicadores, reglas interpretativas y definiciones operacionales de cada átomo.


---

8. Lo que esta etapa NO hace



· NO consulta el documento original.
· NO recopila evidencia.
· NO aplica indicadores.
· NO resuelve átomos (en el sentido de integración de observaciones).
· NO modifica los perfiles activados ni la ontología.
· NO permite la reconfiguración del CAAC una vez generado. Si se detecta un error en los perfiles activados, la evaluación en curso se invalida y debe reiniciarse desde SEMANTIC_INITIALIZATION.


---

9. Principios metodológicos



Principio 1 – Determinismo.
Con los mismos perfiles activados y las mismas versiones de ontología, el CAAC generado es siempre idéntico.

Principio 2 – Inmutabilidad del CAAC.
El CAAC es un artefacto inmutable. Ninguna etapa posterior puede modificarlo.

Principio 3 – Trazabilidad.
Cada átomo del CAAC registra la ruta semántica, el perfil del que procede su definición y las versiones de ontología y modelo semántico utilizadas.

Principio 4 – Separación de responsabilidades.
La carga de átomos no interfiere en la recopilación de evidencia, la aplicación de indicadores ni la resolución. Se limita a construir el conjunto de herramientas conceptuales que las etapas posteriores utilizarán.

Principio 5 – Invalidación por error de configuración.
Un error en la Configuración Semántica Inicial no se corrige modificando el CAAC a mitad del pipeline. La evaluación se invalida y se reinicia desde el principio, preservando la integridad del proceso.


---

10. Garantías arquitectónicas



La arquitectura de esta etapa proporciona las siguientes garantías:

· Reproducibilidad: dos ejecuciones con los mismos perfiles y ontología producen exactamente el mismo CAAC.
· Auditabilidad: un auditor puede verificar cada átomo del CAAC contrastándolo con los perfiles activados y la ontología de referencia.
· Inmutabilidad: el CAAC no cambia durante la evaluación. Esta propiedad es esencial para que las etapas posteriores puedan operar sobre una base conceptual estable.
· Independencia de implementación: la especificación no prescribe formatos técnicos ni plataformas.


---

11. Observaciones finales



La Carga de Átomos Cognitivos es el momento en que la arquitectura ontológica de SOPHIA se particulariza para una evaluación concreta. Al generar un CAAC inmutable y determinista, esta etapa establece la base conceptual sobre la que se desarrollará todo el trabajo empírico posterior. Cualquier intento de modificar el CAAC durante la evaluación comprometería la trazabilidad y la reproducibilidad del proceso, y por tanto está excluido por diseño.

La versión actual del documento elimina cualquier noción de reconfiguración semántica interna y establece explícitamente que los errores en la configuración inicial invalidan la evaluación en curso y fuerzan un reinicio completo del Instrumento, en plena coherencia con la arquitectura de funciones puras y artefactos inmutables definida en INSTRUMENT_ARCHITECTURE.md.


---
