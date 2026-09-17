// logodemocracy-api/src/services/rf/brujulaEngine.js
//
// Motor determinista de perfil de aprendizaje — Microtest "brujula".
// Implementa el contrato "Motor determinista de perfil de aprendizaje —
// Rey Filósofo · Beta 1", versión 1.0.1 (A.6.2 reformulado: el requisito
// de distinción de A.6.2 se satisface por el conjunto de los tres campos
// dominante/relacion/implicacion, no por cada campo individualmente —
// ver B.9, que delega explícitamente en "relacion" la distinción entre
// E:4|P:1 y E:4|S:1), Niveles A y B (Microtest brujula).
//
// Principios de A.2 respetados explícitamente:
// - Determinismo estricto: mismas 5 respuestas -> mismo firm_key -> mismo
//   shape -> misma regla -> mismo texto. Sin Date.now(), sin Math.random(),
//   sin llamadas a red ni a ningún modelo generativo.
// - Trazabilidad total: cada campo de salida es derivable de firm_key/shape.
// - Hipótesis, no diagnóstico: todo el lenguaje respeta A.7.
// - Sin decisiones implícitas: un indicador fuera de los 4 válidos, o un
//   array que no tenga longitud 5, lanza error. No hay fallback.
//
// Las 56 reglas de dominante/relacion/implicacion viven en FIRM_RULES como
// 56 entradas literales, cada una redactada como unidad (no generadas por
// funciones parametrizadas por shape). Esto es una decisión de
// implementación autorizada explícitamente: se reemplazan los 6 builders
// de la versión anterior por texto explícito, uno por firma, para que la
// auditoría de "leer las 56 reglas" sea directa sobre el código y no
// dependa de ejecutar el motor para verla.
//
// Este módulo es puro: no requiere Mongoose, Express ni acceso a red.
// Eso permite que brujulaEngine.test.js corra los 56 casos sin backend.

'use strict';

const crypto = require('crypto');

// ============================================================
// A.3 — CONSTANTES DEL MICROTEST "brujula" (Nivel B, B.1 / B.2)
// ============================================================

const TEST_ID = 'brujula';
const CONTRACT_VERSION = '1.0.1';
const SHAPE_ALGORITHM_VERSION = 1;

const ALLOWED_INDICATORS = ['ejemplo', 'principio', 'analogia', 'secuencia'];

// B.2 — nombre descriptivo (label). Se usa SIEMPRE en las plantillas de
// patron. Nunca se usa la clave interna en el texto de salida.
const LABELS = {
  ejemplo: 'buscar un caso concreto para comprender',
  principio: 'identificar la regla o el principio general',
  analogia: 'relacionar con algo ya conocido',
  secuencia: 'reconstruir el proceso paso a paso'
};

// ============================================================
// B.3 — LAS SEIS PLANTILLAS DE "patron" (texto exacto del contrato,
// no se modifican).
// ============================================================

const PATRON_TEMPLATES = {
  '5': (i) =>
    'En las cinco respuestas de este Microtest apareció el mismo recurso: ' +
    i[0] + '.',
  '4-1': (i) =>
    'En cuatro de las cinco respuestas aparece ' + i[0] + '; en una sola, ' +
    i[1] + '.',
  '3-2': (i) =>
    'Tus respuestas se reparten entre dos recursos: ' + i[0] +
    ' aparece en tres respuestas, y ' + i[1] + ' en dos.',
  '3-1-1': (i) =>
    'Tres de tus respuestas comparten un mismo recurso —' + i[0] +
    '—, mientras que las otras dos utilizan recursos distintos: ' + i[1] +
    ' y ' + i[2] + '.',
  '2-2-1': (i) =>
    'Tus respuestas se organizan en dos pares —' + i[0] + ' y ' + i[1] +
    '— junto a una aparición aislada de ' + i[2] + '.',
  '2-1-1-1': (i) =>
    'Hay un recurso que se repite —' + i[0] + '— junto a otros tres que ' +
    'aparecen una sola vez cada uno: ' + i[1] + ', ' + i[2] + ' y ' + i[3] +
    '.'
};

// patron_template_id estable por shape (A.8): identifica la plantilla
// usada, independientemente de si el texto resuelto coincidiera por
// casualidad con el de otro shape.
const PATRON_TEMPLATE_ID = {
  '5': 'brujula.patron.5',
  '4-1': 'brujula.patron.4-1',
  '3-2': 'brujula.patron.3-2',
  '3-1-1': 'brujula.patron.3-1-1',
  '2-2-1': 'brujula.patron.2-2-1',
  '2-1-1-1': 'brujula.patron.2-1-1-1'
};

// ============================================================
// A.4 — FIRMA Y SHAPES
// ============================================================

function computeCounts(indicators) {
  const counts = {};
  ALLOWED_INDICATORS.forEach((ind) => { counts[ind] = 0; });
  indicators.forEach((ind) => { counts[ind] += 1; });
  return counts;
}

// Orden canónico: count descendente; empate alfabético por clave interna.
// Se usa tanto para firm_key como para el orden de los slots de patron
// (B.3: "en orden canónico").
function canonicalOrder(counts) {
  return Object.keys(counts)
    .filter((ind) => counts[ind] > 0)
    .sort((a, b) => {
      if (counts[b] !== counts[a]) return counts[b] - counts[a];
      return a < b ? -1 : (a > b ? 1 : 0);
    });
}

function buildFirmKey(counts, ordered) {
  return ordered.map((ind) => ind + ':' + counts[ind]).join('|');
}

// A.4.2 — Las seis particiones posibles de 5 en hasta 4 partes.
function classifyShape(counts, ordered) {
  const sortedCounts = ordered.map((ind) => counts[ind]);
  const key = sortedCounts.join('-');
  const VALID_SHAPES = ['5', '4-1', '3-2', '3-1-1', '2-2-1', '2-1-1-1'];
  if (VALID_SHAPES.indexOf(key) === -1) {
    throw new Error('brujulaEngine: partición de conteos no reconocida: ' + key);
  }
  return key;
}

// ============================================================
// B.4 / B.6 / B.9 — LAS 56 REGLAS FIRM-LEVEL, LITERALES.
//
// Ruling del auditor del contrato (ver historial): 56 reglas explícitas
// para brujula, cada una redactada como unidad (dominante+relacion+
// implicacion juntos), no generadas por builders parametrizados por
// shape. Cada entrada es contenido de Nivel B específico de su firma —
// no hay dos firmas que compartan las tres frases.
//
// ejemplo:5 es la firma de calibración (B.6): su texto es literal, tal
// como quedó aprobado, y no se reescribe.
// ============================================================

const FIRM_RULES = {

  // ---- shape 5 (4 firmas) ----
  'analogia:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron relacionar el fenómeno con algo ya conocido como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esto sugiere que presentarte contenido nuevo en esta dimensión ofreciendo primero una comparación con algo que ya conoces podría facilitar tu comprensión. Un acompañamiento que no ofrezca ningún punto de referencia conocido podría requerir un esfuerzo adicional.'
  },
  'ejemplo:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron un ejemplo concreto como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esto sugiere que presentarte contenido nuevo en esta dimensión comenzando por un caso concreto y avanzando desde ahí hacia la regla general podría facilitar tu comprensión. Un acompañamiento que empiece por la abstracción y luego descienda a ejemplos podría requerir un esfuerzo adicional.'
  },
  'principio:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron identificar la regla o el principio general como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esto sugiere que presentarte contenido nuevo en esta dimensión comenzando por la regla general y descendiendo después hacia casos concretos podría facilitar tu comprensión. Un acompañamiento que solo ofrezca casos aislados, sin explicitar el principio que los conecta, podría requerir un esfuerzo adicional.'
  },
  'secuencia:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron reconstruir el proceso paso a paso como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esto sugiere que presentarte contenido nuevo en esta dimensión siguiendo un orden temporal o procesual, paso a paso, podría facilitar tu comprensión. Un acompañamiento que muestre el resultado final sin mostrar el proceso que lleva a él podría requerir un esfuerzo adicional.'
  },

  // ---- shape 4-1 (12 firmas) ----
  'analogia:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a un caso concreto que muestra el fenómeno funcionando, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en una comparación con algo conocido podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también un caso concreto como vía alternativa podría ser de ayuda.'
  },
  'analogia:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la regla o el principio general que explica el fenómeno, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en una comparación con algo conocido podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también la regla o principio general como vía alternativa podría ser de ayuda.'
  },
  'analogia:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la reconstrucción del proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en una comparación con algo conocido podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también los pasos del proceso como vía alternativa podría ser de ayuda.'
  },
  'ejemplo:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a una comparación con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en un caso concreto podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una comparación con algo conocido como vía alternativa podría ser de ayuda.'
  },
  'ejemplo:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la regla o el principio general que explica el fenómeno, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en un caso concreto podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también la regla o principio general como vía alternativa podría ser de ayuda.'
  },
  'ejemplo:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la reconstrucción del proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en un caso concreto podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también los pasos del proceso como vía alternativa podría ser de ayuda.'
  },
  'principio:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a una comparación con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en la regla o principio general podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una comparación con algo conocido como vía alternativa podría ser de ayuda.'
  },
  'principio:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a un caso concreto que muestra el fenómeno funcionando, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en la regla o principio general podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también un caso concreto como vía alternativa podría ser de ayuda.'
  },
  'principio:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la reconstrucción del proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en la regla o principio general podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también los pasos del proceso como vía alternativa podría ser de ayuda.'
  },
  'secuencia:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a una comparación con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en los pasos del proceso podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una comparación con algo conocido como vía alternativa podría ser de ayuda.'
  },
  'secuencia:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a un caso concreto que muestra el fenómeno funcionando, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en los pasos del proceso podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también un caso concreto como vía alternativa podría ser de ayuda.'
  },
  'secuencia:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a la regla o el principio general que explica el fenómeno, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que presentarte contenido nuevo en esta dimensión apoyándote principalmente en los pasos del proceso podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también la regla o principio general como vía alternativa podría ser de ayuda.'
  },

  // ---- shape 3-2 (12 firmas) ----
  'analogia:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: una comparación con algo ya conocido, presente en tres de las cinco situaciones planteadas, y un caso concreto que muestra el fenómeno funcionando, presente en las otras dos.',
    relacion: 'Un caso concreto convive con una comparación con algo ya conocido: la comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con otro ya comprendido, aunque en tus respuestas una comparación con algo conocido aparece con mayor frecuencia que un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido con un caso concreto al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en una comparación con algo conocido y usar un caso concreto como refuerzo podría ser especialmente útil.'
  },
  'analogia:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: una comparación con algo ya conocido, presente en tres de las cinco situaciones planteadas, y la regla o el principio general que explica el fenómeno, presente en las otras dos.',
    relacion: 'La búsqueda de la regla general convive con una comparación con algo ya conocido: la comprensión se apoya tanto en identificar qué rige el fenómeno como en vincularlo con otro caso ya comprendido, aunque en tus respuestas una comparación con algo conocido aparece con mayor frecuencia que la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido con la regla o principio general al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en una comparación con algo conocido y usar la regla o principio general como refuerzo podría ser especialmente útil.'
  },
  'analogia:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: una comparación con algo ya conocido, presente en tres de las cinco situaciones planteadas, y la reconstrucción del proceso paso a paso, presente en las otras dos.',
    relacion: 'Una comparación con algo ya conocido convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, aunque en tus respuestas una comparación con algo conocido aparece con mayor frecuencia que los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido con los pasos del proceso al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en una comparación con algo conocido y usar los pasos del proceso como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: un caso concreto que muestra el fenómeno funcionando, presente en tres de las cinco situaciones planteadas, y una comparación con algo ya conocido, presente en las otras dos.',
    relacion: 'Un caso concreto convive con una comparación con algo ya conocido: la comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con otro ya comprendido, aunque en tus respuestas un caso concreto aparece con mayor frecuencia que una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto con una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en un caso concreto y usar una comparación con algo conocido como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: un caso concreto que muestra el fenómeno funcionando, presente en tres de las cinco situaciones planteadas, y la regla o el principio general que explica el fenómeno, presente en las otras dos.',
    relacion: 'Un caso concreto que muestra el fenómeno funcionando convive con la búsqueda de la regla que lo explica: la comprensión se apoya tanto en lo observado como en lo que lo rige, aunque en tus respuestas un caso concreto aparece con mayor frecuencia que la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto con la regla o principio general al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en un caso concreto y usar la regla o principio general como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: un caso concreto que muestra el fenómeno funcionando, presente en tres de las cinco situaciones planteadas, y la reconstrucción del proceso paso a paso, presente en las otras dos.',
    relacion: 'Un caso concreto convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en un punto de observación concreto como en seguir su desarrollo en el tiempo, aunque en tus respuestas un caso concreto aparece con mayor frecuencia que los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto con los pasos del proceso al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en un caso concreto y usar los pasos del proceso como refuerzo podría ser especialmente útil.'
  },
  'principio:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la regla o el principio general que explica el fenómeno, presente en tres de las cinco situaciones planteadas, y una comparación con algo ya conocido, presente en las otras dos.',
    relacion: 'La búsqueda de la regla general convive con una comparación con algo ya conocido: la comprensión se apoya tanto en identificar qué rige el fenómeno como en vincularlo con otro caso ya comprendido, aunque en tus respuestas la regla o principio general aparece con mayor frecuencia que una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar la regla o principio general con una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en la regla o principio general y usar una comparación con algo conocido como refuerzo podría ser especialmente útil.'
  },
  'principio:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la regla o el principio general que explica el fenómeno, presente en tres de las cinco situaciones planteadas, y un caso concreto que muestra el fenómeno funcionando, presente en las otras dos.',
    relacion: 'Un caso concreto que muestra el fenómeno funcionando convive con la búsqueda de la regla que lo explica: la comprensión se apoya tanto en lo observado como en lo que lo rige, aunque en tus respuestas la regla o principio general aparece con mayor frecuencia que un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar la regla o principio general con un caso concreto al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en la regla o principio general y usar un caso concreto como refuerzo podría ser especialmente útil.'
  },
  'principio:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la regla o el principio general que explica el fenómeno, presente en tres de las cinco situaciones planteadas, y la reconstrucción del proceso paso a paso, presente en las otras dos.',
    relacion: 'La búsqueda de la regla general convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en identificar qué rige el fenómeno como en seguir su desarrollo en el tiempo, aunque en tus respuestas la regla o principio general aparece con mayor frecuencia que los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar la regla o principio general con los pasos del proceso al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en la regla o principio general y usar los pasos del proceso como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la reconstrucción del proceso paso a paso, presente en tres de las cinco situaciones planteadas, y una comparación con algo ya conocido, presente en las otras dos.',
    relacion: 'Una comparación con algo ya conocido convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, aunque en tus respuestas los pasos del proceso aparece con mayor frecuencia que una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar los pasos del proceso con una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en los pasos del proceso y usar una comparación con algo conocido como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la reconstrucción del proceso paso a paso, presente en tres de las cinco situaciones planteadas, y un caso concreto que muestra el fenómeno funcionando, presente en las otras dos.',
    relacion: 'Un caso concreto convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en un punto de observación concreto como en seguir su desarrollo en el tiempo, aunque en tus respuestas los pasos del proceso aparece con mayor frecuencia que un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar los pasos del proceso con un caso concreto al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en los pasos del proceso y usar un caso concreto como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: la reconstrucción del proceso paso a paso, presente en tres de las cinco situaciones planteadas, y la regla o el principio general que explica el fenómeno, presente en las otras dos.',
    relacion: 'La búsqueda de la regla general convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en identificar qué rige el fenómeno como en seguir su desarrollo en el tiempo, aunque en tus respuestas los pasos del proceso aparece con mayor frecuencia que la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar los pasos del proceso con la regla o principio general al presentar contenido nuevo en esta dimensión podría ayudarte a construir una comprensión más completa. En algunos casos, apoyarte primero en los pasos del proceso y usar la regla o principio general como refuerzo podría ser especialmente útil.'
  },

  // ---- shape 3-1-1 (12 firmas) ----
  'analogia:3|ejemplo:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, un caso concreto y la regla o principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a un caso concreto o a la regla o principio general podría aportar un punto de apoyo adicional.'
  },
  'analogia:3|ejemplo:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, un caso concreto y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a un caso concreto o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'analogia:3|principio:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, la regla o principio general y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en una comparación con algo conocido al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a la regla o principio general o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'ejemplo:3|analogia:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y la regla o principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en un caso concreto al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a la regla o principio general podría aportar un punto de apoyo adicional.'
  },
  'ejemplo:3|analogia:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en un caso concreto al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'ejemplo:3|principio:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, la regla o principio general y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en un caso concreto al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a la regla o principio general o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'principio:3|analogia:1|ejemplo:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y un caso concreto, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a un caso concreto podría aportar un punto de apoyo adicional.'
  },
  'principio:3|analogia:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'principio:3|ejemplo:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, un caso concreto y los pasos del proceso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a un caso concreto o a los pasos del proceso podría aportar un punto de apoyo adicional.'
  },
  'secuencia:3|analogia:1|ejemplo:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y un caso concreto, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a un caso concreto podría aportar un punto de apoyo adicional.'
  },
  'secuencia:3|analogia:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, una comparación con algo conocido y la regla o principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a una comparación con algo conocido o a la regla o principio general podría aportar un punto de apoyo adicional.'
  },
  'secuencia:3|ejemplo:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, que aparece como el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, un caso concreto y la regla o principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Tus respuestas sugieren que apoyarte principalmente en los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, recurrir también a un caso concreto o a la regla o principio general podría aportar un punto de apoyo adicional.'
  },

  // ---- shape 2-2-1 (12 firmas) ----
  'analogia:2|ejemplo:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y un caso concreto que muestra el fenómeno funcionando, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto convive con una comparación con algo ya conocido: la comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con otro ya comprendido, junto a una única aparición de la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y un caso concreto al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en la regla o principio general también podría ser útil.'
  },
  'analogia:2|ejemplo:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y un caso concreto que muestra el fenómeno funcionando, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto convive con una comparación con algo ya conocido: la comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con otro ya comprendido, junto a una única aparición de los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y un caso concreto al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en los pasos del proceso también podría ser útil.'
  },
  'analogia:2|principio:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y la regla o el principio general que explica el fenómeno, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La búsqueda de la regla general convive con una comparación con algo ya conocido: la comprensión se apoya tanto en identificar qué rige el fenómeno como en vincularlo con otro caso ya comprendido, junto a una única aparición de un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en un caso concreto también podría ser útil.'
  },
  'analogia:2|principio:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y la regla o el principio general que explica el fenómeno, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La búsqueda de la regla general convive con una comparación con algo ya conocido: la comprensión se apoya tanto en identificar qué rige el fenómeno como en vincularlo con otro caso ya comprendido, junto a una única aparición de los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en los pasos del proceso también podría ser útil.'
  },
  'analogia:2|secuencia:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Una comparación con algo ya conocido convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, junto a una única aparición de un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en un caso concreto también podría ser útil.'
  },
  'analogia:2|secuencia:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Una comparación con algo ya conocido convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, junto a una única aparición de la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar una comparación con algo conocido y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en la regla o principio general también podría ser útil.'
  },
  'ejemplo:2|principio:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: un caso concreto que muestra el fenómeno funcionando y la regla o el principio general que explica el fenómeno, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto que muestra el fenómeno funcionando convive con la búsqueda de la regla que lo explica: la comprensión se apoya tanto en lo observado como en lo que lo rige, junto a una única aparición de una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto y la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en una comparación con algo conocido también podría ser útil.'
  },
  'ejemplo:2|principio:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: un caso concreto que muestra el fenómeno funcionando y la regla o el principio general que explica el fenómeno, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto que muestra el fenómeno funcionando convive con la búsqueda de la regla que lo explica: la comprensión se apoya tanto en lo observado como en lo que lo rige, junto a una única aparición de los pasos del proceso.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto y la regla o principio general al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en los pasos del proceso también podría ser útil.'
  },
  'ejemplo:2|secuencia:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: un caso concreto que muestra el fenómeno funcionando y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en un punto de observación concreto como en seguir su desarrollo en el tiempo, junto a una única aparición de una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en una comparación con algo conocido también podría ser útil.'
  },
  'ejemplo:2|secuencia:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: un caso concreto que muestra el fenómeno funcionando y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Un caso concreto convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en un punto de observación concreto como en seguir su desarrollo en el tiempo, junto a una única aparición de la regla o principio general.',
    implicacion: 'Tus respuestas sugieren que combinar un caso concreto y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en la regla o principio general también podría ser útil.'
  },
  'principio:2|secuencia:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: la regla o el principio general que explica el fenómeno y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La búsqueda de la regla general convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en identificar qué rige el fenómeno como en seguir su desarrollo en el tiempo, junto a una única aparición de una comparación con algo conocido.',
    implicacion: 'Tus respuestas sugieren que combinar la regla o principio general y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en una comparación con algo conocido también podría ser útil.'
  },
  'principio:2|secuencia:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: la regla o el principio general que explica el fenómeno y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La búsqueda de la regla general convive con la reconstrucción del proceso paso a paso: la comprensión se apoya tanto en identificar qué rige el fenómeno como en seguir su desarrollo en el tiempo, junto a una única aparición de un caso concreto.',
    implicacion: 'Tus respuestas sugieren que combinar la regla o principio general y los pasos del proceso al presentar contenido nuevo en esta dimensión podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual basado en un caso concreto también podría ser útil.'
  },

  // ---- shape 2-1-1-1 (4 firmas) ----
  'analogia:2|ejemplo:1|principio:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a una comparación con algo ya conocido, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, un caso concreto, la regla o principio general y los pasos del proceso, de manera puntual.',
    implicacion: 'Tus respuestas sugieren que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando una comparación con algo conocido con ejemplos puntuales de un caso concreto, la regla o principio general o los pasos del proceso podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro recurso de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'ejemplo:2|analogia:1|principio:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a un caso concreto que muestra el fenómeno funcionando, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, una comparación con algo conocido, la regla o principio general y los pasos del proceso, de manera puntual.',
    implicacion: 'Tus respuestas sugieren que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando un caso concreto con ejemplos puntuales de una comparación con algo conocido, la regla o principio general o los pasos del proceso podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro recurso de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'principio:2|analogia:1|ejemplo:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a la regla o el principio general que explica el fenómeno, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, una comparación con algo conocido, un caso concreto y los pasos del proceso, de manera puntual.',
    implicacion: 'Tus respuestas sugieren que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando la regla o principio general con ejemplos puntuales de una comparación con algo conocido, un caso concreto o los pasos del proceso podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro recurso de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'secuencia:2|analogia:1|ejemplo:1|principio:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a la reconstrucción del proceso paso a paso, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, una comparación con algo conocido, un caso concreto y la regla o principio general, de manera puntual.',
    implicacion: 'Tus respuestas sugieren que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando los pasos del proceso con ejemplos puntuales de una comparación con algo conocido, un caso concreto o la regla o principio general podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro recurso de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
};

// ============================================================
// A.8 — rule_version: SHA-256 sobre la serialización canónica exacta.
// ============================================================

function computeRuleVersion(fields) {
  // Orden alfabético por nombre de campo, tal como exige A.8.
  const orderedValues = [
    fields.dominante_text,
    fields.firm_key,
    fields.implicacion_text,
    fields.patron_template_id,
    fields.patron_text_resuelto,
    fields.relacion_text,
    fields.testId
  ].map((v) => Buffer.from(String(v).normalize('NFC'), 'utf8'));

  const NUL = Buffer.from([0]);
  const parts = [];
  orderedValues.forEach((buf, idx) => {
    if (idx > 0) parts.push(NUL);
    parts.push(buf);
  });

  const canonicalBuffer = Buffer.concat(parts);
  return crypto.createHash('sha256').update(canonicalBuffer).digest('hex');
}

// ============================================================
// API PÚBLICA
// ============================================================

// ------------------------------------------------------------------
// Decisiones explícitas (no delegadas al criterio de la IA
// implementadora, señaladas aquí por escrito, tal como exige A.12):
//
// 1) generated_at vs. determinismo estricto (A.11.7).
//    buildProfile() NUNCA llama a Date.now() ni a ninguna fuente de
//    entropía. Por eso su output es byte a byte idéntico entre
//    ejecuciones (verificado en brujulaEngine.test.js con
//    assert.deepStrictEqual sobre dos llamadas). "generated_at" no es un
//    campo de esta función: lo añade microtestController.js DESPUÉS de
//    llamar a buildProfile(), como metadato de cuándo se persistió el
//    registro. No participa en el cálculo de rule_version (ver
//    computeRuleVersion) ni se compara en las pruebas de determinismo.
//
// 2) Política de campos adicionales en deterministic_profile respecto a
//    los 9 campos de A.8. A.8 define un MÍNIMO obligatorio, no una lista
//    cerrada. testId/attemptId/timestamp ya existen en el nivel superior
//    de "attempt" (no se duplican); firm_key, shape,
//    shape_algorithm_version, contract_version, rule_version e
//    indicators son devueltos por esta función. Se permiten campos
//    adicionales documentados (como "generated_at") siempre que no
//    reemplacen ninguno de los 9 y no entren en rule_version salvo que
//    el contrato lo exija.
//
// 3) A.6.2 (contrato v1.0.1): "dominante, relacion e implicacion deben
//    distinguir su firma" se satisface por el CONJUNTO de los tres
//    campos, no exige que cada campo sea individualmente único dentro de
//    su shape. Por diseño, "dominante" puede coincidir entre firmas que
//    comparten indicador primario (shapes 4-1, 3-1-1) o par principal
//    (2-2-1): en esos casos "relacion" es quien distingue, tal como B.9
//    delega explícitamente ("el relacion debe distinguir claramente
//    entre principio y secuencia como secundarios", B.9 punto 1). La
//    tripleta dominante+relacion+implicacion SÍ es única en las 56
//    firmas — verificado en brujulaEngine.test.js.
// ------------------------------------------------------------------

/**
 * Construye el perfil determinista de un intento de "brujula" a partir de
 * los 5 indicadores ya extraídos de attempt.evidence (en orden de
 * pregunta). No recibe answers ni evidence completos: el llamador
 * (microtestController) es responsable de extraer
 * attempt.evidence.map(e => e.indicator) antes de invocar esta función.
 *
 * Pura y determinista: mismos 5 indicadores -> mismo objeto devuelto,
 * byte a byte, en cualquier ejecución. No usa Date.now() ni Math.random();
 * el llamador es responsable de añadir un timestamp de persistencia
 * (generated_at) fuera de esta función si lo necesita.
 *
 * @param {string[]} indicators - Array de exactamente 5 claves internas,
 *   cada una en ['ejemplo','principio','analogia','secuencia'].
 * @returns {object} deterministic_profile (sin generated_at).
 */
function buildProfile(indicators) {
  if (!Array.isArray(indicators) || indicators.length !== 5) {
    throw new Error(
      'brujulaEngine.buildProfile: se requieren exactamente 5 indicadores ' +
      '(recibido: ' + (Array.isArray(indicators) ? indicators.length : typeof indicators) + ').'
    );
  }

  indicators.forEach((ind, idx) => {
    if (ALLOWED_INDICATORS.indexOf(ind) === -1) {
      throw new Error(
        'brujulaEngine.buildProfile: indicador inválido en posición ' + idx +
        ': "' + ind + '". Válidos: ' + ALLOWED_INDICATORS.join(', ') + '.'
      );
    }
  });

  const counts = computeCounts(indicators);
  const ordered = canonicalOrder(counts);
  const firm_key = buildFirmKey(counts, ordered);
  const shape = classifyShape(counts, ordered);

  const labelsOrdered = ordered.map((ind) => LABELS[ind]);
  const patron = PATRON_TEMPLATES[shape](labelsOrdered);
  const patron_template_id = PATRON_TEMPLATE_ID[shape];

  // Búsqueda directa en la tabla literal de 56 reglas. Sin fallback: si
  // faltara una entrada (no debería, hay 56 y las 56 combinaciones
  // posibles están cubiertas), se lanza error en vez de inventar texto.
  const firmRules = FIRM_RULES[firm_key];
  if (!firmRules) {
    throw new Error('brujulaEngine: no existe regla explícita para firm_key: ' + firm_key);
  }

  const rule_version = computeRuleVersion({
    testId: TEST_ID,
    firm_key: firm_key,
    patron_template_id: patron_template_id,
    patron_text_resuelto: patron,
    dominante_text: firmRules.dominante,
    relacion_text: firmRules.relacion,
    implicacion_text: firmRules.implicacion
  });

  return {
    indicators: indicators.slice(),
    firm_key: firm_key,
    shape: shape,
    shape_algorithm_version: SHAPE_ALGORITHM_VERSION,
    contract_version: CONTRACT_VERSION,
    rule_version: rule_version,
    interpretation: {
      patron: patron,
      dominante: firmRules.dominante,
      relacion: firmRules.relacion,
      implicacion: firmRules.implicacion
    }
  };
}

module.exports = {
  TEST_ID,
  CONTRACT_VERSION,
  SHAPE_ALGORITHM_VERSION,
  ALLOWED_INDICATORS,
  LABELS,
  FIRM_RULES,
  buildProfile,
  // Exportadas para que brujulaEngine.test.js pueda enumerar las 56 firmas
  // sin duplicar la lógica de conteo/orden.
  _internal: {
    computeCounts,
    canonicalOrder,
    buildFirmKey,
    classifyShape
  }
};
