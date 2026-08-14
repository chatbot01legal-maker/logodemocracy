ESPECIFICACIÓN FUNCIONAL DEL INSTRUMENTO LOGOS v0.1.1

Ecosistema LogoDemocracy — Infraestructura dialéctica y gimnasio deliberativo

---

1. Propósito

Esta especificación define el comportamiento funcional de Logos v0.1 a partir del protocolo cognitivo. Describe qué hace Logos cuando una persona lo utiliza, qué información recibe, qué produce, cómo se actualiza y cómo se relaciona con el usuario.

La especificación no contiene decisiones de implementación técnica (lenguajes, frameworks, bases de datos, APIs, infraestructura). Es el contrato funcional que debe satisfacer cualquier implementación posterior.

Logos v0.1 existe para que dos posiciones puedan encontrarse cognitivamente de manera rigurosa: comprenderse con precisión, relacionarse con claridad y, cuando sea posible, producir algo que ninguna contenía por separado.

---

2. Relación con el Protocolo Logos

Esta especificación es una traducción directa del PROTOCOLO_LOGOS_v0.1.1.md a comportamiento funcional observable. Todo elemento aquí definido debe poder rastrearse hasta una disposición explícita del protocolo.

Donde el protocolo no determina un comportamiento concreto, se señala explícitamente como "Decisión pendiente de especificación técnica/funcional".

El documento respeta la separación:

```
PROTOCOLO COGNITIVO
       ↓
ESPECIFICACIÓN FUNCIONAL    ← ESTE DOCUMENTO
       ↓
IMPLEMENTACIÓN TÉCNICA      (posterior)
```

---

3. Principios funcionales

Estos principios rigen todo el comportamiento de Logos y son verificables en la experiencia de usuario:

1. Comprensión antes que confrontación. Ninguna comparación ni síntesis se presenta sin que las posiciones hayan sido reconstruidas primero.
2. Síntesis como propuesta. Toda síntesis generativa se presenta explícitamente como propuesta sujeta a evaluación humana, nunca como conclusión o verdad.
3. El desacuerdo bien descrito es éxito. Logos nunca fuerza resolución artificial ni oculta desacuerdos persistentes.
4. Neutralidad ≠ equivalencia. Logos puede señalar diferencias de evidencia o coherencia sin declarar ganador.
5. Transparencia de proceso. El usuario sabe en todo momento qué está haciendo Logos, qué significa lo que ve y qué puede hacer a continuación.
6. Progresividad cognitiva, no bloqueo funcional. Logos presenta el análisis en un orden cognitivamente recomendado, pero el usuario puede acceder a cualquier etapa. Si accede a una etapa que requiere validaciones previas no realizadas, Logos lo señala y marca el resultado como provisional.
7. Autonomía del usuario. El usuario conserva autoridad sobre su propia posición; toda reconstrucción es confirmable, corregible o rechazable.
8. Actualización dinámica. Nueva información provoca reanálisis, nunca sobrescritura silenciosa.
9. Separación de niveles cognitivos. Logos distingue explícitamente entre aquello que proviene directamente del material (representación), aquello que infiere de él (inferencia) y aquello que genera a partir de la relación entre materiales (generación).
10. Validación como fidelidad, no aprobación. Validar una reconstrucción significa validar su fidelidad descriptiva, no validar su contenido, verdad, calidad ni razonabilidad.
11. Validación como estado actual. La validación certifica la aceptación actual de la reconstrucción por parte del participante; no constituye una garantía permanente de estabilidad de la posición.

---

4. Modelo funcional de Logos

Logos se comporta como un mediador cognitivo riguroso y no partidista que:

· Recibe materiales o intervenciones.
· Reconstruye posiciones.
· Valida la reconstrucción con la persona correspondiente.
· Mapea acuerdos, desacuerdos y su naturaleza.
· Explora convergencias y síntesis.
· Genera preguntas deliberativas.
· Registra el historial de cambios.
· Se actualiza cuando aparece nueva información.

Nunca:

· Decide qué posición es correcta.
· Vota o puntúa posiciones.
· Fabrica consenso donde no existe.
· Modifica silenciosamente la posición registrada.
· Habla en nombre de un participante en Modalidad B.
· Sustituye a SOPHIA.

---

5. Entidades funcionales

Las entidades que Logos reconoce y opera son:

Entidad Definición Propiedad clave
Posición Lo que una persona o conjunto de materiales sostiene Puede contener múltiples documentos/intervenciones
Documento Material aportado para representar una posición en Modalidad A Se integra al conjunto de la posición
Argumento Razón mediante la cual se sostiene una afirmación Pertenece a una posición o intervención
Evidencia Material utilizado como respaldo de una afirmación Puede ser textual, referencial o empírica
Supuesto Premisa necesaria o implícita para sostener un argumento Puede estar no declarada explícitamente
Intervención Acto comunicativo producido durante una deliberación Puede ser posición, argumento, pregunta, objeción, evidencia, aclaración, concesión, reformulación o nueva propuesta
Reconstrucción Representación que Logos produce de una posición o intervención Es corregible por el usuario
Validación Confirmación, corrección o rechazo de una reconstrucción Puede ser: confirmada, corregida, rechazada, parcialmente validada
Desacuerdo Diferencia identificada entre posiciones Se clasifica por tipo (factual, causal, conceptual, normativo, metodológico, estratégico) y por estado (sustantivo, aparente, indeterminado)
Convergencia Compatibilidad existente o trayectoria posible de acercamiento Puede ser: encontrada (ya existente) o posible (condicionada)
Síntesis descriptiva Reconstrucción fiel de las posiciones Es prerrequisito de las otras síntesis
Síntesis relacional Mapa de la relación entre posiciones Contiene acuerdos, desacuerdos, supuestos compartidos
Síntesis generativa Posibilidad nueva que aparece al comprender conjuntamente Puede ser de solución o de problema; puede no existir
Pregunta deliberativa Pregunta producida para continuar el proceso Puede reabrir cualquier etapa anterior

---

6. Modalidades

6.1 Modalidad A — Comparar posiciones

Propósito: Comparar documentos, modelos, teorías o propuestas ya existentes. No requiere interacción en tiempo real entre personas.

Estructura funcional:

```
POSICIÓN A                 POSICIÓN B
     │                           │
 documentos (1..N)          documentos (1..N)
     │                           │
     └────────── LOGOS ──────────┘
                      │
              Análisis completo
```

Características funcionales:

· Cada posición es un conjunto de documentos, no un documento aislado.
· Los documentos pueden añadirse progresivamente a cualquiera de las dos posiciones.
· Cada adición de documento provoca una reactualización del análisis.
· El análisis se construye integrando todos los documentos de cada posición.
· No hay límite superior de documentos por posición (sujeto a restricciones técnicas futuras).

Entrada: documentos en formatos de texto (la especificación técnica definirá los formatos soportados).

Salida: síntesis descriptiva, relacional, generativa; acuerdos, desacuerdos, convergencias, preguntas.

6.2 Modalidad B — Deliberar

Propósito: Interacción entre dos personas (en v0.1, puede simularse con un único usuario alternando roles; la arquitectura debe permitir posteriormente participantes reales, asíncronos o en tiempo real).

Estructura funcional:

```
Participante A → Intervención
        ↓
     LOGOS
        ↓
Participante B ← Intervención procesada
        ↓
Participante B → Intervención
        ↓
     LOGOS
        ↓
Participante A ← Intervención procesada
        ↓
    (ciclo continúa)
```

Unidad fundamental: la intervención deliberativa, no el documento.

Características funcionales:

· Cada intervención se etiqueta funcionalmente según su tipo: posición, argumento, pregunta, objeción, evidencia, aclaración, concesión, reformulación, nueva propuesta.
· Logos procesa cada intervención y la presenta al otro participante (nunca reformulada de forma que distorsione la intención sin señalarlo).
· Logos puede ofrecer síntesis relacional intermedia en cualquier punto, sin forzar el cierre.
· Cada intervención dispara una re-evaluación del estado de la posición del participante.

Entrada: texto de la intervención, identificador del participante.

Salida: reconstrucción de la intervención, malentendidos detectados, concesiones identificadas, estado de posición actualizado, desacuerdos persistentes, convergencias nuevas, pregunta productiva para el siguiente turno.

---

7. Preparación de una posición

Objetivo de la etapa: Recibir los materiales que representan una posición, tanto en Modalidad A (documentos) como en Modalidad B (intervenciones iniciales).

Entrada: texto o documento(s).

Procesamiento funcional:

1. Logos recibe el material.
2. Identifica si contiene una afirmación central identificable.
3. Identifica razones, argumentos, evidencia, supuestos cuando están presentes.
4. Si el material es insuficiente, Logos lo declara explícitamente.

Criterio de suficiencia cognitiva (ver §8).

Output: indicación de si la posición está suficientemente representada o qué falta.

Significado: "He recibido tu material y puedo/ no puedo reconstruir tu posición."

Acción siguiente: si es suficiente, avanzar a reconstrucción. Si no, agregar más información.

Corrección: el usuario puede reemplazar o complementar el material en cualquier momento.

Actualización: cuando se añade material, el análisis se reactualiza.

---

8. Suficiencia cognitiva

Logos no utiliza umbrales arbitrarios de caracteres ni número de palabras. Evalúa la suficiencia cognitiva del material recibido.

Criterios funcionales para determinar suficiencia:

· Nivel 1 (insuficiente): No hay afirmación central identificable.
· Nivel 2 (parcial): Hay afirmación central, pero no hay razones que la sostengan.
· Nivel 3 (suficiente): Hay afirmación central y al menos una razón que la sostiene (argumento). Puede haber evidencia o supuestos, pero no son obligatorios para avanzar.

Comportamiento en cada nivel:

Nivel Mensaje de Logos Acción del usuario
Insuficiente "Tu posición todavía no contiene una afirmación central identificable. ¿Podrías formular qué es lo que sostienes?" Añadir afirmación central
Parcial "Existe una afirmación central, pero no hay razones suficientes para reconstruir por qué sostienes esa posición. ¿Podrías agregar tus principales razones?" Añadir argumentos
Suficiente "He identificado tu afirmación central y sus principales razones. Puedo reconstruir tu posición. ¿Quieres avanzar o prefieres agregar más información?" Avanzar o ampliar

Nota: El usuario puede avanzar con nivel 2 si lo desea explícitamente; Logos debe advertir que la reconstrucción será más incierta.

---

9. Flujo funcional de Modalidad A

El flujo completo de Modalidad A es:

```
INICIO (sin posiciones)
        ↓
  [Crear comparación]
        ↓
Posición A (vacía) ←→ Posición B (vacía)
        ↓
  [Agregar documento a A]
        ↓
Posición A (1 doc) → Logos → Reconstrucción A
        ↓
  [Agregar documento a B]
        ↓
Posición B (1 doc) → Logos → Reconstrucción B
        ↓
  [Logos: síntesis descriptiva de A y B]
        ↓
  [Validación de A por usuario]
        ↓
  [Validación de B por usuario]
        ↓
  [Logos: comprensión cruzada]
        ↓
  [Logos: acuerdos y desacuerdos]
        ↓
  [Logos: naturaleza de desacuerdos]
        ↓
  [Logos: convergencias]
        ↓
  [Logos: síntesis relacional]
        ↓
  [Logos: síntesis generativa (si existe)]
        ↓
  [Logos: preguntas deliberativas]
        ↓
  [Posibilidad de agregar más documentos → reinicio del análisis]
        ↓
  [Finalización (temporal o definitiva)]
```

Detalles de cada transición:

Acción del usuario Procesamiento funcional de Logos Output Siguiente acción
Crear comparación Inicializa estado vacío para A y B Dos columnas vacías Agregar documento a A o B
Agregar documento a A Almacena documento; verifica suficiencia cognitiva; si suficiente, produce reconstrucción parcial Reconstrucción parcial de A Agregar más a A o pasar a B
Agregar documento a B Almacena documento; verifica suficiencia; produce reconstrucción parcial de B Reconstrucción parcial de B Agregar más a B o solicitar análisis
Solicitar análisis Integra todos los documentos de A y B; produce síntesis descriptiva Síntesis descriptiva de A y B Validar reconstrucciones
Validar A Presenta reconstrucción; permite confirmar/corregir Reconstrucción validada o corregida Validar B o continuar
Validar B Presenta reconstrucción; permite confirmar/corregir Reconstrucción validada o corregida Solicitar análisis relacional
Solicitar análisis relacional Mapea acuerdos, desacuerdos, supuestos, clasifica desacuerdos Síntesis relacional Explorar convergencias
Solicitar convergencias Identifica puntos de compatibilidad y condiciones Convergencias encontradas y posibles Solicitar síntesis generativa
Solicitar síntesis generativa Construye propuesta(s) emergente(s) si existen; si no, lo declara Síntesis generativa (o ausencia) Evaluar, reformular, rechazar, aceptar
Solicitar preguntas Genera preguntas deliberativas Lista de preguntas Responder o agregar documentos
Agregar nuevo documento Reactualiza todo el análisis; señala qué cambió y qué se mantuvo Análisis actualizado Continuar ciclo
Finalizar Conserva estado; registra finalización Resumen de la sesión Salir o archivar

---

10. Flujo funcional de Modalidad B

El flujo completo de Modalidad B es:

```
INICIO (sin participantes)
        ↓
  [Iniciar sesión deliberativa]
        ↓
Participante A (posición inicial) ←→ Participante B (posición inicial)
        ↓
  [A: primera intervención]
        ↓
Logos → reconstruye intervención → valida con A → presenta a B
        ↓
  [B: respuesta]
        ↓
Logos → reconstruye respuesta → identifica concesiones, cambios de posición
        ↓
Logos → actualiza estado de ambas posiciones → presenta a A
        ↓
  [A: nueva intervención]
        ↓
    (ciclo continúa)
        ↓
  [En cualquier punto: solicitar síntesis relacional intermedia]
        ↓
Logos → produce mapa actual de acuerdos/desacuerdos → lo presenta
        ↓
  [En cualquier punto: solicitar síntesis generativa]
        ↓
Logos → produce propuestas si existen
        ↓
  [En cualquier punto: finalizar sesión]
        ↓
Logos → conserva historial completo → resumen de la sesión
```

Detalles de cada intervención:

Momento Acción del usuario Procesamiento funcional de Logos Output Siguiente acción
1 A escribe intervención Recibe texto; identifica tipo de intervención; reconstruye argumento si lo hay Reconstrucción de la intervención de A Validar con A
2 A valida o corrige Si corrige, ajusta reconstrucción; si confirma, la fija Reconstrucción validada Presentar a B
3 (Logos) Presenta reconstrucción a B con indicación de que es la versión procesada, no la literal Intervención de A (procesada) B responde
4 B escribe respuesta Recibe texto; identifica concesiones (puntos donde B acepta algo de A); detecta posibles cambios de posición Concesiones identificadas; cambio de posición (inferencia) Validar cambio de posición con B
5 B valida o corrige cambio Si B confirma cambio, se registra; si lo rechaza, permanece inferencia Estado de posición actualizado Presentar respuesta a A
6 (Logos) Presenta respuesta de B a A, con indicación de concesiones y cambios Respuesta de B (procesada) A responde o solicita síntesis
7 (En cualquier punto) A/B solicita síntesis relacional Logos construye mapa actual de acuerdos/desacuerdos Síntesis relacional intermedia Continuar deliberando o finalizar
8 (En cualquier punto) A/B solicita síntesis generativa Logos explora posibles propuestas emergentes Síntesis generativa (o ausencia) Evaluar, continuar, finalizar
9 (En cualquier punto) A/B solicita finalización Logos consolida historial; ofrece resumen Resumen de la sesión Salir

Regla de actualización: Cada intervención provoca una re-evaluación completa del estado de las posiciones, no un reinicio.

Regla de cambio de posición: Si Logos detecta que una intervención parece modificar la posición anterior, lo presenta como:

"Esta intervención parece modificar parcialmente la posición que habías expresado anteriormente. ¿Es correcto?"

El usuario puede: confirmar, rechazar o precisar. Si rechaza, la posición anterior permanece.

---

11. Reconstrucción y validación

11.1 Proceso de reconstrucción

Objetivo: Logos construye una representación de una posición o intervención y la valida con la persona correspondiente.

Entrada: Materiales (documentos o intervenciones) de una posición.

Procesamiento funcional:

1. Logos identifica la afirmación central.
2. Identifica argumentos que la sostienen.
3. Identifica evidencia, si existe.
4. Identifica supuestos explícitos y, cuando sea posible, supuestos implícitos que son necesarios para que el argumento funcione.
5. Construye una representación estructurada.

Nivel de procedencia: Esta operación es de Representación (nivel 1: fuente directa).

Output: Reconstrucción estructurada que incluye:

· Afirmación central
· Argumentos principales
· Evidencia citada
· Supuestos identificados
· Límites o condiciones si están presentes

Formato de presentación: El usuario ve la reconstrucción en lenguaje comprensible, con secciones claramente etiquetadas y con indicación de procedencia (fragmentos textuales).

11.2 Proceso de validación

Regla fundamental: Validar una reconstrucción significa validar su fidelidad descriptiva (si Logos ha entendido correctamente lo que la posición dice), no su contenido, verdad, calidad ni razonabilidad. La validación nunca constituye aprobación de la posición.

Regla de estado actual: La validación certifica la aceptación actual de la reconstrucción por parte del participante; no constituye una garantía permanente de estabilidad de la posición. La posición puede evolucionar.

Entrada: Reconstrucción producida por Logos.

Output: Estado de validación.

Opción del usuario Comportamiento de Logos Actualización
Confirmar Registra validación completa La reconstrucción se fija como base para análisis posteriores
Corregir El usuario señala puntos incorrectos; Logos ajusta La reconstrucción original se conserva en historial; la corregida se usa para adelante
Rechazar (parcial o total) Logos solicita precisión La reconstrucción no se usa; se requiere nueva intervención/documento

Regla de historial: La reconstrucción original nunca se sobrescribe. Las correcciones se registran como una línea de tiempo.

Regla de actualización: Cuando una reconstrucción es validada o corregida, todos los análisis que dependen de ella se reactualizan.

---

12. Steelman dialéctico

Objetivo: Construir la mejor versión posible de una posición, que la parte contraria pueda reconocer como fiel aunque siga en desacuerdo.

Nivel de procedencia: Esta operación es de Inferencia (nivel 2: inferencia relacional).

Cuándo aparece: Después de la reconstrucción descriptiva, antes de la síntesis relacional. Puede solicitarse explícitamente o ofrecerse como opción.

Entrada: Posición validada (reconstrucción confirmada).

Procesamiento funcional:

1. Logos identifica los argumentos de la posición.
2. Los reformula en su versión más fuerte:
   · Completa argumentos incompletos cuando dicha completación sea necesaria para hacer explícita una inferencia que ya está contenida o fuertemente implicada por la posición.
   · Resuelve ambigüedades en favor de la interpretación más plausible.
   · Elimina debilidades retóricas sin cambiar el núcleo sustantivo.
   · No introduce premisas sustantivas nuevas que modifiquen el compromiso intelectual del participante.
3. Presenta el steelman al usuario correspondiente (la persona cuya posición es).

Validación del steelman:

Opción del usuario Comportamiento de Logos
Confirmar El steelman se registra como validado; se usa como base para síntesis relacional
Corregir El usuario señala puntos inexactos; Logos ajusta; se repite validación
Rechazar (parcial o total) Logos no usa el steelman; se mantiene la reconstrucción descriptiva

Diferencia con síntesis descriptiva:

 Reconstrucción descriptiva Steelman
Operación cognitiva Representación Inferencia
Nivel de procedencia Fuente directa Inferencia relacional
Qué representa Lo que la posición efectivamente dice La mejor versión posible de la posición
Base Texto literal Inferencia dialéctica guiada por el texto
Validación requerida Sí, por el propio autor Sí, por el propio autor, y opcionalmente también por la parte contraria

Regla de uso: El steelman validado se usa preferentemente como base para la síntesis relacional, porque comparar las mejores versiones produce un mapeo más honesto.

---

13. Indicadores

Cada indicador se produce en el momento correspondiente del flujo. Todos son cualitativos o categóricos, excepto donde el protocolo especifique lo contrario.

13.1 Comprensión de A

Aspecto Especificación
Propósito Indicar si Logos ha reconstruido fielmente la posición A
Información necesaria Reconstrucción de A validada (confirmada o corregida)
Momento de aparición Después de la validación de la reconstrucción de A
Formato de presentación Texto: "Comprensión de la Posición A: [confirmada / corregida / parcialmente validada]" con detalle de qué puntos fueron corregidos si corresponde
Interpretación Si está confirmada, Logos ha comprendido la posición. Si corregida, la comprensión se ajustó. Si parcial, hay puntos no validados que se registran.
Qué no significa No significa que A tenga razón ni que la posición sea robusta, ni que la posición sea estable en el tiempo
Información insuficiente Si no se ha validado, indicador no disponible; se muestra "pendiente de validación"
Actualización Se actualiza cada vez que la reconstrucción es corregida o re-validada
Acción posible después Continuar al siguiente paso, o solicitar nueva validación

13.2 Comprensión de B

Análogo a 13.1 para Posición B.

13.3 Simetría de comprensión

Aspecto Especificación
Propósito Indicar si ambas posiciones fueron reconstruidas con igual profundidad y cuidado, y si ambas validaciones ocurrieron
Información necesaria Estado de validación de A y B
Momento de aparición Después de que ambas validaciones estén disponibles
Formato de presentación Categórico: "Simétrica" (ambas validadas), "Asimétrica (A más desarrollada)", "Asimétrica (B más desarrollada)", "Pendiente"
Interpretación Señala si hay desbalance en la información disponible; no penaliza ninguna posición
Qué no significa No significa que una posición sea mejor o peor
Información insuficiente Si una o ambas no están validadas, se muestra "Pendiente de validación"
Actualización Se actualiza cuando cambia el estado de validación
Acción posible después Continuar; o si asimétrica, agregar más información a la posición menos documentada

13.4 Coincidencias

Aspecto Especificación
Propósito Mostrar puntos de acuerdo explícito entre posiciones
Información necesaria Síntesis relacional (acuerdos identificados)
Momento de aparición En la síntesis relacional
Formato de presentación Lista de puntos de acuerdo, con referencia a los fragmentos que los sustentan
Interpretación Áreas donde las posiciones convergen en contenido
Qué no significa No significa que el desacuerdo esté resuelto
Información insuficiente Si no se identifican acuerdos, se muestra "No se identificaron coincidencias explícitas"
Actualización Se actualiza con nueva información
Acción posible después Explorar convergencias o continuar

13.5 Desacuerdos

Aspecto Especificación
Propósito Mostrar puntos de desacuerdo explícito
Información necesaria Síntesis relacional (desacuerdos identificados)
Momento de aparición En la síntesis relacional
Formato de presentación Lista de puntos de desacuerdo, cada uno con su clasificación de tipo (§14) y estado (§14.2), y referencia a fragmentos
Interpretación Áreas donde las posiciones divergen
Qué no significa No significa que una posición sea incorrecta
Información insuficiente Si no se identifican desacuerdos, se muestra "No se identificaron desacuerdos explícitos"
Actualización Se actualiza con nueva información
Acción posible después Explorar naturaleza de desacuerdos, formular preguntas

13.6 Naturaleza de los desacuerdos

Aspecto Especificación
Propósito Clasificar cada desacuerdo por tipo (§14) y estado (§14.2)
Información necesaria Desacuerdos identificados
Momento de aparición Después de la identificación de desacuerdos
Formato de presentación Tabla: desacuerdo → tipo(s) → estado → explicación de por qué se clasifica así
Interpretación Comprensión de qué tipo de desacuerdo persiste y si es real o aparente
Qué no significa No es una puntuación ni juicio de calidad
Información insuficiente Si no hay desacuerdos, no aplica
Actualización Se actualiza con nuevo análisis
Acción posible después Profundizar en un desacuerdo, formular preguntas específicas

13.7 Supuestos compartidos

Aspecto Especificación
Propósito Identificar premisas que ambas posiciones asumen sin cuestionar
Información necesaria Reconstrucciones y análisis de supuestos
Momento de aparición En la síntesis relacional
Formato de presentación Lista de supuestos compartidos con referencia a fragmentos
Interpretación Base común sobre la cual ambas posiciones se asientan
Qué no significa No significa que esos supuestos sean verdaderos
Información insuficiente Si no se identifican, se muestra "No se identificaron supuestos compartidos explícitos"
Actualización Se actualiza con nuevo análisis
Acción posible después Cuestionar supuestos, explorar síntesis

13.8 Puntos de convergencia

Aspecto Especificación
Propósito Mostrar áreas donde una síntesis relacional o generativa parece más alcanzable
Información necesaria Análisis relacional
Momento de aparición Antes de la síntesis generativa
Formato de presentación Dos categorías: "Convergencias encontradas" (ya presentes) y "Convergencias posibles" (requieren condición)
Interpretación Zonas de potencial acuerdo o síntesis
Qué no significa No significa que la síntesis sea inevitable
Información insuficiente Si no hay convergencias, se muestra "No se identificaron convergencias"
Actualización Se actualiza con nueva información
Acción posible después Explorar síntesis generativa

13.9 Argumentos pendientes

Aspecto Especificación
Propósito Registrar objeciones planteadas que no recibieron respuesta
Información necesaria Historial de intervenciones o materiales
Momento de aparición Continuamente, se actualiza en cada nueva información
Formato de presentación Lista de argumentos/objeciones sin respuesta, con referencia
Interpretación Lo que aún no ha sido abordado
Qué no significa No significa que esos argumentos sean inválidos
Información insuficiente Si no hay, se muestra "No hay argumentos pendientes"
Actualización Se actualiza cuando se responde un argumento
Acción posible después Responder argumento, formular pregunta

13.10 Preguntas abiertas

Aspecto Especificación
Propósito Registrar preguntas deliberativas generadas y no resueltas
Información necesaria Preguntas generadas por Logos o por el usuario
Momento de aparición Después de cada ciclo de preguntas
Formato de presentación Lista de preguntas con su estado (respondida / pendiente)
Interpretación Lo que aún no se ha explorado
Qué no significa No significa que la deliberación esté incompleta
Información insuficiente Si no hay preguntas, se muestra "No hay preguntas abiertas"
Actualización Se actualiza cuando se responde o generan nuevas preguntas
Acción posible después Responder pregunta, explorar nuevo ciclo

13.11 Evolución de posiciones (Modalidad B)

Aspecto Especificación
Propósito Registrar cambios de posición detectados
Información necesaria Intervenciones y su comparación con posición anterior
Momento de aparición Después de cada intervención que pueda implicar cambio
Formato de presentación Línea de tiempo: posición inicial → intervención → posición actual; cada cambio con estado (confirmado / inferido / rechazado)
Interpretación Cómo ha evolucionado la posición del participante
Qué no significa No significa inconsistencia ni debilidad
Información insuficiente Si no hay cambios, se muestra "La posición se ha mantenido estable"
Actualización Se actualiza en cada intervención
Acción posible después Confirmar, corregir o rechazar cambio inferido

13.12 Síntesis descriptiva

Aspecto Especificación
Propósito Presentar la reconstrucción fiel de cada posición
Nivel de procedencia Representación (nivel 1: fuente directa)
Información necesaria Materiales validados
Momento de aparición Después de validación
Formato de presentación Texto estructurado: afirmación central, argumentos, evidencia, supuestos
Interpretación "Esto es lo que cada posición sostiene"
Qué no significa No es evaluación de validez
Información insuficiente No aplica; se produce solo si hay materiales suficientes
Actualización Se reactualiza con nueva información
Acción posible después Validar, corregir, avanzar a relacional

13.13 Síntesis relacional

Aspecto Especificación
Propósito Mapear la relación entre posiciones
Nivel de procedencia Inferencia (nivel 2: inferencia relacional)
Información necesaria Síntesis descriptiva de A y B validada
Momento de aparición Después de síntesis descriptiva y steelman (si se usa)
Formato de presentación Estructurado: acuerdos, desacuerdos (con tipos y estados), supuestos compartidos, convergencias
Interpretación "Así se relacionan estas posiciones"
Qué no significa No es una puntuación de distancia ni de calidad
Información insuficiente No aplica
Actualización Se reactualiza con nueva información
Acción posible después Explorar convergencias, síntesis generativa

13.14 Síntesis generativa

Aspecto Especificación
Propósito Presentar posibilidades nuevas que emergen de la relación
Nivel de procedencia Generación (nivel 3: generación)
Información necesaria Síntesis relacional, convergencias
Momento de aparición Después de síntesis relacional; solo si Logos identifica algo
Formato de presentación Propuesta(s) explicitadas como: "Propuesta de Logos: [...]"; cada propuesta con su tipo (solución / problema) y fundamento; indicación de nivel de procedencia (generación)
Interpretación "Esto es lo que podría emerger de la relación entre estas posiciones"
Qué no significa No es conclusión ni verdad ni resolución del debate
Información insuficiente Si no existe, se muestra: "No se identificó una síntesis generativa en este momento"
Actualización Se reactualiza con nueva información
Acción posible después Evaluar, reformular, rechazar, aceptar, explorar, incorporar nueva información

---

14. Desacuerdos

14.1 Clasificación de desacuerdos por tipo

Logos clasifica cada desacuerdo en una o más de estas categorías:

Tipo Descripción funcional Ejemplo de detección
Factual Discrepancia sobre hechos verificables A dice "X ocurrió", B dice "X no ocurrió"
Causal Discrepancia sobre qué causa qué A dice "Y causa Z", B dice "Y no causa Z"
Conceptual Uso o comprensión distinta de un mismo concepto A define "libertad" como X, B como Y
Normativo Discrepancia de valores, principios o criterios de deseabilidad A dice "debería ser X", B dice "debería ser Y"
Metodológico Discrepancia sobre cómo debe conocerse o evaluarse el problema A dice "hay que medir con método M", B dice "hay que medir con N"
Estratégico Objetivos compartidos, desacuerdo sobre el mecanismo para alcanzarlos Ambos quieren reducir emisiones, pero discrepan sobre cómo

Regla de clasificación: Un desacuerdo puede pertenecer a múltiples categorías. Logos debe indicar todas las aplicables, no forzar una única.

14.2 Estado del desacuerdo

Además del tipo, Logos clasifica cada desacuerdo según su estado:

Estado Descripción funcional Indicador
Sustantivo Existe un desacuerdo real; las posiciones sostienen cosas diferentes "Desacuerdo sustantivo sobre [tema]"
Aparente Las posiciones parecen divergir, pero probablemente se refieren a lo mismo con conceptos distintos; puede resolverse con clarificación conceptual "Este desacuerdo parece ser aparente: ambas posiciones podrían ser compatibles si se precisan los términos"
Indeterminado Logos no puede determinar si existe desacuerdo real; falta información o claridad "No puedo determinar todavía si existe desacuerdo sustantivo; se necesita más información"

Regla de evolución: Un desacuerdo puede cambiar de estado. Por ejemplo, un desacuerdo aparente puede convertirse en sustantivo si se descubre que las diferencias conceptuales ocultan diferencias reales. Un desacuerdo indeterminado puede pasar a sustantivo o aparente cuando aparece nueva información.

Formato de presentación: Para cada desacuerdo: "Desacuerdo sobre [tema] — Tipo(s): [factual, causal, ...] — Estado: [sustantivo / aparente / indeterminado] — Justificación: [explicación breve]"

14.3 Visualización de desacuerdos

Modalidad A: Lista completa de desacuerdos en la síntesis relacional.

Modalidad B: Los desacuerdos se actualizan en cada intervención. Se pueden mostrar acumulados y también los más recientes.

Acción posible después de ver desacuerdos: Profundizar en uno, pedir evidencia, formular pregunta, explorar convergencia.

---

15. Convergencias

Distinción funcional:

Tipo Definición Indicador
Convergencia encontrada Compatibilidad que ya existe en los materiales. No requiere acción adicional para ser reconocida. "Ambas posiciones coinciden en que..."
Convergencia posible Trayectoria de acercamiento que requiere una condición (más evidencia, aclaración conceptual, etc.) "Si se resuelve el punto Y, ambas podrían converger en..."

Comportamiento de Logos:

1. Identifica convergencias encontradas y posibles.
2. Las presenta en secciones separadas y etiquetadas.
3. Para convergencias posibles, especifica la condición necesaria.
4. Nunca infla el número de convergencias para narrar cierre.

Acción posible después de convergencias: Explorar síntesis generativa, formular pregunta específica sobre la condición, agregar evidencia.

---

16. Síntesis descriptiva

Objetivo: Presentar una reconstrucción fiel de cada posición sin interpretación evaluativa.

Nivel de procedencia: Representación (nivel 1: fuente directa).

Comportamiento funcional:

1. Logos produce una síntesis descriptiva para cada posición por separado.
2. La síntesis incluye: afirmación central, argumentos principales, evidencia citada, supuestos identificados.
3. Todo está referenciado a los materiales originales (fragmentos).
4. La síntesis se presenta antes de cualquier comparación.
5. La síntesis está sujeta a validación (ver §11).

Output: Texto estructurado por secciones.

Formato de presentación:

```
## Posición A

**Afirmación central:** [texto]

**Argumentos principales:**
1. [argumento] (referencia: fragmento)
2. ...

**Evidencia citada:**
- [evidencia] (referencia)

**Supuestos identificados:**
- [supuesto] (implícito/explícito)

**Validación:** [estado]
```

---

17. Síntesis relacional

Objetivo: Mapear la relación entre las dos posiciones.

Nivel de procedencia: Inferencia (nivel 2: inferencia relacional).

Comportamiento funcional:

1. Logos compara las síntesis descriptivas (y steelman, si están validados).
2. Identifica:
   · Acuerdos explícitos
   · Desacuerdos explícitos (con tipo y estado)
   · Supuestos compartidos
   · Diferencias conceptuales
   · Diferencias empíricas
   · Diferencias normativas
   · Diferencias metodológicas (si corresponden)
3. Clasifica cada desacuerdo según §14.
4. Presenta el mapa de forma estructurada.

Output: Mapa relacional completo.

Formato de presentación:

```
## Síntesis relacional

### Acuerdos
- [acuerdo 1] (referencia)
- ...

### Desacuerdos
- [desacuerdo 1] (referencia) — Tipo(s): [factual, causal, ...] — Estado: [sustantivo / aparente / indeterminado]
- ...

### Supuestos compartidos
- [supuesto] (referencia)

### Diferencias conceptuales
- [diferencia] (referencia)

### Diferencias empíricas
- [diferencia] (referencia)

### Diferencias normativas
- [diferencia] (referencia)
```

---

18. Síntesis generativa

Objetivo: Presentar posibilidades nuevas que emergen de la relación entre posiciones.

Nivel de procedencia: Generación (nivel 3: generación). Es la única síntesis que puede contener contenido no presente en los materiales originales.

Comportamiento funcional:

1. Logos explora si existe alguna propuesta, reformulación, pregunta, hipótesis o alternativa que no estaba presente en las posiciones originales pero que emerge de su relación.
2. Distingue entre:
   · Síntesis de solución: nueva propuesta que responde a la pregunta original.
   · Síntesis de problema: reformulación de la pregunta misma (por ejemplo, la dicotomía original era falsa).
3. Si no existe ninguna, Logos lo declara explícitamente.
4. Si existe, la presenta como propuesta deliberativa, no como conclusión.
5. Incluye fundamento: qué de las posiciones originales da lugar a esta síntesis, y qué tipo de operación cognitiva la produjo (generación).
6. La síntesis generativa puede ser especulativa; en ese caso, Logos debe marcarla explícitamente como tal.

Formato de presentación:

```
## Síntesis generativa

**Tipo:** [solución / problema]

**Propuesta de Logos:** [texto]

**Fundamento:** [explicación de cómo emerge de las posiciones originales]

**Nivel de procedencia:** Generación (nivel 3)

**Estado:** [propuesta sujeta a evaluación humana]

**Especulativa:** [sí / no] (si es especulativa, explicación de por qué)
```

Acciones posibles del usuario:

· Aceptar como interesante
· Rechazar
· Modificar
· Pedir explicación
· Pedir evidencia
· Generar otra posibilidad

Regla de ausencia: Si Logos no identifica síntesis generativa, muestra:

"No se identificó una síntesis generativa en este momento. Esto es un resultado válido — la relación entre estas posiciones puede describirse con precisión sin que surja una nueva propuesta."

---

19. Preguntas deliberativas

Objetivo: Generar preguntas que permitan continuar profundizando.

Comportamiento funcional:

1. Logos formula preguntas que surgen de los desacuerdos, convergencias o huecos identificados.
2. Las preguntas son específicas, no genéricas.
3. Las preguntas se presentan al final del ciclo (o en cualquier punto si se solicitan).
4. Las preguntas pueden reabrir cualquier etapa anterior.

Formato de presentación:

```
## Preguntas deliberativas

1. ¿Qué evidencia empírica permitiría zanjar el desacuerdo sobre [tema]?
2. ¿Cómo se relaciona [concepto X] con [concepto Y]?
3. Si se aceptara la premisa [supuesto], ¿cómo cambiaría la posición?
```

Acción posible: Responder preguntas (lo que dispara nuevo ciclo), o continuar.

---

20. Actualización dinámica

Comportamiento funcional: Logos se actualiza cuando aparece nueva información, ya sea:

· Nuevo documento añadido a una posición (Modalidad A).
· Nueva intervención (Modalidad B).

Reglas de actualización:

1. La nueva información se integra, no reemplaza lo anterior.
2. El historial completo se conserva.
3. Todas las representaciones dependientes se actualizan:
   · Reconstrucciones
   · Síntesis descriptiva, relacional, generativa
   · Acuerdos, desacuerdos, convergencias
   · Preguntas
4. Logos señala explícitamente qué cambió y qué se mantuvo con la nueva información.
5. Las validaciones previas no se eliminan; se registran como "anteriores a la nueva información".

Comunicación al usuario:

"Se ha añadido nuevo material. El análisis se ha actualizado.

Cambios principales:
- [lista de cambios]

Se mantiene:
- [lista de continuidades]

Nuevo:
- [lista de elementos nuevos que aparecen]

Descartado:
- [lista de elementos que ya no se sostienen]

Las validaciones previas permanecen registradas, pero la síntesis relacional se ha ajustado."

Regla de no sobrescritura: Ninguna información anterior se sobrescribe silenciosamente. Todo cambio es trazable.

---

21. Estado de las posiciones

Modalidad A: El estado de cada posición es su conjunto de documentos y las reconstrucciones derivadas.

Modalidad B: El estado de cada posición se compone de:

```
POSICIÓN INICIAL (lo que sostenía al comenzar)
       ↓
INTERVENCIONES (registro cronológico)
       ↓
POSICIÓN ACTUAL (mejor reconstrucción disponible)
```

Reglas:

1. La posición inicial nunca se sobrescribe.
2. Cada intervención se registra con su tipo y contenido.
3. La posición actual se actualiza después de cada intervención.
4. Si Logos detecta un cambio de posición, lo presenta como inferencia (ver §10).
5. El usuario puede confirmar, rechazar o precisar el cambio.
6. Si se rechaza, la posición actual vuelve a la anterior.
7. La validación certifica la aceptación actual de la posición, no su estabilidad permanente.

---

22. Historial y trazabilidad

Objetivo: Permitir que cada output de Logos pueda rastrearse hasta su origen y conocer el tipo de operación cognitiva que lo produjo.

Niveles de procedencia (regla transversal):

Todo output de Logos debe indicar su nivel de procedencia:

Nivel Nombre Definición Ejemplo
1 Fuente directa El output deriva directamente de un material original (documento, fragmento, intervención) Reconstrucción descriptiva: "A sostiene X" (basado en el fragmento Y)
2 Inferencia relacional El output se deriva de la relación entre dos o más materiales o posiciones Steelman: "La mejor versión de la posición de A es..." (inferido de los argumentos de A)
3 Generación El output no está contenido en los materiales originales; es una elaboración generativa de Logos basada en la relación entre posiciones Síntesis generativa: "Una posibilidad emergente sería..."

Regla fundamental: Todo output debe ser trazable a su nivel de procedencia. Sin trazabilidad, el output no es válido. Para la síntesis generativa, la trazabilidad consiste en indicar explícitamente que es una generación, y mostrar qué relación entre posiciones la fundamenta.

Requisitos funcionales:

1. Cada síntesis, desacuerdo, convergencia y pregunta debe estar vinculada a:
   · El documento o fragmento que la origina (Modalidad A).
   · La intervención específica que la origina (Modalidad B).
   · El nivel de procedencia correspondiente.
2. El usuario puede, en cualquier momento, solicitar la referencia de un output.
3. El historial completo de la sesión se conserva y es accesible.

Formato de presentación de trazabilidad: Al hacer clic o solicitar referencia, Logos muestra: "Esto se basa en el fragmento: [texto] de [documento/intervención] — Nivel de procedencia: [fuente directa / inferencia relacional / generación]"

---

23. Estados funcionales de la interfaz

Cada estado corresponde a una pantalla conceptual. La implementación técnica podrá traducir esto a una o varias pantallas.

23.1 Estado: Inicio

Aspecto Especificación
Nombre Inicio de Logos
Propósito Permitir elegir modalidad y empezar
Información visible Título, descripción breve, botones: "Comparar posiciones" (Modalidad A), "Deliberar" (Modalidad B)
Acciones disponibles Elegir modalidad
Acciones bloqueadas Ninguna
Output de Logos Ninguno
Transiciones posibles → Comparar, → Deliberar
Condiciones de transición Selección del usuario
Datos que deben conservarse Ninguno
Errores/casos límite Ninguno

23.2 Estado: Comparar — Preparación

Aspecto Especificación
Nombre Comparar posiciones (preparación)
Propósito Recibir documentos para Posición A y Posición B
Información visible Dos columnas: "Posición A" y "Posición B"; botón "Agregar documento"; estado de suficiencia cognitiva; indicador de posición actual (A/B)
Acciones disponibles Agregar documento a A, agregar documento a B, ver reconstrucción parcial, solicitar análisis (si ambas son suficientes)
Acciones bloqueadas Solicitar análisis si alguna posición es insuficiente (con mensaje explicativo)
Output de Logos Reconstrucción parcial de cada posición a medida que se agregan documentos; mensaje de suficiencia cognitiva
Significado del output "He recibido tu material y puedo / no puedo reconstruir tu posición"
Transiciones posibles → Comparar — Análisis (cuando ambas posiciones son suficientes y usuario solicita)
Condiciones de transición Ambas posiciones con suficiencia cognitiva (Nivel 3) o usuario solicita avanzar con advertencia
Datos que deben conservarse Documentos de A, documentos de B, reconstrucciones parciales
Errores/casos límite Documento contradictorio con otro → señalarlo; documento insuficiente → solicitar más; asimetría en cantidad de documentos → señalar pero no impedir avanzar

23.3 Estado: Comparar — Análisis

Aspecto Especificación
Nombre Comparar posiciones (análisis)
Propósito Mostrar el análisis completo de la relación entre posiciones
Información visible Reconstrucciones (descriptiva A, descriptiva B), acuerdos, desacuerdos (con tipo y estado), convergencias, síntesis relacional, síntesis generativa (si existe), preguntas; todo con trazabilidad y nivel de procedencia
Acciones disponibles Validar reconstrucciones, corregir, solicitar steelman, solicitar síntesis generativa (si no se mostró), agregar más documentos, profundizar en un punto, ver referencias, volver a preparación, finalizar
Acciones bloqueadas Ninguna (todo el análisis está accesible, pero si el usuario salta etapas sin validación, Logos lo advierte)
Output de Logos Mapa relacional completo, con todos los indicadores
Significado del output "Así se relacionan estas posiciones; estas son las propuestas que emergen"
Transiciones posibles → Comparar — Preparación (para añadir documentos), → Comparar — Steelman, → Comparar — Profundizar, → Final
Condiciones de transición Acción del usuario
Datos que deben conservarse Todo el estado: documentos, reconstrucciones, validaciones, síntesis, etc.
Errores/casos límite Síntesis generativa ausente → mostrar mensaje explícito; agregar documento nuevo → reactualizar y señalar cambios y continuidades; usuario solicita síntesis generativa sin validar reconstrucciones → Logos advierte que el fundamento es provisional

23.4 Estado: Deliberar — Sesión

Aspecto Especificación
Nombre Deliberar (sesión)
Propósito Gestionar intercambio de intervenciones entre participantes
Información visible Historial de intervenciones (cronológico), estado actual de posiciones, indicadores (desacuerdos, concesiones, cambios de posición), entrada de texto para nueva intervención, identificador del participante actual
Acciones disponibles Escribir intervención, validar reconstrucción, confirmar/corregir cambio de posición, solicitar síntesis relacional intermedia, solicitar síntesis generativa, ver trazabilidad y nivel de procedencia, finalizar
Acciones bloqueadas Hablar en nombre del otro participante (nunca)
Output de Logos Reconstrucción de cada intervención, malentendidos detectados, concesiones, cambio de posición (inferencia), desacuerdos actualizados (con tipo y estado), pregunta productiva
Significado del output "He procesado tu intervención; así la he entendido; así se actualiza el estado de la deliberación"
Transiciones posibles → Deliberar — Siguiente turno, → Deliberar — Síntesis, → Final
Condiciones de transición Después de cada intervención, siguiente participante puede responder; puede solicitar síntesis en cualquier punto
Datos que deben conservarse Historial completo de intervenciones, posiciones iniciales y actuales, validaciones, concesiones, desacuerdos, síntesis
Errores/casos límite Un usuario simulando ambos lados → advertir; cambio de posición inferido → presentar como inferencia; ambigüedad → pedir aclaración; desacuerdo indeterminado → clasificar como tal

23.5 Estado: Steelman

Aspecto Especificación
Nombre Steelman dialéctico
Propósito Construir la mejor versión de una posición
Nivel de procedencia Inferencia (nivel 2: inferencia relacional)
Información visible Reconstrucción descriptiva de la posición, steelman propuesto, texto de validación, indicación de nivel de procedencia
Acciones disponibles Confirmar steelman, corregir steelman, rechazar steelman, ver diferencias con descriptiva
Acciones bloqueadas Usar steelman como base para relacional sin validación
Output de Logos Steelman validado (o rechazado)
Significado del output "Esta es la mejor versión de la posición que el otro participante puede reconocer"
Transiciones posibles → Comparar — Análisis (si validado), → Comparar — Preparación (si rechazado)
Condiciones de transición Validación completada
Datos que deben conservarse Steelman, validación, historial de correcciones
Errores/casos límite Si el usuario rechaza el steelman, Logos puede ofrecer construir uno nuevo con indicaciones; si el usuario confirma, se usa como base para relacional

23.6 Estado: Síntesis generativa

Aspecto Especificación
Nombre Síntesis generativa
Propósito Presentar y evaluar propuestas emergentes
Nivel de procedencia Generación (nivel 3: generación)
Información visible Síntesis generativa (solución o problema), fundamento, estado (propuesta), nivel de procedencia, indicación de especulatividad (si corresponde), acciones posibles
Acciones disponibles Aceptar como interesante, rechazar, modificar, pedir explicación, pedir evidencia, generar otra posibilidad, incorporar nueva información
Acciones bloqueadas Presentar síntesis como conclusión o verdad
Output de Logos Síntesis generativa (o mensaje de ausencia)
Significado del output "Esto es lo que podría emerger de la relación entre estas posiciones"
Transiciones posibles → Análisis (para continuar), → Preparación (para agregar info), → Final
Condiciones de transición Acción del usuario
Datos que deben conservarse Síntesis, evaluaciones, fundamento, nivel de procedencia
Errores/casos límite Si no existe síntesis, mostrar mensaje de ausencia; no forzar; si el usuario no ha validado reconstrucciones, Logos advierte que el fundamento es provisional

---

24. Navegación

Mapa conceptual de navegación:

```
INICIO
  │
  ├── COMPARAR (Modalidad A)
  │      │
  │      ├── Preparación
  │      │      ├── Posición A (documentos)
  │      │      ├── Posición B (documentos)
  │      │      └── Validación de suficiencia
  │      │
  │      ├── Reconstrucción
  │      │      ├── Síntesis descriptiva A
  │      │      ├── Síntesis descriptiva B
  │      │      └── Validación de A y B
  │      │
  │      ├── Steelman (opcional)
  │      │      ├── Steelman A
  │      │      ├── Steelman B
  │      │      └── Validación
  │      │
  │      ├── Análisis relacional
  │      │      ├── Acuerdos y desacuerdos (con tipo y estado)
  │      │      ├── Naturaleza de desacuerdos
  │      │      ├── Convergencias
  │      │      └── Síntesis relacional
  │      │
  │      ├── Síntesis generativa
  │      │      ├── Propuesta (o ausencia)
  │      │      └── Evaluación humana
  │      │
  │      ├── Preguntas
  │      │      └── Preguntas deliberativas
  │      │
  │      └── Finalización
  │
  └── DELIBERAR (Modalidad B)
         │
         ├── Inicio de sesión
         │      ├── Participante A (posición inicial)
         │      └── Participante B (posición inicial)
         │
         ├── Ciclo de intervenciones
         │      ├── A → Logos → B
         │      ├── B → Logos → A
         │      └── (repetir)
         │
         ├── Análisis intermedio (opcional)
         │      ├── Síntesis relacional
         │      └── Síntesis generativa
         │
         └── Finalización
```

Transiciones clave:

· Desde cualquier punto de "Preparación" → "Reconstrucción" cuando ambas posiciones son suficientes.
· Desde "Reconstrucción" → "Steelman" (opcional) o → "Análisis relacional".
· Desde "Análisis relacional" → "Síntesis generativa" o → "Preguntas".
· Desde "Preguntas" → "Preparación" (para agregar información) o → "Finalización".
· En Modalidad B, desde cualquier punto → "Análisis intermedio" (bajo demanda).
· En cualquier punto → "Finalización" (temporal o definitiva).

Regla de progresividad: Logos presenta las etapas en orden cognitivo recomendado, pero el usuario puede acceder a cualquier etapa. Si accede a una etapa que requiere validaciones previas no realizadas, Logos lo advierte y marca el resultado como provisional.

---

25. Outputs

Lista de todos los outputs que Logos puede producir, con formato de presentación mínimo y nivel de procedencia:

Output Nivel de procedencia Formato Contexto
Reconstrucción descriptiva Fuente directa (nivel 1) Texto estructurado con secciones Modalidad A y B, después de recepción de materiales
Validación de reconstrucción Fuente directa (nivel 1) Estado (confirmada / corregida / rechazada) Después de presentar reconstrucción
Steelman Inferencia relacional (nivel 2) Texto estructurado, precedido de "Versión más fuerte de la posición..." Después de descriptiva, opcional
Síntesis relacional Inferencia relacional (nivel 2) Mapa con acuerdos, desacuerdos (tipo y estado), supuestos, convergencias Después de validación y steelman (si se usa)
Clasificación de desacuerdos Inferencia relacional (nivel 2) Lista de desacuerdos con tipo(s) y estado(s) Dentro de síntesis relacional
Síntesis generativa Generación (nivel 3) Texto precedido de "Propuesta de Logos:" Después de relacional, si existe
Ausencia de síntesis generativa Generación (nivel 3) Texto: "No se identificó síntesis generativa..." Cuando no existe
Preguntas deliberativas Inferencia relacional (nivel 2) Lista numerada de preguntas Después de síntesis generativa (o de relacional)
Concesiones Fuente directa (nivel 1) Lista de puntos concedidos Modalidad B
Cambio de posición (inferencia) Inferencia relacional (nivel 2) Texto: "Esta intervención parece modificar..." Modalidad B
Estado de posición actual Fuente directa (nivel 1) + Inferencia (nivel 2) Línea de tiempo Modalidad B
Trazabilidad Variable (según output) Referencia a fragmento/documento + nivel de procedencia Bajo demanda
Resumen de sesión Variable Resumen estructurado Al finalizar

---

26. Casos límite

Caso límite Comportamiento funcional Mensaje al usuario Corrección posible
Posición con mucha documentación vs. poco documentada Logos señala la asimetría en la simetría de comprensión "La Posición A tiene material más extenso que la Posición B. La comprensión de B puede ser más incierta." Agregar más información a B; continuar con advertencia
Un usuario simulando ambos lados (Modalidad B) Logos advierte de la limitación "Estás simulando ambos lados. La detección de malentendidos genuinos puede ser limitada. Los cambios de posición detectados deben tratarse con cautela." El usuario puede continuar con advertencia
Materiales contradictorios dentro de una misma posición Logos señala la contradicción en la síntesis descriptiva "He identificado una contradicción interna en tu posición: en el fragmento X dices A, y en el fragmento Y dices ¬A. ¿Cómo debe interpretarse esto?" El usuario puede aclarar, o Logos registrar la contradicción como hallazgo
Desacuerdo aparente (terminológico) Logos lo identifica y clasifica como aparente "Este desacuerdo parece ser aparente: ambas coinciden en sustancia pero usan palabras distintas. ¿Te parece que esto es una convergencia?" El usuario puede confirmar, y Logos ofrecer reconciliación de vocabulario como síntesis generativa
Desacuerdo indeterminado Logos lo clasifica como indeterminado "No puedo determinar todavía si existe desacuerdo real en este punto. Se necesita más información para clasificarlo." Agregar información o continuar con advertencia
Cambio radical de posición Logos lo señala explícitamente "Esta intervención modifica sustancialmente tu posición anterior. ¿Es correcto?" Confirmar, rechazar o precisar
Ausencia total de convergencia Logos lo declara como resultado válido "No se identificaron convergencias. La relación entre estas posiciones es de desacuerdo persistente. El desacuerdo bien descrito es un resultado exitoso." Finalizar o continuar explorando
Información insuficiente Logos declara incertidumbre y pide más "No tengo suficiente información para reconstruir tu posición. Identifiqué tu afirmación central, pero no hay razones que la sostengan. ¿Podrías agregar tus principales argumentos?" Agregar información
Síntesis generativa especulativa Logos la marca como especulativa "Propuesta especulativa de Logos: [...]. Esta síntesis se basa en inferencias adicionales, no directamente en los materiales." El usuario puede evaluar, rechazar o pedir fundamentos
Interpretación ambigua Logos pide aclaración "La intervención X puede interpretarse de dos maneras: Y o Z. ¿Cuál es la correcta?" El usuario aclara, y Logos actualiza

---

27. Relación funcional con SOPHIA

Logos puede consultar información de SOPHIA cuando:

1. Un documento de alguna posición ya fue evaluado por SOPHIA.
2. El usuario lo solicita explícitamente.
3. La información de SOPHIA puede enriquecer la comprensión de la construcción de una posición.

Reglas funcionales:

· La información de SOPHIA se muestra en una sección separada, etiquetada como "Evaluación SOPHIA (para referencia)".
· Nunca se utiliza el IRD de SOPHIA como criterio para "quién tiene razón" en Logos.
· Nunca se mezcla silenciosamente la información de SOPHIA con los indicadores propios de Logos.
· Si un documento no tiene evaluación SOPHIA, Logos no la inventa ni la simula.

Ejemplo de presentación:

```
## Evaluación SOPHIA (referencia)

- Documento A: IRD 72/100 — Robustez moderada. Infracciones detectadas: [lista]
- Documento B: IRD 58/100 — Robustez baja. Infracciones detectadas: [lista]

*Nota: Esta información es complementaria al análisis relacional de Logos. No indica qué posición es correcta.*
```

---

28. Criterios de aceptación

La implementación de Logos v0.1 se considera exitosa cuando se cumplan todos los siguientes criterios:

28.1 Modalidad A

ID Criterio Verificación
A1 El usuario puede crear una comparación con dos posiciones Sí / No
A2 El usuario puede agregar documentos a cada posición Sí / No
A3 Logos evalúa la suficiencia cognitiva y no usa límites de caracteres Sí / No
A4 Logos produce síntesis descriptiva para cada posición Sí / No
A5 El usuario puede validar, corregir o rechazar cada reconstrucción Sí / No
A6 Logos produce síntesis relacional con acuerdos, desacuerdos y supuestos Sí / No
A7 Cada desacuerdo se clasifica en al menos un tipo (factual, causal, conceptual, normativo, metodológico, estratégico) y tiene un estado (sustantivo, aparente, indeterminado) Sí / No
A8 Logos identifica convergencias encontradas y posibles Sí / No
A9 Logos produce síntesis generativa si existe; si no, declara su ausencia Sí / No
A10 Logos genera preguntas deliberativas Sí / No
A11 Agregar un documento reactualiza el análisis y señala qué cambió y qué se mantuvo Sí / No
A12 El steelman está disponible como opción y requiere validación Sí / No
A13 Toda síntesis generativa se presenta como propuesta, no como conclusión Sí / No
A14 Cada output indica su nivel de procedencia (fuente directa / inferencia relacional / generación) Sí / No
A15 Validar una reconstrucción significa validar fidelidad, no aprobación Sí / No

28.2 Modalidad B

ID Criterio Verificación
B1 El usuario puede iniciar una sesión deliberativa con dos participantes Sí / No
B2 Cada intervención se reconstruye y se presenta al otro participante Sí / No
B3 Logos identifica concesiones en las intervenciones Sí / No
B4 Logos detecta cambios de posición y los presenta como inferencia Sí / No
B5 El usuario puede confirmar, rechazar o precisar cambios de posición Sí / No
B6 El estado de posición (inicial, intervenciones, actual) se conserva Sí / No
B7 Logos puede ofrecer síntesis relacional intermedia en cualquier punto Sí / No
B8 Logos nunca habla en nombre de un participante Sí / No
B9 El ciclo A → Logos → B → Logos → A se mantiene Sí / No

28.3 Generales

ID Criterio Verificación
G1 El usuario puede en todo momento saber qué está haciendo Logos Sí / No
G2 El usuario puede en todo momento saber qué significa el resultado Sí / No
G3 El usuario puede en todo momento saber qué puede hacer a continuación Sí / No
G4 Cada output tiene trazabilidad a materiales originales y nivel de procedencia Sí / No
G5 La incertidumbre se declara explícitamente cuando corresponde Sí / No
G6 La información de SOPHIA (si se usa) está claramente etiquetada Sí / No
G7 Ninguna síntesis generativa se presenta como verdad o consenso Sí / No
G8 Un desacuerdo persistente bien descrito es aceptado como resultado válido Sí / No
G9 La posición inicial nunca se sobrescribe Sí / No
G10 El historial completo de la sesión es accesible Sí / No
G11 Logos distingue entre representación, inferencia y generación Sí / No
G12 El usuario puede acceder a cualquier etapa, pero Logos advierte si se saltan validaciones previas Sí / No

---

29. CORE / OPCIONAL / FUTURO

29.1 CORE v0.1 (obligatorio)

Funcionalidad ¿Por qué es CORE?
Modalidad A: comparar posiciones con documentos Es la funcionalidad fundamental de Logos
Modalidad B: deliberar con intervenciones (un usuario simulando ambos lados) Permite probar el ciclo deliberativo
Suficiencia cognitiva (sin límites de caracteres) Sustituye la falsa objetividad de métricas arbitrarias
Reconstrucción y validación de posiciones Es el principio "comprensión antes que confrontación"
Síntesis descriptiva Es el primer paso de toda comparación
Síntesis relacional (acuerdos, desacuerdos, supuestos) Es el mapa de la relación
Clasificación de desacuerdos en 6 tipos y 3 estados Es la operación central para entender la naturaleza del desacuerdo
Distinción acuerdo/convergencia Evita inflar compatibilidades
Síntesis generativa (con ausencia declarada) Es el producto más valioso, pero su ausencia es válida
Preguntas deliberativas Permite continuar el ciclo
Actualización dinámica (reanálisis) Es esencial porque las posiciones pueden cambiar
Estado de posiciones (inicial / intervenciones / actual) Garantiza trazabilidad de evolución
Steelman dialéctico Es el gimnasio deliberativo en acción
Historial y trazabilidad con niveles de procedencia Garantiza auditabilidad y transparencia epistemológica
Transparencia de proceso (qué hace, qué significa, qué sigue) Es el principio de experiencia de usuario
Distinción representación / inferencia / generación Es el núcleo epistemológico de Logos
Validación como fidelidad (no aprobación) Separa comprensión de acuerdo
Progresividad cognitiva con acceso libre Equilibra orden recomendado con autonomía

29.2 OPCIONAL v0.1 (puede implementarse si no aumenta excesivamente la complejidad)

Funcionalidad Consideración
Exportación de sesión (resumen estructurado) Útil pero no esencial para probar la hipótesis
Vista de trazabilidad interactiva (clic para ver referencia) Mejora UX, no es funcionalidad central
Cambio de posición inferido (confirmable) Es útil pero puede ser complejo; se puede implementar en una versión inicial más simple con solo registro de intervenciones
Simetría de comprensión como indicador Útil pero derivado de las validaciones

29.3 FUTURO (fuera de v0.1)

Funcionalidad Motivo
Múltiples posiciones (más de 2) El protocolo actual se centra en dos; expandir requiere rediseño
Participantes reales (distintas personas en Modalidad B) Requiere autenticación, gestión de sesiones, comunicación en tiempo real o asíncrona
Tiempo real (Modalidad B en vivo) Requiere infraestructura de comunicación
Asincronía avanzada (turnos diferidos) Requiere persistencia y notificaciones
Integración profunda con Academia Requiere definir el flujo de publicación
Metasíntesis El protocolo la define como capacidad avanzada, fuera de v0.1
Memoria longitudinal entre sesiones Requiere definir un modelo de usuario y sesión
Detección automática de cambio de posición (sin intervención humana) El protocolo exige validación humana; la detección automática sin confirmación viola la autonomía
Intervención de Logos en el contenido de la deliberación (propuestas automáticas no solicitadas) Violaría el principio de que Logos no habla en nombre del participante

---

30. Límites de esta especificación

Esta especificación describe el comportamiento funcional de Logos, pero no determina:

· Decisiones técnicas: lenguaje de programación, frameworks, bases de datos, APIs, infraestructura, proveedores de IA.
· Diseño visual: colores, tipografías, espacios, componentes visuales, CSS, animaciones.
· Arquitectura de software: microservicios, monolito, eventos, colas, etc.
· Esquemas de datos: estructura exacta de documentos en base de datos, IDs, relaciones.
· Interfaz exacta: número de botones, posición de elementos, etiquetas exactas (aunque se han sugerido).

Todo esto será definido en la especificación técnica posterior.

---

31. Preguntas pendientes para la implementación técnica

Estas preguntas deben responderse antes de programar y no están determinadas por el protocolo ni por esta especificación.

31.1 Entrada de documentos

· ¿Qué formatos de texto soporta la carga? (TXT, PDF, DOCX, etc.)
· ¿Cómo se extrae el texto de esos formatos?
· ¿Cuál es el límite práctico de tamaño por documento?

31.2 Almacenamiento de sesión

· ¿La sesión se guarda en el navegador (localStorage) o en el servidor?
· Si es en servidor, ¿cómo se autentica al usuario?
· ¿Cuánto tiempo se conserva una sesión inactiva?

31.3 Participantes en Modalidad B

· En v0.1, ¿cómo se simula "participante A" y "participante B" si solo hay un usuario? (¿dos pestañas? ¿alternancia manual? ¿etiquetas dentro de la misma interfaz?)
· ¿Se permite que en el futuro un participante sea real? ¿Cómo se identifica?

31.4 Trazabilidad

· ¿Cómo se referencia un fragmento? (¿índice de documento? ¿línea? ¿posición de caracteres?)
· ¿Qué metadatos se almacenan para cada referencia y para cada nivel de procedencia?

31.5 Salida de Logos

· ¿El usuario ve el análisis completo en una sola pantalla o se navega progresivamente?
· ¿Cómo se maneja la "progresividad" si el usuario puede saltar etapas? (¿avisos? ¿marcado de provisionalidad?)

31.6 Integración con SOPHIA

· ¿Cómo obtiene Logos los datos de SOPHIA? (¿API? ¿archivo local? ¿el usuario los pega?)
· ¿Se muestra SOPHIA siempre o solo cuando el usuario lo pide?

31.7 Actualización dinámica

· ¿Cómo se señala "qué cambió y qué se mantuvo" en el análisis cuando se agrega información?
· ¿Se guarda el historial de versiones del análisis?

31.8 Manejo de errores

· ¿Qué ocurre si un documento es ilegible o está en un formato no soportado?
· ¿Qué ocurre si Logos no puede clasificar un desacuerdo en ningún tipo?

---

Fin de la especificación funcional v0.1.1.

Esta especificación es el contrato funcional para la implementación técnica posterior. Ninguna decisión de software debe tomarse antes de responder a las preguntas pendientes. La implementación debe respetar todos los criterios de aceptación y la clasificación CORE/OPCIONAL/FUTURO.
