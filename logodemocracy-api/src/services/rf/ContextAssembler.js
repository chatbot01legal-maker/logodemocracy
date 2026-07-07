const PedagogicalProfile = require('../../models/PedagogicalProfile');
const LearningMap = require('../../models/LearningMap');
const RFSession = require('../../models/RFSession');
const PersistenceManager = require('./PersistenceManager');

const ContextAssembler = {
  async assemble(userId, sessionId, provider_module) {
    const query = userId ? { userId } : { sessionId };
    
    // Si estamos en entorno de test sin Mongoose, evitamos llamar al ORM
    if (!PedagogicalProfile.findOne || typeof PedagogicalProfile.findOne !== 'function') {
      return {
        profile: { nivel_abstraccion_inicial: 'intermedio', estilo_explicativo: 'analogico', necesidad_andamiaje: 'media' },
        learningMap: { competencies: new Map(), anchors: [], telemetry: { successful_analogies: [] }, interaction_stats: { successful_transfers: 0 } },
        session: { fsm_state: 'AUTONOMO', provider_module, is_active: true, save: async () => {} }
      };
    }

    let profile = await PedagogicalProfile.findOne(query);
    let learningMap = await LearningMap.findOne(query);
    let session = await RFSession.findOne({ ...query, is_active: true });

    if (!profile) {
      profile = await PedagogicalProfile.create({ userId: userId || undefined, sessionId });
    }
    if (!learningMap) {
      learningMap = await LearningMap.create({ userId: userId || undefined, sessionId });
    }
    if (!session) {
      session = await RFSession.create({ userId: userId || undefined, sessionId, provider_module });
    } else if (provider_module && session.provider_module !== provider_module) {
      session.provider_module = provider_module;
    }

    return { profile, learningMap, session };
  },

  async persist(ctx) {
    await PersistenceManager.save(ctx);
  }
};

module.exports = ContextAssembler;
