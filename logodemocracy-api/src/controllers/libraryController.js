/* ============================================================
   REY FILÓSOFO · LIBRERÍA PERSONAL · CONTROLLER
   Endpoints para generar, listar y leer cursos personales.
============================================================ */

'use strict';

const UserLibrary = require('../models/UserLibrary');
const { generateCourse } = require('../../../modules/reyFilosofo/libreriaGenerator');

/* ============================================================
   Genera un título único para el usuario.
   Si ya existe "Cocina japonesa", devuelve "Cocina japonesa 2",
   después "Cocina japonesa 3", etc.
============================================================ */
async function uniqueTitleForUser(userId, baseTitle) {
  const base = String(baseTitle || 'Curso').trim();
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Buscar todos los que empiecen con el título base
  const existing = await UserLibrary
    .find({
      userId: userId,
      title: { $regex: '^' + escaped + '(\\s+\\d+)?$' }
    })
    .select('title')
    .lean();

  if (!existing.length) {
    return base;
  }

  // Detectar números usados
  const used = new Set();
  existing.forEach(function (lib) {
    if (lib.title === base) {
      used.add(1);
      return;
    }
    const m = lib.title.match(/\\s+(\\d+)$/);
    if (m) used.add(Number(m[1]));
  });

  // Buscar el primer número libre desde 2 en adelante
  let n = 2;
  while (used.has(n)) n++;
  return base + ' ' + n;
}

/* ============================================================
   POST /api/reyfilosofo/library/generate
   Genera un curso personal y lo guarda.
============================================================ */
exports.generate = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión para crear una librería.' });
    }

    const params = req.body && req.body.params ? req.body.params : {};
    const tema = (params.tema || '').trim();

    if (!tema) {
      return res.status(400).json({ error: 'El campo "tema" es obligatorio.' });
    }

    // Resolver título único para este usuario
    const requestedTitle = (req.body.title || tema).trim();
    const finalTitle = await uniqueTitleForUser(req.user._id, requestedTitle);

    // Crear registro pending
    const library = await UserLibrary.create({
      userId: req.user._id,
      title: finalTitle,
      params: {
        tema: tema,
        proposito: params.proposito || null,
        dificultad: params.dificultad || null,
        conocimiento: params.conocimiento || null,
        atraccion: params.atraccion || '',
        tecnico: params.tecnico || null,
        estilo: params.estilo || null,
        referencias: params.referencias || null
      },
      status: 'pending'
    });

    try {
      const course = await generateCourse(params);

      // Mantenemos el título único ya resuelto (no el que devolvió Gemini)
      // library.title ya está asignado en create();
      // si querés preservar el título del curso como subtitle, se agrega después.
      library.documents = course.documents;
      library.model = course.model;
      library.status = 'ready';
      await library.save();

      return res.status(201).json({
        library: {
          _id: library._id,
          title: library.title,
          params: library.params,
          documents: library.documents.map(function (d) {
            return {
              order: d.order,
              title: d.title,
              summary: d.summary,
              ideas_fuerza: d.ideas_fuerza
            };
          }),
          status: library.status,
          createdAt: library.createdAt
        }
      });
    } catch (genError) {
      library.status = 'failed';
      library.error = String(genError.message || genError).slice(0, 500);
      await library.save();

      console.error('[LIBRERIA] Error generando:', genError.message);
      return res.status(502).json({
        error: 'No se pudo generar el curso. Intenta de nuevo en unos instantes.',
        detail: genError.message
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET /api/reyfilosofo/library/list
   Devuelve todas las librerías del usuario (sin contenido completo).
============================================================ */
exports.list = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ libraries: [] });
    }

    const libs = await UserLibrary
      .find({ userId: req.user._id, status: 'ready' })
      .sort({ createdAt: -1 })
      .lean();

    const libraries = libs.map(function (lib) {
      return {
        _id: lib._id,
        title: lib.title,
        tema: lib.params && lib.params.tema ? lib.params.tema : '',
        createdAt: lib.createdAt,
        documents: (lib.documents || []).map(function (d) {
          return {
            order: d.order,
            title: d.title,
            summary: d.summary
          };
        })
      };
    });

    res.json({ libraries: libraries });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET /api/reyfilosofo/library/:id/document/:order
   Devuelve el contenido completo de un documento.
============================================================ */
exports.getDocument = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const lib = await UserLibrary.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!lib) {
      return res.status(404).json({ error: 'Librería no encontrada.' });
    }

    const order = Number(req.params.order);
    const doc = (lib.documents || []).find(function (d) {
      return Number(d.order) === order;
    });

    if (!doc) {
      return res.status(404).json({ error: 'Documento no encontrado.' });
    }

    res.json({
      library: {
        _id: lib._id,
        title: lib.title,
        tema: lib.params && lib.params.tema ? lib.params.tema : ''
      },
      document: {
        order: doc.order,
        title: doc.title,
        content_md: doc.content_md,
        summary: doc.summary,
        ideas_fuerza: doc.ideas_fuerza || []
      }
    });
  } catch (error) {
    next(error);
  }
};
