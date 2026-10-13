const { askVertex } = require('../../../../modules/vertexClient');

/**
 * RFResponseGenerator
 *
 * Frontera pedagógica entre SOPHIA y Rey Filósofo.
 *
 * SOPHIA puede conservar internamente sus penalizaciones para producir
 * puntos de atención, riesgo y VPA.
 *
 * Rey Filósofo NO debe entregar esas variables internas a Gemini para
 * que el modelo pueda reinterpretarlas como puntuaciones, porcentajes
 * o como un índice antiguo.
 */

function removeInternalEvaluationFields(value) {
  if (Array.isArray(value)) {
    return value.map(removeInternalEvaluationFields);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const blockedKeys = new Set([
    'IRD',
    'ird',
    'IRD_global',
    'ird_global',
    'sophia_ird',
    'puntaje',
    'puntuaje',
    'puntaje_fase',
    'puntuacion',
    'puntuación',
    'score',
    'scores',
    'percentage',
    'percent',
    'porcentaje',
    'porcentajes',
    'penalizacion',
    'penalización',
    'penalizacion_fase',
    'penalización_fase',
    'penalizacion_atomo',
    'penalización_atomo',
    'penalizacion_atomo_total',
    'penalización_atomo_total',
    'penalizacion_criterio',
    'penalización_criterio',
    'penalizacion_ruta',
    'penalización_ruta',
    'severity_score',
    'severityScore',
    'risk_score',
    'riskScore'
  ]);

  const clean = {};

  Object.keys(value).forEach(key => {
    if (blockedKeys.has(key)) return;
    clean[key] = removeInternalEvaluationFields(value[key]);
  });

  return clean;
}

function buildSophiaPedagogicalContext(asset) {
  if (!asset || typeof asset !== 'object') {
    return null;
  }

  const clean = removeInternalEvaluationFields(asset);

  const pedagogical = {
    tipo: 'resultado_pedagogico_sophia'
  };

  if (clean.naturaleza_documental !== undefined) {
    pedagogical.naturaleza_documental = clean.naturaleza_documental;
  }

  if (clean.confianza_clasificacion !== undefined) {
    pedagogical.confianza_clasificacion = clean.confianza_clasificacion;
  }

  if (clean.clasificacion !== undefined) {
    pedagogical.clasificacion = clean.clasificacion;
  }

  if (clean.vpa !== undefined) {
    pedagogical.vpa = clean.vpa;
  }

  if (clean.VPA !== undefined) {
    pedagogical.vpa = clean.VPA;
  }

  if (Array.isArray(clean.fases)) {
    pedagogical.fases = clean.fases;
  }

  if (Array.isArray(clean.evidencias)) {
    pedagogical.evidencias = clean.evidencias;
  }

  if (clean.riesgo !== undefined) {
    pedagogical.riesgo = clean.riesgo;
  }

  if (clean.confiabilidad_factual !== undefined) {
    pedagogical.confiabilidad_factual = clean.confiabilidad_factual;
  }

  if (clean.factual_reliability !== undefined) {
    pedagogical.factual_reliability = clean.factual_reliability;
  }

  if (clean.claims_refutados !== undefined) {
    pedagogical.claims_refutados = clean.claims_refutados;
  }

  if (clean.claims_en_conflicto !== undefined) {
    pedagogical.claims_en_conflicto = clean.claims_en_conflicto;
  }

  if (clean.claims_evidencia_insuficiente !== undefined) {
    pedagogical.claims_evidencia_insuficiente =
      clean.claims_evidencia_insuficiente;
  }

  if (clean.gemini_review !== undefined) {
    pedagogical.gemini_review = clean.gemini_review;
  }

  if (clean.interpretacion !== undefined) {
    pedagogical.interpretacion = clean.interpretacion;
  }

  if (clean.contexto !== undefined) {
    pedagogical.contexto = clean.contexto;
  }

  if (clean.observaciones !== undefined) {
    pedagogical.observaciones = clean.observaciones;
  }

  if (clean.preguntas_reflexivas !== undefined) {
    pedagogical.preguntas_reflexivas = clean.preguntas_reflexivas;
  }

  if (clean.metadata !== undefined) {
    pedagogical.metadata = clean.metadata;
  }

  return pedagogical;
}

/* ============================================================
   DETECCIÓN DE ORIGEN DEL PROMPT
============================================================ */
function detectOrigin(context) {
  const asset = context && context.cognitiveAsset;

  const candidates = [
    asset && asset.source,
    asset && asset.metadata && asset.metadata.originModule,
    context && context.session && context.session.provider_module,
    context && context.sophiaAudit && context.sophiaAudit.originModule
  ].filter(Boolean);

  for (let i = 0; i < candidates.length; i++) {
    const s = String(candidates[i]).toLowerCase();
    if (s.indexOf('sophia') !== -1) return 'sophia';
    if (s.indexOf('logos') !== -1) return 'logos';
    if (s.indexOf('academia') !== -1 || s.indexOf('academy') !== -1) return 'academia';
  }

  if (looksLikeSophiaAsset(asset)) return 'sophia';

  return 'academia';
}

function looksLikeSophiaAsset(asset) {
  if (!asset || typeof asset !== 'object') {
    return false;
  }

  return (
    Array.isArray(asset.fases) ||
    asset.vpa !== undefined ||
    asset.VPA !== undefined ||
    asset.IRD_global !== undefined ||
    asset.ird_global !== undefined ||
    asset.sophia_ird !== undefined ||
    asset.riesgo !== undefined
  );
}

const RFResponseGenerator = {

  async generate({ content, scaffold, context }) {
    console.log("=== PAYLOAD RECIBIDO EN RFResponseGenerator ===");
    console.log(JSON.stringify({ content, context }, null, 2));
    console.log("===============================================");

    const fsmState =
      context?.session?.fsm_state || 'No definido';

    const scaffoldType =
      scaffold?.scaffold_type || 'ninguno';

    const adaptedContent =
      scaffold?.adapted_content || '';

    let sophiaData = 'Sin auditoría previa';
    let assetData = 'Sin activo cognitivo';

    const cognitiveAsset = context?.cognitiveAsset;

    if (looksLikeSophiaAsset(cognitiveAsset)) {
      const pedagogicalSophia =
        buildSophiaPedagogicalContext(cognitiveAsset);

      assetData = pedagogicalSophia
        ? JSON.stringify(pedagogicalSophia, null, 2)
        : 'Sin resultado pedagógico de SOPHIA';

      sophiaData =
        'El contexto analítico interno de SOPHIA no se expone al modelo pedagógico.';
    } else {
      sophiaData = context?.sophiaAudit
        ? JSON.stringify(
            removeInternalEvaluationFields(context.sophiaAudit),
            null,
            2
          )
        : 'Sin auditoría previa';

      assetData = cognitiveAsset
        ? JSON.stringify(
            removeInternalEvaluationFields(cognitiveAsset),
            null,
            2
          )
        : 'Sin activo cognitivo';
    }

    const origin = detectOrigin(context);
    const NL = String.fromCharCode(10);
    const SEP = NL + NL;

    const BLOCK_BASE = [
      'REY FILÓSOFO — CONTRATO DE RESPUESTA',
      '',
      'Eres Rey Filósofo, tutor orientado al aprendizaje y la comprensión.',
      '',
      'FORMA DE RESPONDER:',
      '- Sé explicativo, claro y pedagógico.',
      '- Prioriza la comprensión por sobre la exhibición de conocimiento.',
      '- Explica las relaciones entre las ideas cuando sea útil.',
      '- Usa ejemplos cuando ayuden a comprender.',
      '- Responde directamente a la pregunta del usuario.',
      '- No adoptes por defecto un método socrático.',
      '- No respondas sistemáticamente con preguntas.',
      '- Si la pregunta requiere explicación, explica.',
      '- Si es directa, responde directamente.',
      '- Mantén la respuesta sintética, sin sacrificar comprensión.',
      '- Evita repetir información ya visible en pantalla.',
      '- No te presentes innecesariamente.',
      '- No uses expresiones como "tu Rey Filósofo" o "tu asistente".'
    ].join(NL);

    const BLOCK_CODIGO = [
      'PROHIBICIÓN DE CÓDIGO:',
      'No escribas, modifiques ni proporciones código de ningún tipo.',
      'Si el usuario pide código, indícale brevemente que use ChatGPT u otra',
      'herramienta especializada. Puedes ayudarlo a pensar conceptualmente',
      'sobre el problema (objetivos, arquitectura, lógica), sin producir código.'
    ].join(NL);

    const BLOCK_SOPHIA = [
      'CONTEXTO DE SOPHIA:',
      'SOPHIA utiliza VPA — Vale la Pena Prestar Atención.',
      'VPA identifica puntos de atención, no es una nota ni un porcentaje.',
      'No existe un IRD vigente. No uses "IRD", "índice" ni variantes.',
      'No conviertas penalizaciones ni criterios en porcentajes.',
      'No inventes puntuaciones, notas ni rankings.',
      'Las fases de SOPHIA son categorías estructurales, no calificaciones.',
      'Si el usuario pregunta por un IRD, corrige la premisa y explica VPA.',
      'Puedes explicar qué punto de atención se detectó, en qué fase, con qué',
      'criterio y qué puede aprender el usuario, sin declarar verdad o falsedad',
      'únicamente a partir de VPA.'
    ].join(NL);

    const BLOCK_LOGOS = [
      'CONTEXTO DE LOGOS:',
      'LOGOS ayuda a comprender el desacuerdo entre dos posiciones.',
      'No decide quién tiene razón ni obliga a consensuar.',
      'Puedes explicar: reconstrucciones, acuerdos, diferencias, supuestos',
      'compartidos, convergencias posibles y síntesis.',
      'La síntesis no es una conclusión obligatoria. Las convergencias posibles',
      'no son acuerdos: son posibilidades a examinar.'
    ].join(NL);

    const BLOCK_FINAL = [
      'Genera la respuesta más clara y útil posible para producir comprensión.',
      'Por defecto responde en 2 a 5 frases breves, pero extiéndete cuando la',
      'explicación lo requiera. Mantén una idea central por respuesta.',
      'No agregues contexto que el usuario no haya solicitado.'
    ].join(NL);

    const blocks = [BLOCK_BASE, BLOCK_CODIGO];

    if (origin === 'sophia') {
      blocks.push(BLOCK_SOPHIA);
    } else if (origin === 'logos') {
      blocks.push(BLOCK_LOGOS);
    }

    const contextParts = [];
    if (assetData && assetData !== 'Sin activo cognitivo') {
      contextParts.push('CONTEXTO DEL DOCUMENTO ACTIVO:' + SEP + assetData);
    }
    if (sophiaData && sophiaData !== 'Sin auditoría previa') {
      contextParts.push('AUDITORÍA PREVIA:' + SEP + sophiaData);
    }

    const allParts = blocks
      .concat(['MENSAJE DEL USUARIO:' + SEP + content])
      .concat(contextParts)
      .concat(['RESPUESTA:', BLOCK_FINAL]);

    const prompt = allParts.join(SEP);


    try {
      return await askVertex(prompt, 'gemini-3.6-flash', 45000, null, 'reyfilosofo_chat');
    } catch (error) {
      if (
        error.message &&
        error.message.includes('429')
      ) {
        console.warn(
          "[RFResponseGenerator] Advertencia: Límite de cuota de Vertex alcanzado (429)."
        );

        return "El sistema está experimentando alta demanda en este momento (límite de peticiones de la IA alcanzado). Por favor, espera unos segundos e intenta nuevamente.";
      }

      throw error;
    }
  }

};

module.exports = RFResponseGenerator;
