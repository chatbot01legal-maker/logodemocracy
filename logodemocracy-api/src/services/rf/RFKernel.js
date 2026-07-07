const ContextAssembler = require('./ContextAssembler');
const FSMManager = require('./FSMManager');
const ZDPResolver = require('./ZDPResolver');
const AnalogyEngine = require('./AnalogyEngine');
const ScaffoldEngine = require('./ScaffoldEngine');
const CompetencyTracker = require('./CompetencyTracker');
const TelemetryCollector = require('./TelemetryCollector');
const TransferDetector = require('./TransferDetector');

const RFKernel = {
  async process({ userId, sessionId, provider_module, content, user_response, metadata }) {
    const ctx = await ContextAssembler.assemble(userId, sessionId, provider_module);
    
    // 1. Detección de Transferencia (sobre respuesta de usuario)
    const transfer = TransferDetector.analyze(user_response, metadata?.competence);
    if (transfer.detected) {
      await CompetencyTracker.recordTransfer(ctx.learningMap, metadata?.competence, transfer.score);
      await TelemetryCollector.updateAnalogy(ctx.learningMap, metadata?.concept, transfer.score);
    }

    // 2. Transición de Estado (Evento-céntrica)
    const event = transfer.detected ? "successful_transfer" : "default";
    FSMManager.transition(ctx.session, event);
    
    // 3. Resolución de Estrategia
    const strategy = ZDPResolver.resolve(ctx.profile);
    const analogy = await AnalogyEngine.select(metadata?.concept, ctx.profile, ctx.learningMap);
    
    // 4. Transformación de Contenido
    const scaffold = ScaffoldEngine.apply(content, strategy, analogy, ctx.session.fsm_state);
    
    // 5. Persistencia Centralizada
    await ContextAssembler.persist(ctx);

    return {
      adapted_content: scaffold.adapted_content,
      fsm_state: ctx.session.fsm_state,
      transfer_detected: transfer.detected
    };
  }
};
module.exports = RFKernel;
