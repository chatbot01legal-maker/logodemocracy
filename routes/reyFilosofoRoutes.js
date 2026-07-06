const express = require("express");
const router = express.Router();
const {
  saveMicrotestResult,
  getProfile,
  saveMetacognitiveClosure,
  getTutorReply
} = require("../modules/reyFilosofoService");

// ─── AUDITORÍA Y NORMALIZACIÓN DE PAYLOAD ──────────────────────────
function auditAndNormalizeChat(req, res, next) {
  console.log("🔍 [AUDIT req.body raw]:", JSON.stringify(req.body, null, 2));
  
  // Normalización: buscamos el contenido en las posibles propiedades que envíe el frontend
  const rawMessage = req.body.message || req.body.text || req.body.prompt || req.body.input;
  
  if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim() === '') {
    console.warn("⚠️ [AUDIT] Petición rechazada: mensaje vacío o indefinido.");
    return res.status(400).json({
      success: false,
      error: "message requerido"
    });
  }

  // Aseguramos que el controlador principal siempre reciba 'message'
  req.body.message = rawMessage.trim();
  next();
}

// ─── Perfil pedagógico (microtests) ───────────────────
router.post("/microtests/save", async (req, res) => {
  console.log("📥 [REY-FILOSOFO-API] POST /microtests/save");
  try {
    const { userId, sessionId, testId, answers, variables } = req.body;
    if (!userId && !sessionId) {
      return res.status(400).json({ error: "Se requiere userId o sessionId" });
    }
    const result = await saveMicrotestResult({ userId, sessionId, testId, answers, variables });
    res.json({ success: true, profile: result });
  } catch (error) {
    console.error("❌ [REY-FILOSOFO-API] Error en /microtests/save:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/microtests/profile", async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    if (!userId && !sessionId) {
      return res.status(400).json({ error: "Se requiere userId o sessionId" });
    }
    const profile = await getProfile({ userId, sessionId });
    res.json({ success: true, profile });
  } catch (error) {
    console.error("❌ [REY-FILOSOFO-API] Error en /microtests/profile:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ─── Cierre metacognitivo ──────────────────────────────
router.post("/metacognitive-closure", async (req, res) => {
  try {
    const { userId, sessionId, helpedBy, feltLike } = req.body;
    if (!userId && !sessionId) {
      return res.status(400).json({ error: "Se requiere userId o sessionId" });
    }
    const result = await saveMetacognitiveClosure({ userId, sessionId, helpedBy, feltLike });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("❌ [REY-FILOSOFO-API] Error en /metacognitive-closure:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ─── Chat con el tutor cognitivo (Gemini / Vertex AI) ───
router.post("/chat", auditAndNormalizeChat, async (req, res) => {
  console.log("📥 [REY-FILOSOFO-API] POST /chat procesando mensaje validado");
  try {
    const { userId, sessionId, message, history, sophiaContext, lastChoice } = req.body;
    if (!userId && !sessionId) {
      return res.status(400).json({ error: "Se requiere userId o sessionId" });
    }
    
    const { reply, zpdUpdate, options } = await getTutorReply({ 
      userId, 
      sessionId, 
      message, 
      history: history || [],
      sophiaContext: sophiaContext || null,
      lastChoice: lastChoice || null
    });
    
    res.json({ success: true, reply, zpdUpdate, options });
  } catch (error) {
    console.error("❌ [REY-FILOSOFO-API] Error en /chat:", error.message);
    res.status(500).json({ success: false, error: "Error en el motor de andamiaje cognitivo." });
  }
});

module.exports = router;
