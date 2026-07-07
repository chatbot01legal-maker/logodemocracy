/* MEMORIA 1: PERFIL ESTABLE (¿Cómo aprende el ciudadano?) */
const mongoose = require('mongoose');

const pedagogicalProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    sparse: true
  },
  sessionId: {
    type: String,
    index: true
  },
  completed_micro_instruments: [{
    type: String // Ej: 'microtest_01', 'microtest_02'
  }],
  // Variables extraídas directamente de los Micro-instrumentos ZDP
  estilo_explicativo: {
    type: String,
    enum: ['analogico', 'secuencial_estructurado', 'conceptual', 'paso_a_paso', null],
    default: null
  },
  preferencia_ejemplos: {
    type: String,
    enum: ['alta', 'baja', null],
    default: null
  },
  contexto_ejemplo: {
    type: String,
    enum: ['cotidiano', 'profesional', 'mediatico_social', null],
    default: null
  },
  tipo_analogia_dominante: {
    type: String,
    enum: ['colaborativa', 'sistemica', 'creativa', 'constructiva', null],
    default: null
  },
  orientacion: {
    type: String,
    enum: ['practica', 'teorica', 'mixta', null],
    default: null
  },
  pensamiento_sistemico: {
    type: String,
    enum: ['alto', 'medio', 'bajo', null],
    default: null
  },
  preferencia_formato: {
    type: String,
    enum: ['textual', 'visual', 'auditivo_conversacional', null],
    default: null
  },
  nivel_abstraccion_inicial: {
    type: String,
    enum: ['concreto', 'intermedio', 'abstracto', null],
    default: null
  },
  secuencia_preferida: {
    type: String,
    enum: ['ejemplos_primero', 'definicion_primero', null],
    default: null
  },
  necesidad_andamiaje: {
    type: String,
    enum: ['alta', 'media', 'baja', null],
    default: null
  },
  tipo_andamiaje_preferido: [{
    type: String,
    enum: ['resumen', 'guia', 'pregunta', 'analogia', 'mapa']
  }],
  estrategias_metacognitivas: [{
    type: String // 'planificacion', 'elaboracion_ejemplos', 'autoevaluacion', etc.
  }],
  enfoque_resolucion: {
    type: String,
    enum: ['analitico', 'experiencial', 'sistemico', 'creativo', null],
    default: null
  },
  raw_variables: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('PedagogicalProfile', pedagogicalProfileSchema);
