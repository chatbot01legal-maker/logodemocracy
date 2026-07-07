const CompetencyTracker = {
  async update(learningMap, competenceKey, user_response, transferScore = 0) {
    if (!competenceKey || !learningMap) return;
    
    let comp = undefined;
    if (learningMap.competencies instanceof Map) {
      comp = learningMap.competencies.get(competenceKey);
    } else if (learningMap.competencies && typeof learningMap.competencies === 'object') {
      comp = learningMap.competencies[competenceKey];
    }

    if (!comp) {
      comp = { autonomy: 10, trend: 'stable', scaffolds_used: [], last_assessed: new Date() };
    }

    // Ganancia o ajuste de autonomía
    let delta = 0;
    if (transferScore > 0) {
      delta = Math.round(transferScore * 6); // Ganancia por transferencia
    } else if (user_response && user_response.toLowerCase().includes("no entiendo")) {
      delta = -2; // Ligero retroceso ante fricción declarada
    }

    comp.autonomy = Math.min(100, Math.max(0, comp.autonomy + delta));
    comp.trend = delta > 0 ? 'up' : (delta < 0 ? 'down' : 'stable');
    comp.last_assessed = new Date();

    if (learningMap.competencies instanceof Map) {
      learningMap.competencies.set(competenceKey, comp);
    } else if (learningMap.competencies) {
      learningMap.competencies[competenceKey] = comp;
    }
  }
};
module.exports = CompetencyTracker;
