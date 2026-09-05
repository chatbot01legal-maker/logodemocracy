// modules/sophiaReportSchema.js  
// Contrato oficial de salida del sistema SOPHIA v4.0  
//  
// Principio arquitectónico: preservar la independencia epistemológica de cada capa.  
// - local: resultado del motor determinista (Sophia Engine V4)  
// - semantic_review: auditoría contextual externa (semanticReview.js)  
// - confiabilidad_factual: verificación de evidencia (evidencePipeline.js)  
// - gemini_review: interpretación semántica global (sophiaGeminiReview.js)  
//  
// Ninguna capa tiene autoridad para modificar otra.  

const crypto = require('crypto');

const SCHEMA_VERSION = "1.0";
const PROTOCOL_VERSION = "4.0";  

const AUTHORITY_MAP = {
  local: "deterministic",
  semantic_review: "audit",
  confiabilidad_factual: "verification",
  gemini_review: "interpretation"
};

// ─── Helpers ────────────────────────────────────────────  

/**  
 * Verifica si un valor es un array.  
 * @param {*} val  
 * @returns {boolean}  
 */  
function isArray(val) {  
  return Array.isArray(val);  
}  

/**  
 * Verifica si un valor es un objeto plano (no array, no null).  
 * @param {*} val  
 * @returns {boolean}  
 */  
function isObject(val) {  
  return val !== null && typeof val === 'object' && !isArray(val);  
}  

// ─── 1. createReport ────────────────────────────────────  

/**  
 * Construye el reporte final SOPHIA a partir de los resultados de cada capa.  
 * Exige obligatoriamente localResult y genera un report_id único (UUID v4).  
 *  
 * @param {Object} params  
 * @param {Object} params.localResult       - Resultado del motor Sophia Engine V4 (Obligatorio)  
 * @param {Array}  [params.semanticReview]   - Resultado del revisor semántico  
 * @param {Object} [params.confiabilidadFactual] - Resultado del fact checker  
 * @param {Object} [params.geminiReview]     - Resultado de Gemini Review  
 * @param {Object} [params.versions]         - Versiones de los módulos utilizados  
 * @param {string} [params.text]             - Texto original (para calcular density)  
 * @returns {Object} Reporte SOPHIA estructurado  
 */  
function createReport({  
  localResult,  
  semanticReview,  
  confiabilidadFactual,  
  geminiReview,  
  versions = {},  
  text = ''  
}) {  
  if (!isObject(localResult)) {
    throw new Error("createReport requiere obligatoriamente localResult.");
  }

  // ── Capa local (motor determinista) ──  
  const local = {  
    engine: "SophiaEngineV4",  
      
    fases: localResult.fases ?? [],  
    evidencias: localResult.evidencias ?? [],  
    riesgo: localResult.riesgo ?? "Normal",  
    naturaleza_documental: localResult.naturaleza_documental ?? "No determinada",  
    confianza_clasificacion: localResult.confianza_clasificacion ?? 0,  
    hibrido: localResult.hibrido ?? false,  
    naturalezas_secundarias: localResult.naturalezas_secundarias ?? []  
  };  

  // ── Capa de revisión semántica ──  
  const semanticReviewNormalized = isArray(semanticReview) ? semanticReview : [];  

  // ── Capa de confiabilidad factual ──  
  const confiabilidadFactualNormalized = isObject(confiabilidadFactual)  
    ? confiabilidadFactual  
    : {  
        claims_verificados: [],  
        claims_refutados: [],  
        claims_en_conflicto: [],  
        claims_evidencia_insuficiente: [],  
        claims_no_aplicables: []  
      };  

  // ── Capa Gemini ──  
  const geminiReviewNormalized = isObject(geminiReview)  
    ? geminiReview  
    : null;  

  // ── Metadatos ──  
  const wordCount = text ? text.split(/\s+/).length : 0;  
  const evidenceCount = local.evidencias.length;  
  const evidenceDensity = wordCount > 0 ? evidenceCount / wordCount : 0;  

  const metadata = {  
    module_versions: {  
      protocol: PROTOCOL_VERSION,  
      schema: SCHEMA_VERSION,
      engine: versions.engine || versions.sophiaEngine || "4.0",  
      semantic_review: versions.semantic_review || versions.semanticReview || "2.0",  
      fact_checker: versions.fact_checker || versions.factChecker || "1.0",  
      gemini_review: versions.gemini_review || versions.geminiReview || "1.0"  
    },  
    authority_map: AUTHORITY_MAP,
    evidence_density: evidenceDensity  
  };  

  return {  
    report_id: crypto.randomUUID(),
    schema_version: SCHEMA_VERSION,
    protocol_version: PROTOCOL_VERSION,  
    evaluated_at: new Date().toISOString(),  
    local,  
    semantic_review: semanticReviewNormalized,  
    confiabilidad_factual: confiabilidadFactualNormalized,  
    gemini_review: geminiReviewNormalized,  
    metadata  
  };  
}  

// ─── 2. validateReport ──────────────────────────────────  

/**  
 * Valida que un reporte cumpla el esquema oficial SOPHIA.  
 *  
 * @param {Object} report - Reporte a validar  
 * @returns {{ valid: boolean, errors: string[] }}  
 */  
function validateReport(report) {  
  const errors = [];  

  if (!isObject(report)) {  
    return { valid: false, errors: ['El reporte debe ser un objeto'] };  
  }  

  // Campos raíz obligatorios  
  const requiredRoot = [  
    'report_id',
    'schema_version',
    'protocol_version',  
    'evaluated_at',  
    'local',  
    'semantic_review',  
    'confiabilidad_factual',  
    'gemini_review',  
    'metadata'  
  ];  

  for (const field of requiredRoot) {  
    if (!(field in report)) {  
      errors.push(`Falta campo raíz obligatorio: ${field}`);  
    }  
  }  

  if (report.report_id && typeof report.report_id !== 'string') {
    errors.push('report_id debe ser un string (UUID)');
  }

  // Validar fecha ISO
  if (report.evaluated_at && Number.isNaN(Date.parse(report.evaluated_at))) {
    errors.push('evaluated_at debe ser una cadena ISO Date válida');
  }

  // Validar 'local'  
  if (isObject(report.local)) {  
    const requiredLocal = ['evidencias', 'fases'];  
    for (const field of requiredLocal) {  
      if (!(field in report.local)) {  
        errors.push(`Falta local.${field}`);  
      }  
    }  

    if (!isArray(report.local.evidencias)) {  
      errors.push('local.evidencias debe ser un array');  
    }  
    if (!isArray(report.local.fases)) {  
      errors.push('local.fases debe ser un array');  
    }  
  } else {  
    errors.push('local debe ser un objeto');  
  }  

  // Validar 'semantic_review'  
  if (!isArray(report.semantic_review)) {  
    errors.push('semantic_review debe ser un array');  
  }  

  // Validar 'confiabilidad_factual'  
  if (!isObject(report.confiabilidad_factual)) {  
    errors.push('confiabilidad_factual debe ser un objeto');  
  }  

  // Validar 'metadata'  
  if (isObject(report.metadata)) {  
    if (!isObject(report.metadata.module_versions)) {  
      errors.push('metadata.module_versions debe ser un objeto');  
    }  
    if (!isObject(report.metadata.authority_map)) {
      errors.push('metadata.authority_map debe ser un objeto');
    }
  } else {  
    errors.push('metadata debe ser un objeto');  
  }  

  return {  
    valid: errors.length === 0,  
    errors  
  };  
}  

// ─── 3. normalizeReport ─────────────────────────────────  

/**  
 * Normaliza un reporte, completando estructuras faltantes sin modificar  
 * ni alterar valores calculados por el motor.  
 *  
 * @param {Object} report - Reporte a normalizar  
 * @returns {Object} Reporte normalizado  
 */  
function normalizeReport(report) {  
  if (!isObject(report)) {  
    return {
      report_id: crypto.randomUUID(),
      schema_version: SCHEMA_VERSION,
      protocol_version: PROTOCOL_VERSION,
      evaluated_at: new Date().toISOString(),
      local: {
        engine: "SophiaEngineV4",
        fases: [],
        evidencias: [],
        riesgo: "Normal",
        naturaleza_documental: "No determinada",
        confianza_clasificacion: 0,
        hibrido: false,
        naturalezas_secundarias: []
      },
      semantic_review: [],
      confiabilidad_factual: {
        claims_verificados: [],
        claims_refutados: [],
        claims_en_conflicto: [],
        claims_evidencia_insuficiente: [],
        claims_no_aplicables: []
      },
      gemini_review: null,
      metadata: {
        module_versions: {
          protocol: PROTOCOL_VERSION,
          schema: SCHEMA_VERSION,
          engine: "4.0",
          semantic_review: "2.0",
          fact_checker: "1.0",
          gemini_review: "1.0"
        },
        authority_map: AUTHORITY_MAP,
        evidence_density: 0
      }
    };
  }  

  const normalized = { ...report };  

  // Asegurar identificador y versión
  normalized.report_id = normalized.report_id || crypto.randomUUID();
  normalized.schema_version = normalized.schema_version || SCHEMA_VERSION;
  normalized.protocol_version = normalized.protocol_version || PROTOCOL_VERSION;
  
  if (!normalized.evaluated_at || Number.isNaN(Date.parse(normalized.evaluated_at))) {  
    normalized.evaluated_at = new Date().toISOString();  
  }  

  // Normalizar 'local' asegurando estructura pero respetando los valores originales exactos
  if (!isObject(normalized.local)) {  
    normalized.local = {};  
  }  
  normalized.local.engine = normalized.local.engine || "SophiaEngineV4";
  normalized.local.evidencias = isArray(normalized.local.evidencias) ? normalized.local.evidencias : [];  
  normalized.local.fases = isArray(normalized.local.fases) ? normalized.local.fases : [];  
  normalized.local.riesgo = normalized.local.riesgo ?? "Normal";  
  normalized.local.naturaleza_documental = normalized.local.naturaleza_documental ?? "No determinada";  
  normalized.local.confianza_clasificacion = normalized.local.confianza_clasificacion ?? 0;  
  normalized.local.hibrido = normalized.local.hibrido ?? false;  
  normalized.local.naturalezas_secundarias = isArray(normalized.local.naturalezas_secundarias)  
    ? normalized.local.naturalezas_secundarias  
    : [];  

  // Normalizar 'semantic_review'  
  if (!isArray(normalized.semantic_review)) {  
    normalized.semantic_review = [];  
  }  

  // Normalizar 'confiabilidad_factual'  
  if (!isObject(normalized.confiabilidad_factual)) {  
    normalized.confiabilidad_factual = {  
      claims_verificados: [],  
      claims_refutados: [],  
      claims_en_conflicto: [],  
      claims_evidencia_insuficiente: [],  
      claims_no_aplicables: []  
    };  
  }  

  // Normalizar 'gemini_review'  
  if (normalized.gemini_review === undefined) {  
    normalized.gemini_review = null;  
  }  

  // Normalizar 'metadata'  
  if (!isObject(normalized.metadata)) {  
    normalized.metadata = {};  
  }  
  if (!isObject(normalized.metadata.module_versions)) {  
    normalized.metadata.module_versions = {
      protocol: PROTOCOL_VERSION,
      schema: SCHEMA_VERSION,
      engine: "4.0",
      semantic_review: "2.0",
      fact_checker: "1.0",
      gemini_review: "1.0"
    };  
  }  
  normalized.metadata.authority_map = normalized.metadata.authority_map || AUTHORITY_MAP;
  if (typeof normalized.metadata.evidence_density !== 'number') {  
    normalized.metadata.evidence_density = 0;  
  }  

  return normalized;  
}  

// ─── API pública ────────────────────────────────────────  

module.exports = {  
  createReport,  
  validateReport,  
  normalizeReport  
};
