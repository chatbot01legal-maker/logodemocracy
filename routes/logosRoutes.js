const express = require("express");
const router = express.Router();
const { evaluate } = require("../modules/sophiaEvaluationPipeline");

// ─── Endpoint de comparación de Logos ───────────────────
router.post("/compare", async (req, res) => {
  try {
    console.log("🔍 [Logos] Payload recibido en /compare:", JSON.stringify(req.body));

    const body = req.body || {};
    let primaryText = body.text1 || body.content || body.text || body.input || body.code;
    let comparisonText = body.text2 || body.baseline || body.comparison;

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

    // Estructura segura de reconstructions para evitar errores en el frontend
    const reconstructionsData = evaluationResult.reconstructions || {
      a: primaryText,
      b: comparisonText || "",
      analysis: evaluationResult
    };

    res.json({
      success: true,
      message: "Comparación de Logos realizada exitosamente",
      reconstructions: reconstructionsData, // <-- Propiedad clave esperada por el cliente
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
