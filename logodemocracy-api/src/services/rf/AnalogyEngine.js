const AnalogyEngine = {
  async select(concept, profile, learningMap) {
    if (!concept || !learningMap) return null;

    // 1. Prioridad: Telemetría de analogías exitosas previas
    const successful = (learningMap.telemetry?.successful_analogies || [])
      .filter(a => a.concept.toLowerCase() === concept.toLowerCase())
      .sort((a, b) => b.effectiveness - a.effectiveness);
    
    if (successful.length > 0) {
      return { analogy: successful[0].analogy, source: 'telemetry', confidence: successful[0].effectiveness };
    }

    // 2. Fallback: Anclajes (Anchors) consolidados en el perfil
    const anchorMatch = (learningMap.anchors || [])
      .find(a => a.concept.toLowerCase() === concept.toLowerCase());
    
    if (anchorMatch) {
      return { analogy: anchorMatch.analogy, source: 'anchor', confidence: 0.65 };
    }

    return null;
  }
};
module.exports = AnalogyEngine;
