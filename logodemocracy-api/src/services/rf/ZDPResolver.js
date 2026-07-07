const ZDPResolver = {
  resolve(profile, learningMap, session) {
    return {
      abstraction_level: profile.abstraction_level || 'intermedio',
      explanation_style: profile.explanation_style || 'secuencial_estructurado',
      scaffold_intensity: profile.scaffolding_need || 'media',
      preferred_sequence: profile.secuencia_preferida || 'definicion_primero'
    };
  }
};

module.exports = ZDPResolver;
