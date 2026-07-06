const express = require('express');
const router = express.Router();
const { getPhilosopherConsultation } = require('../modules/reyFilosofoService');

router.post('/consult', async (req, res) => {
  console.log('[REY-FILOSOFO-API] POST /api/rey-filosofo/consult recibido');
  
  try {
    const { text, sophiaContext } = req.body;
    const consultation = await getPhilosopherConsultation(text, sophiaContext);
    
    res.json({
      success: true,
      consultation
    });
  } catch (error) {
    console.error(`[REY-FILOSOFO-API] Error de validación o ejecución: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
