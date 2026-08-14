// modules/logosEvaluationPipeline.js
// Motor cognitivo de LOGOS v0.1.1 — Modalidad A (Comparar Posiciones)
//
// Implementa el PROTOCOLO_LOGOS_v0.1.1.md y su Especificación Funcional
// como pipeline de backend. Sigue el mismo principio de capas que
// sophiaEvaluationPipeline.js: cada etapa tiene una responsabilidad
// propia y ninguna modifica silenciosamente el resultado de otra.
//
// Simplificación explícita de este MVP (a diferencia del protocolo
// completo): la "Prueba de Reconstrucción" (§13 del protocolo — el
// usuario confirma/rechaza/precisa cada reconstrucción antes de avanzar)
// requiere una interfaz conversacional de validación que todavía no
// existe en el frontend. Este pipeline genera el análisis completo en
// una sola pasada, marcando cada reconstrucción como "no validada
// todavía" — la validación dialógica es la siguiente iteración natural
// de Logos, no de este archivo.
//
// Dependencias cognitivas respetadas (protocolo §6):
//   Etapa 1 (reconstrucción de A y B) — sin dependencias, corre en paralelo
//   Etapa 2 (comprensión cruzada + mapeo relacional) — depende de Etapa 1,
//            sus dos partes no dependen entre sí, corren en paralelo
//   Etapa 3 (síntesis + preguntas) — depende del mapeo relacional de Etapa 2

const { askVertex } = require("./vertexClient");

function extractJson(rawText) {
  const cleaned = rawText.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();
  return JSON.parse(cleaned);
}

// ─── ETAPA 1 — Reconstrucción (síntesis descriptiva) ──────────────────
// Descompone una posición en sus unidades de información (protocolo §10):
// afirmación central, argumentos, evidencia y supuestos.
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

Identifica, en las propias palabras del material (nunca inventes contenido
que no esté presente ni implícito con claridad):

- afirmacion_central: la formulación principal de la posición, en una frase.
- argumentos: lista de razones mediante las cuales se sostiene la afirmación central.
- evidencia: lista de datos, fuentes o ejemplos citados como respaldo (vacío si no hay).
- supuestos: lista de premisas que el argumento necesita asumir para funcionar, aunque no estén declaradas explícitamente. Si infieres un supuesto no declarado, indícalo como tal.

Devuelve EXCLUSIVAMENTE un JSON, sin texto adicional:
{
  "afirmacion_central": "...",
  "argumentos": ["..."],
  "evidencia": ["..."],
  "supuestos": ["..."]
}`;

  const raw = await askVertex(prompt);
  return extractJson(raw);
}

// ─── ETAPA 2a — Comprensión cruzada + Steelman dialéctico ─────────────
// Protocolo §13: cómo entiende A a B y B a A, más la mejor versión
// posible de cada posición (steelman), presentadas como candidatas a
// validación por las propias partes — este pipeline las genera; la
// validación dialógica ocurre en el frontend en una iteración futura.
async function crossUnderstanding(reconA, reconB) {
  console.log(`   🔄 [Logos] Comprensión cruzada + steelman...`);

  const prompt = `
Eres el módulo de comprensión mutua del instrumento LOGOS.

Posición A reconstruida:
${JSON.stringify(reconA, null, 2)}

Posición B reconstruida:
${JSON.stringify(reconB, null, 2)}

Produce dos cosas, sin evaluar cuál posición es más correcta:

1. Comprensión cruzada: cómo se relaciona cada posición con la otra desde
   la perspectiva de comprensión (no de acuerdo) — qué entendería A sobre
   B, y qué entendería B sobre A, si cada una leyera la reconstrucción de
   la otra.

2. Steelman dialéctico: para cada posición, construye la MEJOR versión
   posible de ella — la formulación más fuerte que la parte contraria
   debería poder reconocer como justa, aunque siga en desacuerdo. Esto
   NO es una evaluación de robustez (eso es SOPHIA); es una reconstrucción
   caritativa y precisa.

Devuelve EXCLUSIVAMENTE un JSON:
{
  "comprension_cruzada": {
    "a_sobre_b": "...",
    "b_sobre_a": "..."
  },
  "steelman": {
    "a": "...",
    "b": "..."
  }
}`;

  const raw = await askVertex(prompt);
  return extractJson(raw);
}

// ─── ETAPA 2b — Mapeo relacional ───────────────────────────────────────
// Protocolo §8.2 y §20: acuerdos, desacuerdos clasificados por tipo,
// supuestos compartidos, convergencias encontradas o posibles.
async function relationalMapping(reconA, reconB) {
  console.log(`   🗺️  [Logos] Mapeo relacional (acuerdos, desacuerdos, convergencias)...`);

  const prompt = `
Eres el módulo de mapeo relacional del instrumento LOGOS. Tu función es
identificar cómo se relacionan dos posiciones — NUNCA decidir cuál es
correcta.

Posición A reconstruida:
${JSON.stringify(reconA, null, 2)}

Posición B reconstruida:
${JSON.stringify(reconB, null, 2)}

Identifica:

1. acuerdos: puntos donde A y B coinciden explícitamente.

2. desacuerdos: puntos donde discrepan. Para cada uno, clasifícalo con al
   menos uno de estos tipos exactos (puede tener más de uno si aplica):
   "factual" (discrepan sobre hechos), "causal" (sobre qué causa qué),
   "conceptual" (usan un concepto de forma distinta), "normativo"
   (sobre valores o principios), "metodologico" (sobre cómo debe
   conocerse o evaluarse el problema), "estrategico" (comparten el
   objetivo, discrepan sobre el mecanismo).

3. supuestos_compartidos: premisas que ambas posiciones asumen sin
   cuestionar, aunque discrepen en lo demás.

4. convergencias: puntos donde ambas posiciones podrían encontrarse.
   Para cada una, indica su estado: "encontrada" (ya presente en los
   materiales) o "posible" (solo se daría bajo cierta condición — indica
   cuál).

Devuelve EXCLUSIVAMENTE un JSON:
{
  "acuerdos": ["..."],
  "desacuerdos": [{ "texto": "...", "tipo": ["factual"] }],
  "supuestos_compartidos": ["..."],
  "convergencias": [{ "texto": "...", "estado": "encontrada" }]
}`;

  const raw = await askVertex(prompt);
  return extractJson(raw);
}

// ─── ETAPA 3 — Síntesis relacional + generativa + preguntas ──────────
// Protocolo §8.3: distingue explícitamente síntesis de SOLUCIÓN
// (una propuesta que responde a la pregunta tal como estaba formulada)
// de síntesis de PROBLEMA (se descubre que la pregunta estaba mal
// formulada). Ambas se presentan como propuesta, nunca como conclusión
// (protocolo §2, axioma central: "la síntesis pertenece a las personas").
async function synthesize(reconA, reconB, mapeo) {
  console.log(`   ✨ [Logos] Síntesis relacional y generativa...`);

  const prompt = `
Eres el módulo de síntesis del instrumento LOGOS.

REGLA ABSOLUTA E INQUEBRANTABLE: ninguna síntesis que produzcas es una
conclusión, un veredicto, ni la posición correcta. Toda síntesis es una
PROPUESTA sujeta a evaluación humana. Nunca uses lenguaje que sugiera
que resolviste el desacuerdo — puedes, y a veces debes, concluir que un
desacuerdo legítimo permanece.

Posición A: ${JSON.stringify(reconA, null, 2)}
Posición B: ${JSON.stringify(reconB, null, 2)}
Mapeo relacional: ${JSON.stringify(mapeo, null, 2)}

Produce:

1. sintesis_relacional: un párrafo que resume cómo se relacionan ambas
   posiciones — su estructura de acuerdo/desacuerdo — en prosa clara.

2. sintesis_generativa: lista de posibilidades nuevas que emergen de
   comprender A y B conjuntamente. Cada una debe clasificarse como:
   - "solucion": una propuesta nueva que responde a la pregunta tal como
     estaba formulada (combina o trasciende A y B).
   - "problema": una reformulación — se descubre que la pregunta original
     estaba mal planteada o incompleta, y existe una dimensión que
     ninguna posición consideraba.
   Si no emerge ninguna síntesis generativa razonable de los materiales,
   devuelve un array vacío — NO fuerces una.

3. preguntas_deliberativas: preguntas que permitirían profundizar el
   proceso o resolver un desacuerdo pendiente (por ejemplo, qué evidencia
   haría falta para zanjar un desacuerdo factual).

Devuelve EXCLUSIVAMENTE un JSON:
{
  "sintesis_relacional": "...",
  "sintesis_generativa": [{ "tipo": "solucion", "texto": "..." }],
  "preguntas_deliberativas": ["..."]
}`;

  const raw = await askVertex(prompt);
  return extractJson(raw);
}

// ─── ENSAMBLADO DEL PIPELINE COMPLETO ──────────────────────────────────
async function compare({ posicionA, posicionB }) {
  console.log("🔺 [Logos] PIPELINE START");

  if (!posicionA || !posicionA.trim() || !posicionB || !posicionB.trim()) {
    throw new Error("Ambas posiciones (A y B) son requeridas.");
  }

  // Etapa 1 — sin dependencias entre sí: en paralelo.
  console.log("📊 [Logos] PIPELINE STEP 1: Reconstrucción de A y B...");
  const [reconA, reconB] = await Promise.all([
    reconstructPosition(posicionA, "A"),
    reconstructPosition(posicionB, "B")
  ]);

  // Etapa 2 — ambas dependen solo de las reconstrucciones: en paralelo entre sí.
  console.log("📊 [Logos] PIPELINE STEP 2: Comprensión cruzada + mapeo relacional...");
  const [comprension, mapeo] = await Promise.all([
    crossUnderstanding(reconA, reconB),
    relationalMapping(reconA, reconB)
  ]);

  // Etapa 3 — depende del mapeo relacional de la Etapa 2.
  console.log("📊 [Logos] PIPELINE STEP 3: Síntesis...");
  const sintesis = await synthesize(reconA, reconB, mapeo);

  console.log("🏁 [Logos] PIPELINE COMPLETE");

  // Forma final — coincide con el contrato que espera logos.js en el frontend.
  return {
    sintesis_descriptiva: {
      a: reconA.afirmacion_central,
      b: reconB.afirmacion_central
    },
    reconstruccion_completa: { a: reconA, b: reconB }, // detalle completo, por si el frontend quiere mostrarlo
    comprension_cruzada: comprension.comprension_cruzada,
    steelman: comprension.steelman,
    acuerdos: mapeo.acuerdos,
    desacuerdos: mapeo.desacuerdos,
    supuestos_compartidos: mapeo.supuestos_compartidos,
    convergencias: mapeo.convergencias,
    sintesis_relacional: sintesis.sintesis_relacional,
    sintesis_generativa: sintesis.sintesis_generativa,
    preguntas_deliberativas: sintesis.preguntas_deliberativas,
    metadata: {
      module_versions: { protocol: "0.1.1", pipeline: "1.0" },
      validacion_dialogica: "pendiente", // ver nota al inicio del archivo
      evaluated_at: new Date().toISOString()
    }
  };
}

module.exports = { compare };

