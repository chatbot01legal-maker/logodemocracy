const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createProxyMiddleware } = require("http-proxy-middleware");

// ─── Módulos propios ──────────────────────────────────
const { connect } = require("./modules/database");
const { askVertex } = require("./modules/vertexClient");
const { evaluateText, getLLMReview, PROTOCOL } = require("./modules/sophiaCore");
const { mergeGuestProfileIntoUser } = require("./modules/reyFilosofoService");
const reyFilosofoRoutes = require("./routes/reyFilosofoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── LOGS de inicio ──────────────────────────────────
console.log("🚀 Iniciando servidor SOPHIA...");
console.log(`📁 Directorio actual: ${__dirname}`);
console.log(`📦 Protocolo cargado: ${PROTOCOL.version || "desconocido"}`);

// ─── Middleware ────────────────────────────────────────

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

app.post("/api/debug-log", (req, res) => {
  const { level, message } = req.body;
  const ts = new Date().toISOString();

  console.log(
    `📱 [REMOTE-${(level || "log").toUpperCase()}] ${ts} — ${message}`
  );

  res.sendStatus(204);
});


// ─── LOG de cada petición con ID ÚNICO ────────────────
app.use((req, res, next) => {
  req.headers['x-request-id'] = crypto.randomUUID(); // Genera un ID único
  console.log(`📥 [${req.headers['x-request-id']}] ${req.method} ${req.url}`);
  res.setHeader('X-Request-ID', req.headers['x-request-id']); // Lo devuelve al navegador
  next();
});
app.use(
  "/api/reyfilosofo/microtests",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,

    pathRewrite: (path) => {
      return "/api/reyfilosofo/microtests" + path;
    }
  })
);

// ─── Ruta principal ────────────────────────────────────
app.get("/", (req, res) => {
  console.log("📄 Sirviendo index.html");
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─── Health Check ─────────────────────────────────────
app.get("/api/health", (req, res) => {
  console.log("💚 Health check");
  res.json({
    status: "OK",
    version: "SOPHIA v0.92-beta",
    protocol_version: PROTOCOL.version || "desconocida"
  });
});

// ─── Autenticación ────────────────────────────────────

// Registro
app.post("/api/register", async (req, res) => {
  console.log("📝 Registro de usuario:", req.body.email);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ Registro fallido: faltan datos");
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    const db = await connect();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      console.log("❌ Registro fallido: usuario ya existe");
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      email,
      password: hashed,
      createdAt: new Date(),
      role: "citizen"
    });
    console.log("✅ Usuario registrado:", email);
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error en /api/register:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  console.log("🔑 Intento de login:", req.body.email);
  try {
    const { email, password, sessionId } = req.body;
    if (!email || !password) {
      console.log("❌ Login fallido: faltan datos");
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    const db = await connect();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.log("❌ Login fallido: usuario no encontrado");
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("❌ Login fallido: contraseña incorrecta");
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "citizen" },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "7d" }
    );
    console.log("✅ Login exitoso:", email);

    // Si el usuario venía navegando como invitado (sessionId local),
    // fusionamos su perfil pedagógico anónimo con su cuenta.
    if (sessionId) {
      try {
        await mergeGuestProfileIntoUser({ userId: user._id.toString(), sessionId });
      } catch (mergeError) {
        console.error("⚠️ No se pudo fusionar el perfil de invitado:", mergeError.message);
      }
    }

    res.json({
      token,
      userId: user._id,
      email: user.email,
      role: user.role || "citizen"
    });
  } catch (error) {
    console.error("❌ Error en /api/login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Middleware de autenticación (opcional) ──────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ─── Evaluación con SOPHIA (híbrida) ─────────────────
app.post("/api/sophia/evaluate", async (req, res) => {
  console.log("📊 Petición de evaluación recibida");
  try {
    const { text, userId } = req.body;
    console.log(`📝 Texto recibido (${text?.length || 0} caracteres), userId: ${userId || "anonimo"}`);

    if (!text || text.trim().length === 0) {
      console.log("❌ Texto vacío");
      return res.status(400).json({ error: "Texto requerido" });
    }

    // 1️⃣ Evaluación local (determinista, auditable)
    console.log("🔍 Ejecutando evaluación local...");
    const localResult = evaluateText(text);
    if (!localResult) {
      console.log("❌ Error en evaluación local");
      return res.status(400).json({ error: "Error al evaluar el texto" });
    }
    console.log(`✅ Evaluación local completada. IRD: ${localResult.IRD_global}, evidencias: ${localResult.evidencias?.length || 0}`);

    // 2️⃣ Revisión semántica con Gemini (solo si es necesario)
    let llmReview = null;
    if (localResult.IRD_global < 85 || localResult.evidencias.length > 0) {
      console.log("🤖 Solicitando revisión semántica a Gemini...");
      try {
        llmReview = await getLLMReview(text, localResult);
        console.log("✅ Revisión semántica completada");
      } catch (llmError) {
        console.error("❌ Error en LLM review:", llmError);
        llmReview = { error: "Revisión semántica no disponible" };
      }
    } else {
      console.log("⏩ Saltando revisión semántica (IRD alto y sin evidencias)");
    }

    // 3️⃣ Ensamblar informe final
    const finalReport = {
      protocol_version: PROTOCOL.version || "0.92-beta",
      evaluated_at: new Date().toISOString(),
      local: localResult,
      llm_review: llmReview,
      ird: localResult.IRD_global,
      risk: localResult.riesgo,
      evidence_density: localResult.evidencias.length / (text.split(/\s+/).length || 1)
    };
    console.log(`📊 IRD final: ${finalReport.ird}%`);

    // 4️⃣ Guardar en MongoDB (si hay userId)
    if (userId) {
      console.log("💾 Guardando evaluación en MongoDB...");
      try {
        const db = await connect();
        const textHash = crypto.createHash("sha256").update(text).digest("hex");
        await db.collection("evaluations").insertOne({
          userId,
          text_hash: textHash,
          text_preview: text.substring(0, 500),
          protocol_version: PROTOCOL.version || "0.92-beta",
          model_used: "gemini-2.5-flash",
          evaluated_at: new Date(),
          result: finalReport
        });
        console.log("✅ Evaluación guardada en MongoDB");
      } catch (dbError) {
        console.error("❌ Error al guardar en DB:", dbError);
        // No fallamos la respuesta por error de DB
      }
    } else {
      console.log("⏩ Sin userId, omitiendo guardado en DB");
    }

    res.json(finalReport);
  } catch (error) {
    console.error("❌ Error en /api/sophia/evaluate:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Rey Filósofo Kernel ZDP ─────────

const rfRoutes = require("./logodemocracy-api/src/routes/rfRoutes");

app.use(
  "/api/reyfilosofo",
  rfRoutes
);
// ─── Endpoint protegido (ejemplo) ────────────────────
app.get("/api/profile", authenticate, (req, res) => {
  console.log(`👤 Perfil solicitado por: ${req.user.email}`);
  res.json({ user: req.user });
});

// ─── Iniciar servidor ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor SOPHIA ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Protocolo cargado: ${PROTOCOL.version || "desconocido"}`);
})
