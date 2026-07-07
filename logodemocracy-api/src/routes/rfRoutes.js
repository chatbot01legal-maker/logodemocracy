const express = require('express');
const router = express.Router();
const rfController = require('../controllers/rfController');
const { optionalAuth } = require('../middlewares/auth');

// Endpoint principal del Pedagogical Operating System
router.post('/process', optionalAuth, rfController.process);

module.exports = router;
