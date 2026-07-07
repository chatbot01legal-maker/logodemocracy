const express = require('express');
const router = express.Router();
const { saveMicrotest, listCompletedTests } = require('../controllers/microtestController');
const { optionalAuth } = require('../middlewares/auth');

/* Enganche exacto con el frontend existente: /api/reyfilosofo/microtests/save */
router.post('/save', optionalAuth, saveMicrotest);
router.get('/list', optionalAuth, listCompletedTests);

module.exports = router;
