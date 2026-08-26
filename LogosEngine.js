/* ═══════════════════════════════════════════════════════
   LOGOS ENGINE v0.2.1 — Motor Cognitivo Orquestador
   Ecosistema LogoDemocracy
   ═══════════════════════════════════════════════════════ */

const LogosModelAdapter = require('./LogosModelAdapter');

class LogosEngine {
  constructor(adapter = null) {
    this.ai = adapter || new LogosModelAdapter();
  }

  async processComparison(posicionA, posicionB, options = {}) {
    const {
      sessionId = `logos-session-${Date.now()}`,
      validationMode = 'USER_ASSERTED_UNVERIFIED'
    } = options;

    const eventLog = [];
    const logEvent = (state, details = {}) => {
      eventLog.push({ state, timestamp: new Date().toISOString(), details });
    };

    logEvent('INPUT_RECEIVED', { lengthA: posicionA.length, lengthB: posicionB.length });

    // 1. RECONSTRUCCIÓN
    logEvent('RECONSTRUCTION');
    const reconstructions = await this._phaseReconstruct(posicionA, posicionB);

    // 2. VALIDATION PENDING (Simulada para v0.2.1 experimental)
    logEvent('VALIDATION_PENDING', { status: validationMode });
    reconstructions.a.validationStatus = validationMode;
    reconstructions.b.validationStatus = validationMode;

    // 3. COMPRENSIÓN MUTUA
    logEvent('MUTUAL_UNDERSTANDING');
    const mutualUnderstanding = await this._phaseMutualUnderstanding(reconstructions);

    // 4. MAPEO RELACIONAL
    logEvent('RELATIONAL_MAPPING');
    const relational = await this._phaseRelationalMapping(reconstructions, mutualUnderstanding);

    // 5. TAXONOMÍA
    logEvent('DISAGREEMENT_TAXONOMY');
    const disagreements = await this._phaseDisagreementTaxonomy(reconstructions, relational);

    // 6. CONVERGENCIAS
    logEvent('CONVERGENCE_ANALYSIS');
    const convergences = await this._phaseConvergenceAnalysis(reconstructions, disagreements);

    // 7. DECISION GATE DETERMINISTA
    logEvent('SYNTHESIS_EVALUATION');
    const llmEligibility = await this._phaseEvaluateEligibility(reconstructions, disagreements);
    const deterministicEligibility = this._computeDeterministicEligibility(llmEligibility, validationMode);

    let synthesis = { relational: null, generative: [] };
    let finalStatus = "COMPLETE";

    if (deterministicEligibility.eligible) {
      logEvent('SYNTHESIS_GENERATION');
      synthesis = await this._phaseGenerateSynthesis({
        reconstructions, mutualUnderstanding, relational, disagreements, convergences
      });
      // 8. PREGUNTAS E INCERTIDUMBRES (Solo si avanza)
      logEvent('DELIBERATIVE_QUESTIONS');
      const questionsAndUncertainties = await this._phaseQuestionsAndUncertainties({
        reconstructions, disagreements, eligibility: deterministicEligibility
      });
      
      logEvent('COMPLETE', { reason: "Protocolo completado exitosamente." });
      
      return this._buildResponse("0.2.1", sessionId, "complete", "COMPLETE", "SYNTHESIS_GENERATION", eventLog, reconstructions, mutualUnderstanding, relational, disagreements, convergences, deterministicEligibility, synthesis, questionsAndUncertainties);

    } else {
      finalStatus = "ABSTAINED";
      logEvent('ABSTAINED', { reason: deterministicEligibility.reason });
      
      return this._buildResponse("0.2.1", sessionId, "abstained", "ABSTAINED", "SYNTHESIS_EVALUATION", eventLog, reconstructions, mutualUnderstanding, relational, disagreements, convergences, deterministicEligibility, synthesis, { openQuestions: [], uncertainties: ["Síntesis suspendida por el motor determinista."] });
    }
  }

  _buildResponse(protocol, session, statusLower, stateUpper, lastPhase, log, recon, mutual, rel, disagr, conv, elig, synth, quest) {
    return {
      protocolVersion: protocol,
      sessionId: session,
      status: statusLower,
      state: stateUpper,
      lastCompletedPhase: lastPhase,
      eventLog: log,
      reconstructions: recon,
      mutualUnderstanding: mutual,
      agreements: rel.agreements || [],
      sharedAssumptions: rel.sharedAssumptions || [],
      disagreements: disagr.disagreements || [],
      convergences: conv.convergences || [],
      synthesisEligibility: elig,
      synthesis: synth,
      openQuestions: quest.openQuestions || [],
      uncertainties: quest.uncertainties || []
    };
  }

  _computeDeterministicEligibility(llmEval, validationStatus) {
    const questionOK = llmEval.questionAlignment?.status !== 'incompatible';
    const infoOK = llmEval.informationSufficiency?.status === 'sufficient';
    const clarityOK = llmEval.conceptualClarity?.status !== 'insuperable';
    const evidenceOK = llmEval.evidenceSufficiency?.status !== 'insufficient';

    const eligible = questionOK && infoOK && clarityOK && evidenceOK;

    let reason = "Condiciones epistémicas cumplidas para la síntesis.";
    if (!eligible) {
      const reasons = [];
      if (!questionOK) reasons.push("Incompatibilidad de la pregunta de origen.");
      if (!infoOK) reasons.push("Información insuficiente.");
      if (!clarityOK) reasons.push("Ambigüedad conceptual.");
      if (!evidenceOK) reasons.push("Evidencia documental insuficiente.");
      reason = reasons.join(" ");
    }

    return {
      eligible,
      reason,
      criteria: {
        questionAlignment: llmEval.questionAlignment || { status: "unknown" },
        informationSufficiency: llmEval.informationSufficiency || { status: "unknown" },
        conceptualClarity: llmEval.conceptualClarity || { status: "unknown" },
        evidenceSufficiency: llmEval.evidenceSufficiency || { status: "unknown" },
        humanValidationStatus: validationStatus
      }
    };
  }

  // ─── TAREAS COGNITIVAS CON ESQUEMAS JSON ─────────────────────

  async _phaseReconstruct(a, b) {
    const sys = [
      "Reconstruye neutralmente cada posición. No valides verdad factual — eso no es tarea tuya.",
      "Cada coreClaim necesita un id único (A1, A2… para la posición A; B1, B2… para la posición B).",
      "Cada coreClaim debe llevar epistemicStatus: 'EXPLICIT' si la afirmación aparece efectivamente formulada en el material, o 'INFERRED' si es una inferencia o reconstrucción tuya a partir del material.",
      "Si epistemicStatus es 'INFERRED', debes declarar inferredFrom con los ids de los coreClaims (de la misma posición) de los que se desprende esa inferencia. Si es 'EXPLICIT', inferredFrom debe ser un arreglo vacío.",
      "No conviertas una inferencia tuya en una afirmación que parezca haber sido hecha literalmente por la persona: la distinción EXPLICIT/INFERRED debe ser estricta.",
      "Cada elemento de evidence necesita también un id propio (A1-E1, A1-E2, etc.)."
    ].join(" ");
    const claimSchema = {
      type: "object",
      properties: {
        id: { type: "string" },
        text: { type: "string" },
        epistemicStatus: { type: "string", enum: ["EXPLICIT", "INFERRED"] },
        inferredFrom: { type: "array", items: { type: "string" } },
        evidence: { type: "array", items: { type: "object", properties: { id: { type: "string" }, source: { type: "string" }, quote: { type: "string" } } } },
        status: { type: "string" }
      }
    };
    const schema = {
      type: "object",
      properties: {
        a: { type: "object", properties: { summary: { type: "string" }, coreClaims: { type: "array", items: claimSchema } } },
        b: { type: "object", properties: { summary: { type: "string" }, coreClaims: { type: "array", items: claimSchema } } }
      }
    };
    return await this.ai.executeTask(sys, { positionA: a, positionB: b }, schema);
  }

  async _phaseMutualUnderstanding(reconstructions) {
    const sys = "Analiza comprensión cruzada.";
    const schema = { type: "object", properties: { a_understands_b: { type: "string" }, b_understands_a: { type: "string" } } };
    return await this.ai.executeTask(sys, reconstructions, schema);
  }

  async _phaseRelationalMapping(reconstructions, mutualUnderstanding) {
    const sys = "Mapea acuerdos y supuestos compartidos.";
    const schema = { type: "object", properties: { agreements: { type: "array", items: { type: "string" } }, sharedAssumptions: { type: "array", items: { type: "string" } } } };
    return await this.ai.executeTask(sys, { reconstructions, mutualUnderstanding }, schema);
  }

  async _phaseDisagreementTaxonomy(reconstructions, relational) {
    const sys = "Clasifica desacuerdos.";
    const schema = { type: "object", properties: { disagreements: { type: "array", items: { type: "object", properties: { id: { type: "string" }, text: { type: "string" }, primaryType: { type: "string" }, secondaryTypes: { type: "array", items: { type: "string" } }, basis: { type: "object", properties: { positionAClaims: { type: "array", items: { type: "string" } }, positionBClaims: { type: "array", items: { type: "string" } } } } } } } } };
    return await this.ai.executeTask(sys, { reconstructions, relational }, schema);
  }

  async _phaseConvergenceAnalysis(reconstructions, disagreements) {
    const sys = "Identifica zonas de convergencia.";
    const schema = { type: "object", properties: { convergences: { type: "array", items: { type: "object", properties: { text: { type: "string" }, status: { type: "string" }, condition: { type: "string" } } } } } };
    return await this.ai.executeTask(sys, { reconstructions, disagreements }, schema);
  }

  async _phaseEvaluateEligibility(reconstructions, disagreements) {
    const sys = "Evalúa vectores de elegibilidad documental. NO juzgues verdad factual, solo suficiencia textual.";
    const schema = { type: "object", properties: { questionAlignment: { type: "object", properties: { status: { type: "string", enum: ["aligned", "incompatible"] }, reason: { type: "string" } } }, informationSufficiency: { type: "object", properties: { status: { type: "string", enum: ["sufficient", "insufficient"] }, reason: { type: "string" } } }, conceptualClarity: { type: "object", properties: { status: { type: "string", enum: ["sufficient", "insuperable"] }, reason: { type: "string" } } }, evidenceSufficiency: { type: "object", properties: { status: { type: "string", enum: ["sufficient", "insufficient"] }, reason: { type: "string" } } } } };
    return await this.ai.executeTask(sys, { reconstructions, disagreements }, schema);
  }

  async _phaseGenerateSynthesis(context) {
    const sys = "Genera síntesis. Declara explícitamente linaje usando Claim IDs y newElements.";
    const schema = { type: "object", properties: { relational: { type: "string" }, generative: { type: "array", items: { type: "object", properties: { type: { type: "string", enum: ["solucion", "problema"] }, title: { type: "string" }, text: { type: "string" }, derivedFrom: { type: "object", properties: { positionAClaims: { type: "array", items: { type: "string" } }, positionBClaims: { type: "array", items: { type: "string" } }, newElements: { type: "array", items: { type: "string" } } } } } } } } };
    return await this.ai.executeTask(sys, context, schema);
  }

  async _phaseQuestionsAndUncertainties(context) {
    const sys = "Declara incertidumbres e interroga los materiales.";
    const schema = { type: "object", properties: { openQuestions: { type: "array", items: { type: "string" } }, uncertainties: { type: "array", items: { type: "string" } } } };
    return await this.ai.executeTask(sys, context, schema);
  }
}

module.exports = LogosEngine;
