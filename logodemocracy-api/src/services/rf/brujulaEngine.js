// logodemocracy-api/src/services/rf/brujulaEngine.js
//
// Motor determinista de perfil de aprendizaje — Microtest "brujula".
// Implementa el contrato "Motor determinista de perfil de aprendizaje —
// Rey Filósofo · Beta 1", versión 1.0.2

'use strict';

const crypto = require('crypto');

// ============================================================
// A.3 — CONSTANTES DEL MICROTEST "brujula" (Nivel B, B.1 / B.2)
// ============================================================

const TEST_ID = 'brujula';
const CONTRACT_VERSION = '1.0.2';
const SHAPE_ALGORITHM_VERSION = 1;

const ALLOWED_INDICATORS = ['ejemplo', 'principio', 'analogia', 'secuencia'];

const LABELS = {
  ejemplo: 'buscar un caso concreto para comprender',
  principio: 'identificar la regla o el principio general',
  analogia: 'relacionar con algo ya conocido',
  secuencia: 'reconstruir el proceso paso a paso'
};

// ============================================================
// B.3 — LAS SEIS PLANTILLAS DE "patron"
// ============================================================

const PATRON_TEMPLATES = {
  '5': () =>
    'En las cinco respuestas de este Microtest apareció el mismo recurso.',
  '4-1': () =>
    'En cuatro de las cinco respuestas apareció el mismo recurso; en una, ' +
    'otro distinto.',
  '3-2': () =>
    'Tus respuestas se reparten entre dos recursos, uno presente en tres ' +
    'respuestas y otro en dos.',
  '3-1-1': () =>
    'Tres de tus respuestas comparten un mismo recurso, mientras que las ' +
    'otras dos utilizan recursos distintos entre sí.',
  '2-2-1': () =>
    'Tus respuestas se organizan en dos pares junto a una aparición ' +
    'aislada.',
  '2-1-1-1': () =>
    'Hay un recurso que se repite, junto a otros tres que aparecen una ' +
    'sola vez cada uno.'
};

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
// ============================================================

const FIRM_RULES = {

  // ---- shape 5 (4 firmas) ----
  'analogia:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron relacionar con algo ya conocido como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo en esta dimensión ofreciendo primero las referencias conocidas podría facilitar tu comprensión. Un acompañamiento que no ofrezca ningún punto de referencia conocido podría requerir un esfuerzo adicional.'
  },
  'ejemplo:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron buscar un caso concreto como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo en esta dimensión comenzando por lo concreto y advancing desde ahí hacia lo general podría facilitar tu comprensión. Un acompañamiento que empiece por la abstracción podría requerir un esfuerzo adicional.'
  },
  'principio:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron identificar la regla o el principio general como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo en esta dimensión comenzando por lo general y descendiendo después hacia lo concreto podría facilitar tu comprensión. Un acompañamiento que solo ofrezca casos aislados, sin explicitar qué los conecta, podría requerir un esfuerzo adicional.'
  },
  'secuencia:5': {
    dominante: 'En las cinco situaciones planteadas, tus respuestas eligieron reconstruir el proceso paso a paso como punto de entrada a la comprensión.',
    relacion: 'No aparece de forma recurrente ningún otro recurso en tus respuestas.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo en esta dimensión siguiendo el orden del proceso, paso a paso, podría facilitar tu comprensión. Un acompañamiento que muestre el resultado final sin mostrar el proceso que lleva a él podría requerir un esfuerzo adicional.'
  },

  // ---- shape 4-1 (12 firmas) ----
  'analogia:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a buscar un caso concreto para comprender, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'analogia:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a identificar la regla o el principio general, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'analogia:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a reconstruir el proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'ejemplo:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a relacionar con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'ejemplo:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a identificar la regla o el principio general, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'ejemplo:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a reconstruir el proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'principio:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a relacionar con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'principio:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a buscar un caso concreto para comprender, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'principio:4|secuencia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a reconstruir el proceso paso a paso, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'secuencia:4|analogia:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a relacionar con algo ya conocido, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'secuencia:4|ejemplo:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a buscar un caso concreto para comprender, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },
  'secuencia:4|principio:1': {
    dominante: 'En cuatro de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, que aparece como el recurso predominante en esta dimensión.',
    relacion: 'Junto a ese predominio, en una sola situación tus respuestas recurrieron en cambio a identificar la regla o el principio general, sin que este segundo recurso llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que presentarte contenido nuevo apoyándote principalmente en el recurso predominante podría facilitar tu comprensión en la mayoría de los casos. En algunos casos, ofrecer también una vía alternativa distinta podría ser de ayuda.'
  },

  // ---- shape 3-2 (12 firmas) ----
  'analogia:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: relacionar con algo ya conocido, presente en tres de las cinco situaciones planteadas, y buscar un caso concreto para comprender, presente en las otras dos.',
    relacion: 'Ambos recursos conviven de manera complementaria, combinando la vinculación con referencias previas y la atención a situaciones concretas.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'analogia:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: relacionar con algo ya conocido, presente en tres de las cinco situaciones planteadas, y identificar la regla o el principio general, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en vincularlo con algo ya conocido, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'analogia:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: relacionar con algo ya conocido, presente en tres de las cinco situaciones planteadas, y reconstruir el proceso paso a paso, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: buscar un caso concreto para comprender, presente en tres de las cinco situaciones planteadas, y relacionar con algo ya conocido, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con algo ya conocido, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: buscar un caso concreto para comprender, presente en tres de las cinco situaciones planteadas, y identificar la regla o el principio general, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en identificar lo que lo rige, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'ejemplo:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: buscar un caso concreto para comprender, presente en tres de las cinco situaciones planteadas, y reconstruir el proceso paso a paso, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'principio:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: identificar la regla o el principio general, presente en tres de las cinco situaciones planteadas, y relacionar con algo ya conocido, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en vincularlo con algo ya conocido, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'principio:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: identificar la regla o el principio general, presente en tres de las cinco situaciones planteadas, y buscar un caso concreto para comprender, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en identificar lo que lo rige, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'principio:3|secuencia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: identificar la regla o el principio general, presente en tres de las cinco situaciones planteadas, y reconstruir el proceso paso a paso, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|analogia:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: reconstruir el proceso paso a paso, presente en tres de las cinco situaciones planteadas, y relacionar con algo ya conocido, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|ejemplo:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: reconstruir el proceso paso a paso, presente en tres de las cinco situaciones planteadas, y buscar un caso concreto para comprender, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },
  'secuencia:3|principio:2': {
    dominante: 'Tus respuestas se dividen principalmente entre dos recursos: reconstruir el proceso paso a paso, presente en tres de las cinco situaciones planteadas, y identificar la regla o el principio general, presente en las otras dos.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en seguir su desarrollo en el tiempo, aunque el primero aparece con mayor frecuencia que el segundo.',
    implicacion: 'Esta combinación sugiere que presentar contenido nuevo apoyándose en ambos recursos podría ayudarte a construir una comprensión más completa. En algunos casos, priorizar primero el más frecuente y usar el otro como refuerzo podría ser especialmente útil.'
  },

  // ---- shape 3-1-1 (12 firmas) ----
  'analogia:3|ejemplo:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, buscar un caso concreto para comprender e identificar la regla o el principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'analogia:3|ejemplo:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, buscar un caso concreto para comprender y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'analogia:3|principio:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, identificar la regla o el principio general y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'ejemplo:3|analogia:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido e identificar la regla o el principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'ejemplo:3|analogia:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'ejemplo:3|principio:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, identificar la regla o el principio general y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'principio:3|analogia:1|ejemplo:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido y buscar un caso concreto para comprender, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'principio:3|analogia:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'principio:3|ejemplo:1|secuencia:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, buscar un caso concreto para comprender y reconstruir el proceso paso a paso, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'secuencia:3|analogia:1|ejemplo:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido y buscar un caso concreto para comprender, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'secuencia:3|analogia:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, relacionar con algo ya conocido e identificar la regla o el principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },
  'secuencia:3|ejemplo:1|principio:1': {
    dominante: 'En tres de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, el recurso más frecuente en esta dimensión.',
    relacion: 'Junto a ese recurso más frecuente, tus respuestas también incluyeron, una vez cada uno, buscar un caso concreto para comprender e identificar la regla o el principio general, sin que ninguno de los dos llegue a repetirse.',
    implicacion: 'Esta pauta sugiere que apoyarte principalmente en el recurso más frecuente al presentar contenido nuevo podría facilitar tu comprensión. En algunos casos, recurrir también a alguno de los dos recursos puntuales podría aportar un apoyo adicional.'
  },

  // ---- shape 2-2-1 (12 firmas) ----
  'analogia:2|ejemplo:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: relacionar con algo ya conocido y buscar un caso concreto para comprender, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con algo ya conocido, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'analogia:2|ejemplo:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: relacionar con algo ya conocido y buscar un caso concreto para comprender, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en vincularlo con algo ya conocido, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'analogia:2|principio:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: relacionar con algo ya conocido y identificar la regla o el principio general, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en vincularlo con algo ya conocido, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'analogia:2|principio:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: relacionar con algo ya conocido y identificar la regla o el principio general, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en vincularlo con algo ya conocido, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'analogia:2|secuencia:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: relacionar con algo ya conocido y reconstruir el proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'analogia:2|secuencia:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: una comparación con algo ya conocido y la reconstrucción del proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en vincular el fenómeno con otro ya comprendido como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'ejemplo:2|principio:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: buscar un caso concreto para comprender y identificar la regla o el principio general, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en identificar lo que lo rige, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'ejemplo:2|principio:2|secuencia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: buscar un caso concreto para comprender y identificar la regla o el principio general, cada uno presente en dos de las cinco situaciones.',
    relacion: 'Ambos recursos principales conviven al conectar marcos generales con situaciones específicas, complementados por un apoyo puntual en el desarrollo por etapas.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'ejemplo:2|secuencia:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: buscar un caso concreto para comprender y reconstruir el proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'ejemplo:2|secuencia:2|principio:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: buscar un caso concreto para comprender y reconstruir el proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en observar el fenómeno mismo como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'principio:2|secuencia:2|analogia:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: identificar la regla o el principio general y reconstruir el proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },
  'principio:2|secuencia:2|ejemplo:1': {
    dominante: 'Tus respuestas se organizan en dos recursos igualmente frecuentes: identificar la regla o el principio general y reconstruir el proceso paso a paso, cada uno presente en dos de las cinco situaciones.',
    relacion: 'La comprensión se apoya tanto en identificar lo que rige el fenómeno como en seguir su desarrollo en el tiempo, junto a una única aparición aislada de otro recurso.',
    implicacion: 'Esta combinación sugiere que presentarte contenido nuevo desde ambas vías a la vez podría facilitar tu comprensión. En algunos casos, un punto de apoyo puntual en el recurso aislado también podría ser útil.'
  },

  // ---- shape 2-1-1-1 (4 firmas) ----
  'analogia:2|ejemplo:1|principio:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a relacionar con algo ya conocido, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, buscar un caso concreto para comprender, identificar la regla o el principio general y reconstruir el proceso paso a paso, de manera puntual.',
    implicacion: 'Esta pauta sugiere que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando el recurso principal con alguno de los recursos puntuales podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'ejemplo:2|analogia:1|principio:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a buscar un caso concreto para comprender, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, relacionar con algo ya conocido, identificar la regla o el principio general y reconstruir el proceso paso a paso, de manera puntual.',
    implicacion: 'Esta pauta sugiere que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando el recurso principal con alguno de los recursos puntuales podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'principio:2|analogia:1|ejemplo:1|secuencia:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a identificar la regla o el principio general, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, relacionar con algo ya conocido, buscar un caso concreto para comprender y reconstruir el proceso paso a paso, de manera puntual.',
    implicacion: 'Esta pauta sugiere que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando el recurso principal con alguno de los recursos puntuales podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
  'secuencia:2|analogia:1|ejemplo:1|principio:1': {
    dominante: 'En dos de las cinco situaciones planteadas, tus respuestas recurrieron a reconstruir el proceso paso a paso, el recurso que aparece con mayor frecuencia, aunque sin concentrar la mayoría de tus respuestas.',
    relacion: 'Junto a ese recurso, tus respuestas incluyeron también, una vez cada uno, relacionar con algo ya conocido, buscar un caso concreto para comprender e identificar la regla o el principio general, de manera puntual.',
    implicacion: 'Esta pauta sugiere que, en este caso, ningún recurso predomina de forma clara, por lo que presentarte contenido nuevo combinando el recurso principal con alguno de los recursos puntuales podría ser lo más adecuado. En ciertas situaciones, apoyarte en uno u otro de manera puntual podría facilitar distintos aspectos de la comprensión.'
  },
};

// ============================================================
// A.8 — rule_version: SHA-256 sobre la serialización canónica exacta.
// ============================================================

function computeRuleVersion(fields) {
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

  const patron = PATRON_TEMPLATES[shape]();
  const patron_template_id = PATRON_TEMPLATE_ID[shape];

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
  _internal: {
    computeCounts,
    canonicalOrder,
    buildFirmKey,
    classifyShape
  }
};
