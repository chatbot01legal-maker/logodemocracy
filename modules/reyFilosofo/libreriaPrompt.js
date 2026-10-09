/* ============================================================
   REY FILÓSOFO · LIBRERÍA PERSONAL · PROMPTS
   1) buildCourseOutlinePrompt → 1 llamada, pide los 5 títulos
   2) buildSingleDocumentPrompt → 5 llamadas paralelas, una por doc
============================================================ */

'use strict';

const PROPÓSITOS = {
  desde_cero: 'aprender desde cero, sin conocimiento previo',
  profundizar: 'profundizar en algo que ya conoce',
  curiosidad: 'satisfacer curiosidad general',
  aplicar: 'aplicar el contenido a un proyecto, trabajo o decisión concreta'
};

const DIFICULTADES = {
  principiante: 'nivel principiante, vocabulario accesible, sin jerga técnica innecesaria',
  intermedio: 'nivel intermedio, con cierta precisión conceptual pero sin asumir formación especializada',
  avanzado: 'nivel avanzado, con rigor conceptual y vocabulario preciso'
};

const TECNICOS = {
  divulgativo: 'registro divulgativo: explicaciones claras, ejemplos cotidianos, sin fórmulas salvo que sean imprescindibles',
  tecnico: 'registro técnico: precisión conceptual, definiciones formales, terminología específica del área'
};

const CONOCIMIENTOS = {
  nada: 'no conoce nada del tema',
  poco: 'tiene nociones básicas pero dispersas',
  bastante: 'conoce el tema con cierta solidez',
  del_tema: 'domina el tema y busca ángulos nuevos'
};

const ESTILOS = {
  neutro: 'estilo neutro, claro, directo',
  bolano: 'estilo literario cercano a Roberto Bolaño: prosa coloquial, ritmo narrativo, cierta melancolía urbana',
  borges: 'estilo literario cercano a Jorge Luis Borges: prosa ensayística, referencias eruditas, tono especulativo y preciso',
  vargas: 'estilo literario cercano a Mario Vargas Llosa: prosa densa, descriptiva, con atención al detalle y a la construcción de escenas',
  saramago: 'estilo literario cercano a José Saramago: prosa de flujo largo, puntuación mínima, tono reflexivo',
  foucault: 'estilo ensayístico cercano a Michel Foucault: análisis conceptual, atención a las relaciones de poder y a los dispositivos discursivos'
};

function _safe(map, key, fallback) {
  if (!key) return fallback;
  return map[key] || fallback;
}

function _userContextLines(params) {
  const proposito = _safe(PROPÓSITOS, params.proposito, 'aprender sobre el tema');
  const dificultad = _safe(DIFICULTADES, params.dificultad, 'nivel intermedio');
  const tecnico = _safe(TECNICOS, params.tecnico, 'registro divulgativo');
  const conocimiento = _safe(CONOCIMIENTOS, params.conocimiento, 'conocimiento previo variable');
  const estilo = _safe(ESTILOS, params.estilo, 'estilo neutro');
  const atraccion = (params.atraccion || '').trim();
  const referencias = params.referencias === 'si'
    ? 'Al final del documento, agregá una sección "## Referencias" con 2 o 3 fuentes bibliográficas reales (libro, autor, año). No inventes fuentes.'
    : 'No incluyas sección de referencias bibliográficas.';

  return {
    proposito,
    dificultad,
    tecnico,
    conocimiento,
    estilo,
    atraccion,
    referencias
  };
}

/* ─────────────────────────────────────────────────────
   1) OUTLINE — pide los 5 títulos y un resumen corto
───────────────────────────────────────────────────── */
function buildCourseOutlinePrompt(params) {
  const tema = (params.tema || '').trim();
  const ctx = _userContextLines(params);

  const contextoUsuario = [
    `- Nivel de conocimiento del tema: ${ctx.conocimiento}.`,
    ctx.atraccion ? `- Lo que le atrae del tema: ${ctx.atraccion}` : null
  ].filter(Boolean).join('\n');

  return `Sos un bibliotecario digital. Vas a diseñar el PLAN de un curso breve de 5 documentos sobre: "${tema}".

CARACTERÍSTICAS DEL CURSO:
- Objetivo del lector: ${ctx.proposito}.
- Nivel: ${ctx.dificultad}.
- Registro: ${ctx.tecnico}.
- ${ctx.estilo}.

CONTEXTO DEL LECTOR:
${contextoUsuario}

TAREA:
Diseñá los 5 documentos. Cada uno debe tener progresión clara respecto al anterior.
Devolvé EXCLUSIVAMENTE un JSON válido con este formato:

{
  "title": "Título del curso (máximo 8 palabras)",
  "documents": [
    { "order": 1, "title": "Título del documento 1 (máximo 8 palabras)", "summary": "Resumen de 2 a 4 oraciones sobre qué trata" },
    { "order": 2, "title": "...", "summary": "..." },
    { "order": 3, "title": "...", "summary": "..." },
    { "order": 4, "title": "...", "summary": "..." },
    { "order": 5, "title": "...", "summary": "..." }
  ]
}

Sin texto adicional. Solo el JSON.`;
}

/* ─────────────────────────────────────────────────────
   2) DOCUMENTO INDIVIDUAL — 5 llamadas paralelas
───────────────────────────────────────────────────── */
function buildSingleDocumentPrompt(params, outline, index) {
  const tema = (params.tema || '').trim();
  const ctx = _userContextLines(params);

  const cursoTitle = outline.title || tema;
  const doc = outline.documents[index];
  const total = outline.documents.length;
  const isFirst = index === 0;

  const prevTitles = outline.documents
    .slice(0, index)
    .map(function (d) { return `- Doc ${d.order}: ${d.title}`; })
    .join('\n');

  const nextTitles = outline.documents
    .slice(index + 1)
    .map(function (d) { return `- Doc ${d.order}: ${d.title}`; })
    .join('\n');

  const contextoUsuario = [
    `- Nivel de conocimiento del tema: ${ctx.conocimiento}.`,
    ctx.atraccion ? `- Lo que le atrae del tema: ${ctx.atraccion}` : null
  ].filter(Boolean).join('\n');

  return `Sos un bibliotecario digital. Estás escribiendo el DOCUMENTO ${doc.order} DE ${total} de un curso sobre "${tema}".

CURSO: "${cursoTitle}"
DOCUMENTO A ESCRIBIR:
- Número: ${doc.order} de ${total}
- Título: "${doc.title}"
- Resumen previsto: ${doc.summary}
${prevTitles ? `\nDOCUMENTOS PREVIOS DEL CURSO (ya cubiertos, no repetir contenido):\n${prevTitles}` : ''}
${nextTitles ? `\nDOCUMENTOS POSTERIORES (todavía no escritos, podés dejar hilos abiertos):\n${nextTitles}` : ''}

CARACTERÍSTICAS DEL LECTOR:
- Objetivo: ${ctx.proposito}.
- Nivel: ${ctx.dificultad}.
- Registro: ${ctx.tecnico}.
- ${ctx.estilo}.
- ${ctx.conocimiento}.
${ctx.atraccion ? `- Lo que le atrae del tema: ${ctx.atraccion}` : ''}
${isFirst ? '- Este es el PRIMER documento: partí desde lo más básico.' : ''}

TAREA:
Escribí el contenido COMPLETO de este documento, con una EXTENSIÓN DE 1000 A 1200 PALABRAS (equivalente a 5 minutos de lectura pausada para una persona adulta). No resumas ni abrevies: desarrollá cada idea con profundidad, ejemplos concretos, matices y contexto.

FORMATO DEL CONTENIDO (Markdown puro, sin HTML):

## ${doc.title}

[contenido aquí: párrafos separados por línea en blanco, **negrita** para destacar conceptos clave, subtítulos internos con ### si ayudan]

REGLAS CRÍTICAS DE EXTENSIÓN:
1. La extensión DEBE SER DE 1000 A 1200 PALABRAS. Esto es obligatorio, no una sugerencia.
2. Un documento de 500 palabras NO SIRVE. Contá las palabras: si al terminar tenés menos de 1000, seguí desarrollando con más ejemplos, más comparaciones, más contexto histórico, más matices.
3. No resumas ni abrevies. Desarrollá cada idea con profundidad: ejemplos concretos, anécdotas, comparaciones, contexto.
4. No repitas contenido de otros documentos del curso.

REGLAS DE FORMATO:
5. Empezá directamente con: ## ${doc.title}
6. NO uses etiquetas HTML como <div>. Solo Markdown puro.
7. Español chileno neutro: tuteo, sin voseo. Sin modismos regionales.
8. No inventes datos, cifras, fechas ni fuentes. Si dudás de un dato, reformulalo sin cifra exacta.
${ctx.referencias}

DEVOLVÉ EXCLUSIVAMENTE un JSON válido con este formato:

{
  "order": ${doc.order},
  "title": "${doc.title.replace(/"/g, '\\"')}",
  "content_md": "## ${doc.title.replace(/"/g, '\\"')}\\n\\n[contenido completo de 1000 a 1200 palabras]",
  "summary": "${doc.summary.replace(/"/g, '\\"')}",
  "ideas_fuerza": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"]
}

Sin texto adicional. Solo el JSON.`;
}

module.exports = { buildCourseOutlinePrompt, buildSingleDocumentPrompt };
