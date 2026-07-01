// modules/sophiaEngine.js
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Cargar protocolo desde YAML (fuente de verdad)
const protocolPath = path.join(__dirname, '..', 'assets', 'js', 'protocol', 'sophia_protocol.yaml');
const protocol = yaml.load(fs.readFileSync(protocolPath, 'utf8'));

// Transformar el YAML al formato que usa el motor (similar a PROTOCOL en sophia.js)
function buildProtocolFromYAML(yamlData) {
  // Adapta la estructura de YAML a la que espera evaluateText
  // (puedes copiar la estructura de PROTOCOL de sophia.js y mapear)
  // Por ahora, usamos una versión simplificada
  return {
    version: yamlData.version,
    fases: yamlData.dimensions.map(dim => ({
      id: dim.id,
      nombre: dim.name,
      descripcion: dim.description,
      criterios: dim.criteria.map(c => ({
        id: c.id,
        nombre: c.name,
        constructo: c.construct?.name || 'Sin constructo',
        definicion: c.construct?.definition || c.definition || '',
        severidad: c.severity_level || 2,
        atomos: c.atoms.map(a => ({
          id: a.id,
          definicion: a.definition,
          patrones: a.patterns || []
        }))
      }))
    }))
  };
}

const PROTOCOL = buildProtocolFromYAML(protocol);

// ─── EVALUACIÓN LOCAL (copia de evaluateText de sophia.js) ───
function evaluateText(text) {
  if (!text || text.trim().length === 0) return null;

  const oraciones = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const resultados = {
    fases: [],
    evidencias: [],
    puntajes_fase: {},
    IRD_global: 0,
    riesgo: "Normal"
  };

  let nivel3_count = 0;

  PROTOCOL.fases.forEach(fase => {
    let penalizacion_fase = 0;
    let infracciones_fase = [];

    fase.criterios.forEach(criterio => {
      let penalizacion_criterio = 0;
      let atomos_activados = [];

      criterio.atomos.forEach(atom => {
        if (atom.patrones && atom.patrones.length > 0) {
          const patrones_unicos = [...new Set(atom.patrones)];
          let frecuencia = 0;
          oraciones.forEach(ora => {
            const lower = ora.toLowerCase();
            if (patrones_unicos.some(p => lower.includes(p))) {
              frecuencia++;
            }
          });
          if (frecuencia > 0) {
            const penalizacion_atomo = criterio.severidad * frecuencia;
            penalizacion_criterio += penalizacion_atomo;
            atomos_activados.push({ atomo: atom.id, frecuencia, severidad: criterio.severidad });
            // Capturar evidencia textual
            const evidencia = text.match(new RegExp(`[^.!?]*\\b${patrones_unicos[0]}\\b[^.!?]*[.!?]`, 'i'));
            if (evidencia) {
              resultados.evidencias.push({
                atomo: atom.id,
                fragmento: evidencia[0].trim(),
                criterio: criterio.id
              });
            }
          }
        }
      });

      penalizacion_criterio = Math.min(penalizacion_criterio, 25);
      if (penalizacion_criterio > 0) {
        infracciones_fase.push({
          criterio: `${criterio.id} - ${criterio.nombre}`,
          constructo: criterio.constructo,
          penalizacion: penalizacion_criterio,
          atomos_activados
        });
        penalizacion_fase += penalizacion_criterio;
        if (penalizacion_criterio === 25) nivel3_count++;
      }
    });

    // Meta-regla MR-001 (mitigación por incertidumbre)
    if (fase.id === "fase4" && resultados.puntajes_fase["fase3"] && resultados.puntajes_fase["fase3"] > 80) {
      const infra42 = infracciones_fase.find(inf => inf.criterio.startsWith("4.2"));
      if (infra42) {
        infra42.penalizacion = infra42.penalizacion * 0.5;
        infra42.meta_regla_aplicada = "MR-001 (Mitigación por Incertidumbre)";
        penalizacion_fase = infracciones_fase.reduce((acc, inf) => acc + inf.penalizacion, 0);
      }
    }

    let puntaje_fase = Math.max(0, 100 - penalizacion_fase);
    if (infracciones_fase.length === 0) puntaje_fase = 100;
    resultados.puntajes_fase[fase.id] = Math.round(puntaje_fase);
    resultados.fases.push({
      id: fase.id,
      nombre: fase.nombre,
      puntaje: Math.round(puntaje_fase),
      infracciones: infracciones_fase
    });
  });

  const puntajes = Object.values(resultados.puntajes_fase);
  const ird = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
  resultados.IRD_global = Math.round(ird);

  if (nivel3_count >= 4) resultados.riesgo = "Riesgo Extremo";
  else if (nivel3_count >= 3) resultados.riesgo = "Alta Fragilidad";
  else if (nivel3_count >= 2) resultados.riesgo = "Atención";
  else resultados.riesgo = "Normal";

  return resultados;
}

// ─── REVISIÓN CON LLM (complementaria) ──────────────
async function getLLMReview(text, localResult) {
  const { askVertex } = require('./vertexClient');

  const prompt = `
    Eres el módulo de revisión semántica de SOPHIA.
    El motor local ha detectado las siguientes infracciones:
    ${JSON.stringify(localResult.fases, null, 2)}

    Texto original (fragmento):
    "${text.substring(0, 1000)}"

    Revisa si hay algún matiz que el motor local no haya captado:
    - ¿Hay falacias no detectadas?
    - ¿La evidencia es sólida?
    - ¿El tono es proporcionado?
    Devuelve un JSON con: {
      "additional_fallacies": [],
      "evidence_quality": "alta|media|baja",
      "tone_proportionality": "adecuado|excesivo|insuficiente",
      "overall_comment": "string"
    }
  `;
  const response = await askVertex(prompt, 'gemini-2.5-flash');
  // Extraer JSON con regex más robusto
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { error: 'No se pudo parsear la revisión semántica' };
  }
  return JSON.parse(jsonMatch[0]);
}

module.exports = { evaluateText, getLLMReview, PROTOCOL, protocol };
