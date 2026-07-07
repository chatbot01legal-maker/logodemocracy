module.exports = {
  analyze(content) {
    // Heurística simple: si el contenido contiene signos de ejemplo propio
    const detected = content.includes("ejemplo:") || content.includes("como cuando");
    return { detected, score: detected ? 0.8 : 0 };
  }
};
