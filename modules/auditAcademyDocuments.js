// modules/auditAcademyDocuments.js
//
// Proceso de generación para SOPHIA Academia v1. Es la ÚNICA vía por la
// que se dispara generateAcademyAnalysis() (además de una invocación
// administrativa directa equivalente) — el endpoint HTTP nunca genera,
// solo consulta.
//
// No modifica audit-documents.js. Es un archivo nuevo e independiente,
// con su propia colección de caché (sophia_academy_cache), aunque
// localiza los mismos .md que el proceso general.

const fs = require('fs');
const path = require('path');

const { generateAcademyAnalysis, ACADEMY_PROTOCOL_VERSION } = require('./sophiaAcademyPipeline');
const { computeContentHash, getCachedAcademyResult } = require('./sophiaAcademyCache');
const SophiaEngineV4 = require('../assets/js/sophiaEngineV4');

const CONTENT_DIR = path.join(__dirname, '..', 'pages/academy/content');

/**
 * Recorre todos los .md de Academia y genera (o recupera de caché) el
 * análisis de cada uno. Incremental: si docId + content_hash +
 * academy_protocol_version + sophia_engine_version ya coinciden con lo
 * guardado, salta el documento sin llamar a Gemini.
 *
 * @param {Object} [opts]
 * @param {string} [opts.onlyFile] - si se pasa, procesa solo ese archivo (para pruebas puntuales, ej. "01-El-Modelo.md")
 * @returns {Promise<Array>} resumen por archivo: { file, status, skipped, budget_used, caracteres }
 */
async function auditAcademyDocuments(opts = {}) {
  const sophia_engine_version = SophiaEngineV4.version || "4.0";

  let files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (opts.onlyFile) {
    files = files.filter(f => f === opts.onlyFile);
    if (files.length === 0) {
      throw new Error(`No se encontró "${opts.onlyFile}" en ${CONTENT_DIR}`);
    }
  }

  const resumen = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const text = fs.readFileSync(filePath, 'utf8');
    const content_hash = computeContentHash(text);

    const cached = await getCachedAcademyResult({
      docId: file,
      content_hash,
      academy_protocol_version: ACADEMY_PROTOCOL_VERSION,
      sophia_engine_version
    });

    if (cached) {
      console.log(`⏩ [CACHE HIT - OMITIDO] ${file}`);
      resumen.push({
        file,
        status: cached.result.status,
        skipped: true,
        budget_used: cached.result.budget_used,
        caracteres: text.length
      });
      continue;
    }

    console.log(`▶️  [PROCESANDO] ${file} (${text.length} caracteres)`);
    const inicio = Date.now();
    try {
      const result = await generateAcademyAnalysis({ docId: file, text });
      const duracionMs = Date.now() - inicio;
      console.log(
        `✅ [${result.status.toUpperCase()}] ${file} — ` +
        `evidencias: ${(result.local && result.local.evidencias ? result.local.evidencias.length : 0)}, ` +
        `semantic_review: ${result.budget_used.semantic_review}, ` +
        `claims seleccionados: ${result.budget_used.factual_verification}, ` +
        `gemini_review: ${result.budget_used.gemini_review}, ` +
        `tiempo: ${duracionMs}ms`
      );
      if (result.etapas_fallidas && result.etapas_fallidas.length > 0) {
        console.log(`   ⚠️  Etapas fallidas: ${result.etapas_fallidas.join(', ')}`);
      }
      resumen.push({
        file,
        status: result.status,
        skipped: false,
        budget_used: result.budget_used,
        caracteres: text.length,
        duracionMs
      });
    } catch (err) {
      console.error(`❌ [ERROR] ${file}:`, err.message);
      resumen.push({ file, status: 'failed', skipped: false, error: err.message, caracteres: text.length });
    }
  }

  return resumen;
}

if (require.main === module) {
  const onlyFile = process.argv[2] || null;
  auditAcademyDocuments(onlyFile ? { onlyFile } : {})
    .then((resumen) => {
      console.log('\n─── Resumen ───');
      console.table(resumen.map(r => ({
        archivo: r.file,
        estado: r.status,
        omitido: r.skipped,
        semantic: r.budget_used ? r.budget_used.semantic_review : '-',
        factual: r.budget_used ? r.budget_used.factual_verification : '-',
        gemini: r.budget_used ? r.budget_used.gemini_review : '-'
      })));
      process.exit(0);
    })
    .catch(err => {
      console.error('Error fatal en auditAcademyDocuments:', err);
      process.exit(1);
    });
}

module.exports = { auditAcademyDocuments };

