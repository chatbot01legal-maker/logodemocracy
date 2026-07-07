const ContextAssembler = require('./ContextAssembler');
const FSMManager = require('./FSMManager');
const ZDPResolver = require('./ZDPResolver');
const AnalogyEngine = require('./AnalogyEngine');
const ScaffoldEngine = require('./ScaffoldEngine');
const CompetencyTracker = require('./CompetencyTracker');
const TelemetryCollector = require('./TelemetryCollector');
const TransferDetector = require('./TransferDetector');

const RFKernel = {
  async process({ userId, sessionId, provider_module, content, metadata }) {
    // 1. Ensamblar contexto
    const ctx = await ContextAssembler.assemble(userId, sessionId, provider_module);
    
    // 2. Gestionar estado (FSM)
    const fsm_previous = ctx.session.fsm_state;
    await FSMManager.update(ctx.session);
    
    // 3. Resolver ZDP
    const zdpStrategy = ZDPResolver.resolve(ctx.profile, ctx.learningMap, ctx.session);
    
    // 4. Seleccionar analogía
    const analogy = await AnalogyEngine.select(metadata?.concept, ctx.profile, ctx.learningMap);
    
    // 5. Aplicar Andamiaje
    const scaffold = ScaffoldEngine.apply(content, zdpStrategy, analogy, ctx.session.fsm_state);
    
    // 6. Detectar Transferencia
    const transfer = TransferDetector.analyze(content);
    
    // 7. Actualizar Competencias y Telemetría
    if (transfer.detected) {
      await CompetencyTracker.recordTransfer(ctx.learningMap, metadata?.competence);
      await TelemetryCollector.record(ctx.learningMap, metadata, analogy, transfer.score);
    }
    
    await ctx.session.save();
    await ctx.learningMap.save();

    return {
      adapted_content: scaffold.adapted_content,
      analogy_used: analogy ? analogy.analogy : null,
      analogy_score: analogy ? analogy.confidence : 0,
      competence: metadata?.competence,
      fsm_previous,
      fsm_current: ctx.session.fsm_state,
      scaffold_applied: scaffold.scaffold_type,
      transfer_detected: transfer.detected
    };
  }
};

module.exports = RFKernel;
