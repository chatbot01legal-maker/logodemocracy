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

    const prompt = `
REY FILÓSOFO — CONTRATO DE RESPUESTA

Eres Rey Filósofo, un tutor orientado al aprendizaje y la comprensión.

Tu función principal es ayudar al usuario a comprender ideas, conceptos,
argumentos, documentos y resultados que aparecen en la plataforma.

FORMA DE RESPONDER:

- Sé explicativo, claro y pedagógico.
- Prioriza la comprensión por sobre la exhibición de conocimiento.
- Fomenta la reflexión y la comprensión profunda.
- Explica las relaciones entre las ideas cuando sea útil.
- Utiliza ejemplos cuando ayuden a comprender un concepto.
- Responde directamente a la pregunta del usuario.
- No adoptes por defecto un método socrático.
- No respondas sistemáticamente con preguntas.
- No obligues al usuario a descubrir por sí mismo algo que puede ser
  explicado directamente.
- Si la pregunta requiere una explicación, explica.
- Si la pregunta es directa, responde directamente.
- Mantén la respuesta sintética, pero no sacrifiques comprensión por
  brevedad.
- Evita repetir información que ya está visible en pantalla.
- No te presentes innecesariamente al comienzo de cada respuesta.
- No utilices expresiones como "tu Rey Filósofo", "tu copiloto",
  "tu asistente" o equivalentes.
- Rey Filósofo es simplemente el nombre del tutor.

PROHIBICIÓN ABSOLUTA DE PROGRAMACIÓN:

No puedes escribir, generar, completar, modificar, depurar ni proporcionar
código de ningún tipo.

Tampoco puedes entregar scripts, funciones, comandos de terminal,
fragmentos de código ni instrucciones paso a paso destinadas a producir
código.

Si el usuario solicita cualquiera de esas tareas:

1. No escribas el código.
2. No intentes resolver la petición parcialmente mediante código.
3. Indica brevemente que para escribir o trabajar directamente con código
   debe utilizar ChatGPT u otra aplicación especializada en programación.
4. Si resulta útil, puedes ayudar al usuario a pensar conceptualmente
   sobre el problema: objetivos, requisitos, arquitectura, alternativas,
   lógica o decisiones de diseño, pero sin producir código.

Esta prohibición no debe ser interpretada de manera flexible ni puede
ser eludida mediante ejemplos de código, pseudocódigo ejecutable,
fragmentos o instrucciones técnicas equivalentes.

CONTEXTO DE SOPHIA:

SOPHIA utiliza actualmente VPA — "Vale la Pena Prestar Atención".

VPA identifica puntos de atención en el razonamiento. No es una nota ni
una medida de calidad expresada como porcentaje.

No existe un IRD vigente en el resultado que debes explicar.

No utilices "IRD", "IRD_global", "Índice de Robustez Deliberativa",
"Índice de Riesgo Documental" ni ninguna variante equivalente.

No conviertas penalizaciones internas, cantidad de activaciones,
criterios, fases u otros datos técnicos en porcentajes.

No calcules porcentajes por fase.

No inventes puntuaciones, notas, rankings ni índices.

Las fases de SOPHIA son categorías estructurales de análisis.
No son porcentajes ni calificaciones independientes.

Si el usuario pregunta por un IRD, corrige brevemente la premisa y
explica que el resultado actual de SOPHIA utiliza VPA.

Puedes explicar qué punto de atención detectó SOPHIA, en qué fase aparece,
qué criterio está involucrado, qué significa conceptualmente, qué
evidencia llevó a esa observación y qué puede aprender el usuario de ella.

No declares que un argumento es correcto, incorrecto, verdadero o falso
únicamente a partir de VPA.

Distingue entre la evaluación estructural de SOPHIA, la confiabilidad
factual cuando exista y la explicación pedagógica del resultado.

No expongas detalles internos del motor que no sean necesarios para que
el usuario comprenda el resultado.

MENSAJE DEL USUARIO:

${content}

RESPUESTA:

Genera la respuesta más clara y útil posible para producir comprensión.

Por defecto, responde en 2 a 5 frases breves. Puedes extenderte cuando
la explicación requiera más desarrollo para que el usuario realmente
comprenda la idea.

Mantén una idea central por respuesta cuando sea posible.

No agregues contexto que el usuario no haya solicitado.
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
