// modules/claimExtractor.js
// Extrae ÚNICAMENTE afirmaciones empíricas y estadísticas verificables del texto.
// No verifica hechos, no opina, actúa como un filtro estricto de datos duros.

const { askVertex } = require("./vertexClient");

async function extractClaims(text) {
  const prompt = `
Eres un extractor de datos empíricos y evidencia del sistema SOPHIA. Tu única función es identificar en el texto enunciados con pretensión de verdad empírica o estadística QUE PUEDAN SER CONTRASTADOS con fuentes externas.

REGLAS ABSOLUTAS:
- Extrae ÚNICAMENTE afirmaciones que contengan:
  * Datos estadísticos, porcentajes, cifras numéricas o métricas.
  * Menciones explícitas a estudios, investigaciones, informes o autores específicos.
  * Hechos históricos, científicos o eventos empíricos concretos y precisos.
- IGNORA Y OMITE por completo:
  * Opiniones, juicios de valor, posturas éticas o políticas.
  * Proposiciones normativas ("debemos...", "se debería...", "es necesario...").
  * Predicciones a futuro o reflexiones abstractas.
- Extrae el texto LITERAL de la afirmación, sin parafrasear.
- Si el texto NO contiene ninguna afirmación empírica o estadística verificable, devuelve EXCLUSIVAMENTE un array vacío [].

Texto del documento:
"""
${text.substring(0, 8000)}
"""

Devuelve EXCLUSIVAMENTE un array JSON con este formato, sin texto adicional ni explicaciones:
[
  {
    "claim_text": "texto literal de la afirmación",
    "tipo": "estadístico|factual|histórico|científico",
    "verificable": true
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
    
    // Filtro defensivo: conservar únicamente los marcados como verificables y con tipo empírico
    return parsed.filter(item => 
      item.verificable === true && 
      ["estadístico", "factual", "histórico", "científico"].includes(item.tipo)
    );
  } catch (error) {
    console.error("Error en extractClaims:", error.message);
    return [];
  }
}

module.exports = { extractClaims };
