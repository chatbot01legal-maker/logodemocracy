const { askVertex } = require('../../../../modules/vertexClient');

/**
 * RFResponseGenerator
 *
 * Frontera pedagógica entre SOPHIA y Rey Filósofo.
 *
 * IMPORTANTE:
 * SOPHIA puede conservar internamente sus penalizaciones para producir
 * puntos de atención, riesgo y VPA.
 *
 * Rey Filósofo NO debe entregar esas variables internas a Gemini para
 * que el modelo pueda reinterpretarlas como puntuaciones, porcentajes
 * o como un índice antiguo.
 */

/**
 * Elimina recursivamente campos internos de evaluación que no deben
 * llegar al modelo pedagógico.
 *
 * La evaluación determinista conserva estos datos internamente.
 * Aquí solamente se evita que Gemini los reutilice o los reconstruya.
 */
function removeInternalEvaluationFields(value) {
  if (Array.isArray(value)) {
    return value.map(removeInternalEvaluationFields);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const blockedKeys = new Set([
    // Sistema antiguo
    'IRD',
    'ird',
    'IRD_global',
    'ird_global',
    'sophia_ird',

    // Puntuaciones antiguas / numéricas
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

    // Penalizaciones internas
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

    // Datos derivados exclusivamente para scoring
    'severity_score',
    'severityScore',
    'risk_score',
    'riskScore'
  ]);

  const clean = {};

  Object.keys(value).forEach(key => {
    if (blockedKeys.has(key)) {
      return;
    }

    clean[key] = removeInternalEvaluationFields(value[key]);
  });

  return clean;
}

/**
 * Construye una representación pedagógica de SOPHIA.
 *
 * No expone la estructura interna completa del motor.
 * El objetivo es que Rey Filósofo pueda enseñar e interpretar VPA,
 * pero no reconstruir un sistema de puntuación.
 */
function buildSophiaPedagogicalContext(asset) {
  if (!asset || typeof asset !== 'object') {
    return null;
  }

  const clean = removeInternalEvaluationFields(asset);

  const pedagogical = {
    tipo: 'resultado_pedagogico_sophia'
  };

  // Naturaleza y clasificación documental
  if (clean.naturaleza_documental !== undefined) {
    pedagogical.naturaleza_documental = clean.naturaleza_documental;
  }

  if (clean.confianza_clasificacion !== undefined) {
    pedagogical.confianza_clasificacion = clean.confianza_clasificacion;
  }

  if (clean.clasificacion !== undefined) {
    pedagogical.clasificacion = clean.clasificacion;
  }

  // VPA
  if (clean.vpa !== undefined) {
    pedagogical.vpa = clean.vpa;
  }

  if (clean.VPA !== undefined) {
    pedagogical.vpa = clean.VPA;
  }

  // Fases e infracciones/puntos de atención
  if (Array.isArray(clean.fases)) {
    pedagogical.fases = clean.fases;
  }

  // Evidencias
  if (Array.isArray(clean.evidencias)) {
    pedagogical.evidencias = clean.evidencias;
  }

  // Riesgo
  if (clean.riesgo !== undefined) {
    pedagogical.riesgo = clean.riesgo;
  }

  // Información factual relevante
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

  // Contexto semántico producido por SOPHIA.
  // Se conserva porque es pedagógicamente útil.
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

  // Metadata útil, pero sin permitir que entren nuevamente campos
  // de scoring a través de metadata.
  if (clean.metadata !== undefined) {
    pedagogical.metadata = clean.metadata;
  }

  return pedagogical;
}

/**
 * Determina si el activo corresponde a SOPHIA.
 *
 * No depende de un campo único porque existen distintas generaciones
 * del contrato del activo.
 */
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

    /**
     * ---------------------------------------------------------------
     * CONTEXTO SOPHIA
     * ---------------------------------------------------------------
     *
     * NO enviamos a Gemini el objeto interno completo.
     *
     * Antes:
     *
     *   sophiaData = JSON.stringify(context.sophiaAudit)
     *   assetData  = JSON.stringify(context.cognitiveAsset)
     *
     * Eso permitía que Gemini viera las penalizaciones internas y
     * reconstruyera porcentajes/índices que ya no forman parte del
     * contrato actual de SOPHIA.
     */

    let sophiaData = 'Sin auditoría previa';
    let assetData = 'Sin activo cognitivo';

    const cognitiveAsset = context?.cognitiveAsset;

    if (looksLikeSophiaAsset(cognitiveAsset)) {
      const pedagogicalSophia =
        buildSophiaPedagogicalContext(cognitiveAsset);

      assetData = pedagogicalSophia
        ? JSON.stringify(pedagogicalSophia, null, 2)
        : 'Sin resultado pedagógico de SOPHIA';

      /**
       * No necesitamos enviar nuevamente sophiaAudit completo.
       *
       * El activo pedagógico ya contiene la información necesaria
       * para interpretar SOPHIA sin exponer el motor interno.
       */
      sophiaData = 'El contexto analítico interno de SOPHIA no se expone al modelo pedagógico.';
    } else {
      /**
       * Para otros módulos (por ejemplo LOGOS o activos de Academia),
       * conservamos el comportamiento general anterior.
       */
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

    const prompt = `
Actúa como Rey Filósofo, tutor pedagógico y metacognitivo.

Tu función es ayudar al usuario a comprender su razonamiento y aprender
a pensar sobre él. No eres un sistema de puntuación ni debes convertir
la evaluación en una nota, porcentaje o índice.

ESTADO COGNITIVO:
${fsmState}

TIPO DE ANDAMIAJE:
${scaffoldType}

CONTEXTO ANALÍTICO INTERNO:
${sophiaData}

ACTIVO COGNITIVO:
${assetData}

INSTRUCCIÓN PEDAGÓGICA / RESULTADO ESPERADO:
${adaptedContent}

MENSAJE ORIGINAL DEL USUARIO:
${content}

REGLAS FUNDAMENTALES PARA RESULTADOS DE SOPHIA:

1. SOPHIA utiliza actualmente VPA — "Vale la Pena Prestar Atención".
   VPA identifica puntos de atención en el razonamiento. No es una nota
   ni una medida de calidad expresada como porcentaje.

2. No existe un IRD vigente en el resultado que debes explicar.
   No utilices "IRD", "IRD_global", "Índice de Robustez Deliberativa",
   "Índice de Riesgo Documental" ni ninguna variante equivalente.

3. No conviertas penalizaciones internas, cantidad de activaciones,
   criterios, fases u otros datos técnicos en porcentajes.

4. No calcules porcentajes por fase.

5. No inventes puntuaciones, notas, rankings ni índices.

6. Las fases de SOPHIA son categorías estructurales de análisis.
   No son porcentajes ni calificaciones independientes.

7. Si el usuario pregunta por un "IRD", debes corregir brevemente la
   premisa y explicar que el resultado actual de SOPHIA utiliza VPA.

8. Si el usuario pregunta por porcentajes o puntajes que ya no forman
   parte del resultado actual, no los reconstruyas a partir de los datos
   internos. Explica que el resultado actual se expresa mediante VPA y
   puntos de atención.

9. Puedes explicar:
   - qué punto de atención detectó SOPHIA;
   - en qué fase aparece;
   - qué criterio está involucrado;
   - qué significa conceptualmente;
   - qué evidencia llevó a esa observación;
   - qué puede aprender el usuario de ella.

10. No declares que el argumento es "correcto", "incorrecto",
    "verdadero" o "falso" únicamente a partir de VPA.

11. Distingue siempre entre:
    - la evaluación estructural de SOPHIA;
    - la confiabilidad factual cuando exista;
    - la interpretación pedagógica de Rey Filósofo.

12. No expongas detalles internos del motor que no sean necesarios para
    que el usuario comprenda el resultado.

RESPUESTA:

Genera una respuesta pedagógica clara y directa.

Si el andamiaje es "ninguno" o si el resultado exige una respuesta
directa, responde directamente a la solicitud sin utilizar un estilo
socrático ni hacer preguntas de vuelta.

No cambies la estrategia pedagógica.
`;

    try {
      return await askVertex(prompt);
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
