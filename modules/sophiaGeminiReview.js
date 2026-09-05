const { askVertex } = require("./vertexClient");

/**
 * Módulo puente entre Sophia Engine V4 y Gemini.
 * Responsabilidad: Interpretar contexto sin alterar el cálculo determinista.
 */

// ─── VPA — VALE LA PENA PRESTAR ATENCIÓN ──────────────
// Misma lógica que el frontend (sophia.js: computeVPA): una relectura de
// fases[].infracciones, no una fórmula nueva. Se calcula aquí también
// para que el prompt le dé a Gemini el número y la categoría reales en
// vez de dejar que la IA infiera o repita un IRD que ya no es el
// concepto central.
function computeVPA(fases) {
  const puntos = [];
  (fases || []).forEach(fase => {
    (fase.infracciones || []).forEach(inf => {
      puntos.push({
        fase: fase.nombre || fase.id,
        criterio: inf.criterio,
        constructo: inf.constructo,
        atomos: inf.atomos_activados || [],
        mitigado: !!inf.mitigado_parcialmente,
        severidad: inf.penalizacion
      });
    });
  });
  let categoria;
  if (puntos.length === 0) categoria = "Sin puntos de atención";
  else if (puntos.length <= 2) categoria = "Pocos puntos de atención";
  else if (puntos.length <= 5) categoria = "Varios puntos de atención";
  else categoria = "Múltiples puntos de atención";
  return { conteo: puntos.length, categoria, puntos };
}

async function generateGeminiReview(documentText, localResult, confiabilidadFactual = null) {

  // 0. Calcular VPA a partir del mismo resultado que ya produjo el motor.
  //    Esto es lo que se le pasa a Gemini como dato central — no el IRD.
  const vpa = computeVPA(localResult && localResult.fases);

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
Como la verificación factual NO se realizó por falta de conexión a un buscador, ESTÁ ESTRICTAMENTE PROHIBIDO mencionar que hay "falta de evidencia", "ausencia de soporte factual" o similares. Ignora la factibilidad por ahora y evalúa la estructura del texto asumiendo que los datos aportados por el autor podrían ser correctos. Concéntrate exclusivamente en qué partes del razonamiento vale la pena examinar con más cuidado.
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

Instrucción adicional: En tu 'interpretacion' o 'contexto', menciona brevemente cómo se relacionan los puntos de atención (VPA) detectados en el razonamiento con la confiabilidad factual de este documento. No uses la palabra "IRD" ni "robustez" como si fueran una nota: son señales para revisar, no una calificación.
`;
    }
  }

  // 2. Ensamblar el prompt completo
  const prompt = `
Eres SOPHIA-Gemini, la capa semántica cognitiva del proyecto LogoDemocracia.
Tu tarea exclusiva es interpretar los resultados del motor determinista local y ofrecer una capa de comprensión contextual ciudadana.

QUÉ ES SOPHIA (para que tu narrativa sea coherente con el instrumento):
SOPHIA no es un calificador ni un juez de la calidad del razonamiento. Es un instrumento de pensamiento crítico: examina cómo está construido un argumento y señala qué partes vale la pena revisar con más cuidado. No determina si el autor tiene razón ni le pone una nota al texto.

VPA — VALE LA PENA PRESTAR ATENCIÓN (el dato central, no el IRD):
- Puntos de atención detectados: ${vpa.conteo}
- Categoría: ${vpa.categoria}
- Detalle: ${JSON.stringify(vpa.puntos, null, 2)}

REGLAS ESTRICTAS DE ARQUITECTURA:
1. NO puedes recalcular ni sugerir modificaciones a los puntos de atención (VPA) ya detectados por el motor determinista.
2. NO puedes anular, borrar ni agregar evidencias o puntos de atención — solo puedes contextualizarlos (confirmar, mitigar, explicar o señalar como falso positivo).
3. Tu rol es explicar el contexto semántico: detectar si un átomo (ej. causalidad) fue usado con un fin retórico, irónico o crítico (ej. el autor está refutando una falacia, no cometiéndola), y ofrecer observaciones.
4. PROHIBIDO usar las expresiones "IRD", "Índice de Robustez Deliberativa", "puntaje", "puntuación", "nota" o "califica" en cualquier campo de tu respuesta. Refiérete siempre a "puntos de atención (VPA)", nunca a una nota de 0 a 100.
5. Si VPA = 0, no lo presentes como "el argumento es correcto" o "está probado" — solo como "SOPHIA no encontró puntos de atención en la estructura", dejando claro que esto no certifica la verdad del contenido.

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
  "interpretacion": "Breve resumen de tu interpretación general del texto: qué examina el argumento y qué puntos de atención (VPA) — si los hay — vale la pena revisar. Sin lenguaje de nota ni de robustez.",
  "contexto": "Explicación del contexto semántico, detectando posibles tensiones entre la señal estructural y la intención del autor (ej. uso crítico de átomos, experimento mental, ironía).",
  "observaciones": "Observaciones puntuales sobre las evidencias estructurales detectadas: si cada punto de atención fue confirmado, mitigado, contextualizado o resultó un falso positivo.",
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

    const parsed = JSON.parse(cleanJson);

    // La respuesta se devuelve tal como fue generada.
    // El prompt ya establece el contrato semántico: VPA, no IRD ni puntuaciones.
    return parsed;
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
             
