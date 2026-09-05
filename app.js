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
const { getAcademyAnalysis } = require("./modules/sophiaAcademyPipeline");

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
  console.log(
    `📱 [REMOTE-${(level || "log").toUpperCase()}] ${ts} — ${message}`
  );
  res.sendStatus(204);
});

// ─── LOG de cada petición con ID ÚNICO ────────────────
app.use((req, res, next) => {
  req.headers["x-request-id"] = crypto.randomUUID();

  console.log(
    `📥 [${req.headers["x-request-id"]}] ${req.method} ${req.url}`
  );

  res.setHeader("X-Request-ID", req.headers["x-request-id"]);

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

// ═══════════════════════════════════════════════════════
// AUDITORÍA INTERNA DE DOCUMENTOS SOPHIA
// ═══════════════════════════════════════════════════════

/**
 * Ejecuta la auditoría de todos los documentos de la Academia.
 *
 * force = false
 *   Respeta la caché existente.
 *
 * force = true
 *   Reevalúa todos los documentos aunque ya exista
 *   una entrada idéntica en sophia_document_cache.
 *
 * La auditoría forzada se utiliza desde:
 *
 *   POST /api/admin/audit-all
 *
 * Esto permite volver a evaluar los documentos después de
 * cambios en Gemini, SOPHIA o el pipeline cognitivo.
 */
async function runBackgroundAudit({ force = false } = {}) {
  console.log("🔍 [Audit] Iniciando auditoría de documentos...");

  if (force) {
    console.log(
      "🔥 [Audit] MODO FORZADO: se ignorará la caché existente."
    );
  }

  const contentDir = path.join(__dirname, "pages/academy/content");

  if (!fs.existsSync(contentDir)) {
    console.log(
      `⚠️ [Audit] Directorio de contenido no encontrado: ${contentDir}`
    );

    return {
      audited: 0,
      skipped: 0,
      errors: 0,
      forced: force
    };
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"));

  console.log(`📚 [Audit] Documentos Markdown encontrados: ${files.length}`);

  const db = await connect();

  const auditTasks = files.map(async (file) => {
    try {
      const filePath = path.join(contentDir, file);

      const rawText = fs.readFileSync(filePath, "utf8");
      const textContent = normalizeTextForHash(rawText);

      if (textContent.length < 50) {
        console.log(
          `⚠️ [Audit] Omitiendo ${file} (texto demasiado corto o vacío)`
        );

        return {
          file,
          status: "skipped"
        };
      }

      const contentHash = crypto
        .createHash("sha256")
        .update(textContent)
        .digest("hex");

      // ─────────────────────────────────────────────────
      // CACHE
      // ─────────────────────────────────────────────────

      if (!force) {
        const cached = await db
          .collection("sophia_document_cache")
          .findOne({
            docId: file,
            content_hash: contentHash,
            protocol_version: PROTOCOL.version
          });

        if (cached) {
          console.log(`♻️ [Audit] Caché válida: ${file}`);

          return {
            file,
            status: "skipped"
          };
        }
      } else {
        console.log(
          `🔥 [Audit] Forzando reevaluación: ${file}`
        );
      }

      // ─────────────────────────────────────────────────
      // EVALUACIÓN SOPHIA
      // ─────────────────────────────────────────────────

      console.log(
        `⚡ [Audit] Evaluando contenido: ${file}...`
      );

      const startedAt = Date.now();

      const report = await evaluate({
        text: textContent
      });

      const duration = Date.now() - startedAt;

      console.log(
        `✅ [Audit] Evaluación completada: ${file} (${duration}ms)`
      );

      // ─────────────────────────────────────────────────
      // GUARDAR RESULTADO
      // ─────────────────────────────────────────────────

      await db
        .collection("sophia_document_cache")
        .updateOne(
          {
            docId: file
          },
          {
            $set: {
              docId: file,
              content_hash: contentHash,
              protocol_version: PROTOCOL.version,
              result: report,
              evaluated_at: new Date(),
              audit_forced: force
            }
          },
          {
            upsert: true
          }
        );

      console.log(
        `💾 [Audit] Resultado guardado en caché: ${file}`
      );

      return {
        file,
        status: "audited"
      };
    } catch (err) {
      console.error(
        `❌ [Audit] Error en ${file}:`,
        err.message
      );

      return {
        file,
        status: "error",
        error: err.message
      };
    }
  });

  // Ejecutamos las auditorías en paralelo.
  const results = await Promise.all(auditTasks);

  const audited = results.filter(
    (r) => r.status === "audited"
  ).length;

  const skipped = results.filter(
    (r) => r.status === "skipped"
  ).length;

  const errors = results.filter(
    (r) => r.status === "error"
  ).length;

  console.log(
    `🎉 [Audit] Finalizada. Evaluados: ${audited}, ` +
    `En caché/Omitidos: ${skipped}, ` +
    `Errores: ${errors}`
  );

  return {
    audited,
    skipped,
    errors,
    forced: force
  };
}

// ─── Ejecutor único automático ────────────────────────
async function runAutomaticAuditOnce() {
  if (hasRunAudit || isAuditRunning) {
    return;
  }

  isAuditRunning = true;

  try {
    console.log(
      "🤖 [Sophia Auto-Audit] Ejecutando proceso automático por única vez..."
    );

    // La auditoría automática NO fuerza reevaluación.
    await runBackgroundAudit({
      force: false
    });

    hasRunAudit = true;

    console.log(
      "✅ [Sophia Auto-Audit] Proceso completado y marcado como ejecutado."
    );
  } catch (err) {
    console.error(
      "❌ [Sophia Auto-Audit] Error en ejecución automática:",
      err
    );
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
    console.log(
      "🔥 [Admin Audit] Solicitud de auditoría forzada recibida."
    );

    const result = await runBackgroundAudit({
      force: true
    });

    res.json({
      message: "Auditoría forzada completada",
      result
    });
  } catch (error) {
    console.error(
      "❌ Error en /api/admin/audit-all:",
      error
    );

    res.status(500).json({
      error: "Error procesando la auditoría"
    });
  }
});

// ─── Autenticación ────────────────────────────────────
app.post("/api/register", async (req, res) => {
  console.log("📝 Registro de usuario:", req.body.email);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña requeridos"
      });
    }

    const db = await connect();

    const existing = await db
      .collection("users")
      .findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "El usuario ya existe"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      email,
      password: hashed,
      createdAt: new Date(),
      role: "citizen"
    });

    console.log("✅ Usuario registrado:", email);

    res.json({
      message: "Usuario registrado correctamente"
    });
  } catch (error) {
    console.error(
      "❌ Error en /api/register:",
      error
    );

    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("🔑 Intento de login:", req.body.email);

  try {
    const {
      email,
      password,
      sessionId
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña requeridos"
      });
    }

    const db = await connect();

    const user = await db
      .collection("users")
      .findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || "citizen"
      },
      process.env.JWT_SECRET || "secreto",
      {
        expiresIn: "7d"
      }
    );

    console.log(
      "✅ Login exitoso:",
      email
    );

    if (sessionId) {
      try {
        await mergeGuestProfileIntoUser({
          userId: user._id.toString(),
          sessionId
        });
      } catch (mergeError) {
        console.error(
          "⚠️ No se pudo fusionar perfil invitado:",
          mergeError.message
        );
      }
    }

    res.json({
      token,
      userId: user._id,
      email: user.email,
      role: user.role || "citizen"
    });
  } catch (error) {
    console.error(
      "❌ Error en /api/login:",
      error
    );

    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token no proporcionado"
    });
  }

  try {
    req.user = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET || "secreto"
    );

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }
}

// ─── LECTURA PURA DE CACHÉ ─────────────────────────────
app.get(
  "/api/sophia/analysis/:docId",
  async (req, res) => {
    try {
      const docId = req.params.docId;

      const db = await connect();

      const cached = await db
        .collection("sophia_document_cache")
        .findOne({
          docId: docId,
          protocol_version: PROTOCOL.version
        });

      if (cached) {
        console.log(
          `♻️ [Read-Only Cache HIT] Entregando análisis pre-calculado de ${docId}`
        );

        return res.json(cached.result);
      } else {
        console.log(
          `⚠️ [Read-Only Cache MISS] Análisis de ${docId} no encontrado en base de datos`
        );

        return res.status(404).json({
          error:
            "Análisis aún no disponible para este documento."
        });
      }
    } catch (error) {
      console.error(
        "❌ Error en /api/sophia/analysis/:docId:",
        error
      );

      res.status(500).json({
        error:
          "Error interno del servidor al buscar el análisis."
      });
    }
  }
);

// ─── LECTURA PURA DE CACHÉ SOPHIA — ACADEMIA ──────────
// READ-ONLY.
// Nunca ejecuta SophiaEngineV4.
// Nunca llama a Gemini.
// Nunca escribe en MongoDB.
// Solo devuelve un análisis previamente generado por
// auditAcademyDocuments.js.

app.get(
  "/api/sophia/academy/analysis/:docId",
  async (req, res) => {
    try {
      const docId = req.params.docId;

      const cached = await getAcademyAnalysis(docId);

      if (!cached) {
        return res.status(404).json({
          error: "Análisis de Academia aún no disponible"
        });
      }

      return res.json(cached.result);

    } catch (error) {
      console.error(
        "❌ Error en /api/sophia/academy/analysis/:docId:",
        error
      );

      return res.status(500).json({
        error: "Error interno"
      });
    }
  }
);

// ─── Evaluación SOPHIA con caché robusto ──────────────
app.post(
  "/api/sophia/evaluate-cached",
  async (req, res) => {
    try {
      const {
        text,
        docId
      } = req.body;

      if (
        !text ||
        !text.trim() ||
        !docId
      ) {
        return res.status(400).json({
          error: "text y docId son requeridos"
        });
      }

      const db = await connect();

      const cached = await db
        .collection("sophia_document_cache")
        .findOne({
          docId,
          protocol_version: PROTOCOL.version
        });

      if (cached) {
        console.log(
          `♻️ [Cache HIT Robusto] ${docId} — Entregando análisis central, 0 tokens gastados`
        );

        return res.json(cached.result);
      }

      console.log(
        `🧠 [Cache MISS] ${docId} no estaba en BD — forzando evaluación a Vertex`
      );

      const normalizedText =
        normalizeTextForHash(text);

      const contentHash = crypto
        .createHash("sha256")
        .update(normalizedText)
        .digest("hex");

      const report = await evaluate({
        text: normalizedText
      });

      await db
        .collection("sophia_document_cache")
        .updateOne(
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

      console.log(
        `✅ [Cache SAVE Fallback] ${docId} analizado por acción del usuario y guardado`
      );

      res.json(report);
    } catch (error) {
      console.error(
        "❌ Error en /api/sophia/evaluate-cached:",
        error
      );

      res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
);

// ─── Evaluación con SOPHIA (Sin Caché) ─────────────────
app.post(
  "/api/sophia/evaluate",
  async (req, res) => {
    try {
      const {
        text,
        userId
      } = req.body;

      if (
        !text ||
        text.trim().length === 0
      ) {
        return res.status(400).json({
          error: "Texto requerido"
        });
      }

      if (text.trim().length > 5000) {
        return res.status(400).json({
          ok: false,
          code: "SOPHIA_INPUT_TOO_LONG",
          error: "El texto supera el límite de 5.000 caracteres.",
          maxCharacters: 5000,
          receivedCharacters: text.trim().length
        });
      }

      const report = await evaluate({
        text
      });

      if (userId) {
        try {
          const db = await connect();

          const textHash = crypto
            .createHash("sha256")
            .update(text)
            .digest("hex");

          await db
            .collection("evaluations")
            .insertOne({
              userId,
              text_hash: textHash,
              text_preview: text.substring(0, 500),
              protocol_version: PROTOCOL.version,
              model_used: "gemini-2.5-flash",
              evaluated_at: new Date(),
              result: report
            });
        } catch (dbError) {
          console.error(
            "❌ Error al guardar en DB:",
            dbError
          );
        }
      }

      res.json(report);
    } catch (error) {
      console.error(
        "❌ Error en /api/sophia/evaluate:",
        error
      );

      res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
);

// ─── Feedback de usuarios sobre evaluaciones ───────────
app.post(
  "/api/sophia/feedback",
  async (req, res) => {
    try {
      const {
        comentario,
        texto_evaluado,
        ird_global,
        userId,
        timestamp
      } = req.body;

      if (
        !comentario ||
        !comentario.trim()
      ) {
        return res.status(400).json({
          error: "Comentario requerido"
        });
      }

      const db = await connect();

      await db
        .collection("feedback")
        .insertOne({
          comentario,
          texto_evaluado:
            texto_evaluado || null,
          userId: userId || null,
          timestamp:
            timestamp ||
            new Date().toISOString(),
          created_at: new Date()
        });

      console.log(
        "📝 Feedback de SOPHIA guardado en MongoDB"
      );

      res.json({
        message:
          "Comentario recibido correctamente"
      });
    } catch (error) {
      console.error(
        "❌ Error en /api/sophia/feedback:",
        error
      );

      res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
);

// ─── Comparación con LOGOS (Modalidad A: Comparar Posiciones) ────────
const {
  compare: compareWithLogos
} = require(
  "./modules/logosEvaluationPipeline"
);

app.post(
  "/api/logos/compare",
  async (req, res) => {
    try {
      const {
        posicionA,
        posicionB
      } = req.body;

      if (
        !posicionA ||
        !posicionA.trim() ||
        !posicionB ||
        !posicionB.trim()
      ) {
        return res.status(400).json({
          error:
            "posicionA y posicionB son requeridos"
        });
      }

      const resultado =
        await compareWithLogos({
          posicionA,
          posicionB
        });

      res.json(resultado);
    } catch (error) {
      console.error(
        "❌ Error en /api/logos/compare:",
        error
      );

      if (
        error?.code === "AI_DAILY_LIMIT_REACHED"
      ) {
        return res.status(429).json({
          ok: false,
          code: "AI_DAILY_LIMIT_REACHED",
          resetAt: error.resetAt
        });
      }

      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
);

// ─── Feedback de usuarios sobre comparaciones de Logos ─────────────────
app.post(
  "/api/logos/feedback",
  async (req, res) => {
    try {
      const {
        comentario,
        validacion,
        timestamp
      } = req.body;

      if (
        !comentario ||
        !comentario.trim()
      ) {
        return res.status(400).json({
          error: "Comentario requerido"
        });
      }

      const db = await connect();

      await db
        .collection("logos_feedback")
        .insertOne({
          comentario,
          validacion:
            validacion || null,
          timestamp:
            timestamp ||
            new Date().toISOString(),
          created_at: new Date()
        });

      console.log(
        "📝 Feedback de Logos guardado en MongoDB"
      );

      res.json({
        message:
          "Comentario recibido correctamente"
      });
    } catch (error) {
      console.error(
        "❌ Error en /api/logos/feedback:",
        error
      );

      res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }
);

// ─── Endpoint protegido ────────────────────────────────
app.get(
  "/api/profile",
  authenticate,
  (req, res) => {
    res.json({
      user: req.user
    });
  }
);
