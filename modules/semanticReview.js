// modules/semanticReview.js
// Revisor Semántico de Falsos Positivos Contextuales (Capa 3 - SOPHIA v4.0)
//
// Principio fundamental: NO tiene autoridad sobre el Protocolo SOPHIA.
// Solo interpreta activaciones ya producidas por Capa 1. No modifica IRD, átomos ni puntajes.

const { askVertex } = require("./vertexClient");

// ─── Umbrales y Constantes ────────────────────────────────
const UMBRAL_CONFIANZA = 0.65; // Bajo este umbral, se marca para revisión humana

const CATEGORIAS = {
  infraccion_confirmada: {
    falso_positivo: false,
    descripcion: "El autor incurre efectivamente en la infracción detectada."
  },
  uso_legitimo: {
    falso_positivo: true,
    descripcion: "El autor utiliza el concepto de manera legítima y fundamentada."
  },
  uso_metadiscursivo: {
    falso_positivo: true,
    descripcion: "El autor habla sobre el concepto o la infracción, sin aplicarla incorrectamente."
  },
  uso_critico: {
    falso_positivo: true,
    descripcion: "El autor critica, cuestiona o denuncia el mal uso del concepto por terceros."
  },
  uso_ironico: {
    falso_positivo: true,
    descripcion: "El autor emplea el concepto como sarcasmo o ironía."
  },
  uso_hipotetico: {
    falso_positivo: true,
    descripcion: "El autor plantea un escenario supuesto o condicional, no un hecho afirmado."
  },
  uso_cita: {
    falso_positivo: true,
    descripcion: "El autor está citando o parafraseando la postura de un tercero."
  },
  ambiguo: {
    falso_positivo: false, // Por seguridad, la ambigüedad no anula la infracción
    descripcion: "No es posible determinar con claridad la intención del autor."
  }
};

const CATEGORIAS_LISTA = Object.keys(CATEGORIAS).join(", ");

/**
 * Deriva falso_positivo a partir de la categoría clasificada por el LLM.
 */
function derivarFalsoPositivo(categoria) {
  const entrada = CATEGORIAS[categoria];
  if (!entrada) {
    console.warn(`Categoría desconocida "${categoria}", asumiendo infraccion_confirmada`);
    return false;
  }
  return entrada.falso_positivo;
}

/**
 * Valida que el JSON devuelto por el LLM tenga los campos obligatorios.
 */
function validarRespuestaLLM(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { valido: false, error: 'La respuesta no es un objeto JSON válido' };
  }

  if (!parsed.categoria || typeof parsed.categoria !== 'string') {
    return { valido: false, error: 'Falta el campo "categoria" o no es un string' };
  }

  if (!CATEGORIAS[parsed.categoria]) {
    return { valido: false, error: `Categoría "${parsed.categoria}" no reconocida. Válidas: ${CATEGORIAS_LISTA}` };
  }

  if (typeof parsed.confianza !== 'number' || parsed.confianza < 0 || parsed.confianza > 1) {
    return { valido: false, error: 'El campo "confianza" debe ser un número entre 0 y 1' };
  }

  if (!parsed.explicacion || typeof parsed.explicacion !== 'string' || parsed.explicacion.trim().length === 0) {
    return { valido: false, error: 'El campo "explicacion" debe ser un string no vacío' };
  }

  return { valido: true, error: null };
}

/**
 * Extrae una ventana de contexto acotada alrededor del fragmento.
 */
function extraerContexto(fragmento, documentoCompleto) {
  if (!fragmento || typeof documentoCompleto !== 'string') {
    return fragmento || '';
  }

  const idx = documentoCompleto.indexOf(fragmento);
  if (idx === -1) {
    return fragmento;
  }

  const start = Math.max(0, idx - 1000);
  const end = Math.min(documentoCompleto.length, idx + fragmento.length + 1000);
  return documentoCompleto.substring(start, end);
}

/**
 * Analiza una activación de Capa 1 para determinar si es un falso positivo contextual.
 */
async function analizarPenalizacion(evidencia, documentoCompleto) {
  const contextoAcotado = extraerContexto(evidencia.fragmento, documentoCompleto);

  const prompt = `Eres el Revisor Semántico de Capa 3 de SOPHIA.

CONTRATO DE AUTORIDAD Y LÍMITES ESTRICTOS:
- No eres parte del motor SOPHIA determinista ni del Fact Checker.
- No puedes modificar ningún resultado ni penalización producida por Capa 1.
- No puedes modificar el IRD_global ni recalculaciones de puntajes.
- No puedes crear nuevas infracciones ni nuevos átomos.
- No puedes recalcular fases ni reevaluar el documento completo.
- Tu evaluación debe limitarse exclusivamente a la activación recibida y al fragmento contextual proporcionado. No debes inferir una nueva evaluación global del documento.
Tu única tarea es determinar si la activación producida por Capa 1 podría constituir un falso positivo contextual.

DATOS DE LA ACTIVACIÓN DE CAPA 1:
- Criterio: ${evidencia.criterio || 'No especificado'}
- Átomo: ${evidencia.atomo || 'No especificado'}
- Fase: ${evidencia.fase || 'No especificado'}
- Perfil: ${evidencia.perfil || 'No especificado'}
- Fragmento: "${evidencia.fragmento || ''}"
- Indicador activado: ${evidencia.indicador_activado || 'No especificado'}
- Severidad base: ${evidencia.severidad_base || 'No especificado'}

CONTEXTO EXCLUSIVO DE LA EVIDENCIA:
"""
${contextoAcotado}
"""

CATEGORÍAS DISPONIBLES:
${Object.entries(CATEGORIAS).map(([k, v]) => `- ${k} → ${v.descripcion}`).join('\n')}

INSTRUCCIONES ESTRICTAS:
1. La única salida válida es un JSON.
2. Clasifica la activación en EXACTAMENTE UNA de las categorías listadas.
3. Indica tu nivel de confianza como un número entre 0 y 1.
4. Explica brevemente por qué elegiste esa categoría.

Responde ÚNICAMENTE con el siguiente formato JSON:
{
  "categoria": "infraccion_confirmada",
  "confianza": 0.85,
  "explicacion": "Explicación breve de por qué se clasifica en esa categoría."
}`;

  try {
    const response = await askVertex(prompt);
    let cleaned = response.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró JSON en la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const validacion = validarRespuestaLLM(parsed);
    if (!validacion.valido) {
      throw new Error(validacion.error);
    }

    const falsoPositivo = derivarFalsoPositivo(parsed.categoria);
    const requiereRevision = parsed.confianza < UMBRAL_CONFIANZA;

    return {
      schema: "SOPHIA.semanticReview.v2",
      categoria: parsed.categoria,
      falso_positivo: falsoPositivo,
      confianza: parsed.confianza,
      requiere_revision_humana: requiereRevision,
      razon: parsed.explicacion
    };
  } catch (error) {
    console.error(
      `Error en Revisor Semántico para criterio ${evidencia.criterio || 'desconocido'}:`,
      error.message
    );
    return {
      schema: "SOPHIA.semanticReview.v2",
      categoria: "ambiguo",
      falso_positivo: false,
      confianza: 0,
      requiere_revision_humana: true,
      razon: `Fallo en el análisis: ${error.message}`
    };
  }
}

/**
 * Procesa todas las activaciones de una evaluación.
 */
async function procesarPenalizaciones(evidencias, documentoCompleto) {
  if (!evidencias || evidencias.length === 0) return [];

  const resultados = [];
  for (const evidencia of evidencias) {
    const revision = await analizarPenalizacion(evidencia, documentoCompleto);
    resultados.push({
      ...evidencia,
      revision_semantica: revision
    });
  }
  return resultados;
}

module.exports = { procesarPenalizaciones, analizarPenalizacion };
