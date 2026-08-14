const express = require("express");
const router = express.Router();
const { evaluate } = require("../modules/sophiaEvaluationPipeline");

// ─── Endpoint de comparación de Logos ───────────────────
router.post("/compare", async (req, res) => {
  try {
    const { text1, text2, content, baseline } = req.body;
    
    // Soporta múltiples formatos de payload enviados por el cliente
    const primaryText = text1 || content;
    const comparisonText = text2 || baseline;

    if (!primaryText) {
      return res.status(400).json({ error: "Se requiere al menos un texto o contenido para procesar la comparación." });
    }

    console.log("🔍 [Logos] Procesando comparación en /api/logos/compare...");

    // Ejecuta la evaluación analítica sobre el texto principal
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
