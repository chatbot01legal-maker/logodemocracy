const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { requireAuth } = require('../middlewares/auth');

router.post('/generate', requireAuth, libraryController.generate);
router.get('/list', requireAuth, libraryController.list);
router.get('/:id/document/:order', requireAuth, libraryController.getDocument);

module.exports = router;
