
// modules/sophiaAcademyCache.js
//
// Caché específico de SOPHIA Academia. Vive en su propia colección
// ("sophia_academy_cache"), separada del caché general de SOPHIA
// ("sophia_document_cache" en audit-documents.js / app.js). Nunca lee
// ni escribe en la colección general — así que no hay riesgo de que un
// GET de Academia devuelva un resultado generado por el pipeline general,
// ni viceversa.
//
// Reutiliza connect() de modules/database.js tal cual, sin modificarlo.

const crypto = require("crypto");
const { connect } = require("./database");

const COLLECTION_NAME = "sophia_academy_cache";

/**
 * SHA-256 del texto exacto que se evaluó. Se usa como parte de la clave
 * de caché junto con docId, academy_protocol_version y sophia_engine_version.
 * @param {string} text
 * @returns {string} hash hexadecimal
 */
function computeContentHash(text) {
  return crypto.createHash("sha256").update(text || "", "utf8").digest("hex");
}

/**
 * Lookup exacto usado durante la generación: solo hay CACHE HIT si
 * coinciden las cuatro claves. Si cambió el documento, o la versión del
 * protocolo de Academia, o la versión de SophiaEngineV4, es un MISS y el
 * pipeline debe regenerar.
 *
 * @param {Object} params
 * @param {string} params.docId
 * @param {string} params.content_hash
 * @param {string} params.academy_protocol_version
 * @param {string} params.sophia_engine_version
 * @returns {Promise<Object|null>} el documento completo de la colección, o null
 */
async function getCachedAcademyResult({ docId, content_hash, academy_protocol_version, sophia_engine_version }) {
  const db = await connect();
  return await db.collection(COLLECTION_NAME).findOne({
    docId,
    content_hash,
    academy_protocol_version,
    sophia_engine_version
  });
}

/**
 * Lookup usado por el endpoint READ-ONLY (GET /api/sophia/academy/analysis/:docId).
 * Deliberadamente NO exige que coincidan content_hash/versión: el
 * endpoint de consulta nunca decide si regenerar, solo devuelve lo que
 * exista. Si no existe nada para ese docId, devuelve null (el endpoint
 * responde 404).
 *
 * @param {string} docId
 * @returns {Promise<Object|null>}
 */
async function getLatestAcademyResultByDocId(docId) {
  const db = await connect();
  return await db.collection(COLLECTION_NAME).findOne({ docId });
}

/**
 * Guarda (o reemplaza) el resultado de Academia para un docId. Un solo
 * documento por docId — la generación siempre sobrescribe la versión
 * anterior de ese mismo docId, nunca acumula histórico.
 *
 * @param {Object} params
 * @param {string} params.docId
 * @param {string} params.content_hash
 * @param {string} params.academy_protocol_version
 * @param {string} params.sophia_engine_version
 * @param {Object} params.result - el objeto de resultado completo (con status, local, semantic_review, etc.)
 */
async function saveAcademyResult({ docId, content_hash, academy_protocol_version, sophia_engine_version, result }) {
  const db = await connect();
  return await db.collection(COLLECTION_NAME).updateOne(
    { docId },
    {
      $set: {
        docId,
        content_hash,
        academy_protocol_version,
        sophia_engine_version,
        result,
        evaluated_at: new Date()
      }
    },
    { upsert: true }
  );
}

module.exports = {
  computeContentHash,
  getCachedAcademyResult,
  getLatestAcademyResultByDocId,
  saveAcademyResult,
  COLLECTION_NAME
};
