/* ============================================================
   REY FILÓSOFO · BIBLIOTECA PERSONAL · CONTROLLER
   Endpoints para generar, listar, modificar y borrar cursos
   y carpetas personales.
============================================================ */

'use strict';

const { UserLibrary, UserFolder } = require('../models/UserLibrary');
const { generateCourse } = require('../../../modules/reyFilosofo/libreriaGenerator');

/* ============================================================
   Helper: título único por usuario.
============================================================ */
async function uniqueTitleForUser(userId, baseTitle) {
  const base = String(baseTitle || 'Curso').trim();
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const existing = await UserLibrary
    .find({
      userId: userId,
      title: { $regex: '^' + escaped + '(\\s+\\d+)?$' }
    })
    .select('title')
    .lean();

  if (!existing.length) return base;

  const used = new Set();
  existing.forEach(function (lib) {
    if (lib.title === base) {
      used.add(1);
      return;
    }
    const m = lib.title.match(/\s+(\d+)$/);
    if (m) used.add(Number(m[1]));
  });

  let n = 2;
  while (used.has(n)) n++;
  return base + ' ' + n;
}

/* ============================================================
   GENERAR curso (sin cambios de fondo, ajustado al nuevo modelo)
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

    const requestedTitle = (req.body.title || tema).trim();
    const finalTitle = await uniqueTitleForUser(req.user._id, requestedTitle);

    // Crear carpeta automática con el nombre del curso (excepto si ya viene folderId).
    let folderId = req.body.folderId || null;
    if (!folderId) {
      const lastFolder = await UserFolder
        .findOne({ userId: req.user._id })
        .sort({ order: -1 })
        .select('order')
        .lean();
      const nextFolderOrder = lastFolder ? (lastFolder.order || 0) + 1 : 0;

      const folder = await UserFolder.create({
        userId: req.user._id,
        name: finalTitle,
        order: nextFolderOrder
      });
      folderId = folder._id;
    }

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
      folderId: folderId,
      status: 'pending'
    });

    try {
      const course = await generateCourse(params);

      library.documents = course.documents;
      library.model = course.model;
      library.status = 'ready';
      await library.save();

      return res.status(201).json({
        library: {
          _id: library._id,
          title: library.title,
          params: library.params,
          folderId: library.folderId,
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
   LIST · todas las librerías ready + carpetas
============================================================ */
exports.list = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ libraries: [], folders: [] });
    }

    // Lazy migration: cursos sin carpeta → crear carpeta con su título.
    const orphans = await UserLibrary
      .find({ userId: req.user._id, status: 'ready', folderId: null })
      .select('_id title')
      .lean();

    if (orphans.length) {
      const lastFolder = await UserFolder
        .findOne({ userId: req.user._id })
        .sort({ order: -1 })
        .select('order')
        .lean();
      let nextOrder = lastFolder ? (lastFolder.order || 0) + 1 : 0;

      for (const orphan of orphans) {
        let folder = await UserFolder.findOne({
          userId: req.user._id,
          name: orphan.title
        });
        if (!folder) {
          folder = await UserFolder.create({
            userId: req.user._id,
            name: orphan.title,
            order: nextOrder
          });
          nextOrder++;
        }
        await UserLibrary.updateOne(
          { _id: orphan._id },
          { $set: { folderId: folder._id } }
        );
      }
      console.log('[LIBRERIA] Migrados ' + orphans.length + ' cursos huérfanos a carpetas');
    }

    const [libs, folders] = await Promise.all([
      UserLibrary
        .find({ userId: req.user._id, status: 'ready' })
        .sort({ orderInFolder: 1, createdAt: 1 })
        .lean(),
      UserFolder
        .find({ userId: req.user._id })
        .sort({ order: 1, createdAt: 1 })
        .lean()
    ]);

    const libraries = libs.map(function (lib) {
      return {
        _id: lib._id,
        title: lib.title,
        tema: lib.params && lib.params.tema ? lib.params.tema : '',
        folderId: lib.folderId || null,
        orderInFolder: lib.orderInFolder || 0,
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

    const folderList = folders.map(function (fo) {
      return {
        _id: fo._id,
        name: fo.name,
        order: fo.order || 0
      };
    });

    res.json({ libraries: libraries, folders: folderList });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET DOCUMENT · contenido completo de un doc
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

/* ============================================================
   DELETE LIBRARY · borrar un curso propio
============================================================ */
exports.deleteLibrary = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const result = await UserLibrary.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Librería no encontrada.' });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   RENAME LIBRARY · cambiar el título
============================================================ */
exports.renameLibrary = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const newTitle = String((req.body && req.body.title) || '').trim();
    if (!newTitle) {
      return res.status(400).json({ error: 'El título no puede estar vacío.' });
    }
    if (newTitle.length > 120) {
      return res.status(400).json({ error: 'El título no puede superar 120 caracteres.' });
    }

    // Garantizar unicidad
    const finalTitle = await uniqueTitleForUser(req.user._id, newTitle);

    const lib = await UserLibrary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { title: finalTitle } },
      { new: true }
    ).lean();

    if (!lib) {
      return res.status(404).json({ error: 'Librería no encontrada.' });
    }

    res.json({ library: { _id: lib._id, title: lib.title } });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   MOVE LIBRARY · mover a una carpeta (o a null)
============================================================ */
exports.moveLibrary = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const rawFolderId = req.body && req.body.folderId;
    let folderId = null;

    if (rawFolderId) {
      const folder = await UserFolder.findOne({
        _id: rawFolderId,
        userId: req.user._id
      }).lean();
      if (!folder) {
        return res.status(404).json({ error: 'Carpeta no encontrada.' });
      }
      folderId = folder._id;
    }

    // Determinar orderInFolder: último de la carpeta destino + 1
    const last = await UserLibrary
      .findOne({ userId: req.user._id, folderId: folderId })
      .sort({ orderInFolder: -1 })
      .select('orderInFolder')
      .lean();
    const nextOrder = last ? (last.orderInFolder || 0) + 1 : 0;

    const lib = await UserLibrary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { folderId: folderId, orderInFolder: nextOrder } },
      { new: true }
    ).lean();

    if (!lib) {
      return res.status(404).json({ error: 'Librería no encontrada.' });
    }

    res.json({ library: { _id: lib._id, folderId: lib.folderId } });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   REORDER LIBRARY · subir o bajar dentro de su carpeta
   body: { direction: 'up' | 'down' }
============================================================ */
exports.reorderLibrary = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const direction = req.body && req.body.direction;
    if (direction !== 'up' && direction !== 'down') {
      return res.status(400).json({ error: 'direction debe ser "up" o "down".' });
    }

    const lib = await UserLibrary.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!lib) {
      return res.status(404).json({ error: 'Librería no encontrada.' });
    }

    const siblings = await UserLibrary
      .find({ userId: req.user._id, folderId: lib.folderId || null })
      .sort({ orderInFolder: 1, createdAt: 1 })
      .select('_id orderInFolder')
      .lean();

    const idx = siblings.findIndex(function (s) {
      return String(s._id) === String(lib._id);
    });
    if (idx === -1) {
      return res.status(404).json({ error: 'Librería no encontrada en su carpeta.' });
    }

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) {
      return res.json({ ok: true, moved: false });
    }

    const a = siblings[idx];
    const b = siblings[swapIdx];

    // Intercambio de orderInFolder
    await UserLibrary.updateOne({ _id: a._id }, { $set: { orderInFolder: b.orderInFolder || 0 } });
    await UserLibrary.updateOne({ _id: b._id }, { $set: { orderInFolder: a.orderInFolder || 0 } });

    res.json({ ok: true, moved: true });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   CREATE FOLDER
============================================================ */
exports.createFolder = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const name = String((req.body && req.body.name) || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    }
    if (name.length > 80) {
      return res.status(400).json({ error: 'El nombre no puede superar 80 caracteres.' });
    }

    const exists = await UserFolder.findOne({ userId: req.user._id, name: name }).lean();
    if (exists) {
      return res.status(409).json({ error: 'Ya tenés una carpeta con ese nombre.' });
    }

    const last = await UserFolder
      .findOne({ userId: req.user._id })
      .sort({ order: -1 })
      .select('order')
      .lean();
    const nextOrder = last ? (last.order || 0) + 1 : 0;

    const folder = await UserFolder.create({
      userId: req.user._id,
      name: name,
      order: nextOrder
    });

    res.status(201).json({ folder: { _id: folder._id, name: folder.name, order: folder.order } });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   RENAME FOLDER
============================================================ */
exports.renameFolder = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const name = String((req.body && req.body.name) || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
    }
    if (name.length > 80) {
      return res.status(400).json({ error: 'El nombre no puede superar 80 caracteres.' });
    }

    const exists = await UserFolder.findOne({
      userId: req.user._id,
      name: name,
      _id: { $ne: req.params.id }
    }).lean();
    if (exists) {
      return res.status(409).json({ error: 'Ya tenés otra carpeta con ese nombre.' });
    }

    const folder = await UserFolder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { name: name } },
      { new: true }
    ).lean();

    if (!folder) {
      return res.status(404).json({ error: 'Carpeta no encontrada.' });
    }

    res.json({ folder: { _id: folder._id, name: folder.name } });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   DELETE FOLDER · borra la carpeta y deja los cursos sin carpeta.
============================================================ */
exports.deleteFolder = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const folder = await UserFolder.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).lean();

    if (!folder) {
      return res.status(404).json({ error: 'Carpeta no encontrada.' });
    }

    // Desasociar cursos de la carpeta.
    await UserLibrary.updateMany(
      { userId: req.user._id, folderId: folder._id },
      { $set: { folderId: null } }
    );

    await UserFolder.deleteOne({ _id: folder._id });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   DELETE DOCUMENT · borra un doc. Si queda 0, borra el curso.
============================================================ */
exports.deleteDocument = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const lib = await UserLibrary.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!lib) {
      return res.status(404).json({ error: 'Curso no encontrado.' });
    }

    const order = Number(req.params.order);
    const before = (lib.documents || []).length;
    lib.documents = lib.documents.filter(function (d) {
      return Number(d.order) !== order;
    });

    if (lib.documents.length === before) {
      return res.status(404).json({ error: 'Documento no encontrado.' });
    }

    // Reordenar (1, 2, 3, ...)
    lib.documents.sort(function (a, b) { return a.order - b.order; });
    lib.documents.forEach(function (d, i) { d.order = i + 1; });

    // Si quedó sin documentos, borrar el curso.
    if (lib.documents.length === 0) {
      await UserLibrary.deleteOne({ _id: lib._id });
      return res.json({ ok: true, courseDeleted: true, libraryId: lib._id });
    }

    await lib.save();
    return res.json({
      ok: true,
      courseDeleted: false,
      remainingDocuments: lib.documents.length
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   MOVE DOCUMENT · mueve un doc de un curso a otro (mismo usuario).
============================================================ */
exports.moveDocument = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const targetId = req.body && req.body.targetLibraryId;
    if (!targetId) {
      return res.status(400).json({ error: 'Falta targetLibraryId.' });
    }

    if (String(targetId) === String(req.params.id)) {
      return res.status(400).json({ error: 'El curso origen y destino son el mismo.' });
    }

    const [source, target] = await Promise.all([
      UserLibrary.findOne({ _id: req.params.id, userId: req.user._id }),
      UserLibrary.findOne({ _id: targetId, userId: req.user._id })
    ]);

    if (!source) return res.status(404).json({ error: 'Curso origen no encontrado.' });
    if (!target) return res.status(404).json({ error: 'Curso destino no encontrado.' });

    const order = Number(req.params.order);
    const doc = (source.documents || []).find(function (d) {
      return Number(d.order) === order;
    });
    if (!doc) {
      return res.status(404).json({ error: 'Documento no encontrado.' });
    }

    // Quitar del origen
    source.documents = source.documents.filter(function (d) {
      return Number(d.order) !== order;
    });
    source.documents.sort(function (a, b) { return a.order - b.order; });
    source.documents.forEach(function (d, i) { d.order = i + 1; });

    // Agregar al destino (al final)
    const nextOrder = (target.documents || []).length + 1;
    target.documents.push({
      order: nextOrder,
      title: doc.title,
      content_md: doc.content_md,
      summary: doc.summary,
      ideas_fuerza: doc.ideas_fuerza || []
    });

    // Si el origen quedó vacío, borrarlo.
    let sourceDeleted = false;
    if (source.documents.length === 0) {
      await UserLibrary.deleteOne({ _id: source._id });
      sourceDeleted = true;
    } else {
      await source.save();
    }
    await target.save();

    return res.json({
      ok: true,
      sourceDeleted: sourceDeleted,
      targetDocumentCount: target.documents.length,
      sourceDocumentCount: source.documents.length
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   RENAME DOCUMENT · cambia el título de un doc.
============================================================ */
exports.renameDocument = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const newTitle = String((req.body && req.body.title) || '').trim();
    if (!newTitle) return res.status(400).json({ error: 'El título no puede estar vacío.' });
    if (newTitle.length > 120) return res.status(400).json({ error: 'Máximo 120 caracteres.' });

    const lib = await UserLibrary.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!lib) return res.status(404).json({ error: 'Curso no encontrado.' });

    const order = Number(req.params.order);
    const doc = (lib.documents || []).find(function (d) {
      return Number(d.order) === order;
    });
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });

    doc.title = newTitle;
    await lib.save();

    return res.json({ ok: true, document: { order: doc.order, title: doc.title } });
  } catch (error) {
    next(error);
  }
};

