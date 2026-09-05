// modules/evidencePipeline.js
// Pipeline de verificación de afirmaciones.
// Gemini nunca verifica hechos de memoria. Gemini interpreta evidencia
// recuperada por búsqueda real de Google (grounding de Vertex AI).
//
// V1 (anterior): búsqueda simulada — searchWeb() siempre devolvía [].
// V2 (esta versión): askVertexWithSearch() activa la búsqueda real de
// Google directamente en la misma llamada — ya no hace falta un paso
// de búsqueda separado.

const { askVertexWithSearch } = require("./vertexClient");

/**
 * Evalúa un claim usando búsqueda real de Google (vía Vertex grounding).
 * Gemini solo interpreta lo que la búsqueda real encontró — nunca decide
 * el estado a partir de su conocimiento entrenado.
 */
async function evaluateClaim(claim, timeoutMs = 50000) {
  const prompt = `
Eres un evaluador de evidencia del sistema SOPHIA. Verifica la siguiente afirmación
usando búsqueda de información actual y real, no tu conocimiento entrenado.

Claim: "${claim.canonical_text}"
Tipo: ${claim.tipo}

REGLAS ABSOLUTAS:
- Basate únicamente en los resultados de búsqueda reales que obtengas en este momento.
- Si la búsqueda no arroja información concluyente, el estado es OBLIGATORIAMENTE "evidencia_insuficiente".
- NUNCA inventes fuentes ni verificaciones sin datos reales de búsqueda.
- Solo asigna "verificado" si encontraste fuentes concretas que respaldan el claim.
- Solo asigna "refutado" si encontraste fuentes concretas que contradicen el claim.
- Asigna "evidencia_en_conflicto" si las fuentes encontradas se contradicen entre sí.

Devuelve EXCLUSIVAMENTE un JSON, sin texto adicional, sin comillas de markdown:
{
  "estado": "verificado|refutado|evidencia_en_conflicto|evidencia_insuficiente",
  "justificacion": "breve explicación de por qué, basada en lo que encontraste en la búsqueda"
}`;

  const { text, sources } = await askVertexWithSearch(
    prompt,
    undefined,
    timeoutMs,
    "factual_verification"
  );

  let cleaned = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
  let evaluation;
  try {
    evaluation = JSON.parse(cleaned);
  } catch (err) {
    console.error(`   ⚠️ No se pudo parsear la respuesta de evaluación como JSON. Se marca como evidencia insuficiente. Respuesta cruda: ${cleaned.substring(0, 200)}`);
    evaluation = { estado: "evidencia_insuficiente", justificacion: "Error al interpretar la respuesta del evaluador." };
  }

  // Las fuentes son las reales que devolvió la búsqueda de Google — nunca
  // las inventa Gemini, y solo se adjuntan si efectivamente hubo búsqueda.
  evaluation.fuentes_relevantes = sources;
  return evaluation;
}

async function verifyClaims(claims, timeoutMs = 50000) {
  const results = {
    claims_verificados: [],
    claims_refutados: [],
    claims_en_conflicto: [],
    claims_evidencia_insuficiente: []
  };

  // Todas las afirmaciones se verifican EN PARALELO (no una por una),
  // para que el tiempo total sea el de la más lenta, no la suma de todas.
  const evaluaciones = await Promise.all(
    claims.map(async (claim) => {
      console.log(`   🔎 Verificando con búsqueda real (Vertex grounding): "${claim.canonical_text.substring(0, 80)}..."`);
      try {
        const evaluation = await evaluateClaim(claim, timeoutMs);
        return { claim, evaluation };
      } catch (err) {
        console.error(`   ❌ Error al verificar claim ${claim.claim_id}:`, err.message);

        return {
          claim,
          evaluation: {
            estado: "evidencia_insuficiente",
            fuentes_relevantes: [],
            error_tecnico: true,
            error_mensaje: err.message
          }
        };
      }
    })
  );

  for (const { claim, evaluation } of evaluaciones) {
    const entry = {
      claim_id: claim.claim_id,
      canonical_text: claim.canonical_text,
      original_texts: claim.original_texts,
      estado: evaluation.estado,
      fuentes: evaluation.fuentes_relevantes || [],
      ...(evaluation.error_tecnico === true
        ? {
            error_tecnico: true,
            error_mensaje:
              evaluation.error_mensaje ||
              "Error técnico durante la verificación"
          }
        : {})
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
