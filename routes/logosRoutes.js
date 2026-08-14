/* ═══════════════════════════════════════════════════════
   LOGOS ROUTES - Endpoint de Comparación Dialéctica
   Ecosistema LogoDemocracy
   ═══════════════════════════════════════════════════════ */

const express = require('express');
const router = express.Router();
const LogosModelAdapter = require('../LogosModelAdapter');

const adapter = new LogosModelAdapter();

/**
 * POST /api/logos/compare
 * Compara dos posiciones, extrae afirmaciones centrales, convergencias,
 * divergencias y genera una síntesis dialéctica estructurada en JSON.
 */
router.post('/compare', async (req, res) => {
  console.log('📥 [LOGOS-API] Recibida solicitud en POST /api/logos/compare');

  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      return res.status(400).json({ 
        success: false, 
        error: 'Se requieren ambos textos (textA y textB) para realizar la comparación.' 
      });
    }

    const systemInstruction = `
    Eres Logos, el motor deliberativo y analítico del ecosistema LogoDemocracy. 
    Tu tarea es realizar una comparación dialéctica rigurosa entre dos posiciones argumentales proporcionadas (Posición A y Posición B).
    Debes estructurar el análisis analizando:
    1. Las afirmaciones centrales (coreClaims) de cada posición.
    2. Los puntos de convergencia o acuerdos implícitos/explícitos.
    3. Los puntos de divergencia o tensiones críticas.
    4. Una síntesis dialéctica integradora que supere la falsa dicotomía o proponga un marco superior.
    Devuelve estrictamente un objeto JSON que cumpla con el esquema requerido.
    `.trim();

    const responseSchema = {
      type: "OBJECT",
      properties: {
        coreClaimsA: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Afirmaciones centrales de la posición A"
        },
        coreClaimsB: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Afirmaciones centrales de la posición B"
        },
        convergence: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Puntos de acuerdo entre ambas posiciones"
        },
        divergence: { 
          type: "ARRAY", 
          items: { type: "STRING" },
          description: "Puntos de fricción o desacuerdo fundamental"
        },
        synthesis: { 
          type: "STRING", 
          description: "Síntesis dialéctica integradora de ambas posturas"
        }
      },
      required: ["coreClaimsA", "coreClaimsB", "convergence", "divergence", "synthesis"]
    };

    const userInput = { 
      positionA: textA, 
      positionB: textB 
    };

    const comparisonResult = await adapter.executeTask(systemInstruction, userInput, responseSchema);

    console.log('✅ [LOGOS-API] Comparación generada y estructurada exitosamente.');
    return res.json({ 
      success: true, 
      comparison: comparisonResult 
    });

  } catch (err) {
    console.error('❌ [LOGOS-API] Error procesando /compare:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Error interno al procesar la comparación en el motor Logos.' 
    });
  }
});

module.exports = router;
