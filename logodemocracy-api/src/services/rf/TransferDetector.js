const TransferDetector = {
  analyze(user_response, competenceKey) {
    if (!user_response) return { detected: false, score: 0 };
    const text = user_response.trim();
    
    // Heurística simple MVP: texto estructurado, longitud y conectores causales
    const hasLength = text.length > 40;
    const hasExample = text.toLowerCase().includes("ejemplo") || text.toLowerCase().includes("como cuando") || text.toLowerCase().includes("parecido a");
    const isQuestion = text.includes("?");

    if (hasLength && !isQuestion) {
      const score = hasExample ? 0.85 : 0.70;
      return { detected: true, score };
    }
    return { detected: false, score: 0 };
  }
};
module.exports = TransferDetector;
