const CompetencyTracker = {
  async update(learningMap, competenceKey, user_response) {
    // Lógica de actualización atómica
    const comp = learningMap.competencies.get(competenceKey) || { autonomy: 10 };
    
    // Aquí se conectaría la lógica para decidir si es aumento, retroceso o fatiga
    const delta = this.calculateDelta(user_response); 
    
    comp.autonomy = Math.min(100, Math.max(0, comp.autonomy + delta));
    comp.trend = delta > 0 ? 'up' : 'down';
    comp.last_assessed = new Date();
    
    learningMap.competencies.set(competenceKey, comp);
  }
};
