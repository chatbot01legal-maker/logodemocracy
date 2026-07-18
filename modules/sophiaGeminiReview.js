const { askVertex } = require("./vertexClient");

/**
 * Módulo puente entre Sophia Engine V4 y Gemini.
 * Responsabilidad: Interpretar contexto sin alterar el cálculo determinista.
 */
async function generateGeminiReview(documentText, localResult, confiabilidadFactual = null) {
  
  // 1. Construir la sección de confiabilidad si existen los datos
  let confiabilidadSection = '';
  if (confiabilidadFactual && !confiabilidadFactual.error) {
    confiabilidadSection = `
RESULTADO DEL PIPELINE DE VERIFICACIÓN (Confiabilidad Factual):
- Afirmaciones verificadas: ${confiabilidadFactual.claims_verificados?.length || 0}
- Afirmaciones refutadas: ${confiabilidadFactual.claims_refutados?.length || 0}
- Afirmaciones con evidencia en conflicto: ${confiabilidadFactual.claims_en_conflicto?.length || 0}
- Afirmaciones sin evidencia suficiente: ${confiabilidadFactual.claims_evidencia_insuficiente?.length || 0}

Detalle de afirmaciones verificadas:
${confiabilidadFactual.claims_verificados?.map(c => `  ✅ "${c.canonical_text}"`).join('\n') || '  (ninguna)'}

Detalle de afirmaciones refutadas:
${confiabilidadFactual.claims_refutados?.map(c => `  ❌ "${c.canonical_text}"`).join('\n') || '  (ninguna)'}

Instrucción adicional: En tu 'interpretacion' o 'contexto', menciona brevemente la relación entre la robustez deliberativa (IRD) y la confiabilidad factual de este documento.
`;
  }

  // 2. Ensamblar el prompt completo
  const prompt = `
Eres SOPHIA-Gemini, la capa semántica cognitiva del proyecto LogoDemocracia.
Tu tarea exclusiva es interpretar los resultados del motor determinista local y ofrecer una capa de comprensión contextual ciudadana.

REGLAS ESTRICTAS DE ARQUITECTURA:
1. NO puedes recalcular ni sugerir modificaciones al Índice de Robustez Deliberativa (IRD).
2. NO puedes anular, borrar o modificar las evidencias o penalizaciones detectadas por el motor.
3. Tu rol es explicar el contexto semántico: detectar si un átomo (ej. causalidad) fue usado con un fin retórico, irónico o crítico (ej. el autor está refutando una falacia, no cometiéndola), y ofrecer observaciones.

DOCUMENTO ORIGINAL:
"""
${documentText}
"""

RESULTADO DEL MOTOR LOCAL (SOPHIA ENGINE V4):
"""
${JSON.stringify(localResult, null, 2)}
"""
${confiabilidadSection}
Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta (sin bloques de código markdown, sin texto previo ni posterior):
{
  "interpretacion": "Breve resumen de tu interpretación general del texto y su robustez argumentativa.",
  "contexto": "Explicación del contexto semántico, detectando posibles tensiones entre la regla estructural y la intención del autor (ej. uso crítico de átomos).",
  "observaciones": "Observaciones puntuales sobre las evidencias estructurales detectadas.",
  "preguntas_reflexivas": ["Pregunta 1", "Pregunta 2"]
}
`;

  try {
    const rawResponse = await askVertex(prompt);
    // Limpiamos la respuesta en caso de que Vertex devuelva el JSON envuelto en markdown
    const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("[SOPHIA-GEMINI-REVIEW] Error procesando la revisión:", error);
    return {
      interpretacion: "No se pudo generar la interpretación semántica.",
      contexto: "Error de conexión o timeout con la capa cognitiva.",
      observaciones: "Requiere revisión manual.",
      preguntas_reflexivas: []
    };
  }
}

module.exports = { generateGeminiReview };
