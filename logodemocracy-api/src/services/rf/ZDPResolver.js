const ZDPResolver = {
  resolve(profile, fsm_state) {
    profile = profile || {};
    return {
      abstraction_level: profile.nivel_abstraccion_inicial || 'intermedio',
      explanation_style: profile.estilo_explicativo || 'secuencial_estructurado',
      scaffold_intensity: profile.necesidad_andamiaje || 'media',
      preferred_sequence: profile.secuencia_preferida || 'definicion_primero',
      analogy_type: profile.tipo_analogia_dominante || 'constructiva',
      example_preference: profile.preferencia_ejemplos || 'alta',
      current_fsm_state: fsm_state
    };
  }
};
module.exports = ZDPResolver;
