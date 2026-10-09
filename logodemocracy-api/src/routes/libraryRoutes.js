const express = require('express');
const router = express.Router();
const c = require('../controllers/libraryController');
const { requireAuth } = require('../middlewares/auth');

// Generación y lectura
router.post('/generate', requireAuth, c.generate);
router.get('/list', requireAuth, c.list);

// Documentos — ANTES de rutas con :id para evitar colisión
router.delete('/:id/document/:order', requireAuth, c.deleteDocument);
router.patch('/:id/document/:order', requireAuth, c.renameDocument);
router.post('/:id/document/:order/move', requireAuth, c.moveDocument);
router.get('/:id/document/:order', requireAuth, c.getDocument);

// Modificación de cursos
router.delete('/:id', requireAuth, c.deleteLibrary);
router.patch('/:id', requireAuth, c.renameLibrary);
router.post('/:id/move', requireAuth, c.moveLibrary);
router.post('/:id/reorder', requireAuth, c.reorderLibrary);

// Carpetas
router.post('/folders', requireAuth, c.createFolder);
router.patch('/folders/:id', requireAuth, c.renameFolder);
router.delete('/folders/:id', requireAuth, c.deleteFolder);

module.exports = router;
