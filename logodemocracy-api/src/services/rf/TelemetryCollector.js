module.exports = {
  async record(lm, metadata, analogy, score) {
    // Barreras de seguridad granulares para no sobrescribir futuros campos en telemetry
    if (!lm) return;
    if (!lm.telemetry) {
      lm.telemetry = {};
    }
    if (!lm.telemetry.successful_analogies) {
      lm.telemetry.successful_analogies = [];
    }
    
    // Solo registramos si hay un concepto mapeado y un anclaje analógico
    if (analogy && metadata?.concept) {
      lm.telemetry.successful_analogies.push({
        concept: metadata.concept,
        analogy: analogy.analogy || analogy,
        effectiveness: score
      });
    }
  }
};
