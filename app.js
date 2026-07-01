const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ─── Módulos propios ──────────────────────────────────
const { connect } = require("./modules/database");
const { askVertex } = require("./modules/vertexClient");
const { evaluateText, getLLMReview, PROTOCOL } = require("./modules/sophiaCore");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// ─── Ruta principal ────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─── Health Check ─────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    version: "SOPHIA v0.92-beta",
    protocol_version: PROTOCOL.version || "desconocida"
  });
});

// ─── Autenticación ────────────────────────────────────

// Registro
app.post("/api/register", async (req, res) => {
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
      role: "citizen" // por defecto
    });
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en /api/register:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    const db = await connect();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "citizen" },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      userId: user._id,
      email: user.email,
      role: user.role || "citizen"
    });
  } catch (error) {
    console.error("Error en /api/login:", error);
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
  try {
    const { text, userId } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Texto requerido" });
    }

    // 1️⃣ Evaluación local (determinista, auditable)
    const localResult = evaluateText(text);
    if (!localResult) {
      return res.status(400).json({ error: "Error al evaluar el texto" });
    }

    // 2️⃣ Revisión semántica con Gemini (solo si es necesario)
    let llmReview = null;
    if (localResult.IRD_global < 85 || localResult.evidencias.length > 0) {
      try {
        llmReview = await getLLMReview(text, localResult);
      } catch (llmError) {
        console.error("Error en LLM review:", llmError);
        llmReview = { error: "Revisión semántica no disponible" };
      }
    }

    // 3️⃣ Ensamblar informe final
    const finalReport = {
      protocol_version: PROTOCOL.version || "0.92-beta",
      evaluated_at: new Date().toISOString(),
      local: localResult,
      llm_review: llmReview,
      // Campos enriquecidos
      ird: localResult.IRD_global,
      risk: localResult.riesgo,
      evidence_density: localResult.evidencias.length / (text.split(/\s+/).length || 1)
    };

    // 4️⃣ Guardar en MongoDB (si hay userId)
    if (userId) {
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
    }

    res.json(finalReport);
  } catch (error) {
    console.error("Error en /api/sophia/evaluate:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ─── Endpoint protegido (ejemplo) ────────────────────
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ─── Iniciar servidor ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor SOPHIA ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Protocolo cargado: ${PROTOCOL.version || "desconocido"}`);
});
