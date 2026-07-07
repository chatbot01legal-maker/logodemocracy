const CompetencyTracker = {
  async recordTransfer(learningMap, competenceKey, score) {
    const comp = learningMap.competencies.get(competenceKey) || { autonomy: 10 };
    
    const delta = Math.round(score * 5); // Ganancia por transferencia
    comp.autonomy = Math.min(100, comp.autonomy + delta);
    comp.trend = 'up';
    comp.last_assessed = new Date();
    
    learningMap.competencies.set(competenceKey, comp);
    learningMap.interaction_stats.successful_transfers += 1;
  }
};
module.exports = CompetencyTracker;
