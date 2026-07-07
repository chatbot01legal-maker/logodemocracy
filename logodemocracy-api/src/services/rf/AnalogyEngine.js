const AnalogyEngine = {
  async select(concept, profile, learningMap) {
    // 1. Filtrar analogías eficaces del LM
    const successful = learningMap.telemetry.successful_analogies
      .filter(a => a.concept === concept)
      .sort((a, b) => b.effectiveness - a.effectiveness);
    
    if (successful.length > 0) {
      return { analogy: successful[0].analogy, source: 'telemetry', confidence: successful[0].effectiveness };
    }
    
    return null;
  }
};
module.exports = AnalogyEngine;
