const { askVertex } = require("./vertexClient");

/**
 * Módulo puente entre Sophia Engine V4 y Gemini.
 * Responsabilidad: Interpretar contexto sin alterar el cálculo determinista.
 */
async function generateGeminiReview(documentText, localResult, confiabilidadFactual = null) {
  
  // 1. Construir la sección de confiabilidad si existen los datos
  let confiabilidadSection = '';
  if (confiabilidadFactual && !confiabilidadFactual.error) {
    
    // MODIFICACIÓN: Intercepción de estado inactivo
    if (confiabilidadFactual.estado === "verificacion_no_realizada") {
      confiabilidadSection = `
RESULTADO DEL PIPELINE DE VERIFICACIÓN (Confiabilidad Factual):
- ESTADO: VERIFICACIÓN NO REALIZADA (Pipeline sin proveedor de búsqueda configurado en esta instancia).
- Afirmaciones detectadas pero NO verificadas: ${confiabilidadFactual.claims_extraidos || 0}

INSTRUCCIÓN ESTRICTA PARA LA IA: 
Como la verificación factual NO se realizó por falta de conexión a un buscador, ESTÁ ESTRICTAMENTE PROHIBIDO mencionar que hay "falta de evidencia", "ausencia de soporte factual" o similares. Ignora la factibilidad por ahora y evalúa la estructura del texto asumiendo que los datos aportados por el autor podrían ser correctos. Concéntrate exclusivamente en la robustez argumentativa y estructural.
`;
    } else {
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
    const rawResponse = await askVertex(prompt, undefined, undefined, undefined, "gemini_review");
    
    // Limpiamos la respuesta en caso de que Vertex devuelva el JSON envuelto en markdown
    let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // PARCHE DE ARQUITECTURA: Sanitizador determinista
    // Detecta y corrige comas faltantes entre propiedades (ej. antes de "contexto": o "observaciones":)
    cleanJson = cleanJson.replace(/([}\]"])\s+(?="[a-zA-Z0-9_]+":)/g, '$1,');
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("[SOPHIA-GEMINI-REVIEW] Error procesando la revisión:", error);
    return {
      interpretacion: "No se pudo generar la interpretación semántica.",
      contexto: "Error de conexión, timeout o formato irrecuperable con la capa cognitiva.",
      observaciones: "Requiere revisión manual.",
      preguntas_reflexivas: []
    };
  }
}

module.exports = { generateGeminiReview };
