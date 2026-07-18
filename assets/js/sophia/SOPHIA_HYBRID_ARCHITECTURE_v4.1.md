SOPHIA_HYBRID_ARCHITECTURE_v4.1.md – Arquitectura Híbrida del Sistema SOPHIA

Proyecto: SOPHIA
Versión del documento: 4.1
Estado: Fundacional (con enmienda de estados de verificación)
Naturaleza: Documento arquitectónico de la arquitectura híbrida Sophia Engine V4 + Gemini

---

1. Propósito

Este documento define la arquitectura híbrida del sistema SOPHIA en su versión 4.1. Establece la separación formal entre la evaluación de robustez deliberativa (a cargo del motor determinista Sophia Engine V4) y la verificación de afirmaciones factuales (orquestada por Gemini con acceso a fuentes externas). Especifica los roles, los límites, las entidades de datos y las garantías de cada capa, asegurando que ningún componente invada responsabilidades ajenas ni comprometa la auditabilidad del sistema.

Este documento no contiene implementaciones concretas, prompts ni código. Es la especificación normativa sobre la cual se construirán los módulos correspondientes.

---

2. Alcance

La arquitectura 4.1 introduce una capa independiente de Auditoría Factual (también denominada Verificación de Afirmaciones) que complementa la evaluación estructural sin modificarla. El alcance incluye:

· La definición formal de afirmación verificable (claim).
· La clasificación de afirmaciones según su naturaleza (factual, estadística, normativa, etc.).
· Los estados posibles de verificación.
· La delimitación estricta de responsabilidades: el motor determinista, el extractor de afirmaciones, el verificador y el integrador narrativo.
· La separación de los resultados en dos dimensiones independientes: Robustez Deliberativa (IRD) y Confiabilidad Factual.

No forma parte de esta especificación la implementación de herramientas de búsqueda concretas, la integración con bases de datos externas, ni los mecanismos de persistencia.

---

3. Principio fundacional: Separación de dimensiones evaluativas

La arquitectura 4.1 se asienta sobre un principio epistemológico irreversible:

La calidad del razonamiento y la veracidad de sus premisas son dimensiones distintas. Mezclarlas en un solo indicador oculta información crítica y compromete la transparencia.

Por tanto, SOPHIA produce dos evaluaciones independientes:

1. Índice de Robustez Deliberativa (IRD): mide la calidad estructural del razonamiento según los criterios del protocolo. No juzga si las afirmaciones son verdaderas.
2. Confiabilidad Factual: refleja el resultado de contrastar las afirmaciones verificables del documento con fuentes de autoridad. Es una capa complementaria, no subordinada al IRD, y nunca lo modifica.

Ambos juicios se presentan en paralelo, permitiendo al ciudadano entender si un documento está bien argumentado, si se apoya en hechos contrastados, o ambas cosas.

---

4. Visión general de la arquitectura

```
Documento de entrada
       │
       ├─── Sophia Engine V4 ────────────► IRD, fases, evidencias estructurales
       │         (determinista, sin acceso a fuentes externas)
       │
       └─── Pipeline de Auditoría Factual
                │
                ├─ 1. Extracción de afirmaciones (Gemini, rol restringido)
                ├─ 2. Clasificación y filtrado de verificabilidad
                ├─ 3. Verificación (orquestada por Gemini, ejecutada con herramientas de búsqueda)
                └─ 4. Integración narrativa (Gemini, solo lectura de ambos resultados)
```

La salida final es un documento híbrido que contiene el análisis estructural inmutable y la capa de confiabilidad factual, con una interpretación integrada que respeta la independencia de las fuentes.

---

5. Definiciones fundamentales

5.1. Afirmación verificable (claim)

Un claim es un enunciado declarativo extraído del documento original que puede ser evaluado en términos de su correspondencia con hechos, datos o registros externos. No todas las afirmaciones de un texto son claims.

5.2. Tipos de afirmaciones

La clasificación determina si un claim es susceptible de verificación:

· Factual simple: afirma un hecho concreto y objetivo. Ej.: “La temperatura media aumentó 2 °C”.
· Estadístico: involucra cifras o magnitudes. Ej.: “El 70% de los encuestados prefiere la opción A”.
· Histórico: refiere a un evento o estado del pasado.
· Científico: invoca una relación causal o un principio validado por la ciencia.
· Normativo: expresa un deber ser, un valor o un juicio moral. No es verificable empíricamente. Ej.: “La libertad es una condición necesaria para la democracia”.
· Predictivo: anticipa un estado futuro. Puede ser verificable en principio pero no en el presente.
· Metadiscursivo: comenta el propio discurso o la forma de argumentar, sin afirmar un hecho externo.

Solo las categorías factual, estadística, histórica y científica (con condiciones) pueden someterse a verificación. Las normativas, predictivas no verificables en el momento y metadiscursivas reciben el estado no_aplicable.

5.3. Estados de verificación (sección enmendada)

La verificación de un claim puede resultar en uno de los siguientes cinco estados mutuamente excluyentes:

Estado Icono Significado
Verificado ✅ Existe un consenso suficiente entre fuentes confiables que respalda el claim.
Refutado ❌ Existe evidencia convergente de fuentes confiables que demuestra que el claim es falso. No se trata de una opinión aislada, sino de un acuerdo entre múltiples fuentes de autoridad.
Evidencia en conflicto ⚠️ Existen fuentes confiables que llegan a conclusiones distintas o presentan datos contradictorios entre sí. El sistema no puede determinar cuál tiene razón porque el desacuerdo reside en la realidad disponible, no en un error del documento.
Evidencia insuficiente ❓ No se encontró evidencia suficiente para corroborar ni para refutar el claim. El sistema realizó la búsqueda pero no halló fuentes que permitan una conclusión.
No aplicable ⚪ El claim no puede verificarse empíricamente por su naturaleza (normativo, moral, valorativo, metadiscursivo, predictivo no realizable).

Reglas de asignación:

1. Un claim solo puede recibir el estado verificado o refutado si existe consenso suficiente entre las fuentes consultadas. El umbral de consenso será definido en la especificación del verificador.
2. Si existen al menos dos fuentes confiables que presentan datos o conclusiones contradictorias, y ninguna cuenta con una autoridad claramente superior reconocida, el estado es evidencia en conflicto. Este es un estado final válido, no un error del sistema.
3. Si la búsqueda retorna resultados pero ninguno permite corroborar ni refutar el claim, o si las fuentes encontradas no alcanzan el umbral de confiabilidad, el estado es evidencia insuficiente.
4. El estado no_aplicable se asigna sin realizar búsqueda, basándose exclusivamente en la clasificación del claim.

---

6. Capa 1: Sophia Engine V4

El motor determinista permanece inalterado en su funcionamiento. Es el dueño absoluto del análisis estructural y del cálculo del IRD. Sus responsabilidades son:

· Clasificar la naturaleza documental.
· Activar átomos cognitivos y aplicar criterios.
· Detectar infracciones a la robustez deliberativa.
· Generar el registro de evidencias estructurales (fragmentos textuales vinculados a átomos).
· Calcular el IRD y las puntuaciones por fase.

Sophia Engine V4 no accede a fuentes externas, no verifica la verdad de los enunciados y no recibe realimentación de la capa factual.

6.1. Artefacto de salida (resumen)

```
{
  "IRD_global": 95,
  "fases": [...],
  "evidencias": [
    {
      "criterion": "2.2",
      "atom": "ATOMO_CAUSALIDAD",
      "text": "...",
      "penalty": 25
    }
  ],
  ...
}
```

Las “evidencias” en este contexto son fragmentos textuales que soportan la aplicación de un criterio, no verificaciones de verdad. Para evitar confusiones, en la nueva arquitectura se empleará el término evidencia estructural para referirse a este concepto.

---

7. Capa 2: Extracción de afirmaciones (Gemini, rol restringido)

Un módulo independiente (claimExtractor) utiliza Gemini con un prompt fuertemente restrictivo para:

· Identificar enunciados declarativos con pretensión de factualidad.
· Extraer el texto literal de cada afirmación.
· Asignar un tipo según la taxonomía de la Sección 5.2.
· Determinar si la afirmación es verificable (sí/no) según su tipo.

Gemini no evalúa la verdad de ninguna afirmación en esta etapa. Su salida es exclusivamente una lista estructurada de claims.

7.1. Contrato de entrada/salida

· Entrada: texto completo del documento.
· Salida: arreglo de objetos {claim_text, tipo, verificable}.

---

8. Capa 3: Auditoría Factual – Verificación

8.1. Responsable

Un módulo orquestador que, por cada claim marcado como verificable: true:

1. Genera una consulta de búsqueda (query) adecuada al tipo y contenido del claim.
2. Ejecuta la búsqueda a través de fuentes autorizadas (bases de datos estadísticas, literatura científica, archivos de medios, etc.).
3. Evalúa el resultado y asigna el estado correspondiente según la taxonomía de la Sección 5.3, adjuntando la URL y una cita breve de cada fuente relevante.

Gemini puede participar en la generación de la query y en la evaluación del resultado, pero nunca puede inventar la fuente ni decidir un estado sin referencia externa. Si no se encuentra una fuente, el estado es evidencia insuficiente; si las fuentes son contradictorias, el estado es evidencia en conflicto. No existe el estado "probablemente verificado".

8.2. Claims no aplicables

Los claims con verificable: false (normativos, predictivos no realizables, metadiscursivos) reciben automáticamente el estado no_aplicable y no pasan por el motor de búsqueda.

8.3. Registro de verificación

El resultado de esta capa es un objeto confiabilidad_factual que contiene:

· Lista de claims verificados, cada uno con fuente.
· Lista de claims refutados, cada uno con fuente.
· Lista de claims con evidencia en conflicto, cada uno con las fuentes contradictorias.
· Lista de claims con evidencia insuficiente.
· Lista de claims no aplicables.

Ningún campo de este registro afecta al cálculo del IRD.

---

9. Capa 4: Integración y narración (Gemini)

Una vez que Sophia Engine V4 ha producido el análisis estructural y la capa factual ha completado su verificación, un módulo integrador (Gemini) recibe ambos resultados y genera:

· interpretacion_semantica: interpretación de los resultados del motor.
· explicacion_usuario: explicación en lenguaje ciudadano del IRD y de la confiabilidad factual.
· observaciones: señalamientos sobre la relación entre ambas dimensiones, sin modificar ninguna.
· preguntas_reflexivas: preguntas para la reflexión del lector.

Gemini en esta etapa no modifica, corrige ni suaviza los datos numéricos ni las clasificaciones. Su salida es un campo separado (gemini_review) que se añade a la respuesta final.

---

10. Esquema de la respuesta final del sistema

La API devolverá una estructura con dos bloques principales y la narrativa integrada:

```
{
  "protocol_version": "4.0",
  "local": {
    // Resultado inmutable de Sophia Engine V4
    "IRD_global": 95,
    "fases": [...],
    "evidencias": [...]    // evidencia estructural
  },
  "confiabilidad_factual": {
    "claims_verificados": [...],
    "claims_refutados": [...],
    "claims_en_conflicto": [...],
    "claims_evidencia_insuficiente": [...],
    "claims_no_aplicables": [...]
  },
  "gemini_review": {
    "interpretacion_semantica": "...",
    "explicacion_usuario": "...",
    "observaciones": "...",
    "preguntas_reflexivas": [...]
  }
}
```

La interfaz de usuario deberá mostrar ambas dimensiones por separado. No se fusionarán en un único puntaje.

---

11. Límites y autoridades

Capa Dueño de No puede
Sophia Engine V4 Clasificación documental, IRD, fases, evidencia estructural Verificar hechos, acceder a fuentes externas
Claim Extractor (Gemini) Extraer y tipificar afirmaciones Evaluar verdad, asignar estados de verificación
Auditoría Factual (Orquestador + Gemini) Verificar claims con fuentes, asignar estados (verificado/refutado/evidencia en conflicto/evidencia insuficiente/no aplicable) Modificar IRD, reinterpretar átomos, inventar fuentes, forzar una decisión cuando las fuentes son inconclusas
Integrador (Gemini) Narrar resultados de ambas capas Alterar valores numéricos, decidir qué se muestra

---

12. Invariantes arquitectónicos (sección enmendada)

1. Independencia del IRD: El IRD no puede ser modificado por ninguna capa externa al motor determinista.
2. Inmutabilidad de la evidencia estructural: Los fragmentos textuales asociados a átomos no son reinterpretados ni descartados por la capa factual.
3. Trazabilidad de fuentes: Todo claim verificado o refutado debe incluir al menos una referencia externa verificable. Todo claim con evidencia en conflicto debe incluir las fuentes contradictorias que generan el conflicto.
4. No invención de verdad: Gemini nunca asigna verificado o refutado sin fuentes recuperadas. La ausencia de evidencia obliga a evidencia insuficiente.
5. Honestidad epistémica ante el conflicto: evidencia en conflicto es un estado final válido, no un error. El sistema no debe forzar una decisión cuando la realidad disponible no la respalda.
6. Separación terminológica: Se reserva el término evidencia (a secas) para la evidencia estructural del motor. La verificación factual utiliza los términos claim, verificación y confiabilidad factual.

---

13. Relación con el resto de la arquitectura SOPHIA

Este documento extiende la arquitectura definida en INSTRUMENT_ARCHITECTURE.md y AUDIT_ARCHITECTURE.md sin contradecirlos. La capa factual se alinea con el Nivel 3 (Auditoría) en tanto verifica un aspecto externo (la correspondencia con hechos), mientras que el motor V4 permanece en el Nivel 2. El integrador y el extractor son componentes del Nivel 2 que colaboran con el Nivel 3 bajo contratos estrictos.

---

14. Evolución prevista

La arquitectura 4.1 habilita la futura incorporación de:

· Múltiples fuentes de verificación (bases de datos abiertas, APIs institucionales).
· Mecanismos de ponderación de fuentes y umbrales de consenso configurables.
· Un índice de confiabilidad factual compuesto, si se considera necesario, siempre separado del IRD.

Estas ampliaciones no requerirán modificar el motor determinista ni romper la separación de dimensiones aquí establecida.

---
