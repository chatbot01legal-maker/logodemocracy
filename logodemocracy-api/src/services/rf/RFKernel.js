const RFKernel = {
  async process({ userId, sessionId, provider_module, content, user_response, metadata }) {
    // 1. Ensamblar contexto y persistencia
    const ctx = await ContextAssembler.assemble(userId, sessionId, provider_module);
    
    // 2. Eventos y Transición (Scheduler)
    const detectedEvents = EventDetector.detect({ user_response, fsm_state: ctx.session.fsm_state });
    detectedEvents.forEach(event => FSMManager.transition(ctx.session, event));
    
    // 3. Resolución ZDP (Configuración adaptativa basada en estado)
    const strategy = ZDPResolver.resolve(ctx.profile, ctx.session.fsm_state);
    
    // 4. Selección de Analogía (Capas: Telemetría > Anchors)
    const analogy = await AnalogyEngine.select(metadata?.concept, ctx.profile, ctx.learningMap);
    
    // 5. Scaffold (Transformación del contenido)
    const scaffold = ScaffoldEngine.apply(content, strategy, analogy, ctx.session.fsm_state);
    
    // 6. Monitor de Rendimiento (Competency & Telemetry)
    if (metadata?.competencies) {
      for (const comp of metadata.competencies) {
        await CompetencyTracker.update(ctx.learningMap, comp, user_response);
      }
    }
    
    // 7. Persistencia final
    await PersistenceManager.save(ctx);

    return {
      adapted_content: scaffold.adapted_content,
      fsm_state: ctx.session.fsm_state,
      scaffold_type: scaffold.scaffold_type
    };
  }
};
