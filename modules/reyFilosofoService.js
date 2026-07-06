// modules/reyFilosofoService.js
// ─── SERVICIO REY FILÓSOFO ─────────────────────────────
// Responsable de:
//   1. Persistir el perfil pedagógico (microtests) en MongoDB.
//   2. Generar respuestas del tutor cognitivo vía Vertex AI (Gemini).
//   3. Registrar eventos anonimizados para el Laboratorio Cívico
//      (la infraestructura de investigación de LogoDemocracy).

const crypto = require("crypto");
const { connect } = require("./database");
const { askVertex } = require("./vertexClient");

const PROFILES_COLLECTION = "reyfilosofo_profiles";
const CHAT_COLLECTION = "reyfilosofo_chat_sessions";
const EVENTS_COLLECTION = "laboratorio_civico_events";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 12; // turnos (usuario+tutor) que se incluyen en el prompt

// ─── UTILIDADES ────────────────────────────────────────

function hashId(value) {
  if (!value) return null;
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

// El identificador de sesión anónima permite construir el perfil de
// usuarios invitados (sin cuenta) y, si luego inician sesión, fusionar
// su historial.
function resolveIdentity(userId, sessionId) {
  if (!userId && !sessionId) {
    throw new Error("Se requiere userId o sessionId");
  }
  return {
    key: userId ? { userId } : { sessionId },
    userHash: hashId(userId),
    sessionHash: hashId(sessionId)
  };
}

// ─── EVENTOS PARA EL LABORATORIO CÍVICO ───────────────
// Registra únicamente metadatos y variables derivadas — nunca texto
// libre identificable — para alimentar la investigación longitudinal
// sobre cómo aprende una ciudadanía asistida por IA.
async function logResearchEvent(eventType, { userId, sessionId, payload = {} }) {
  try {
    const db = await connect();
    const { userHash, sessionHash } = resolveIdentity(userId, sessionId);
    await db.collection(EVENTS_COLLECTION).insertOne({
      module: "rey_filosofo",
      eventType,
      userHash,
      sessionHash,
      payload,
      ts: new Date()
    });
  } catch (err) {
    // Un fallo en el registro de investigación nunca debe romper la
    // experiencia del usuario.
    console.error("❌ [LABORATORIO-CIVICO] Error al registrar evento:", err.message);
  }
}

// ─── PERFIL PEDAGÓGICO (MICROTESTS) ───────────────────

async function saveMicrotestResult({ userId, sessionId, testId, answers, variables }) {
  console.log(`🧩 [REY-FILOSOFO] Guardando microtest '${testId}' (userId: ${userId || "—"}, sessionId: ${sessionId || "—"})`);

  if (!testId || typeof variables !== "object") {
    throw new Error("testId y variables son requeridos");
  }

  const db = await connect();
  const { key } = resolveIdentity(userId, sessionId);
  const collection = db.collection(PROFILES_COLLECTION);

  const existing = await collection.findOne(key);
  const completed = { ...(existing?.completed || {}), [testId]: true };
  const mergedVariables = { ...(existing?.variables || {}), ...variables };

  await collection.updateOne(
    key,
    {
      $set: {
        ...key,
        completed,
        variables: mergedVariables,
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() },
      $push: {
        history: {
          testId,
          answers: answers || null,
          variables,
          completedAt: new Date()
        }
      }
    },
    { upsert: true }
  );

  await logResearchEvent("microtest_completed", {
    userId, sessionId,
    payload: { testId, variables, totalCompleted: Object.keys(completed).length }
  });

  console.log(`✅ [REY-FILOSOFO] Perfil actualizado. Tests completados: ${Object.keys(completed).length}/10`);
  return { completed, variables: mergedVariables };
}

async function getProfile({ userId, sessionId }) {
  const db = await connect();
  const { key } = resolveIdentity(userId, sessionId);
  const doc = await db.collection(PROFILES_COLLECTION).findOne(key);
  if (!doc) return { completed: {}, variables: {} };
  return { completed: doc.completed || {}, variables: doc.variables || {} };
}

// Si un invitado (sessionId) inicia sesión, fusiona su perfil anónimo
// con el perfil de su cuenta recién autenticada.
async function mergeGuestProfileIntoUser({ userId, sessionId }) {
  if (!userId || !sessionId) return null;
  const db = await connect();
  const collection = db.collection(PROFILES_COLLECTION);

  const guestProfile = await collection.findOne({ sessionId });
  if (!guestProfile) return null;

  const userProfile = await collection.findOne({ userId });
  const completed = { ...(userProfile?.completed || {}), ...(guestProfile.completed || {}) };
  const variables = { ...(userProfile?.variables || {}), ...(guestProfile.variables || {}) };

  await collection.updateOne(
    { userId },
    { $set: { userId, completed, variables, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  await collection.deleteOne({ sessionId });

  console.log(`🔗 [REY-FILOSOFO] Perfil de invitado fusionado con usuario ${userId}`);
  return { completed, variables };
}

// ─── CIERRE METACOGNITIVO ──────────────────────────────
// "¿Qué te ayudó más?" / "¿Cómo te sientes ahora?" — nunca debe
// existir abandono silencioso de una sesión de tutoría.
async function saveMetacognitiveClosure({ userId, sessionId, helpedBy, feltLike }) {
  const db = await connect();
  const { key } = resolveIdentity(userId, sessionId);
  await db.collection(PROFILES_COLLECTION).updateOne(
    key,
    {
      $set: { ...key, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
      $push: { metacognitive_closures: { helpedBy, feltLike, ts: new Date() } }
    },
    { upsert: true }
  );

  await logResearchEvent("metacognitive_closure", { userId, sessionId, payload: { helpedBy, feltLike } });
  return { ok: true };
}

// ─── TUTOR COGNITIVO (CHAT CON GEMINI) ────────────────

function buildScaffoldingInstructions(variables = {}) {
  const lines = [];

  const estiloMap = {
    analogico: "Explica preferentemente mediante analogías antes que con definiciones formales.",
    secuencial_estructurado: "Estructura tus respuestas en secuencias claras: primero define, luego contextualiza, luego ejemplifica.",
    conceptual: "Puedes usar lenguaje conceptual más denso; el usuario tolera bien la abstracción.",
    paso_a_paso: "Divide tus explicaciones en pasos numerados y concretos."
  };
  if (estiloMap[variables.estilo_explicativo]) lines.push(estiloMap[variables.estilo_explicativo]);

  const nivelMap = {
    concreto: "Empieza siempre desde un ejemplo concreto antes de generalizar.",
    intermedio: "Puedes ofrecer una definición general moderada, cercana a lo cotidiano.",
    abstracto: "El usuario tolera bien partir de la definición abstracta antes de bajar a ejemplos."
  };
  if (nivelMap[variables.nivel_abstraccion_inicial]) lines.push(nivelMap[variables.nivel_abstraccion_inicial]);

  const formatoMap = {
    textual: "Prioriza explicaciones bien redactadas en prosa.",
    visual: "Cuando sea útil, describe la idea como si fuera un esquema o gráfico mental.",
    auditivo_conversacional: "Adopta un tono dialógico, como si fuera una conversación entre dos personas."
  };
  if (formatoMap[variables.preferencia_formato]) lines.push(formatoMap[variables.preferencia_formato]);

  const andamiajeMap = {
    alta: "Ofrece bastante estructura de apoyo antes de dejarlo razonar solo (preguntas guía, resúmenes previos).",
    media: "Ofrece un apoyo moderado: una pista o resumen breve antes de la pregunta abierta.",
    baja: "El usuario prefiere partir directamente de una pregunta intrigante, con poco andamiaje previo."
  };
  if (andamiajeMap[variables.necesidad_andamiaje]) lines.push(andamiajeMap[variables.necesidad_andamiaje]);

  if (variables.pensamiento_sistemico === "alto") {
    lines.push("El usuario piensa en términos de sistemas y retroalimentación: puedes usar mapas causales complejos sin simplificar en exceso.");
  } else if (variables.pensamiento_sistemico === "bajo") {
    lines.push("Prefiere explicaciones lineales o jerarquizadas antes que redes causales complejas.");
  }

  if (variables.tipo_analogia_dominante) {
    lines.push(`Si usas una analogía, que sea de tipo ${variables.tipo_analogia_dominante} cuando sea posible.`);
  }

  const enfoqueMap = {
    analitico: "Ante problemas complejos, empieza ofreciendo datos y patrones.",
    experiencial: "Ante problemas complejos, empieza con relatos o motivaciones humanas.",
    sistemico: "Ante problemas complejos, empieza mapeando causas interconectadas.",
    creativo: "Ante problemas complejos, invita primero a imaginar soluciones nuevas."
  };
  if (enfoqueMap[variables.enfoque_resolucion]) lines.push(enfoqueMap[variables.enfoque_resolucion]);

  return lines;
}

function buildTutorPrompt(message, history, variables) {
  const persona = `Eres el "Rey Filósofo" de LogoDemocracy: un tutor cognitivo inspirado en la Zona de Desarrollo Próximo de Vygotsky, la teoría del andamiaje (Bruner, Wood, Collins) y la mayéutica socrática.

Reglas estrictas:
- NUNCA das la respuesta final directamente. Ayudas a que la persona la construya, mediante preguntas, pistas y contraejemplos.
- No impones ideología ni juicios políticos. Tu objetivo es fortalecer el pensamiento crítico y la alfabetización epistemológica, no persuadir de una postura.
- Sé cálido, breve y concreto. Evita párrafos largos; prioriza 1-2 preguntas o ideas por turno.
- Si detectas una falacia o un salto lógico en lo que dice el usuario, señálalo con curiosidad, no con corrección punitiva.`;

  const scaffolding = buildScaffoldingInstructions(variables);
  const scaffoldingBlock = scaffolding.length > 0
    ? `\n\nAdaptación al perfil de aprendizaje de esta persona (úsala silenciosamente, sin mencionarla explícitamente):\n- ${scaffolding.join("\n- ")}`
    : "";

  const historyBlock = (history || [])
    .slice(-MAX_HISTORY_TURNS)
    .map(turn => `${turn.role === "user" ? "Usuario" : "Tutor"}: ${turn.text}`)
    .join("\n");

  return `${persona}${scaffoldingBlock}

${historyBlock ? `Conversación previa:\n${historyBlock}\n` : ""}
Usuario: ${message}
Tutor:`;
}

async function getTutorReply({ userId, sessionId, message, history }) {
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new Error("El mensaje es requerido");
  }
  const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);

  const profile = await getProfile({ userId, sessionId });
  const prompt = buildTutorPrompt(trimmed, history, profile.variables);

  console.log("🤖 [REY-FILOSOFO] Solicitando respuesta del tutor a Gemini...");
  const reply = await askVertex(prompt, "gemini-2.5-flash", 30000);
  console.log("✅ [REY-FILOSOFO] Respuesta del tutor recibida");

  // Persistir el intercambio (para continuidad de sesión y trazabilidad
  // pedagógica — no para el laboratorio cívico, que solo recibe metadatos).
  try {
    const db = await connect();
    const { key } = resolveIdentity(userId, sessionId);
    await db.collection(CHAT_COLLECTION).updateOne(
      key,
      {
        $set: { ...key, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
        $push: {
          messages: {
            $each: [
              { role: "user", text: trimmed, ts: new Date() },
              { role: "tutor", text: reply.trim(), ts: new Date() }
            ]
          }
        }
      },
      { upsert: true }
    );
  } catch (dbError) {
    console.error("❌ [REY-FILOSOFO] Error al guardar el chat:", dbError.message);
  }

  await logResearchEvent("tutor_interaction", {
    userId, sessionId,
    payload: { messageLength: trimmed.length, replyLength: reply.length }
  });

  return { reply: reply.trim() };
}

module.exports = {
  saveMicrotestResult,
  getProfile,
  mergeGuestProfileIntoUser,
  saveMetacognitiveClosure,
  getTutorReply,
  logResearchEvent
};
