const ScaffoldEngine = {
  apply(content, strategy, analogy, fsm_state) {
    let scaffold_type = 'ninguno';
    let adapted_content = content || "";

    if (fsm_state === 'ANDAMIAJE' || fsm_state === 'ORIENTACION') {
      scaffold_type = strategy.preferred_sequence === 'ejemplos_primero' ? 'analogy' : 'guide';
      const supportPrefix = fsm_state === 'ANDAMIAJE' ? '[SOPORTE ACTIVO]' : '[ORIENTACIÓN PEDAGÓGICA]';
      const analogyText = analogy ? ` | Anclaje sugerido (${analogy.source}): "${analogy.analogy}"` : '';
      adapted_content = `${supportPrefix} ${content}${analogyText}`;
    } else if (fsm_state === 'FRICCION') {
      scaffold_type = 'question';
      adapted_content = `[ATENCIÓN COGNITIVA] Notamos una complejidad elevada. ¿Deseas fragmentar este concepto o examinar un ejemplo cotidiano?\n\nContenido original: ${content}`;
    }

    return { adapted_content, scaffold_type };
  }
};
module.exports = ScaffoldEngine;
