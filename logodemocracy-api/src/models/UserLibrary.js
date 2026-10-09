const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  content_md: { type: String, required: true },
  summary: { type: String, default: '' },
  ideas_fuerza: { type: [String], default: [] }
}, { _id: false });

const userLibrarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  params: {
    tema: { type: String, required: true },
    proposito: { type: String, default: null },
    dificultad: { type: String, default: null },
    conocimiento: { type: String, default: null },
    atraccion: { type: String, default: '' },
    tecnico: { type: String, default: null },
    estilo: { type: String, default: null },
    referencias: { type: String, default: null }
  },
  documents: { type: [documentSchema], default: [] },
  status: {
    type: String,
    enum: ['pending', 'ready', 'failed'],
    default: 'pending'
  },
  error: { type: String, default: null },
  model: { type: String, default: null },
  // Carpeta personal (opcional). null = sin carpeta (curso suelto).
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserFolder',
    default: null,
    index: true
  },
  // Orden dentro de la carpeta o global (para futuros reordenamientos).
  orderInFolder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userLibrarySchema.index({ userId: 1, createdAt: -1 });
userLibrarySchema.index({ userId: 1, folderId: 1, orderInFolder: 1 });

// Modelo de carpeta personal.
const userFolderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userFolderSchema.index({ userId: 1, order: 1 });

module.exports = {
  UserLibrary: mongoose.model('UserLibrary', userLibrarySchema),
  UserFolder: mongoose.model('UserFolder', userFolderSchema)
};
