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
const { evaluate } = require("./modules/sophiaEvaluationPipeline");
const { mergeGuestProfileIntoUser } = require("./modules/reyFilosofoService");
const reyFilosofoRoutes = require("./routes/reyFilosofoRoutes");

const PROTOCOL = {
  version: "4.0"
};

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
  console.log(`📱 [REMOTE-${(level || "log").toUpperCase()}] ${ts} — ${message}`);
  res.sendStatus(204);
});

// ─── LOG de cada petición con ID ÚNICO ────────────────
app.use((req, res, next) => {
  req.headers['x-request-id'] = crypto.randomUUID();
  console.log(`📥 [${req.headers['x-request-id']}] ${req.method} ${req.url}`);
  res.setHeader('X-Request-ID', req.headers['x-request-id']);
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
    version: "SOPHIA v4.0",
    protocol_version: PROTOCOL.version || "desconocida"
  });
});

// ─── Autenticación ────────────────────────────────────
app.post("/api/register", async (req, res) => {
  console.log("📝 Registro de usuario:", req.body.email);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    const db = await connect();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
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

app.post("/api/login", async (req, res) => {
  console.log("🔑 Intento de login:", req.body.email);
  try {
    const { email, password, sessionId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    const db = await connect();
    const user = await db.collection("users").findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "citizen" },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "7d" }
    );
    console.log("✅ Login exitoso:", email);

    if (sessionId) {
      try {
        await mergeGuestProfileIntoUser({ userId: user._id.toString(), sessionId });
      } catch (mergeError) {
        console.error("⚠️ No se pudo fusionar perfil invitado:", mergeError.message);
      }
    }

    res.json({ token, userId: user._id, email: user.email, role: user.role || "citizen" });
  } catch (error) {
    console.error("❌ Error en /api/login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET || "secreto");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// ─── Evaluación con SOPHIA ─────────────────────────────
app.post("/api/sophia/evaluate", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Texto requerido" });
    }
    
    // El pipeline solo genera conocimiento
    const report = await evaluate({ text });
app.post("/api/sophia/evaluate", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Texto requerido" });
    }
    
    // El pipeline solo genera conocimiento
    const report = await evaluate({ text });
    console.log("🔎 JSON FINAL AL FRONTEND:", JSON.stringify(report, null, 2)); // ← AGREGAR ESTA LÍNEA

    // La capa de infraestructura guarda los datos
    if (userId) {
    ...
    // La capa de infraestructura guarda los datos
    if (userId) {
      console.log("💾 Guardando evaluación en MongoDB...");
      try {
        const db = await connect();
        const textHash = crypto.createHash("sha256").update(text).digest("hex");
        await db.collection("evaluations").insertOne({
          userId,
          text_hash: textHash,
          text_preview: text.substring(0, 500),
          protocol_version: PROTOCOL.version,
          model_used: "gemini-2.5-flash",
          evaluated_at: new Date(),
          result: report
        });
        console.log("✅ Evaluación guardada en MongoDB");
      } catch (dbError) {
        console.error("❌ Error al guardar en DB:", dbError);
      }
    }

    res.json(report);
  } catch (error) {
    console.error("❌ Error en /api/sophia/evaluate:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Rey Filósofo Kernel ZDP ─────────────────────────
const rfRoutes = require("./logodemocracy-api/src/routes/rfRoutes");
app.use("/api/reyfilosofo", rfRoutes);

// ─── Endpoint protegido (ejemplo) ────────────────────
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ─── Iniciar servidor ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor SOPHIA ejecutándose en http://localhost:${PORT}`);
});
