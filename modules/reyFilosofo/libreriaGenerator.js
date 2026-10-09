/* ============================================================
   REY FILÓSOFO · LIBRERÍA PERSONAL · GENERADOR
   Estrategia: 1 llamada para outline + 5 llamadas en paralelo
   (una por documento). Garantiza extensión larga por doc.
============================================================ */

'use strict';

const { askVertex } = require('../vertexClient');
const {
  buildCourseOutlinePrompt,
  buildSingleDocumentPrompt
} = require('./libreriaPrompt');

const MODEL_OUTLINE = 'gemini-flash-lite-latest';
const MODEL_DOC = 'gemini-flash-lite-latest';
const TIMEOUT_OUTLINE_MS = 15000;
const TIMEOUT_DOC_MS = 50000;

function _extractJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Respuesta vacía de Gemini');
  }
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '');
    clean = clean.replace(/```\s*$/, '');
    clean = clean.trim();
  }
  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error('No se encontró JSON en la respuesta de Gemini');
  }
  try {
    return JSON.parse(clean.slice(first, last + 1));
  } catch (e) {
    throw new Error('JSON inválido en respuesta de Gemini: ' + e.message);
  }
}


async function _getOutline(params) {
  const prompt = buildCourseOutlinePrompt(params);
  const res = await askVertex(
    prompt,
    MODEL_OUTLINE,
    TIMEOUT_OUTLINE_MS,
    { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' },
    'reyfilosofo_libreria_outline'
  );
  const text = typeof res === 'string' ? res : (res && res.text ? res.text : '');
  const parsed = _extractJson(text);

  if (!parsed || !Array.isArray(parsed.documents) || parsed.documents.length !== 5) {
    throw new Error('Outline inválido: se esperaban 5 documentos');
  }
  return parsed;
}

async function _getSingleDocument(params, outline, index) {
  const prompt = buildSingleDocumentPrompt(params, outline, index);
  const res = await askVertex(
    prompt,
    MODEL_DOC,
    TIMEOUT_DOC_MS,
    { temperature: 0.85, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    'reyfilosofo_libreria_doc_' + (index + 1)
  );
  const text = typeof res === 'string' ? res : (res && res.text ? res.text : '');
  const parsed = _extractJson(text);

  const title = String(parsed.title || outline.documents[index].title).trim();
  let content = String(parsed.content_md || '').trim();
  // Si por alguna razón Gemini incluyó el wrapper, lo quitamos.
  content = content.replace(/^<div align="justify">\s*/i, '').replace(/\s*<\/div>\s*$/i, '');
  const summary = String(parsed.summary || outline.documents[index].summary).trim();
  const ideas = Array.isArray(parsed.ideas_fuerza)
    ? parsed.ideas_fuerza.map(function (x) { return String(x).trim(); }).filter(Boolean)
    : [];

  return {
    order: index + 1,
    title: title,
    content_md: content,
    summary: summary,
    ideas_fuerza: ideas
  };
}

function _buildMarkdownFile(params, doc, courseTitle) {
  const safe = function (s) {
    return String(s || '').replace(/"/g, '\\"');
  };
  const tags = ['personal', 'biblioteca-personal', 'rey-filosofo'];
  if (params && params.tema) {
    const temaTag = String(params.tema)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (temaTag) tags.push(temaTag);
  }
  const fm = [
    '---',
    'library: "Biblioteca personal"',
    'folder: "' + safe(courseTitle) + '"',
    'title: "' + safe(doc.title) + '"',
    'tags:',
    tags.map(function (tg) { return '- ' + tg; }).join('\n'),
    '---',
    ''
  ].join('\n');
  return fm + '\n' + doc.content_md;
}

async function generateCourse(params) {
  console.log('[LIBRERIA] Generando curso sobre: ' + params.tema);

  // 1) Outline
  const outline = await _getOutline(params);
  console.log('[LIBRERIA] Outline OK, 5 títulos definidos');

  // 2) 5 documentos en paralelo
  const promises = [0, 1, 2, 3, 4].map(function (i) {
    return _getSingleDocument(params, outline, i);
  });

  const documents = await Promise.all(promises);
  documents.sort(function (a, b) { return a.order - b.order; });

  // 3) Log de largos para diagnóstico
  documents.forEach(function (d) {
    const words = d.content_md.split(/\s+/).length;
    console.log('[LIBRERIA] doc ' + d.order + ' title="' + d.title + '" chars=' + d.content_md.length + ' words~=' + words);
  });

  // 4) Validación
  for (const d of documents) {
    if (!d.content_md || d.content_md.length < 2000) {
      console.warn('[LIBRERIA] doc ' + d.order + ' quedó corto (' + d.content_md.length + ' chars)');
    }
  }

  const courseTitle = outline.title || params.tema;
  const withFrontmatter = documents.map(function (doc) {
    return {
      order: doc.order,
      title: doc.title,
      content_md: _buildMarkdownFile(params, doc, courseTitle),
      summary: doc.summary,
      ideas_fuerza: doc.ideas_fuerza
    };
  });

  console.log('[LIBRERIA] Curso OK: ' + withFrontmatter.length + ' documentos');

  return {
    title: courseTitle,
    documents: withFrontmatter,
    model: MODEL_DOC
  };
}

module.exports = { generateCourse };
