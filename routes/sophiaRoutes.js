const express = require('express');
const router = express.Router();
const { analyzeDocument } = require('../modules/sophiaService');

router.post('/analyze', async (req, res) => {
  console.log('[SOPHIA-API] POST /api/sophia/analyze recibido');
  
  try {
    const { text } = req.body;
    const analysis = await analyzeDocument(text);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error(`[SOPHIA-API] Error de validación o ejecución: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
