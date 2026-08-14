/* ═══════════════════════════════════════════════════════
   ROUTES/LOGOS.JS — Router Express para Logos Engine v0.2.1
   ═══════════════════════════════════════════════════════ */

const express = require('express');
const router = express.Router();
const LogosEngine = require('../LogosEngine');
const LogosModelAdapter = require('../LogosModelAdapter');

let engine = null;
const rateLimitMap = new Map();

function getEngineInstance() {
  if (!engine) {
    const adapter = new LogosModelAdapter();
    engine = new LogosEngine(adapter);
  }
  return engine;
}

router.post('/compare', async (req, res) => {
  // 1. Rate Limiting Simple en Memoria (Evita abusos en Render)
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (rateLimitMap.has(ip) && now - rateLimitMap.get(ip) < 15000) {
    return res.status(429).json({ error: 'Demasiadas peticiones. Espera 15 segundos entre ejecuciones.' });
  }
  rateLimitMap.set(ip, now);

  try {
    const { posicionA, posicionB, sessionId, validationMode } = req.body;

    // 2. Validación de Carga y Límites de Tamaño
    if (!posicionA || !posicionB) {
      return res.status(400).json({ error: 'Se requieren ambas posiciones.' });
    }
    if (posicionA.length > 15000 || posicionB.length > 15000) {
      return res.status(400).json({ error: 'El texto excede el límite experimental de 15,000 caracteres.' });
    }

    const currentEngine = getEngineInstance();
    const result = await currentEngine.processComparison(posicionA, posicionB, {
      sessionId,
      validationMode: validationMode || 'USER_ASSERTED_UNVERIFIED'
    });

    return res.json(result);

  } catch (error) {
    console.error('❌ Error en el endpoint /api/logos/compare:', error);
    return res.status(500).json({
      error: 'Error interno en la ejecución del protocolo Logos.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
