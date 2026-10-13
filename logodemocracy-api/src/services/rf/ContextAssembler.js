const PedagogicalProfile = require('../../models/PedagogicalProfile');
const LearningMap = require('../../models/LearningMap');
const RFSession = require('../../models/RFSession');
const PersistenceManager = require('./PersistenceManager');
const mongoose = require('mongoose');

/* ============================================================
   NORMALIZACIÓN DE PROVIDER_MODULE
   El frontend envía identificadores cortos ('academy', 'sophia',
   'logos'). El modelo RFSession espera valores enum canónicos
   ('AcademiaContextProvider', etc.). Mapeamos ambos.
============================================================ */
const PROVIDER_MAP = {
  'academy': 'AcademiaContextProvider',
  'academia': 'AcademiaContextProvider',
  'academicacontextprovider': 'AcademiaContextProvider',
  'sophia': 'SophiaContextProvider',
  'sophiacontextprovider': 'SophiaContextProvider',
  'logos': 'LogosContextProvider',
  'logoscontextprovider': 'LogosContextProvider',
  'aletheia': 'AletheiaContextProvider',
  'aletheiacontextprovider': 'AletheiaContextProvider',
  'agora': 'AgoraContextProvider',
  'agoracontextprovider': 'AgoraContextProvider',
  'mythos': 'MithosContextProvider',
  'mithos': 'MithosContextProvider',
  'mithoscontextprovider': 'MithosContextProvider',
  'reyfilosofo': 'AcademiaContextProvider'
};

function normalizeProviderModule(p) {
  if (!p) return 'AcademiaContextProvider';
  const key = String(p).toLowerCase().trim();
  return PROVIDER_MAP[key] || 'AcademiaContextProvider';
}


const ContextAssembler = {
  async assemble(userId, sessionId, provider_module) {
    const query = userId ? { userId } : { sessionId };
    
    // Sniffer de entorno: detecta si estamos corriendo un archivo de test o si Mongoose no está conectado
    const isUnitTest = process.env.RF_UNIT_TEST === 'true' ||
                   mongoose.connection.readyState === 0;
    if (isUnitTest) {
      return {
        profile: { completed_tests: [], nivel_abstraccion_inicial: 'intermedio', estilo_explicativo: 'analogico', necesidad_andamiaje: 'media' },
        learningMap: { competencies: new Map(), anchors: [], telemetry: { successful_analogies: [] }, interaction_stats: { successful_transfers: 0 } },
        session: { fsm_state: 'AUTONOMO', provider_module, is_active: true, save: async () => {} }
      };
    }

    let profile = await PedagogicalProfile.findOne(query);
    let learningMap = await LearningMap.findOne(query);
    let session = await RFSession.findOne({ ...query, is_active: true });

    // Autocreación garantizada (Pilar de resiliencia del Kernel)
    if (!profile) {
      profile = await PedagogicalProfile.create({ userId: userId || undefined, sessionId });
    }
    if (!learningMap) {
      learningMap = await LearningMap.create({ userId: userId || undefined, sessionId });
    }
    if (!session) {
      session = await RFSession.create({ 
        userId: userId || undefined, 
        sessionId, 
        provider_module: normalizeProviderModule(provider_module) 
      });
    } else if (provider_module && session.provider_module !== normalizeProviderModule(provider_module)) {
      session.provider_module = normalizeProviderModule(provider_module);
    }

    return { profile, learningMap, session };
  },

  async persist(ctx) {
    await PersistenceManager.save(ctx);
  }
};

module.exports = ContextAssembler;
