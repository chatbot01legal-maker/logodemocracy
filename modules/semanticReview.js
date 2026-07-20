// modules/semanticReview.js
// Revisor Semántico de Falsos Positivos Contextuales
//
// Principio fundamental: NO tiene autoridad sobre el Protocolo SOPHIA.
// Solo interpreta penalizaciones ya emitidas. No modifica IRD, átomos ni puntajes.

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
 * Extrae una ventana de contexto alrededor de la evidencia.
 */
function extraerContexto(evidenciaText, documentoCompleto) {
  if (!evidenciaText || typeof documentoCompleto !== 'string') {
    return documentoCompleto.substring(0, 3000);
  }

  const idx = documentoCompleto.indexOf(evidenciaText);
  if (idx === -1) {
    return documentoCompleto.substring(0, 3000);
  }

  const start = Math.max(0, idx - 1500);
  const end = Math.min(documentoCompleto.length, idx + evidenciaText.length + 1500);
  return documentoCompleto.substring(start, end);
}

/**
 * Analiza una penalización individual para determinar si es un falso positivo contextual.
 */
async function analizarPenalizacion(evidencia, documentoCompleto) {
  const contextoAcotado = extraerContexto(evidencia.text, documentoCompleto);

  const prompt = `Eres el Revisor Semántico de SOPHIA.

El documento ya fue evaluado mediante un algoritmo determinista.
Tu única tarea consiste en clasificar la penalización recibida en una de las categorías predefinidas.

DATOS DE LA PENALIZACIÓN:
- Criterio: ${evidencia.criterion || evidencia.codigo || 'No especificado'}
- Nombre del criterio: ${evidencia.nombre || evidencia.name || 'No especificado'}
- Átomo activado: ${evidencia.atom || 'No especificado'}
- Texto de la evidencia: "${evidencia.text || ''}"
- Penalización aplicada: ${evidencia.penalty || evidencia.puntaje || 'No especificado'}

CONTEXTO DE LA EVIDENCIA (Fragmento del documento):
"""
${contextoAcotado}
"""

CATEGORÍAS DISPONIBLES:
${Object.entries(CATEGORIAS).map(([k, v]) => `- ${k} → ${v.descripcion}`).join('\n')}

INSTRUCCIONES ESTRICTAS:
1. La única salida válida es un JSON.
2. Está prohibido: evaluar nuevamente el documento, modificar el IRD, emitir recomendaciones o proponer nuevas penalizaciones.
3. Clasifica la penalización en EXACTAMENTE UNA de las categorías listadas.
4. Indica tu nivel de confianza como un número entre 0 y 1.
5. Explica brevemente por qué elegiste esa categoría.

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

    // Validar respuesta del LLM
    const validacion = validarRespuestaLLM(parsed);
    if (!validacion.valido) {
      throw new Error(validacion.error);
    }

    // Lógica determinista
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
      `Error en Revisor Semántico para criterio ${evidencia.criterion || evidencia.codigo}:`,
      error.message
    );
    return {
      schema: "SOPHIA.semanticReview.v2",
      categoria: "ambiguo",
      falso_positivo: false,
      confianza: 0,
      requiere_revision_humana: true, // Fuerza revisión si hay error
      razon: `Fallo en el análisis: ${error.message}`
    };
  }
}

/**
 * Procesa todas las penalizaciones de una evaluación.
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
