const express = require("express");
const path = require("path");
const fs = require("fs");
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
console.log(`📦 Protocolo cargado: ${PROTOCOL.version}`);

// Variables de control para ejecución única
let hasRunAudit = false;
let isAuditRunning = false;

// ─── LEVANTAR PUERTO INMEDIATAMENTE (Evita Timeout) ───
app.listen(PORT, () => {
  console.log(`🚀 Servidor SOPHIA ejecutándose y escuchando en el puerto ${PORT}`);
  
  // Auditoría automática que se ejecuta una única vez al arrancar
  setTimeout(() => {
    runAutomaticAuditOnce();
  }, 3000);
});

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

// ─── Rutas del Rey Filósofo (RESTORED) ────────────────
const rfRoutes = require("./logodemocracy-api/src/routes/rfRoutes");
app.use("/api/reyfilosofo", rfRoutes);

// ─── Utilidad para normalizar texto ───────────────────
function normalizeTextForHash(text) {
  return text.replace(/\r\n/g, "\n").trim();
}

// ─── Función de Auditoría Interna ─────────────────────
async function runBackgroundAudit() {
  console.log("🔍 [Audit] Iniciando auditoría de documentos...");
  const contentDir = path.join(__dirname, "pages/academy/content");
  if (!fs.existsSync(contentDir)) return { audited: 0, skipped: 0 };

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"));
  const db = await connect();
  
  const auditTasks = files.map(async (file) => {
    try {
      const filePath = path.join(contentDir, file);
      const rawText = fs.readFileSync(filePath, "utf8");
      const textContent = normalizeTextForHash(rawText);
      
      if (textContent.length < 50) {
        console.log(`⚠️ [Audit] Omitiendo ${file} (texto demasiado corto o vacío)`);
        return { file, status: "skipped" };
      }

      const contentHash = crypto.createHash("sha256").update(textContent).digest("hex");

      const cached = await db.collection("sophia_document_cache").findOne({
        docId: file,
        content_hash: contentHash,
        protocol_version: PROTOCOL.version
      });

      if (cached) return { file, status: "skipped" };

      console.log(`⚡ [Audit] Evaluando nuevo contenido: ${file}...`);
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
      return { file, status: "audited" };
    } catch (err) {
      console.error(`❌ [Audit] Error en ${file}:`, err.message);
      return { file, status: "error" };
    }
  });

  const results = await Promise.all(auditTasks);
  const audited = results.filter(r => r.status === "audited").length;
  const skipped = results.filter(r => r.status === "skipped").length;

  console.log(`🎉 [Audit] Finalizada. Evaluados: ${audited}, En caché/Omitidos: ${skipped}`);
  return { audited, skipped };
}

// ─── Ejecutor único automático ────────────────────────
async function runAutomaticAuditOnce() {
  if (hasRunAudit || isAuditRunning) return;
  isAuditRunning = true;
  try {
    console.log("🤖 [Sophia Auto-Audit] Ejecutando proceso automático por única vez...");
    await runBackgroundAudit();
    hasRunAudit = true;
    console.log("✅ [Sophia Auto-Audit] Proceso completado y marcado como ejecutado.");
  } catch (err) {
    console.error("❌ [Sophia Auto-Audit] Error en ejecución automática:", err);
  } finally {
    isAuditRunning = false;
  }
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

// ─── Endpoint de Administración ───────────────────────
app.post("/api/admin/audit-all", async (req, res) => {
  try {
    const result = await runBackgroundAudit();
    res.json({ message: "Auditoría completada", result });
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

// ─── LECTURA PURA DE CACHÉ ─────────────────────────────
app.get("/api/sophia/analysis/:docId", async (req, res) => {
  try {
    const docId = req.params.docId;
    const db = await connect();
    const cached = await db.collection("sophia_document_cache").findOne({
      docId: docId,
      protocol_version: PROTOCOL.version
    });

    if (cached) {
      console.log(`♻️ [Read-Only Cache HIT] Entregando análisis pre-calculado de ${docId}`);
      return res.json(cached.result);
    } else {
      console.log(`⚠️ [Read-Only Cache MISS] Análisis de ${docId} no encontrado en base de datos`);
      return res.status(404).json({ error: "Análisis aún no disponible para este documento." });
    }
  } catch (error) {
    console.error("❌ Error en /api/sophia/analysis/:docId:", error);
    res.status(500).json({ error: "Error interno del servidor al buscar el análisis." });
  }
});

// ─── Evaluación SOPHIA con caché robusto ──────────────
app.post("/api/sophia/evaluate-cached", async (req, res) => {
  try {
    const { text, docId } = req.body;
    if (!text || !text.trim() || !docId) {
      return res.status(400).json({ error: "text y docId son requeridos" });
    }

    const db = await connect();

    const cached = await db.collection("sophia_document_cache").findOne({
      docId,
      protocol_version: PROTOCOL.version
    });

    if (cached) {
      console.log(`♻️ [Cache HIT Robusto] ${docId} — Entregando análisis central, 0 tokens gastados`);
      return res.json(cached.result);
    }

    console.log(`🧠 [Cache MISS] ${docId} no estaba en BD — forzando evaluación a Vertex`);
    const normalizedText = normalizeTextForHash(text);
    const contentHash = crypto.createHash("sha256").update(normalizedText).digest("hex");
    
    const report = await evaluate({ text: normalizedText });

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
    console.log(`✅ [Cache SAVE Fallback] ${docId} analizado por acción del usuario y guardado`);

    res.json(report);
  } catch (error) {
    console.error("❌ Error en /api/sophia/evaluate-cached:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Evaluación con SOPHIA (Sin Caché) ─────────────────
app.post("/api/sophia/evaluate", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Texto requerido" });
    }
    
    const report = await evaluate({ text });

    if (userId) {
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

// ─── Feedback de usuarios sobre evaluaciones ───────────
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

// ─── Comparación con LOGOS (Modalidad A: Comparar Posiciones) ────────
const { compare: compareWithLogos } = require("./modules/logosEvaluationPipeline");

app.post("/api/logos/compare", async (req, res) => {
  try {
    const { posicionA, posicionB } = req.body;
    if (!posicionA || !posicionA.trim() || !posicionB || !posicionB.trim()) {
      return res.status(400).json({ error: "posicionA y posicionB son requeridos" });
    }

    const resultado = await compareWithLogos({ posicionA, posicionB });
    res.json(resultado);
  } catch (error) {
    console.error("❌ Error en /api/logos/compare:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Feedback de usuarios sobre comparaciones de Logos ─────────────────
app.post("/api/logos/feedback", async (req, res) => {
  try {
    const { comentario, validacion, timestamp } = req.body;
    if (!comentario || !comentario.trim()) {
      return res.status(400).json({ error: "Comentario requerido" });
    }

    const db = await connect();
    await db.collection("logos_feedback").insertOne({
      comentario,
      validacion: validacion || null, // estado de la Prueba de Reconstrucción, si se completó
      timestamp: timestamp || new Date().toISOString(),
      created_at: new Date()
    });

    console.log("📝 Feedback de Logos guardado en MongoDB");
    res.json({ message: "Comentario recibido correctamente" });
  } catch (error) {
    console.error("❌ Error en /api/logos/feedback:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Endpoint protegido ────────────────────────────────
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});
