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
  model: { type: String, default: null }
}, {
  timestamps: true
});

userLibrarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('UserLibrary', userLibrarySchema);
