const express = require("express");
const router = express.Router();
const { evaluate } = require("../modules/sophiaEvaluationPipeline");

// ─── Endpoint de comparación de Logos ───────────────────
router.post("/compare", async (req, res) => {
  try {
    console.log("🔍 [Logos] Payload recibido en /compare:", JSON.stringify(req.body));

    const body = req.body || {};

    // 1. Intentar nombres estándar
    let primaryText = body.text1 || body.content || body.text || body.input || body.code;
    let comparisonText = body.text2 || body.baseline || body.comparison;

    // 2. Extracción ultra flexible: si no calza con los nombres anteriores, 
    // toma automáticamente cualquier texto disponible en el objeto recibido.
    if (!primaryText && typeof body === 'object') {
      const stringValues = Object.values(body).filter(v => typeof v === 'string' && v.trim().length > 0);
      if (stringValues.length > 0) {
        stringValues.sort((a, b) => b.length - a.length);
        primaryText = stringValues[0];
        if (stringValues.length > 1) {
          comparisonText = stringValues[1];
        }
      }
    }

    if (!primaryText || typeof primaryText !== 'string' || primaryText.trim().length === 0) {
      console.warn("⚠️ [Logos] No se encontró texto válido. Claves recibidas:", Object.keys(body));
      return res.status(400).json({ 
        error: "Se requiere al menos un texto o contenido para procesar la comparación.",
        receivedKeys: Object.keys(body)
      });
    }

    console.log("🧠 [Logos] Procesando evaluación analítica...");
    const evaluationResult = await evaluate({ text: primaryText });

    res.json({
      success: true,
      message: "Comparación de Logos realizada exitosamente",
      comparison: {
        primaryLength: primaryText.length,
        comparisonLength: comparisonText ? comparisonText.length : 0,
        result: evaluationResult
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Error en /api/logos/compare:", error);
    res.status(500).json({ error: "Error interno del servidor al procesar Logos." });
  }
});

module.exports = router;
