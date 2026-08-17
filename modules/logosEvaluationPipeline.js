// modules/logosEvaluationPipeline.js
// Motor cognitivo de LOGOS v0.1.2 — Modalidad A (Comparar Posiciones)
//
// Implementa el PROTOCOLO_LOGOS_v0.1.1.md y su Especificación Funcional
// como pipeline de backend. Sigue el mismo principio de capas que
// sophiaEvaluationPipeline.js: cada etapa tiene una responsabilidad
// propia y ninguna modifica silenciosamente el resultado de otra.
//
// Dependencias cognitivas respetadas (protocolo §6):
//   Etapa 1 (reconstrucción de A y B) — sin dependencias, corre en paralelo
//   Etapa 2 (comprensión cruzada, steelman y mapeo relacional fusionados) — depende de Etapa 1
//   Etapa 3 (síntesis + preguntas) — depende de la Etapa 2

const { askVertex } = require("./vertexClient");

function extractJson(rawText) {
  const cleaned = rawText.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── ETAPA 1 — Reconstrucción (síntesis descriptiva) ──────────────────
async function reconstructPosition(texto, etiqueta) {
  console.log(`   🧩 [Logos] Reconstruyendo Posición ${etiqueta}...`);

  const prompt = `
Eres el módulo de reconstrucción del instrumento LOGOS. Tu única función es
reconstruir fielmente una posición a partir de los materiales que se te
entregan — NUNCA evalúes su calidad, corrección ni robustez (eso es
función de otro instrumento, SOPHIA, no tuya).

Materiales de la Posición ${etiqueta}:
"""
${texto}
"""

REGLA ABSOLUTA — DISCIPLINA EPISTÉMICA:
Debes distinguir en todo momento entre dos niveles, y NUNCA mezclarlos:
- NIVEL "explicito": algo que el material dice literalmente o casi literalmente.
- NIVEL "inferido": algo que no está escrito, pero que se sigue con razonable
  claridad de lo que sí está escrito (por ejemplo, un supuesto necesario
  para que el argumento funcione).

PROHIBIDO TERMINANTEMENTE: agregar doctrinas, escuelas de pensamiento,
autores, tradiciones intelectuales, o argumentos que NO están en el
material. Si el material es muy breve, tu reconstrucción también debe ser breve.

Identifica:
- afirmacion_central: la formulación principal de la posición, en una frase, usando en lo posible las palabras del propio material.
- argumentos: lista de razones mediante las cuales se sostiene la afirmación central. Cada argumento es un objeto { "texto": "...", "origen": "explicito" | "inferido" }.
- evidencia: lista de datos, fuentes o ejemplos citados como respaldo (vacío si no hay). Mismo formato { "texto": "...", "origen": "explicito" | "inferido" }.
- supuestos: lista de premisas que el argumento necesita asumir para funcionar. Formato { "texto": "..." }.

Devuelve EXCLUSIVAMENTE un JSON, sin texto adicional:
{
  "afirmacion_central": "...",
  "argumentos": [{ "texto": "...", "origen": "explicito" }],
  "evidencia": [{ "texto": "...", "origen": "explicito" }],
  "supuestos": [{ "texto": "..." }]
}`;

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.15 });
  return extractJson(raw);
}

// ─── ETAPA 2 — Análisis relacional unificado (Comprensión Cruzada + Steelman + Mapeo) ───
// Fusión optimizada: procesa las reconstrucciones de A y B en una sola llamada a la IA
// para evitar duplicar el input en la red y optimizar uso de tokens.
async function relationalAnalysis(reconA, reconB) {
  console.log(`   🔄🗺️ [Logos] Análisis relacional unificado (Comprensión cruzada, steelman y mapeo)...`);

  const prompt = `
Eres el módulo de análisis relacional del instrumento LOGOS.

Posición A reconstruida:
${JSON.stringify(reconA, null, 2)}

Posición B reconstruida:
${JSON.stringify(reconB, null, 2)}

REGLA ABSOLUTA — DISCIPLINA EPISTÉMICA:
Trabajás EXCLUSIVAMENTE con lo que está en las reconstrucciones de arriba.
NUNCA agregues doctrinas, escuelas de pensamiento, autores o argumentos
externos que no estén presentes en las reconstrucciones provistas.

Produce en una sola estructura:

1. comprension_cruzada: cómo se entiende cada posición con la otra desde
   la perspectiva de comprensión (no de acuerdo):
   - a_sobre_b: "..."
   - b_sobre_a: "..."

2. steelman: la mejor versión posible de cada posición basada estrictamente en lo reconstruido:
   - a: "..."
   - b: "..."

3. acuerdos: lista de puntos donde A y B coinciden explícitamente.

4. desacuerdos: lista de puntos donde discrepan. Cada uno con { "texto": "...", "tipo": ["factual" | "causal" | "conceptual" | "normativo" | "metodologico" | "estrategico"] }.

5. supuestos_compartidos: premisas que ambas posiciones asumen sin cuestionar.

6. convergencias: puntos donde ambas posiciones podrían encontrarse, cada uno con { "texto": "...", "estado": "encontrada" | "posible" }.

Devuelve EXCLUSIVAMENTE un JSON con esta estructura exacta:
{
  "comprension_cruzada": {
    "a_sobre_b": "...",
    "b_sobre_a": "..."
  },
  "steelman": {
    "a": "...",
    "b": "..."
  },
  "acuerdos": ["..."],
  "desacuerdos": [{ "texto": "...", "tipo": ["factual"] }],
  "supuestos_compartidos": ["..."],
  "convergencias": [{ "texto": "...", "estado": "encontrada" }]
}`;

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.25 });
  return extractJson(raw);
}

// ─── ETAPA 3 — Síntesis relacional + generativa + preguntas ──────────
async function synthesize(reconA, reconB, analisisRelacional) {
  console.log(`   ✨ [Logos] Síntesis relacional y generativa...`);

  const prompt = `
Eres el módulo de síntesis del instrumento LOGOS.

REGLA ABSOLUTA E INQUEBRANTABLE: ninguna síntesis que produzcas es una
conclusión, un veredicto, ni la posición correcta. Toda síntesis es una
PROPUESTA sujeta a evaluación humana.

Posición A: ${JSON.stringify(reconA, null, 2)}
Posición B: ${JSON.stringify(reconB, null, 2)}
Análisis Relacional: ${JSON.stringify(analisisRelacional, null, 2)}

Produce:

1. sintesis_relacional: un párrafo que resume cómo se relacionan ambas posiciones en prosa clara.

2. sintesis_generativa: lista de posibilidades nuevas que emergen. Cada una clasificada como:
   - "solucion": propuesta nueva que responde a la pregunta original.
   - "problema": reformulación de la pregunta por estar mal planteada o incompleta.
   (Si no emerge ninguna, devuelve un array vacío).

3. preguntas_deliberativas: preguntas que permitirían profundizar el proceso o resolver desacuerdos.

Devuelve EXCLUSIVAMENTE un JSON:
{
  "sintesis_relacional": "...",
  "sintesis_generativa": [{ "tipo": "solucion", "texto": "..." }],
  "preguntas_deliberativas": ["..."]
}`;

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.4 });
  return extractJson(raw);
}

// ─── ENSAMBLADO DEL PIPELINE COMPLETO ──────────────────────────────────
async function compare({ posicionA, posicionB }) {
  console.log("🔺 [Logos] PIPELINE START");

  if (!posicionA || !posicionA.trim() || !posicionB || !posicionB.trim()) {
    throw new Error("Ambas posiciones (A y B) son requeridas.");
  }

  // Etapa 1 — Reconstrucciones en paralelo.
  console.log("📊 [Logos] PIPELINE STEP 1: Reconstrucción de A y B...");
  const [reconA, reconB] = await Promise.all([
    reconstructPosition(posicionA, "A"),
    reconstructPosition(posicionB, "B")
  ]);

  // Etapa 2 — Análisis relacional unificado (Fusión de 2a y 2b).
  console.log("📊 [Logos] PIPELINE STEP 2: Análisis relacional unificado...");
  const analisisRelacional = await relationalAnalysis(reconA, reconB);

  // Etapa 3 — Síntesis basada en el análisis unificado.
  console.log("📊 [Logos] PIPELINE STEP 3: Síntesis...");
  const sintesis = await synthesize(reconA, reconB, analisisRelacional);

  console.log("🏁 [Logos] PIPELINE COMPLETE");

  // Forma final — mantiene compatibilidad total con el contrato que espera el frontend.
  return {
    sintesis_descriptiva: {
      a: reconA.afirmacion_central,
      b: reconB.afirmacion_central
    },
    reconstruccion_completa: { a: reconA, b: reconB },
    comprension_cruzada: analisisRelacional.comprension_cruzada,
    steelman: analisisRelacional.steelman,
    acuerdos: analisisRelacional.acuerdos,
    desacuerdos: analisisRelacional.desacuerdos,
    supuestos_compartidos: analisisRelacional.supuestos_compartidos,
    convergencias: analisisRelacional.convergencias,
    sintesis_relacional: sintesis.sintesis_relacional,
    sintesis_generativa: sintesis.sintesis_generativa,
    preguntas_deliberativas: sintesis.preguntas_deliberativas,
    metadata: {
      module_versions: { protocol: "0.1.1", pipeline: "1.2-optimized" },
      validacion_dialogica: "pendiente",
      evaluated_at: new Date().toISOString()
    }
  };
}

module.exports = { compare };
