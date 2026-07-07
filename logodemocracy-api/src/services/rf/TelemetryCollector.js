module.exports = {
  async record(lm, metadata, analogy, score) {
    if (analogy) {
      lm.telemetry.successful_analogies.push({
        concept: metadata.concept,
        analogy: analogy.analogy,
        effectiveness: score
      });
    }
  }
};
