// modules/sophiaAcademyGeminiReview.js
//
// Interpretación final específica de Academia. A diferencia de
// generateGeminiReview() (modules/sophiaGeminiReview.js), esta función
// NUNCA envía el documento completo ni el localResult completo a Gemini:
// solo un paquete compacto con los hallazgos ya seleccionados por
// sophiaAcademySelector.js. Es una sola llamada, siempre.
//
// No modifica modules/sophiaGeminiReview.js. No lo reutiliza tampoco,
// porque su contrato exige documento completo + localResult completo,
// justo lo que Academia necesita evitar (regla 9 de la tarea).

const { askVertex } = require("./vertexClient");

// Misma lógica de conteo que sophiaGeminiReview.js, reimplementada aquí
// deliberadamente: no está exportada desde ese archivo y no debe
// modificarse ese archivo para exportarla. Son ~15 líneas puras, sin
// efectos secundarios — el costo de la duplicación es menor que el de
// tocar un contrato ya estable.
function computeAcademyVPA(fases) {
  const puntos = [];
  (fases || []).forEach(fase => {
    (fase.infracciones || []).forEach(inf => {
      puntos.push({
        fase: fase.nombre || fase.id,
        criterio: inf.criterio,
        constructo: inf.constructo,
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

function sanitizeVPALanguage(texto) {
  if (!texto || typeof texto !== 'string') return texto;
  return texto
    .replace(/Índice de Robustez Deliberativa \(IRD\)/gi, 'VPA (Vale la Pena Prestar Atención)')
    .replace(/Índice de Robustez Deliberativa/gi, 'VPA (Vale la Pena Prestar Atención)')
    .replace(/\bIRD\b/g, 'VPA')
    .replace(/\bpuntuaci[oó]n\b/gi, 'puntos de atención')
    .replace(/\bcalifica(ci[oó]n)?\b/gi, 'examina');
}

function sanitizeAcademyResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') return parsed;
  if (typeof parsed.interpretacion === 'string') parsed.interpretacion = sanitizeVPALanguage(parsed.interpretacion);
  if (typeof parsed.contexto === 'string') parsed.contexto = sanitizeVPALanguage(parsed.contexto);
  if (typeof parsed.observaciones === 'string') {
    parsed.observaciones = sanitizeVPALanguage(parsed.observaciones);
  } else if (Array.isArray(parsed.observaciones)) {
    parsed.observaciones = parsed.observaciones.map(o => (typeof o === 'string' ? sanitizeVPALanguage(o) : o));
  }
  if (Array.isArray(parsed.preguntas_reflexivas)) {
    parsed.preguntas_reflexivas = parsed.preguntas_reflexivas.map(p => sanitizeVPALanguage(p));
  }
  return parsed;
}

/**
 * @param {Object} datosSeleccionados
 * @param {string} datosSeleccionados.naturaleza_documental
 * @param {string} datosSeleccionados.riesgo
 * @param {Array}  datosSeleccionados.fases            - localResult.fases (para computeAcademyVPA)
 * @param {Array}  datosSeleccionados.semanticReview    - salida de procesarPenalizaciones(), ya acotada a <=5
 * @param {Object|null} datosSeleccionados.confiabilidadFactual - salida de verifyClaims(), o null si no hubo claims
 * @param {Object} datosSeleccionados.rutasEvaluadas    - localResult.rutas_evaluadas (solo tipo/descripcion de saltos, sin fragmentos inventados)
 * @returns {Promise<Object>} { interpretacion, contexto, observaciones, preguntas_reflexivas }
 */
async function generateAcademyGeminiReview({ naturaleza_documental, riesgo, fases, semanticReview, confiabilidadFactual, rutasEvaluadas }) {
  const vpa = computeAcademyVPA(fases);

  // Paquete compacto: solo lo que ya fue seleccionado, nunca el documento
  // ni el localResult completos.
  const puntosDeAtencion = (semanticReview || []).map(e => ({
    criterio: e.criterio,
    fase: e.fase,
    atomo: e.atomo,
    fragmento: e.fragmento,
    revision: e.revision_semantica ? {
      categoria: e.revision_semantica.categoria,
      falso_positivo: e.revision_semantica.falso_positivo,
      confianza: e.revision_semantica.confianza,
      razon: e.revision_semantica.razon
    } : null
  }));

  // Solo tipo/descripcion, tal como los produce evaluateInferentialRoutes
  // en sophiaEngineV4.js — nunca un fragmento de texto fabricado, porque
  // el contrato real no asocia un segmento verificable a cada salto.
  const saltosInferenciales = (rutasEvaluadas && Array.isArray(rutasEvaluadas.saltos_detectados))
    ? rutasEvaluadas.saltos_detectados.map(s => ({ tipo: s.tipo, descripcion: s.descripcion }))
    : [];

  const resumenFactual = confiabilidadFactual ? {
    verificados: (confiabilidadFactual.claims_verificados || []).map(c => c.canonical_text),
    refutados: (confiabilidadFactual.claims_refutados || []).map(c => c.canonical_text),
    en_conflicto: (confiabilidadFactual.claims_en_conflicto || []).map(c => c.canonical_text),
    evidencia_insuficiente: (confiabilidadFactual.claims_evidencia_insuficiente || []).map(c => c.canonical_text)
  } : null;

  const paquete = {
    naturaleza_documental,
    riesgo,
    vpa: { conteo: vpa.conteo, categoria: vpa.categoria },
    puntos_de_atencion: puntosDeAtencion,
    saltos_inferenciales: saltosInferenciales,
    confiabilidad_factual: resumenFactual
  };

  const prompt = `
Eres SOPHIA-Academia, la capa interpretativa de SOPHIA para los documentos de la Academia de LogoDemocracia.

QUÉ ES SOPHIA:
SOPHIA no es un calificador ni un juez de la calidad del razonamiento. Es un instrumento de pensamiento crítico: examina cómo está construido un argumento y señala qué partes vale la pena revisar con más cuidado. No determina si el autor tiene razón ni le pone una nota al texto.

IMPORTANTE — PRESUPUESTO ACOTADO:
No recibes el documento completo ni el resultado íntegro del motor determinista. Recibes únicamente un paquete compacto con los puntos de atención ya seleccionados como los más relevantes, y el resultado de verificación factual ya resuelto. Interpreta solamente esta información — no inventes hallazgos que no estén en el paquete, ni asumas que existen más puntos de atención de los que se te muestran.

REGLAS ESTRICTAS:
1. PROHIBIDO usar las palabras "IRD", "Índice de Robustez Deliberativa", "puntaje", "puntuación", "nota" o "califica" en cualquier campo de tu respuesta. Usa siempre "VPA" o "puntos de atención".
2. Distingue explícitamente entre cuestiones ESTRUCTURALES (cómo está construido el razonamiento: puntos_de_atencion y saltos_inferenciales) y cuestiones FACTUALES (si las afirmaciones verificables son ciertas: confiabilidad_factual). Son evaluaciones independientes — no las mezcles como si fueran lo mismo.
3. Si vpa.conteo es 0, no digas que el argumento "es correcto" o "está probado": di que SOPHIA no encontró puntos de atención estructurales, dejando claro que esto no certifica la verdad del contenido.
4. Si un punto de atención tiene revision.falso_positivo = true, exprésalo como una señal que fue contextualizada (el motor la detectó, pero el contexto la explica), no como un error confirmado.
5. No afirmes ni niegues la verdad general del documento a partir del resultado factual — describe puntualmente lo que la verificación encontró, sin extrapolar a "por lo tanto el documento es/no es confiable".
6. Sé pedagógico: ayuda al lector a saber qué mirar con más cuidado, no le entregues un veredicto.

PAQUETE DE HALLAZGOS SELECCIONADOS (no el documento, no el resultado completo):
"""
${JSON.stringify(paquete, null, 2)}
"""

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin bloques de código markdown, sin texto antes ni después):
{
  "interpretacion": "Resumen breve de qué examina el documento y qué puntos de atención (VPA), si los hay, vale la pena revisar.",
  "contexto": "Explicación de cómo se relacionan los puntos de atención estructurales con los hallazgos factuales, si corresponde.",
  "observaciones": "Observaciones puntuales sobre cada punto de atención: si fue confirmado, contextualizado como falso positivo, o requiere revisión.",
  "preguntas_reflexivas": ["Pregunta 1", "Pregunta 2"]
}
`;

  try {
    const rawResponse = await askVertex(prompt, undefined, undefined, undefined, "academy_gemini_review");
    let cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    cleanJson = cleanJson.replace(/([}\]"])\s+(?="[a-zA-Z0-9_]+":)/g, '$1,');
    const parsed = JSON.parse(cleanJson);
    return sanitizeAcademyResponse(parsed);
  } catch (error) {
    console.error("[SOPHIA-ACADEMY-GEMINI-REVIEW] Error procesando la interpretación:", error);
    return {
      interpretacion: "No se pudo generar la interpretación de Academia.",
      contexto: "Error de conexión, timeout o formato irrecuperable con la capa cognitiva.",
      observaciones: "Requiere revisión manual.",
      preguntas_reflexivas: []
    };
  }
}

module.exports = { generateAcademyGeminiReview };
