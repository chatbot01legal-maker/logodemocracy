/* MEMORIA 2: LEARNING MAP (Competencias Cognitivas Transversales y Anclajes) */
const mongoose = require('mongoose');

const competenceSubSchema = new mongoose.Schema({
  autonomy: { type: Number, default: 10, min: 0, max: 100 },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  scaffolds_used: [{ type: String }],
  last_assessed: { type: Date, default: Date.now }
}, { _id: false });

const anchorSubSchema = new mongoose.Schema({
  concept: { type: String, required: true },
  analogy: { type: String, required: true },
  source_module: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const successfulAnalogySubSchema = new mongoose.Schema({
  concept: { type: String, required: true },
  analogy: { type: String, required: true },
  effectiveness: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

const learningMapSchema = new mongoose.Schema({
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
  competencies: {
    type: Map,
    of: competenceSubSchema,
    default: {
      argumentation: { autonomy: 10 },
      critical_reading: { autonomy: 10 },
      epistemology: { autonomy: 10 },
      deliberation: { autonomy: 10 },
      logic: { autonomy: 10 },
      fallacy_detection: { autonomy: 10 },
      causal_reasoning: { autonomy: 10 },
      normative_analysis: { autonomy: 10 },
      evidence_assessment: { autonomy: 10 },
      systems_thinking: { autonomy: 10 }
    }
  },
  anchors: [anchorSubSchema],
  telemetry: {
    successful_analogies: [successfulAnalogySubSchema]
  },
  interaction_stats: {
    rf_sessions: { type: Number, default: 0 },
    average_depth: { type: Number, default: 1.0 },
    successful_transfers: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('LearningMap', learningMapSchema);
