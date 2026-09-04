// modules/sophiaAcademySelector.js
//
// Selección determinista de qué evidencias y qué claims se envían a las
// capas de IA (Semantic Review y Fact Checking) para un documento de
// Academia. Nunca usa Gemini para seleccionar — solo prioriza con las
// propiedades que ya vienen en los datos producidos por SophiaEngineV4
// y por claimNormalizer.js. No modifica ni reimplementa esos módulos.

const MAX_ACADEMY_SEMANTIC_REVIEWS = 5;
const MAX_ACADEMY_FACTUAL_CHECKS = 5;

// Orden de prioridad por tipo de claim, usado solo como desempate estable
// cuando dos claims tienen la misma cantidad de repeticiones en el texto.
// No es una relación inventada: es una preferencia declarada sobre tipos
// ya presentes en el dato (claim.tipo).
const PRIORIDAD_TIPO_CLAIM = {
  "científico": 0,
  "estadístico": 1,
  "histórico": 2,
  "factual": 3
};

/**
 * Selecciona como máximo `max` evidencias semánticas para Academia.
 *
 * Prioridad, en este orden:
 *  1. Se descartan las evidencias ya neutralizadas por un contraindicador
 *     (mitigado_por_contraindicador === true): el propio motor ya resolvió
 *     que no son un punto de atención real, así que revisarlas con Gemini
 *     sería gastar presupuesto en algo ya cerrado.
 *  2. Se puntúan por severidad_base * relevancia (las mismas magnitudes
 *     que ya expone SophiaEngineV4 en cada evidencia — no se inventa una
 *     métrica nueva).
 *  3. Se deduplica por segmento_indice: dos evidencias en el mismo
 *     segmento apuntan al mismo tramo de texto; se conserva solo la de
 *     mayor puntaje.
 *  4. Se favorece diversidad de criterio: en una primera pasada se toma
 *     como máximo una evidencia por criterio distinto (ya vienen
 *     ordenadas por puntaje, así que es la mejor de cada criterio); si
 *     sobran cupos, se completan con las siguientes de mayor puntaje sin
 *     esa restricción.
 *
 * No usa Gemini. No hace red. Es pura función sobre el array de entrada.
 *
 * @param {Array} evidencias - localResult.evidencias de SophiaEngineV4
 * @param {number} max
 * @returns {Array} subconjunto de `evidencias`, longitud <= max
 */
function selectAcademySemanticEvidence(evidencias, max = MAX_ACADEMY_SEMANTIC_REVIEWS) {
  if (!Array.isArray(evidencias) || evidencias.length === 0) return [];

  const candidatas = evidencias.filter(e => e && !e.mitigado_por_contraindicador);
  if (candidatas.length === 0) return [];

  const puntuadas = candidatas.map(e => ({
    evidencia: e,
    score: (typeof e.severidad_base === 'number' ? e.severidad_base : 0) *
           (typeof e.relevancia === 'number' ? e.relevancia : 1)
  }));
  puntuadas.sort((a, b) => b.score - a.score);

  const segmentosVistos = new Set();
  const sinDuplicados = [];
  for (const { evidencia } of puntuadas) {
    const clave = String(evidencia.segmento_indice);
    if (segmentosVistos.has(clave)) continue;
    segmentosVistos.add(clave);
    sinDuplicados.push(evidencia);
  }

  const criteriosVistos = new Set();
  const primeraPasada = [];
  const resto = [];
  for (const evidencia of sinDuplicados) {
    if (!criteriosVistos.has(evidencia.criterio) && primeraPasada.length < max) {
      criteriosVistos.add(evidencia.criterio);
      primeraPasada.push(evidencia);
    } else {
      resto.push(evidencia);
    }
  }

  return primeraPasada.concat(resto).slice(0, max);
}

/**
 * Selecciona como máximo `max` claims normalizados para Academia.
 *
 * Prioridad, basada exclusivamente en propiedades presentes en el dato
 * que produce claimNormalizer.js (no se infiere ni se inventa ninguna
 * relación entre claims y evidencias que no exista ya en los datos):
 *  1. original_texts.length descendente — un claim que aparece formulado
 *     de varias maneras distintas en el documento es, por definición,
 *     más repetido/central que uno mencionado una sola vez.
 *  2. tipo, como desempate determinista (ver PRIORIDAD_TIPO_CLAIM).
 *  3. orden original de normalizeClaims(), como desempate final estable.
 *
 * No usa Gemini. No hace red.
 *
 * @param {Array} claimsNormalizados - salida de normalizeClaims()
 * @param {number} max
 * @returns {Array} subconjunto de `claimsNormalizados`, longitud <= max
 */
function selectAcademyClaims(claimsNormalizados, max = MAX_ACADEMY_FACTUAL_CHECKS) {
  if (!Array.isArray(claimsNormalizados) || claimsNormalizados.length === 0) return [];

  const indexados = claimsNormalizados.map((claim, idx) => ({ claim, idx }));

  indexados.sort((a, b) => {
    const repA = Array.isArray(a.claim.original_texts) ? a.claim.original_texts.length : 0;
    const repB = Array.isArray(b.claim.original_texts) ? b.claim.original_texts.length : 0;
    if (repB !== repA) return repB - repA;

    const tipoA = PRIORIDAD_TIPO_CLAIM.hasOwnProperty(a.claim.tipo) ? PRIORIDAD_TIPO_CLAIM[a.claim.tipo] : 99;
    const tipoB = PRIORIDAD_TIPO_CLAIM.hasOwnProperty(b.claim.tipo) ? PRIORIDAD_TIPO_CLAIM[b.claim.tipo] : 99;
    if (tipoA !== tipoB) return tipoA - tipoB;

    return a.idx - b.idx;
  });

  return indexados.slice(0, max).map(item => item.claim);
}

module.exports = {
  selectAcademySemanticEvidence,
  selectAcademyClaims,
  MAX_ACADEMY_SEMANTIC_REVIEWS,
  MAX_ACADEMY_FACTUAL_CHECKS
};

