const PedagogicalProfile = require('../../models/PedagogicalProfile');
const LearningMap = require('../../models/LearningMap');
const RFSession = require('../../models/RFSession');

const ContextAssembler = {
  async assemble(userId, sessionId, provider_module) {
    const query = userId ? { userId } : { sessionId };
    
    let profile = await PedagogicalProfile.findOne(query);
    let learningMap = await LearningMap.findOne(query);
    let session = await RFSession.findOne({ sessionId, is_active: true });

    if (!session) {
      session = await RFSession.create({ userId, sessionId, provider_module });
    }

    return { profile, learningMap, session };
  }
};

module.exports = ContextAssembler;
