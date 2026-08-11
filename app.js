const express = require("express");
const path = require("path");
const fs = require("fs"); // <-- AGREGADO para leer los .md
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

// ─── Proxy Middleware ─────────────────────────────────
app.use(
  "/api/reyfilosofo/microtests",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true
  })
);

// ─── Función de Auditoría en Segundo Plano (AGREGADO) ──
async function runBackgroundAudit() {
  console.log("🔍 [Background Audit] Verificando documentos de la Academia...");
  const contentDir = path.join(__dirname, "pages/academy/content");
  if (!fs.existsSync(contentDir)) {
    console.log("⚠️ [Background Audit] Carpeta de contenidos no encontrada.");
    return { audited: 0, skipped: 0 };
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"));
  const db = await connect();
  let audited = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const textContent = fs.readFileSync(filePath, "utf8");
    const contentHash = crypto.createHash("sha256").update(textContent).digest("hex");

    const cached = await db.collection("sophia_document_cache").findOne({
      docId: file,
      content_hash: contentHash,
      protocol_version: PROTOCOL.version
    });

    if (cached) {
      skipped++;
      continue;
    }

    console.log(`⚡ [Background Audit] Evaluando con IA en Render: ${file}...`);
    try {
      const report = await evaluate({ text: textContent });
      await db.collection("sophia_document_cache").updateOne(
        { docId: file },
        {
          $set: {
            docId: file,
            content_hash: contentHash,
            protocol_version: PROTOCOL.version,
            result: report,
            evaluated_at: new Date()
          }
        },
        { upsert: true }
      );
      console.log(`✅ [Background Audit] Guardado en MongoDB: ${file}`);
      audited++;
    } catch (err) {
      console.error(`❌ [Background Audit] Error evaluando ${file}:`, err.message);
    }
  }

  console.log(`🎉 [Background Audit] Finalizada. Evaluados: ${audited}, En caché: ${skipped}`);
  return { audited, skipped, totalFiles: files.length };
}

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

// ─── Endpoint de Administración (AGREGADO) ────────────
app.post("/api/admin/audit-all", async (req, res) => {
  try {
    const result = await runBackgroundAudit();
    res.json({ message: "Auditoría en servidor completada", result });
  } catch (error) {
    console.error("❌ Error en /api/admin/audit-all:", error);
    res.status(500).json({ error: "Error procesando la auditoría" });
  }
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
    console.log("🔎 JSON FINAL AL FRONTEND:", JSON.stringify(report, null, 2));

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
// ─── Feedback de usuarios sobre evaluaciones de SOPHIA ────────────────
app.post("/api/sophia/feedback", async (req, res) => {
  try {
    const { comentario, texto_evaluado, ird_global, userId, timestamp } = req.body;
    if (!comentario || !comentario.trim()) {
      return res.status(400).json({ error: "Comentario requerido" });
    }

    const db = await connect();
    await db.collection("feedback").insertOne({
      comentario,
      texto_evaluado: texto_evaluado || null,
      ird_global: ird_global !== undefined ? ird_global : null,
      userId: userId || null,
      timestamp: timestamp || new Date().toISOString(),
      created_at: new Date()
    });

    console.log("📝 Feedback de SOPHIA guardado en MongoDB");
    res.json({ message: "Comentario recibido correctamente" });
  } catch (error) {
    console.error("❌ Error en /api/sophia/feedback:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Evaluación SOPHIA con caché por documento ─────────
// A diferencia de /api/sophia/evaluate (que siempre llama a la IA), esta
// ruta evalúa un documento UNA SOLA VEZ y reutiliza el resultado guardado
// en MongoDB en cada visita posterior — hasta que el texto cambie o el
// protocolo de SOPHIA se actualice (protocol_version), momento en el que
// se vuelve a evaluar automáticamente.
app.post("/api/sophia/evaluate-cached", async (req, res) => {
  try {
    const { text, docId } = req.body;
    if (!text || !text.trim() || !docId) {
      return res.status(400).json({ error: "text y docId son requeridos" });
    }

    const contentHash = crypto.createHash("sha256").update(text).digest("hex");
    const db = await connect();

    const cached = await db.collection("sophia_document_cache").findOne({
      docId,
      content_hash: contentHash,
      protocol_version: PROTOCOL.version
    });

    if (cached) {
      console.log(`♻️ [Cache HIT] ${docId} — protocolo ${PROTOCOL.version}, sin llamar a la IA`);
      return res.json(cached.result);
    }

    console.log(`🧠 [Cache MISS] ${docId} — evaluando de cero (protocolo ${PROTOCOL.version})`);
    const report = await evaluate({ text });

    await db.collection("sophia_document_cache").updateOne(
      { docId },
      {
        $set: {
          docId,
          content_hash: contentHash,
          protocol_version: PROTOCOL.version,
          result: report,
          evaluated_at: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`✅ [Cache SAVE] ${docId} guardado`);

    res.json(report);
  } catch (error) {
    console.error("❌ Error en /api/sophia/evaluate-cached:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


const rfRoutes = require("./logodemocracy-api/src/routes/rfRoutes");
app.use("/api/reyfilosofo", rfRoutes);

// ─── Endpoint protegido (ejemplo) ────────────────────
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ─── Iniciar servidor ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor SOPHIA ejecutándose en http://localhost:${PORT}`);
  
  // Auditoría automática en segundo plano (AGREGADO)
  setTimeout(() => {
    runBackgroundAudit().catch(err => console.error("❌ Error en auditoría inicial:", err));
  }, 5000);
});
