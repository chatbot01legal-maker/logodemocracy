const { GoogleGenAI } = require('@google/genai');

// Inicialización de Google GenAI SDK con Vertex AI (Sin API Keys)
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'logodemocracy-ai-2026',
  location: 'us-central1'
});

/**
 * Genera el System Prompt dinámico basado en Vygotsky y el ZPD actual.
 */
function buildPedagogicalPrompt(zpdProfile, sophiaContext) {
  let prompt = `Eres el Rey Filósofo, un tutor cognitivo y mediador epistemológico del ecosistema LogoDemocracy.
Tu objetivo NO es dar respuestas correctas ni actuar como chatbot convencional. Tu rol es operar en la Zona de Desarrollo Próximo (ZPD) de Vygotsky, proveyendo andamiaje conceptual para que el ciudadano mejore la calidad dialéctica de sus ideas.

REGLAS PEDAGÓGICAS INNEGOCIABLES:
1. JAMÁS utilices lenguaje evaluativo punitivo (nunca digas: "tu idea es pobre", "puntaje bajo", "insuficiente"). Habla siempre de "oportunidades de integración epistémica" o "tensiones lógicas a explorar".
2. Si recibes un contexto de evaluación de Sophia (IRD, riesgo, constructos e infracciones), tu primera misión es EXPLICAR PEDAGÓGICAMENTE por qué Sophia evaluó así, traduciendo la métrica técnica a un reto intelectual estimulante.
3. ADAPTACIÓN AL USUARIO:
   - Nivel de abstracción estimado: ${zpdProfile?.abstraction_level || 'intermedio'}
   - Necesidad de andamiaje: ${zpdProfile?.scaffolding_need || 'media'}
   - Formato preferido: ${zpdProfile?.preferred_format || 'analógico'}
4. REGLA DE CIERRE OBLIGATORIA: JAMÁS termines tu turno con una pregunta abierta o un párrafo simple. SIEMPRE debes concluir tu intervención ofreciendo un menú explícito de 4 a 6 opciones seleccionables para que el usuario elija su siguiente paso cognitivo. Presenta estas opciones al final del texto con el formato exacto:
[OPCIONES]
○ Un ejemplo concreto sobre este punto
○ Una analogía histórica o sistémica
○ Explicación paso a paso del constructo
○ Cuestionar una premisa de mi argumento opuesto
○ Revisar evidencia empírica aplicable
[/OPCIONES]`;

  if (sophiaContext) {
    prompt += `\n\nCONTEXTO DE EVALUACIÓN SOPHIA RECIBIDO:
- IRD: ${sophiaContext.ird}
- Riesgo Dialéctico: ${sophiaContext.risk}
- Constructos evaluados: ${JSON.stringify(sophiaContext.constructos || [])}
- Infracciones detectadas: ${JSON.stringify(sophiaContext.infracciones || [])}`;
  }

  return prompt;
}

async function getTutorReply({ userId, sessionId, message, history, sophiaContext, lastChoice }) {
  try {
    // 1. Aquí consultaríamos el perfil ZPD en PostgreSQL (mock default por ahora para estabilidad)
    const currentZpd = {
      zpd_estimate: 0.65,
      abstraction_level: "intermedio",
      scaffolding_need: "alta",
      preferred_format: "analógico"
    };

    const systemInstruction = buildPedagogicalPrompt(currentZpd, sophiaContext);

    // 2. Formatear historial para @google/genai
    const formattedContents = history.map(h => ({
      role: h.role === 'tutor' || h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text || h.message || '' }]
    }));

    // Agregar el mensaje actual (si hubo una selección previa, la contextualizamos)
    const userPrompt = lastChoice 
      ? `[El usuario seleccionó la opción pedagógica: "${lastChoice}"]\n\n${message}`
      : message;

    formattedContents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    // 3. Llamada al modelo Gemini 1.5 Pro en Vertex AI
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: formattedContents,
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const rawText = response.text || "He analizado tu premisa. ¿Cómo deseas proceder?\n[OPCIONES]\n○ Un ejemplo concreto\n○ Una analogía\n○ Explicación paso a paso\n○ Cuestionar premisa\n[/OPCIONES]";

    // 4. Extraer el texto limpio y las opciones de andamiaje
    let reply = rawText;
    let options = [];
    const optionsMatch = rawText.match(/\[OPCIONES\]([\s\S]*?)\[\/OPCIONES\]/);
    
    if (optionsMatch && optionsMatch[1]) {
      reply = rawText.replace(/\[OPCIONES\][\s\S]*?\[\/OPCIONES\]/, '').trim();
      options = optionsMatch[1]
        .split('\n')
        .map(opt => opt.replace(/^[○•\-\*]\s*/, '').trim())
        .filter(opt => opt.length > 0);
    } else {
      // Fallback pedagógico de seguridad por si el LLM olvide las etiquetas
      options = [
        "Un ejemplo concreto",
        "Una analogía sistémica",
        "Explicación paso a paso",
        "Cuestionar una premisa central",
        "Revisar evidencia y datos"
      ];
    }

    // 5. Cálculo de evolución ZPD (Aquí el motor reevaluaría las variables)
    const zpdUpdate = {
      ...currentZpd,
      zpd_estimate: Math.min(1.0, currentZpd.zpd_estimate + 0.02)
    };

    return { reply, zpdUpdate, options };
  } catch (error) {
    console.error("❌ [VERTEX-GENAI-ERROR]:", error);
    throw error;
  }
}

async function saveMicrotestResult({ userId, sessionId, testId, answers, variables }) {
  console.log(`[MICROTEST] Guardando variables silenciosas para test ${testId}`);
  // Lógica de persistencia en PostgreSQL (tabla microtests y actualización de zpd_profiles)
  return { status: "variables_recorded", adaptative_profile_updated: true };
}

async function getProfile({ userId, sessionId }) {
  return {
    estilo_explicativo: "analogico",
    preferencia_ejemplos: "alta",
    tipo_analogia: "sistemica",
    orientacion: "mixta",
    pensamiento_sistemico: "alto",
    preferencia_formato: "visual",
    abstraccion: "intermedio",
    andamiaje: "guia"
  };
}

async function saveMetacognitiveClosure({ userId, sessionId, helpedBy, feltLike }) {
  console.log(`[METACOGNITION] Cierre registrado para sesión ${sessionId || userId}`);
  return { recorded: true };
}

module.exports = {
  getTutorReply,
  saveMicrotestResult,
  getProfile,
  saveMetacognitiveClosure
};
