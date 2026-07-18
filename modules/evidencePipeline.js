// modules/evidencePipeline.js
// Pipeline de verificación de afirmaciones.
// Gemini nunca verifica hechos. Gemini interpreta evidencia recuperada por el sistema.
//
// En V1: búsqueda simulada (sin API externa configurada).
// En V2: integración con APIs de búsqueda reales.

const { askVertex } = require("./vertexClient");

/**
 * Search Provider (V1 - simulado)
 * En producción, reemplazar por llamada a Google Custom Search, SerpAPI, etc.
 */
async function searchWeb(query) {
  // V1: sin búsqueda real, devolvemos array vacío.
  // Esto fuerza a que todos los claims queden como "evidencia_insuficiente".
  console.log(`   🔍 [Search] Buscando: "${query.substring(0, 80)}..." (simulado V1)`);
  return [];
}

/**
 * Evalúa un claim contra los resultados de búsqueda usando Gemini como intérprete.
 * Gemini solo interpreta, no decide el estado si no hay fuentes.
 */
async function evaluateClaim(claim, searchResults) {
  const prompt = `
Eres un evaluador de evidencia del sistema SOPHIA. Tu función es analizar si los resultados de búsqueda respaldan o refutan una afirmación.

Claim: "${claim.canonical_text}"
Tipo: ${claim.tipo}

Resultados de búsqueda encontrados:
${searchResults.length === 0 ? '(No se encontraron resultados de búsqueda)' : JSON.stringify(searchResults, null, 2)}

REGLAS ABSOLUTAS:
- Si NO hay resultados de búsqueda (array vacío), el estado es OBLIGATORIAMENTE "evidencia_insuficiente".
- NUNCA inventes fuentes ni verificaciones sin datos reales.
- Solo asigna "verificado" si hay fuentes concretas que respaldan el claim.
- Solo asigna "refutado" si hay fuentes concretas que contradicen el claim.
- Asigna "evidencia_en_conflicto" si hay fuentes contradictorias entre sí.
- Si hay resultados pero no son concluyentes, asigna "evidencia_insuficiente".

Devuelve EXCLUSIVAMENTE un JSON:
{
  "estado": "verificado|refutado|evidencia_en_conflicto|evidencia_insuficiente",
  "fuentes_relevantes": []
}`;

  const response = await askVertex(prompt);
  let cleaned = response.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
  return JSON.parse(cleaned);
}

async function verifyClaims(claims) {
  const results = {
    claims_verificados: [],
    claims_refutados: [],
    claims_en_conflicto: [],
    claims_evidencia_insuficiente: []
  };

  for (const claim of claims) {
    console.log(`   🔎 Verificando: "${claim.canonical_text.substring(0, 80)}..."`);

    // 1. Construir query (sin Gemini)
    const query = `${claim.canonical_text} ${claim.tipo === 'estadístico' ? 'estadísticas datos' : ''}`;

    // 2. Buscar
    const searchResults = await searchWeb(query);

    // 3. Evaluar con Gemini
    const evaluation = await evaluateClaim(claim, searchResults);

    // 4. Clasificar
    const entry = {
      claim_id: claim.claim_id,
      canonical_text: claim.canonical_text,
      original_texts: claim.original_texts,
      estado: evaluation.estado,
      fuentes: evaluation.fuentes_relevantes || []
    };

    switch (evaluation.estado) {
      case 'verificado':
        results.claims_verificados.push(entry);
        break;
      case 'refutado':
        results.claims_refutados.push(entry);
        break;
      case 'evidencia_en_conflicto':
        results.claims_en_conflicto.push(entry);
        break;
      default:
        results.claims_evidencia_insuficiente.push(entry);
    }
  }

  return results;
}

module.exports = { verifyClaims };
