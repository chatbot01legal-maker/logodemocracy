// modules/claimExtractor.js
// Extrae afirmaciones verificables del texto usando Vertex AI (Gemini).
// No verifica hechos, no opina, solo extrae.

const { askVertex } = require("./vertexClient");

async function extractClaims(text) {
  const prompt = `
Eres un extractor de afirmaciones del sistema SOPHIA. Tu única función es identificar enunciados declarativos con pretensión de factualidad en el texto proporcionado.

REGLAS ABSOLUTAS:
- NO evalúes si las afirmaciones son verdaderas o falsas.
- NO opines sobre el texto.
- Extrae SOLO afirmaciones que puedan ser contrastadas con fuentes externas.
- Clasifica cada afirmación en UNO de estos tipos: "factual", "estadístico", "histórico", "científico", "normativo", "predictivo", "metadiscursivo".
- Marca como "verificable": true SOLO si el tipo es factual, estadístico, histórico o científico.
- Marca como "verificable": false para normativo, predictivo (no realizable en el presente) y metadiscursivo.
- Extrae el texto LITERAL de cada afirmación, sin parafrasear.
- Si no encuentras afirmaciones, devuelve un array vacío [].

Texto del documento:
"""
${text.substring(0, 8000)}
"""

Devuelve EXCLUSIVAMENTE un array JSON con este formato, sin texto adicional ni explicaciones:
[
  {
    "claim_text": "texto literal de la afirmación",
    "tipo": "factual|estadístico|histórico|científico|normativo|predictivo|metadiscursivo",
    "verificable": true|false
  }
]`;

  try {
    const response = await askVertex(prompt);
    // Limpiar marcas de código Markdown
    let cleaned = response.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
    // Intentar parsear
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) {
      console.warn("claimExtractor: respuesta no es un array, devolviendo array vacío");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error en extractClaims:", error.message);
    return [];
  }
}

module.exports = { extractClaims };
