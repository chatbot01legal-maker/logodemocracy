const express = require("express");
const cors = require("cors");
const path = require("path");
const { processMessageUnified } = require("./modules/pipeline");

const app = express();

/* ===============================
   CORS ROBUSTO (FIX DEFINITIVO)
=============================== */
const allowedOrigins = [
    "https://abolegal.cl",
    "https://ai-team-backend.onrender.com",
    "https://ai-team-frontend.onrender.com",
    "https://chatbot-legal-widget.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080"
];

app.use(
    cors({
        origin: function (origin, callback) {
            console.log("🌍 Origin recibido:", origin);

            if (!origin) return callback(null, true);

            if (
                allowedOrigins.includes(origin) ||
                origin.includes("onrender.com")
            ) {
                return callback(null, true);
            }

            console.warn(`🚨 CORS bloqueado: ${origin}`);
            return callback(new Error("Origen no permitido por CORS"));
        },
        credentials: true,
    })
);

/* ===============================
   MIDDLEWARE
=============================== */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   HEALTH CHECK
=============================== */
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ===============================
   API CHAT
=============================== */
app.post("/api/chat", async (req, res) => {
    const start = Date.now();

    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: "Message and sessionId are required" });
        }

        const result = await processMessageUnified(sessionId, message);

        const duration = Date.now() - start;
        console.log(
            `📊 [CHAT] session=${sessionId} time=${duration}ms chars=${message.length}`
        );

        res.json(result);

    } catch (error) {
        console.error("❌ SERVER ERROR", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/* ===============================
   CALENDAR ENDPOINTS
=============================== */
app.post("/api/calendar/create-event", async (req, res) => {
    try {
        const { email, name, date, time } = req.body;

        console.log(`📅 Calendar event request for: ${name} (${email}) at ${date} ${time}`);

        res.json({
            success: true,
            message: "Calendar endpoint ready",
            eventId: "placeholder-" + Date.now()
        });

    } catch (error) {
        console.error("❌ CALENDAR ERROR", error);
        res.status(500).json({ error: "Error al crear evento en calendario" });
    }
});

app.get("/api/calendar/availability", async (req, res) => {
    try {
        const { date } = req.query;

        console.log(`📅 Availability request for: ${date}`);

        const slots = [
            "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
        ];

        res.json({
            date,
            availableSlots: slots,
            timezone: "America/Santiago"
        });

    } catch (error) {
        console.error("❌ AVAILABILITY ERROR", error);
        res.status(500).json({ error: "Error al obtener disponibilidad" });
    }
});

/* ===============================
   FALLBACK ROUTE
=============================== */
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   START SERVER
=============================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 ABOLEGAL LANDING ONLINE - PUERTO ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
    console.log(`📅 Calendar API: http://localhost:${PORT}/api/calendar/availability`);
});
