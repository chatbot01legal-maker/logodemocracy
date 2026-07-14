
VERSIONING.md

Proyecto: SOPHIA
Nivel: 1 · Marco Normativo SOPHIA
Versión del documento: 1.0.0
Estado: Fundacional
Ubicación: assets/js/sophia/01-estandar/VERSIONING.md
Naturaleza: Política oficial de versionado del Estándar SOPHIA

---

1. Propósito

Este documento establece la política oficial de versionado del Estándar SOPHIA. Define las reglas que rigen la creación, modificación, aprobación, identificación y retirada de versiones del SOPHIA_STANDARD.md, así como los procedimientos que garantizan la trazabilidad de todos los cambios y la estabilidad normativa del proyecto.

La existencia de una política de versionado explícita es condición necesaria para la integridad metodológica de SOPHIA. Sin ella, la evolución del estándar carecería de control, las evaluaciones realizadas con distintas versiones no serían comparables y la trazabilidad normativa —pilar del sistema— resultaría imposible.

---

2. Alcance

Esta política se aplica exclusivamente al SOPHIA_STANDARD.md y a los documentos normativos que forman parte del Nivel 1 en tanto puedan verse afectados por modificaciones del estándar:

· SOPHIA_STANDARD.md
· GLOSSARY.md
· VERSIONING.md (este mismo documento)
· CHANGELOG.md

No se aplica a los documentos de control del nivel (README.md, CHECKLIST.md, CIERRE.md), cuya modificación sigue el procedimiento general de gobernanza pero no constituye un cambio en el estándar propiamente dicho.

---

3. Principios de versionado

1. Inmutabilidad de versiones publicadas. Una versión del estándar, una vez aprobada y publicada, no puede ser modificada. Cualquier cambio, por mínimo que sea, genera una nueva versión.
2. Identificación permanente. Toda versión posee un identificador único que la distingue de cualquier otra, presente o futura. Ese identificador permite referenciarla de manera inequívoca desde cualquier nivel del proyecto.
3. Trazabilidad completa. Todo cambio entre versiones debe estar documentado en CHANGELOG.md, con indicación de qué se modificó, por qué se modificó, qué evidencia o razonamiento motivó la modificación y qué impacto tiene sobre los niveles posteriores.
4. Modificación controlada. Ningún cambio al estándar puede realizarse sin seguir el procedimiento definido en este documento. Las modificaciones informales, no documentadas o no aprobadas según el procedimiento carecen de validez normativa.
5. Compatibilidad evaluada. Toda nueva versión debe incluir una evaluación explícita de su compatibilidad con versiones anteriores, indicando si las evaluaciones realizadas con versiones previas mantienen o no su validez.
6. Publicidad. Todas las versiones del estándar son públicas y accesibles. El historial completo de versiones permanece disponible como parte del repositorio documental del proyecto.

---

4. Numeración de versiones

El Estándar SOPHIA utiliza numeración semántica de tres niveles: MAYOR.MENOR.REVISIÓN.

4.1. Formato

```
v<MAYOR>.<MENOR>.<REVISIÓN>
```

Ejemplo: v2.1.0

4.2. Significado de cada nivel

MAYOR: Se incrementa cuando se introduce una modificación sustantiva que:

· altera los principios fundamentales del protocolo;
· añade, elimina o redefine dimensiones de evaluación;
· modifica el alcance de la robustez deliberativa;
· cambia las condiciones de evaluabilidad de los documentos;
· produce incompatibilidad con versiones anteriores.

Un cambio de versión mayor requiere reauditoría completa (Nivel 3) y revalidación completa (Nivel 4).

MENOR: Se incrementa cuando se introduce una modificación acotada que:

· añade criterios sin eliminar ni redefinir los existentes;
· refina la redacción de reglas sin alterar su significado evaluativo;
· incorpora aclaraciones o especificaciones que no modifican el núcleo normativo;
· actualiza el glosario con nuevos términos que no afectan a las definiciones existentes.

Un cambio de versión menor requiere reauditoría parcial (solo de los criterios afectados) y revalidación parcial.

REVISIÓN: Se incrementa cuando se introducen correcciones que no afectan al contenido normativo:

· corrección de erratas tipográficas;
· ajustes de formato o numeración;
· mejoras de redacción que no alteran el significado;
· actualizaciones de referencias cruzadas internas.

Un cambio de revisión no requiere reauditoría ni revalidación, aunque debe quedar registrado.

4.3. Reglas de precedencia

· Una nueva versión mayor implica que la versión menor y la revisión vuelven a 0 (ejemplo: v2.0.0).
· Una nueva versión menor implica que la revisión vuelve a 0 (ejemplo: v1.3.0).
· La versión inicial fundacional es v1.0.0.

---

5. Procedimiento para proponer modificaciones

Toda propuesta de modificación del estándar debe seguir el siguiente procedimiento:

1. Formulación de la propuesta. La propuesta debe presentarse por escrito, identificando:
   · Disposición(es) del estándar afectada(s).
   · Naturaleza del cambio (adición, modificación, eliminación).
   · Justificación razonada del cambio.
   · Evidencia o argumentos que lo sustentan.
   · Evaluación preliminar del impacto sobre los niveles 2, 3 y 4.
   · Evaluación preliminar de compatibilidad con versiones anteriores.
2. Registro de la propuesta. La propuesta se registra con un identificador único, que permitirá su seguimiento hasta la resolución definitiva.
3. Análisis de impacto. La autoridad de Arquitectura Conceptual definida por la gobernanza del proyecto evalúa la propuesta y elabora un análisis de impacto que incluye:
   · Compatibilidad con los principios del estándar.
   · Consistencia con el resto del protocolo.
   · Consecuencias para el Instrumento (Nivel 2).
   · Consecuencias para la Auditoría (Nivel 3).
   · Consecuencias para la Validación (Nivel 4).
   · Necesidad de modificar el glosario.

---

6. Procedimiento de revisión

Una vez registrada y analizada, la propuesta entra en fase de revisión:

1. Revisión por Implementación. La función de Implementación evalúa la viabilidad técnica del cambio propuesto y su impacto sobre el Instrumento existente. Emite un informe no vinculante pero que debe ser considerado por la Arquitectura conceptual.
2. Revisión por Auditoría. La función de Auditoría evalúa la coherencia del cambio con el resto del estándar y su impacto sobre los procedimientos de auditoría existentes. Emite un informe con observaciones y recomendaciones.
3. Revisión abierta. Si la Arquitectura conceptual lo considera necesario, la propuesta puede someterse a revisión por parte de la comunidad del proyecto durante un plazo determinado.

---

7. Procedimiento de aprobación

La aprobación de una modificación del estándar requiere:

1. Resolución de la Arquitectura conceptual. La autoridad de Arquitectura Conceptual definida por la gobernanza del proyecto emite una resolución motivada que aprueba o rechaza la propuesta. La resolución debe responder a todos los informes recibidos durante la fase de revisión.
2. Aprobación por las tres funciones. La modificación debe ser aprobada por:
   · Arquitectura conceptual (aprobación de fondo).
   · Implementación (aprobación de viabilidad).
   · Auditoría (aprobación de coherencia).
   La falta de aprobación de cualquiera de las tres funciones impide la adopción del cambio.
3. Actualización documental. Aprobada la modificación, se actualizan:
   · SOPHIA_STANDARD.md con la nueva versión.
   · GLOSSARY.md si la modificación afecta a definiciones existentes o introduce nuevos términos.
   · CHANGELOG.md con el registro completo del cambio.
   · VERSIONING.md si la política de versionado misma ha sido modificada.
4. Publicación. La nueva versión se publica con su identificador único y queda inmediatamente disponible como versión vigente del estándar.

---

8. Compatibilidad hacia atrás

Toda nueva versión del estándar debe incluir una declaración explícita sobre su compatibilidad con versiones anteriores, clasificándola en una de las siguientes categorías:

· Totalmente compatible: Las evaluaciones realizadas con versiones anteriores mantienen su plena validez. Las modificaciones son aclaratorias o aditivas sin afectar criterios existentes.
· Parcialmente compatible: Algunas evaluaciones anteriores pueden requerir revisión. Se especifican las disposiciones afectadas y el alcance de la afectación.
· Incompatible: Las evaluaciones anteriores no pueden considerarse válidas bajo la nueva versión. Se requiere revaluación completa de los documentos afectados.

Esta declaración es vinculante para los niveles posteriores y determina el alcance de la reauditoría y revalidación requeridas.

---

9. Trazabilidad documental

La trazabilidad documental de las modificaciones del estándar se garantiza mediante:

1. Identificador único de propuesta. Cada propuesta de modificación recibe un identificador que la vincula con todos los documentos generados durante su tramitación.
2. CHANGELOG.md. Registro cronológico de todas las versiones del estándar, con indicación de los cambios introducidos, su justificación y su impacto.
3. Historial de versiones. Todas las versiones del SOPHIA_STANDARD.md permanecen accesibles en el repositorio documental del proyecto.
4. Referencias desde niveles posteriores. El Instrumento, la Auditoría y la Validación deben referenciar siempre la versión del estándar contra la cual fueron desarrollados o ejecutados.

---

10. Relación con CHANGELOG.md

CHANGELOG.md es el documento complementario de VERSIONING.md. Mientras este documento define las reglas, CHANGELOG.md registra los hechos. Toda modificación del estándar que genere una nueva versión debe quedar registrada en CHANGELOG.md con el siguiente contenido mínimo:

· Versión resultante.
· Fecha de publicación.
· Tipo de cambio (mayor, menor, revisión).
· Disposiciones afectadas.
· Resumen del cambio.
· Justificación.
· Evaluación de compatibilidad.
· Impacto sobre niveles posteriores.
· Identificador de la propuesta que lo originó.

La ausencia de registro en CHANGELOG.md invalida formalmente la versión correspondiente.

---

11. Impacto sobre Auditoría y Validación

La publicación de una nueva versión del estándar activa obligatoriamente una evaluación de impacto sobre los niveles 3 y 4:

· Cambios de versión mayor: requieren reauditoría completa del Instrumento (Nivel 3) y revalidación completa (Nivel 4).
· Cambios de versión menor: requieren reauditoría de los criterios afectados y revalidación parcial.
· Cambios de revisión: no requieren reauditoría ni revalidación, aunque la función de Auditoría puede recomendar verificaciones adicionales si lo considera necesario.

Hasta que la reauditoría y revalidación requeridas no hayan sido completadas satisfactoriamente, la nueva versión del estándar se considera vigente pero no operativa: es la referencia normativa, pero no puede ser utilizada para realizar evaluaciones oficiales.

---

12. Reglas para retirar versiones

Una versión del estándar puede ser retirada en los siguientes casos:

· Detección de error grave: Se identifica un error en el contenido normativo que compromete la validez de las evaluaciones realizadas con dicha versión.
· Inconsistencia interna: Se demuestra que el estándar contiene contradicciones que impiden su aplicación consistente.
· Inaplicabilidad sobrevenida: Circunstancias externas hacen que el estándar no pueda ser aplicado en los términos previstos.

El procedimiento de retirada sigue los mismos pasos que el de modificación, culminando con la publicación de una resolución motivada que declara la versión como retirada. Una versión retirada no se elimina del repositorio: permanece accesible con la anotación de "RETIRADA" y la fecha y motivo de la retirada.

---

13. Reglas para marcar versiones obsoletas

Una versión del estándar se considera obsoleta cuando ha sido sustituida por una versión posterior. La obsolescencia no implica retirada: una versión obsoleta sigue siendo válida para evaluaciones realizadas durante su período de vigencia.

Las versiones obsoletas deben:

· Permanecer accesibles en el repositorio.
· Incluir una indicación de la versión que las sustituye.
· Conservar su identificador único.

---

14. Principios metodológicos

1. El estándar es público en todas sus versiones. No existen versiones privadas, provisionales o de circulación restringida.
2. Cada versión es un documento completo. No se publican "diffs" como sustitutos del texto completo de la nueva versión.
3. La estabilidad es un valor. Las modificaciones frecuentes erosionan la confianza en el estándar. Toda propuesta de cambio debe ponderar el beneficio de la modificación frente al coste de la inestabilidad.
4. La trazabilidad es irrenunciable. Ninguna modificación puede introducirse sin el registro documental completo que exige esta política.
5. La evolución es deliberada, no accidental. El estándar cambia cuando existe una razón sustantiva para hacerlo, documentada y aprobada según el procedimiento aquí definido.

---

15. Cierre

Esta política de versionado constituye el marco procedimental que gobierna la evolución del Estándar SOPHIA. Su cumplimiento no es opcional: es condición de validez de cualquier versión del estándar que pretenda ser reconocida como tal por el proyecto.

La propia política de versionado está sujeta a sus propias reglas. Cualquier modificación de este documento debe seguir el mismo procedimiento que se aplica al estándar, generando una nueva versión del mismo y quedando registrada en CHANGELOG.md.

---

