// modules/claimNormalizer.js
// Capa de normalización de afirmaciones. No verifica, no consulta fuentes, no utiliza IA.
//
// Principio fundamental:
// "El claimNormalizer puede cambiar la forma del texto, pero nunca su significado."
// Cualquier modificación futura debe preservar este principio.

const NORMALIZATION_VERSION = "1.0";

function normalizeText(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/["""]/g, '"')
    .replace(/[''']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/(\d)\s+(\d)/g, '$1$2')
    .trim();
}

function areEquivalent(a, b) {
  return a === b;
}

function generateClaimId(index) {
  return `CLM-${String(index).padStart(6, '0')}`;
}

function groupEquivalentClaims(claims) {
  const groups = new Map();
  let groupIndex = 0;

  for (const claim of claims) {
    const canonical = normalizeText(claim.claim_text);
    const key = `${claim.tipo}::${claim.verificable}::${canonical}`;

    if (groups.has(key)) {
      const group = groups.get(key);
      if (!group.original_texts.includes(claim.claim_text)) {
        group.original_texts.push(claim.claim_text);
      }
    } else {
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

async function normalizeClaims(claims) {
  if (!Array.isArray(claims)) {
    throw new Error('La entrada debe ser un array de claims');
  }

  if (claims.length === 0) {
    return [];
  }

  for (const claim of claims) {
    if (!claim.claim_text || !claim.tipo || claim.verificable === undefined) {
      throw new Error(`Claim inválido: ${JSON.stringify(claim)}`);
    }
  }

  return groupEquivalentClaims(claims);
}

module.exports = { normalizeClaims };
