// modules/semanticReview.js
// Revisor Semántico de Falsos Positivos Contextuales
//
// Principio fundamental: NO tiene autoridad sobre el Protocolo SOPHIA.
// Solo interpreta penalizaciones ya emitidas. No modifica IRD, átomos ni puntajes.

const { askVertex } = require("./vertexClient");

/**
 * Extrae una ventana de contexto alrededor de la evidencia para no enviar el documento completo.
 */
function extraerContexto(evidenciaText, documentoCompleto) {
  if (!evidenciaText || typeof documentoCompleto !== 'string') return documentoCompleto.substring(0, 3000);
  
  const idx = documentoCompleto.indexOf(evidenciaText);
  if (idx === -1) return documentoCompleto.substring(0, 3000); // Fallback si no encuentra coincidencia exacta
  
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
Tu única tarea consiste en determinar si la penalización recibida constituye un falso positivo contextual.

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

INSTRUCCIONES ESTRICTAS:
1. La única salida válida es un JSON.
2. Está prohibido: evaluar nuevamente el documento, modificar el IRD, emitir recomendaciones, proponer nuevas penalizaciones, reinterpretar el protocolo o resumir el documento.
3. Si el autor comete efectivamente la infracción, NO es falso positivo.
4. Si el autor usa el concepto de manera legítima, metadiscursiva, crítica o irónica, SÍ es falso positivo contextual.
5. Si no puedes determinarlo con suficiente confianza, asume falso_positivo: false.

Responde ÚNICAMENTE con el siguiente formato JSON:
{
  "schema": "SOPHIA.semanticReview.v1",
  "falso_positivo": true o false,
  "razon": "Explicación breve y concreta."
}`;

  try {
    const response = await askVertex(prompt);
    let cleaned = response.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No se encontró JSON en la respuesta');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (typeof parsed.falso_positivo !== 'boolean' || typeof parsed.razon !== 'string') {
      throw new Error('JSON no cumple el formato requerido');
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error en Revisor Semántico para criterio ${evidencia.criterion || evidencia.codigo}:`, error.message);
    return {
      schema: "SOPHIA.semanticReview.v1",
      falso_positivo: false,
      razon: 'No se pudo completar el análisis contextual debido a un error técnico.'
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
