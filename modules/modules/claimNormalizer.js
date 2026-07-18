// modules/claimNormalizer.js
// Capa de normalización de afirmaciones. No verifica, no consulta fuentes, no utiliza IA.
//
// Principio fundamental:
// "El claimNormalizer puede cambiar la forma del texto, pero nunca su significado."
// Cualquier modificación futura debe preservar este principio.
//
// Versión actual: 1.0 (normalización superficial conservadora)

const NORMALIZATION_VERSION = "1.0";

/**
 * Normaliza un texto aplicando transformaciones superficiales conservadoras.
 * No utiliza embeddings, no interpreta semántica, no modifica el significado.
 * 
 * Transformaciones permitidas (solo forma, no significado):
 * - Espacios duplicados → un solo espacio
 * - Trim (espacios al inicio/final)
 * - Comillas tipográficas → comillas rectas
 * - Guiones largos → guión simple
 * - Unir dígitos separados por espacio (ej: "20 000" → "20000")
 * 
 * Transformaciones PROHIBIDAS (modifican significado):
 * - Eliminar palabras como "aproximadamente", "alrededor de", "unos"
 * - Eliminar puntuación significativa (? ! : ;)
 * - Reescribir números en texto a dígitos
 * - Cualquier cambio que altere la precisión, modalidad o fuerza del claim
 * 
 * @param {string} text - Texto original del claim.
 * @returns {string} Texto normalizado (forma canónica superficial).
 */
function normalizeText(text) {
  return text
    .trim()                                          // Espacios al inicio y final
    .replace(/\s+/g, ' ')                            // Múltiples espacios por uno solo
    .replace(/["""]/g, '"')                         // Comillas tipográficas a comillas rectas
    .replace(/[''']/g, "'")                         // Apóstrofes tipográficos a rectos
    .replace(/[–—]/g, '-')                           // Guiones largos a guión simple
    .replace(/(\d)\s+(\d)/g, '$1$2')                // Unir dígitos separados por espacio
    .trim();                                         // Limpiar posibles espacios generados
}

/**
 * Compara si dos textos normalizados son equivalentes.
 * 
 * ***** POLÍTICA DE EQUIVALENCIA DEL SISTEMA *****
 * En V1 (actual): igualdad exacta tras normalización superficial.
 * En V2 (prevista): embeddings con umbral de similitud semántica.
 * 
 * Esta función encapsula la política de equivalencia. Cualquier cambio
 * en el criterio de agrupación debe implementarse aquí, sin modificar
 * el resto del módulo.
 * 
 * @param {string} a - Primer texto en forma canónica.
 * @param {string} b - Segundo texto en forma canónica.
 * @returns {boolean} true si son equivalentes según la política actual.
 */
function areEquivalent(a, b) {
  return a === b;
}

/**
 * Genera un identificador único secuencial para cada claim normalizado.
 * El formato es CLM-XXXXXX con ceros a la izquierda.
 * 
 * ***** IMPORTANTE *****
 * Este identificador es TEMPORAL y válido únicamente para la ejecución actual.
 * No es persistente entre ejecuciones. Si cambia el orden de extracción o
 * el algoritmo de normalización, el mismo claim puede recibir un ID diferente.
 * Para trazabilidad a largo plazo, debe usarse en combinación con
 * el texto canónico y los textos originales.
 * 
 * @param {number} index - Índice secuencial (base 1).
 * @returns {string} Identificador único temporal.
 */
function generateClaimId(index) {
  return `CLM-${String(index).padStart(6, '0')}`;
}

/**
 * Agrupa claims del mismo tipo y verificabilidad que tengan textos canónicos equivalentes.
 * Preserva los textos originales para trazabilidad completa.
 * 
 * Reglas de agrupación:
 * - Claims de distinto tipo NUNCA se agrupan (ej: factual ≠ normativo).
 * - Claims con distinto valor de verificable NUNCA se agrupan.
 * - Claims con mismo tipo y verificable se agrupan si su texto canónico es equivalente
 *   según la política definida en areEquivalent().
 * 
 * @param {Array} claims - Array de claims extraídos por claimExtractor.
 * @returns {Array} Array de claims normalizados y agrupados.
 */
function groupEquivalentClaims(claims) {
  const groups = new Map();
  let groupIndex = 0;

  for (const claim of claims) {
    const canonical = normalizeText(claim.claim_text);
    // La clave de agrupación incluye tipo y verificable para no mezclar categorías
    const key = `${claim.tipo}::${claim.verificable}::${canonical}`;

    if (groups.has(key)) {
      // Añadir a un grupo existente
      const group = groups.get(key);
      if (!group.original_texts.includes(claim.claim_text)) {
        group.original_texts.push(claim.claim_text);
      }
    } else {
      // Crear un nuevo grupo
      groupIndex++;
      groups.set(key, {
        claim_id: generateClaimId(groupIndex),
        canonical_text: canonical,
        original_texts: [claim.claim_text],
        tipo: claim.tipo,
        verificable: claim.verificable,
        normalization_version: NORMALIZATION_VERSION
      });
    }
  }

  return Array.from(groups.values());
}

/**
 * Normaliza y agrupa afirmaciones semánticamente equivalentes.
 * 
 * Esta función es el punto de entrada principal del módulo.
 * Recibe los claims extraídos por claimExtractor.js y devuelve
 * un array de claims normalizados, agrupados por equivalencia superficial,
 * sin modificar tipos ni verificabilidad.
 * 
 * La firma es async aunque actualmente sea síncrona, para permitir
 * reemplazar el algoritmo interno sin romper contratos futuros.
 * 
 * @param {Array} claims - Array de objetos { claim_text, tipo, verificable }
 * @returns {Promise<Array>} Array de objetos normalizados {
 *   claim_id, canonical_text, original_texts, tipo, verificable, normalization_version
 * }
 */
async function normalizeClaims(claims) {
  if (!Array.isArray(claims)) {
    throw new Error('La entrada debe ser un array de claims');
  }

  if (claims.length === 0) {
    return [];
  }

  // Validar que cada claim tenga los campos obligatorios
  for (const claim of claims) {
    if (!claim.claim_text || !claim.tipo || claim.verificable === undefined) {
      throw new Error(`Claim inválido: ${JSON.stringify(claim)}`);
    }
  }

  // Agrupar por equivalencia superficial conservadora
  const normalizedClaims = groupEquivalentClaims(claims);

  return normalizedClaims;
}

module.exports = { normalizeClaims };
