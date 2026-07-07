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
  // Retrocompatibilidad garantizada con microtestController y frontend actual
  completed_tests: [{
    type: String
  }],
  estilo_explicativo: {
    type: String,
    enum: ['analogico', 'secuencial_estructurado', 'conceptual', 'paso_a_paso'],
    default: null
  },
  preferencia_ejemplos: {
    type: String,
    enum: ['alta', 'baja'],
    default: null
  },
  contexto_ejemplo: {
    type: String,
    enum: ['cotidiano', 'profesional', 'mediatico_social'],
    default: null
  },
  tipo_analogia_dominante: {
    type: String,
    enum: ['colaborativa', 'sistemica', 'creativa', 'constructiva'],
    default: null
  },
  orientacion: {
    type: String,
    enum: ['practica', 'teorica', 'mixta'],
    default: null
  },
  pensamiento_sistemico: {
    type: String,
    enum: ['alto', 'medio', 'bajo'],
    default: null
  },
  preferencia_formato: {
    type: String,
    enum: ['textual', 'visual', 'auditivo_conversacional'],
    default: null
  },
  nivel_abstraccion_inicial: {
    type: String,
    enum: ['concreto', 'intermedio', 'abstracto'],
    default: null
  },
  secuencia_preferida: {
    type: String,
    enum: ['ejemplos_primero', 'definicion_primero'],
    default: null
  },
  necesidad_andamiaje: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: null
  },
  tipo_andamiaje_preferido: [{
    type: String,
    enum: ['resumen', 'guia', 'pregunta', 'analogia', 'mapa']
  }],
  estrategias_metacognitivas: [{
    type: String
  }],
  enfoque_resolucion: {
    type: String,
    enum: ['analitico', 'experiencial', 'sistemico', 'creativo'],
    default: null
  },
  // Variable maestra para la ingesta de instrumentos ZDP y telemetría libre
  raw_variables: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Índices optimizados para búsquedas rápidas desde el ensamblador de contexto
pedagogicalProfileSchema.index({ sessionId: 1 });
pedagogicalProfileSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('PedagogicalProfile', pedagogicalProfileSchema);
