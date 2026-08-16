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
//
// DISCIPLINA EPISTÉMICA (crítica incorporada tras revisión externa del
// protocolo): la reconstrucción distingue explícitamente entre lo que el
// material DICE (Nivel 1) y lo que Logos INFIERE que probablemente
// implica (Nivel 2). Nunca debe escalar a "Nivel 3" — atribuir a la
// posición doctrinas, escuelas de pensamiento o argumentos típicos de
// una tradición intelectual que el material no menciona, aunque el estilo
// o vocabulario del material "suene" a esa tradición. Confundir esos dos
// niveles fue el bug más importante detectado en la primera versión: con
// solo una frase de entrada, Logos terminaba atribuyendo a la posición
// diez páginas de doctrina económica que el usuario nunca escribió.
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
material, solo porque el vocabulario o el estilo del material te recuerda
a esa tradición. Si el material es muy breve (por ejemplo, una sola
frase), tu reconstrucción también debe ser breve — NO debes "completar"
la posición con contenido de la escuela de pensamiento que crees que el
autor representa. Preferí una reconstrucción corta y fiel a una
reconstrucción larga y especulativa.

Identifica:

- afirmacion_central: la formulación principal de la posición, en una frase, usando en lo posible las palabras del propio material.
- argumentos: lista de razones mediante las cuales se sostiene la afirmación central. Cada argumento es un objeto { "texto": "...", "origen": "explicito" | "inferido" }.
- evidencia: lista de datos, fuentes o ejemplos citados como respaldo (vacío si no hay). Mismo formato { "texto": "...", "origen": "explicito" | "inferido" }.
- supuestos: lista de premisas que el argumento necesita asumir para funcionar, aunque no estén declaradas — estos son por definición "inferido". Formato { "texto": "..." } (el origen es siempre inferido, no hace falta repetirlo).

Devuelve EXCLUSIVAMENTE un JSON, sin texto adicional:
{
  "afirmacion_central": "...",
  "argumentos": [{ "texto": "...", "origen": "explicito" }],
  "evidencia": [{ "texto": "...", "origen": "explicito" }],
  "supuestos": [{ "texto": "..." }]
}`;

  // Temperatura baja: este paso debe ser una extracción fiel, no una
  // elaboración creativa — buscamos que el mismo material produzca
  // reconstrucciones consistentes entre corridas, no variaciones libres.
  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.15 });
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

REGLA ABSOLUTA — DISCIPLINA EPISTÉMICA (aplica a ambas tareas de abajo):
Trabajás EXCLUSIVAMENTE con lo que está en las reconstrucciones de arriba
(sus campos "afirmacion_central", "argumentos", "evidencia", "supuestos").
NUNCA agregues doctrinas, escuelas de pensamiento, autores o argumentos
típicamente asociados con la tradición intelectual que la posición te
recuerda, si esos elementos no están en la reconstrucción entregada. Si
las reconstrucciones son breves, tu output también debe ser proporcionalmente
breve — ampliar el contenido más allá de lo reconstruido es el error más
grave que puedes cometer en este instrumento.

Produce dos cosas, sin evaluar cuál posición es más correcta:

1. Comprensión cruzada: cómo se relaciona cada posición con la otra desde
   la perspectiva de comprensión (no de acuerdo) — qué entendería A sobre
   B, y qué entendería B sobre A, si cada una leyera la reconstrucción de
   la otra. Basate solo en lo reconstruido.

2. Steelman de la posición reconstruida: para cada posición, construye la
   MEJOR versión posible de ella — la formulación más fuerte que la parte
   contraria debería poder reconocer como justa, aunque siga en desacuerdo.
   El steelman amplifica y organiza SOLO los argumentos presentes o
   razonablemente implícitos en la reconstrucción entregada. NO incorpora
   automáticamente doctrinas externas asociadas con la posición, aunque
   sean plausibles o vengan a la mente. Esto NO es una evaluación de
   robustez (eso es SOPHIA); es una reconstrucción caritativa y fiel,
   nunca una ampliación.

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

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.3 });
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

REGLA ABSOLUTA — DISCIPLINA EPISTÉMICA: trabajá exclusivamente con lo que
está en las reconstrucciones de arriba. No agregues elementos de una
tradición intelectual externa que las reconstrucciones no contienen, ni
siquiera para "enriquecer" el mapeo de acuerdos y desacuerdos.

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

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.2 });
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

DISCIPLINA EPISTÉMICA: la síntesis generativa SÍ puede proponer algo nuevo
— es su función — pero esa novedad debe construirse combinando o
trascendiendo lo que efectivamente está en las reconstrucciones y el
mapeo de arriba, no agregando doctrina externa no relacionada con lo que
las posiciones realmente dijeron.

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

  const raw = await askVertex(prompt, "gemini-2.5-flash", 50000, { temperature: 0.4 });
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
