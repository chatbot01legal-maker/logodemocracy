const ContextAssembler = require('./ContextAssembler');
const EventDetector = require('./EventDetector');
const FSMManager = require('./FSMManager');
const ZDPResolver = require('./ZDPResolver');
const AnalogyEngine = require('./AnalogyEngine');
const ScaffoldEngine = require('./ScaffoldEngine');
const CompetencyTracker = require('./CompetencyTracker');
const TransferDetector = require('./TransferDetector');
const PersistenceManager = require('./PersistenceManager');
const RFResponseGenerator = require('./RFResponseGenerator');

const RFKernel = {
  async process({ userId, sessionId, provider_module, content, user_response, metadata, externalContext }) {
    // 1. Ensamblaje de memorias (Autocreador en frío)
    const ctx = await ContextAssembler.assemble(userId, sessionId, provider_module);
    
    // --- INYECCIÓN DEL SOBRE (SOPHIA) ---
    console.log("[RF KERNEL] Abriendo sobre externo:", JSON.stringify(externalContext, null, 2));

    if (externalContext) {
      // Hacemos un fallback: si no existe la llave específica, asumimos que el objeto completo ES la auditoría.
      ctx.sophiaAudit = externalContext.sophiaAudit || externalContext.audit || externalContext;
      ctx.cognitiveAsset = externalContext.cognitiveAsset || externalContext.asset || null;
    }
    // ------------------------------------

    // 2. Evaluación de transferencia cognitiva
    const transfer = TransferDetector.analyze(user_response, metadata?.concept);
    
    // 3. Detección de eventos cognitivos y mutación FSM
    const detectedEvents = EventDetector.detect({ user_response, fsm_state: ctx.session.fsm_state });
    if (transfer.detected) {
      detectedEvents.push("successful_transfer");
    }
    
    detectedEvents.forEach(event => FSMManager.transition(ctx.session, event));
    
    // 4. Resolución pedagógica (ZDP) y selección de anclajes
    const strategy = ZDPResolver.resolve(ctx.profile, ctx.session.fsm_state);
    const analogy = await AnalogyEngine.select(metadata?.concept, ctx.profile, ctx.learningMap);
    
    // 5. Aplicación de andamiaje sobre el contenido técnico
    const scaffold = ScaffoldEngine.apply(content, strategy, analogy, ctx.session.fsm_state);
    const tutorResponse = await RFResponseGenerator.generate({
      content,
      scaffold,
      context: ctx
    });
    
    // 6. Actualización de competencias en LearningMap
    if (metadata?.competence) {
      await CompetencyTracker.update(ctx.learningMap, metadata.competence, user_response, transfer.score);
    } else if (Array.isArray(metadata?.competencies)) {
      for (const comp of metadata.competencies) {
        await CompetencyTracker.update(ctx.learningMap, comp, user_response, transfer.score);
      }
    }
    
    // 7. Persistencia atómica de las memorias
    await ContextAssembler.persist(ctx);

    // Contrato de salida canónico compatible con el widget
    return {
      content: tutorResponse,
      reply: tutorResponse,
      adapted_content: tutorResponse,
      fsm_state: ctx.session.fsm_state,
      scaffold_type: scaffold.scaffold_type,
      transfer_detected: transfer.detected
    };
  }
};

module.exports = RFKernel;

