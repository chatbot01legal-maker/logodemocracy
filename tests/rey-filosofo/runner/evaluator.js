/**
 * Evalúa la respuesta y genera un objeto con:
 *   - comprobaciones automáticas
 *   - guía para evaluación humana
 */

function evaluateResponse(response, testCase) {
  const result = {
    testId: testCase.id,
    mode: testCase.mode,
    description: testCase.description,
    autoPassed: true,
    autoErrors: [],
    responseText: null,
    semanticGuide: {
      dimensions: [
        'comprension_documento',
        'fidelidad_documento',
        'explicacion_conceptos',
        'comprension_sophia',
        'comprension_logos',
        'integracion_academia_sophia',
        'integracion_academia_logos',
        'integracion_completa',
        'uso_contexto_relevante',
        'ignorar_contexto_irrelevante',
        'reconocer_ausencia_contexto',
        'adaptacion_pedagogica',
        'preguntas_socraticas',
        'no_sustitucion_razonamiento',
        'neutralidad',
        'continuidad',
        'fidelidad_resultados'
      ],
      observations: [],
      score: null
    }
  };

  // Comprobaciones automáticas
  if (response.error) {
    result.autoPassed = false;
    result.autoErrors.push(
      `Error de API: ${response.status || 'desconocido'} - ${JSON.stringify(response.data)}`
    );
    return result;
  }

  // El endpoint actual de Rey Filósofo devuelve:
  // { content, reply, adapted_content, ... }
  const text =
    response.content ||
    response.reply ||
    response.adapted_content ||
    response.text ||
    response.message ||
    response.respuesta ||
    '';

  result.responseText = text;

  if (!text || text.trim().length === 0) {
    result.autoPassed = false;
    result.autoErrors.push('Respuesta vacía');
  }

  // Guía para el revisor humano
  const guide = [];

  if (testCase.expectations && testCase.expectations.must_demonstrate) {
    testCase.expectations.must_demonstrate.forEach(d => {
      guide.push(`✅ ¿Demuestra "${d}"? (0-3)`);
    });
  }

  if (testCase.expectations && testCase.expectations.must_not_do) {
    testCase.expectations.must_not_do.forEach(d => {
      guide.push(`❌ ¿Evita "${d}"? (0-3)`);
    });
  }

  guide.push('📚 ¿Comprende correctamente el documento? (0-3)');

  if (testCase.mode.includes('SOPHIA')) {
    guide.push('🧠 ¿Interpreta correctamente SOPHIA? (0-3)');
    guide.push('🔍 ¿Distingue correctamente VPA de verdad/falsedad? (0-3)');
  }

  if (testCase.mode.includes('LOGOS')) {
    guide.push('⚖️ ¿Interpreta correctamente LOGOS? (0-3)');
    guide.push('🔄 ¿Evita usar LOGOS como juez? (0-3)');
  }

  if (testCase.mode === 'ACADEMIA+SOPHIA+LOGOS') {
    guide.push('🤝 ¿Integra los tres contextos coherentemente? (0-3)');
  }

  result.semanticGuide.observations = guide;

  return result;
}

module.exports = { evaluateResponse };
