// modules/lex.js - PROYECTO NEMOSYNE / ABOLEGAL (CHILE)
// Versión: 1.4.1 - Refinamiento de Diagnóstico y Control de CTA

const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log("⚖️ [LEX] Inicializando motor v1.4.1 (Ajuste Táctico de Niveles)");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.25,
    maxOutputTokens: 400
  }
});

const DEADLINES_CHILE = {
  laboral: [
    { label: "Demanda por despido injustificado", plazo: "60 días hábiles", autoridad: "Juzgados del Trabajo" },
    { label: "Reclamo administrativo", plazo: "60 días desde el término", autoridad: "Inspección del Trabajo" }
  ],
  familia: [
    { label: "Mediación previa", nota: "Obligatoria antes de demandar alimentos o visitas" }
  ],
  civil: [
    { label: "Prescripción general", plazo: "5 años", autoridad: "Tribunales Civiles" }
  ]
};

const MARCO_OPERATIVO_BASE = `
ERES: Lex, Asistente Legal Profesional (Chile).
ESTILO: Empatía breve -> Explicación según nivel -> Preguntas diagnóstico -> CTA.
TONO: Formal y profesional.
RESTRICCIÓN: NO incluyas disclaimers (ya están en la interfaz).
`;

async function lexReply(mensaje, sessionId, analysis = {}, conversationHistory = []) {
  const msgLower = mensaje.toLowerCase();
  
  // 1. CLASIFICACIÓN TÁCTICA (Árbol de Decisión)
  let intent_key = 'general';
  if (msgLower.includes('despido') || msgLower.includes('echaron')) intent_key = 'despido';
  else if (msgLower.includes('pago') || msgLower.includes('sueldo') || msgLower.includes('remuneración')) intent_key = 'no_pago';
  else if (msgLower.includes('acoso') || msgLower.includes('maltrato')) intent_key = 'acoso';
  else if (msgLower.includes('familia') || msgLower.includes('hijo') || msgLower.includes('alimento')) intent_key = 'familia';
  else if (msgLower.includes('contrato') || msgLower.includes('daño') || msgLower.includes('deuda')) intent_key = 'civil';

  let intent_level = 'CLARIFICATION';
  
  // CAMBIO 1: Ajuste de activación MINIMAL (más restrictivo)
  if (
    mensaje.split(' ').length < 8 &&
    (!analysis.stage || analysis.stage === 'initial')
  ) {
    intent_level = 'MINIMAL';
  }
  
  if (analysis.should_offer_videocall || msgLower.includes('demandar') || msgLower.includes('abogado')) {
    intent_level = 'ACTION';
  }

  // 2. SELECCIÓN DE CONTEXTO LEGAL (Filtrado por nivel)
  let contextoLegal = "";
  const areaKey = (analysis.area || "").toLowerCase();
  if (DEADLINES_CHILE[areaKey]) {
    if (intent_level === 'MINIMAL') {
      // CAMBIO 2: Control estricto de plazos en nivel MINIMAL
      contextoLegal = "NO mencionar plazos legales específicos en este nivel.";
    } else {
      contextoLegal = `PLAZOS: ${DEADLINES_CHILE[areaKey].map(d => `${d.label}: ${d.plazo || d.nota}`).join(', ')}`;
    }
  }

  const prompt = `
${MARCO_OPERATIVO_BASE}

PLANTILLA ACTIVA:
- Nivel de Intención: ${intent_level}
- Tipo de Caso: ${intent_key}
- Reglas de Nivel:
  * MINIMAL: Máx 6 líneas. 1 sola idea legal. 1-2 preguntas cerradas. Tono de acogida técnica.
  * CLARIFICATION: Detalle de 1 norma + 1 plazo principal. Preguntas de profundización.
  * ACTION: Opciones legales (Demandar/Reclamar) + CTA a videollamada.

CONTEXTO JURÍDICO:
${contextoLegal}

HISTORIAL:
${conversationHistory.slice(-3).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USUARIO: "${mensaje}"

INSTRUCCIONES: Responde siguiendo la PLANTILLA ACTIVA. No des más información de la necesaria para este nivel.
`;

  try {
    const result = await model.generateContent(prompt);
    let reply = result.response.text().trim();

    // CAMBIO 3: CTA solo cuando el flujo (analysis) lo autoriza
    if (
      intent_level === 'ACTION' &&
      analysis.should_offer_videocall === true &&
      !reply.toLowerCase().includes('widget')
    ) {
      reply += "\n\nPuede agendar una sesión con un abogado para evaluar su demanda usando el widget de abajo.";
    }

    return reply;
  } catch (error) {
    console.error("❌ [LEX] Error:", error.message);
    return "Lamento la interrupción. Para proteger sus derechos, le sugiero contactar a un profesional a la brevedad.";
  }
}

module.exports = { lexReply };
