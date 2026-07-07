/* MEMORIA 3: SESIÓN ACTIVA (El Kernel Operando en Tiempo Real) */
const mongoose = require('mongoose');

const interactionSubSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  action_value: { type: String, required: true }
}, { _id: false });

const rfSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  provider_module: {
    type: String,
    enum: ['AcademiaContextProvider', 'SophiaContextProvider', 'LogosContextProvider', 'AletheiaContextProvider', 'AgoraContextProvider', 'MithosContextProvider'],
    required: true
  },
  fsm_state: {
    type: String,
    enum: ['AUTONOMO', 'FRICCION', 'ORIENTACION', 'ANDAMIAJE', 'TRANSFERENCIA', 'REFLEXION'],
    default: 'AUTONOMO'
  },
  cognitive_assets: {
    academy_document_id: { type: String, default: null },
    academy_chunk_id: { type: String, default: null },
    academy_glossary_term: { type: String, default: null },
    academy_map_node: { type: String, default: null },
    selection: { type: String, default: null }
  },
  interactions: [interactionSubSchema],
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RFSession', rfSessionSchema);
