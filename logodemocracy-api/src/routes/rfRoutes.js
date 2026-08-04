const express = require('express');
const router = express.Router();
const rfController = require('../controllers/rfController');
const { optionalAuth } = require('../middlewares/auth');

// Paso 2: Endpoint maestro del proceso cognitivo extremo a extremo
router.post('/process', optionalAuth, rfController.process);
router.post('/message', optionalAuth, rfController.process);

module.exports = router;
