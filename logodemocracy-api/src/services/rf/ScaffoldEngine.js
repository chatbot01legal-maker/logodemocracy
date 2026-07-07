const ScaffoldEngine = {
  apply(content, strategy, analogy, state) {
    let scaffold_type = 'ninguno';
    let adapted_content = content;

    if (state === 'ANDAMIAJE') {
      scaffold_type = strategy.preferred_sequence === 'ejemplos_primero' ? 'analogia' : 'guia';
      adapted_content = `[SOPORTE FUERTE: ${scaffold_type}] ${content} | Analogía sugerida: ${analogy?.analogy || 'N/A'}`;
    } else if (state === 'ORIENTACION') {
      scaffold_type = 'resumen';
      adapted_content = `[ORIENTACIÓN] ${content}`;
    }

    return { adapted_content, scaffold_type };
  }
};

module.exports = ScaffoldEngine;
