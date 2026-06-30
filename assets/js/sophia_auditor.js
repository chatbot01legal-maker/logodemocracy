#!/usr/bin/env node
/**
 * SOPHIA AUDITOR v0.2
 * 
 * Auditor ontológico y epistemológico del estándar SOPHIA.
 * Lee sophia_protocol.yaml, audita consistencia y genera informes.
 * 
 * Uso: node sophia_auditor.js [--yaml protocol/sophia_protocol.yaml]
 * Salida: sophia_audit_report.json y sophia_audit_report.md
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── CONFIGURACIÓN ─────────────────────────────────────
const CONFIG = {
  protocolFile: path.join(__dirname, 'protocol', 'sophia_protocol.yaml'),
  outputJSON: path.join(__dirname, 'sophia_audit_report.json'),
  outputMD: path.join(__dirname, 'sophia_audit_report.md'),
  expectedDimensions: 5,
  expectedCriteriosPorDimension: 4,
  expectedTotalCriterios: 20,
  minDefinitionLength: 30,
};

// ─── CARGA DEL PROTOCOLO ──────────────────────────────
function loadProtocol(filePath) {
  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const protocol = yaml.load(source);
    return protocol;
  } catch (err) {
    console.error(`Error al cargar ${filePath}:`, err.message);
    process.exit(1);
  }
}

// ─── VALIDACIÓN DE ESQUEMA ────────────────────────────
function validateSchema(protocol) {
  const required = ['version', 'dimensions', 'meta_rules', 'severity_levels', 'aggregation'];
  for (const key of required) {
    if (!protocol[key]) {
      throw new Error(`Falta la clave requerida: ${key}`);
    }
  }
  if (!Array.isArray(protocol.dimensions) || protocol.dimensions.length !== CONFIG.expectedDimensions) {
    throw new Error(`Dimensiones: esperadas ${CONFIG.expectedDimensions}, encontradas ${protocol.dimensions.length}`);
  }
  // Verificar que cada dimensión tenga 4 criterios
  for (const dim of protocol.dimensions) {
    if (!Array.isArray(dim.criteria) || dim.criteria.length !== CONFIG.expectedCriteriosPorDimension) {
      throw new Error(`Dimensión ${dim.id} tiene ${dim.criteria?.length || 0} criterios, esperados ${CONFIG.expectedCriteriosPorDimension}`);
    }
  }
  // Verificar meta-reglas
  if (!Array.isArray(protocol.meta_rules)) {
    throw new Error('meta_rules debe ser un array');
  }
  // Verificar severidad
  if (!Array.isArray(protocol.severity_levels)) {
    throw new Error('severity_levels debe ser un array');
  }
  return true;
}

// ─── AUDITORÍAS ────────────────────────────────────────

/**
 * A1: Consistencia de dimensiones
 */
function auditDimensions(protocol) {
  const count = protocol.dimensions.length;
  const expected = CONFIG.expectedDimensions;
  const passed = count === expected;
  return {
    id: 'A1',
    name: 'Consistencia de dimensiones',
    passed,
    expected,
    actual: count,
    message: passed ? 'OK' : `Se esperaban ${expected} dimensiones, pero se encontraron ${count}`,
  };
}

/**
 * A2: Consistencia de criterios
 */
function auditCriteria(protocol) {
  let total = 0;
  const porDimension = {};
  const duplicados = [];
  const ids = new Set();

  protocol.dimensions.forEach(dim => {
    const crits = dim.criteria || [];
    total += crits.length;
    porDimension[dim.id] = crits.length;
    crits.forEach(c => {
      if (ids.has(c.id)) {
        duplicados.push(c.id);
      } else {
        ids.add(c.id);
      }
    });
  });

  const expected = CONFIG.expectedTotalCriterios;
  const passed = total === expected && duplicados.length === 0 &&
    Object.values(porDimension).every(v => v === CONFIG.expectedCriteriosPorDimension);

  return {
    id: 'A2',
    name: 'Consistencia de criterios',
    passed,
    total,
    expected,
    porDimension,
    duplicados,
    message: passed ? 'OK' : `Total: ${total} (esperado ${expected}), duplicados: ${duplicados.join(', ') || 'ninguno'}`,
  };
}

/**
 * A3: Registro único de constructos (ahora con trazabilidad)
 */
function auditConstructs(protocol) {
  const constructos = new Map();
  const repetidos = [];
  const sinDefinicion = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      if (c.construct) {
        const key = c.construct.name;
        if (constructos.has(key)) {
          repetidos.push(key);
        } else {
          constructos.set(key, {
            definition: c.construct.definition || '',
            version: c.construct.version || '1.0',
            aliases: c.construct.aliases || []
          });
        }
        // Verificar definición
        if (!c.construct.definition || c.construct.definition.length < CONFIG.minDefinitionLength) {
          sinDefinicion.push(key);
        }
      } else {
        sinDefinicion.push(c.id);
      }
    });
  });

  const passed = repetidos.length === 0 && sinDefinicion.length === 0;
  return {
    id: 'A3',
    name: 'Registro único de constructos',
    passed,
    total: constructos.size,
    repetidos,
    sinDefinicion,
    message: passed ? 'OK' : `Repetidos: ${repetidos.join(', ') || 'ninguno'}, sin definición: ${sinDefinicion.join(', ') || 'ninguno'}`,
  };
}

/**
 * A4: Definición obligatoria del constructo
 */
function auditConstructDefinitions(protocol) {
  const incompletos = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      if (!c.construct) return;
      const def = c.construct.definition || '';
      const version = c.construct.version || '';
      if (def.length < CONFIG.minDefinitionLength || !version) {
        incompletos.push({
          constructo: c.construct.name,
          definicion: def,
          version: version || 'missing',
          length: def.length,
        });
      }
    });
  });

  const passed = incompletos.length === 0;
  return {
    id: 'A4',
    name: 'Definición obligatoria del constructo',
    passed,
    incompletos,
    message: passed ? 'OK' : `${incompletos.length} constructos incompletos`,
  };
}

/**
 * A5: Consistencia átomo ↔ criterio (usando aliases y ontología)
 */
function auditAtomCriterionConsistency(protocol) {
  const problemas = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      const atomos = (c.atoms || []).map(a => a.id);
      // Obtener todos los términos relevantes del criterio (definición + constructo)
      const texto = (c.construct?.definition || '') + ' ' + (c.definition || '');
      const palabras = texto.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      // Extraer conceptos del constructo y sus aliases
      const conceptos = new Set();
      if (c.construct) {
        conceptos.add(c.construct.name.toLowerCase());
        (c.construct.aliases || []).forEach(a => conceptos.add(a.toLowerCase()));
      }
      // También extraer de la definición palabras clave (heurística)
      const clave = ['proposiciones','resolución','estabilidad','significado','elección','binaria',
        'multidimensional','premisas','conclusión','magnitud','correlación','causalidad',
        'anécdota','regla','circularidad','asunción','origen','verificabilidad','datos',
        'matiz','certeza','hecho','juicio','variables','entorno','argumento','contrario',
        'adjetivos','intención','identidad','ambiguas','tangente','núcleo','crítica',
        'propuesta','estándar','prueba','pluralidad','evidencia','refutadora','persistencia',
        'definibilidad','operacionalización','vaguedad','referencialidad','hipótesis',
        'reencuadre','apertura','catastrofización','absolutización','dramatización',
        'apelación','carga','modalidad','confianza','alcance','condicionalidad'];
      const faltantes = [];
      // Buscar si algún concepto clave no está cubierto por átomos o aliases
      for (const concepto of clave) {
        if (texto.includes(concepto)) {
          const cubierto = atomos.some(id => id === concepto || 
            (c.atoms || []).some(a => (a.aliases || []).map(al => al.toLowerCase()).includes(concepto)));
          if (!cubierto) {
            faltantes.push(concepto);
          }
        }
      }
      if (faltantes.length > 0) {
        problemas.push({ criterio: c.id, faltantes });
      }
    });
  });

  const passed = problemas.length === 0;
  return {
    id: 'A5',
    name: 'Consistencia átomo ↔ criterio',
    passed,
    problemas,
    message: passed ? 'OK' : `${problemas.length} criterios con conceptos sin átomo`,
  };
}

/**
 * A6: Registro global de átomos
 */
function auditAtomCount(protocol) {
  let total = 0;
  const atomos = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {
        total++;
        atomos.push(a.id);
      });
    });
  });

  const declarado = protocol.metadata?.total_atoms || total;
  const passed = total === declarado;

  return {
    id: 'A6',
    name: 'Registro global de átomos',
    passed,
    total,
    declarado,
    atomos: atomos.slice(0, 10),
    message: passed ? 'OK' : `Total: ${total} (declarado ${declarado})`,
  };
}

/**
 * A7: Tipología ontológica (basada en declaración)
 */
function auditOntologicalTypes(protocol) {
  const types = {};
  let total = 0;

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {
        const type = a.type || 'Indefinido';
        types[type] = (types[type] || 0) + 1;
        total++;
      });
    });
  });

  const passed = total > 0 && !types['Indefinido'];
  const dominante = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b);
  const mezclaExcesiva = types[dominante] / total > 0.6;

  return {
    id: 'A7',
    name: 'Tipología ontológica',
    passed,
    types,
    total,
    dominante,
    mezclaExcesiva,
    message: passed ? (mezclaExcesiva ? `Dominancia de "${dominante}" (${Math.round(types[dominante]/total*100)}%)` : 'OK') : 'Hay átomos sin tipo definido',
  };
}

/**
 * A8: Consistencia de definiciones operacionales
 */
function auditOperationalDefinitions(protocol) {
  const incompletos = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {
        if (!a.version || !a.definition || a.definition.length < 20) {
          incompletos.push({
            atomo: a.id,
            version: a.version || 'missing',
            definicion: a.definition || '',
          });
        }
      });
    });
  });

  const passed = incompletos.length === 0;
  return {
    id: 'A8',
    name: 'Consistencia de definiciones operacionales',
    passed,
    incompletos,
    message: passed ? 'OK' : `${incompletos.length} átomos con definiciones incompletas`,
  };
}

/**
 * A9: Cobertura semántica (usando aliases y lematización básica)
 */
function auditSemanticCoverage(protocol) {
  let totalTerminos = 0;
  let cubiertos = 0;

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      const texto = (c.construct?.definition || '') + ' ' + (c.definition || '');
      const palabras = texto.toLowerCase().split(/\s+/);
      const atomos = (c.atoms || []).map(a => ({
        id: a.id,
        aliases: (a.aliases || []).map(al => al.toLowerCase())
      }));
      for (const p of palabras) {
        if (p.length > 4) {
          totalTerminos++;
          const cubierto = atomos.some(a => 
            a.id === p || a.aliases.some(al => p.includes(al) || al.includes(p))
          );
          if (cubierto) cubiertos++;
        }
      }
    });
  });

  const cobertura = totalTerminos > 0 ? Math.round((cubiertos / totalTerminos) * 100) : 0;
  const passed = cobertura >= 80;

  return {
    id: 'A9',
    name: 'Cobertura semántica',
    passed,
    cobertura,
    totalTerminos,
    cubiertos,
    message: passed ? `Cobertura: ${cobertura}%` : `Cobertura baja: ${cobertura}% (mínimo 80%)`,
  };
}

/**
 * A10: Meta-reglas
 */
function auditMetaRules(protocol) {
  const rules = protocol.meta_rules || [];
  const invalidas = [];
  const sinOrigen = [];
  const sinDestino = [];

  rules.forEach(rule => {
    if (!rule.id || !rule.condition || !rule.effect || !rule.justification) {
      invalidas.push(rule.id || 'sin-id');
    }
    if (rule.effect && rule.effect.target_criterion) {
      const destino = rule.effect.target_criterion;
      const existe = protocol.dimensions.some(d => d.criteria.some(c => c.id === destino));
      if (!existe) sinDestino.push(rule.id);
    }
    if (rule.source_criterion) {
      const origen = rule.source_criterion;
      const existe = protocol.dimensions.some(d => d.criteria.some(c => c.id === origen));
      if (!existe) sinOrigen.push(rule.id);
    }
  });

  const passed = invalidas.length === 0 && sinDestino.length === 0 && sinOrigen.length === 0;
  return {
    id: 'A10',
    name: 'Meta-reglas',
    passed,
    total: rules.length,
    invalidas,
    sinDestino,
    sinOrigen,
    message: passed ? 'OK' : `Inválidas: ${invalidas.join(', ') || 'ninguna'}, sin destino: ${sinDestino.join(', ') || 'ninguna'}, sin origen: ${sinOrigen.join(', ') || 'ninguna'}`,
  };
}

/**
 * A11: Agregación matemática
 */
function auditAggregation(protocol) {
  const agg = protocol.aggregation || {};
  const pesos = agg.dimensions || [];
  const criterioPeso = agg.criteria_weight || 25;
  const maxPenalty = agg.max_penalty_per_criterion || 25;

  let problemas = [];
  let sumaPesos = 0;
  for (const dim of pesos) {
    sumaPesos += dim.weight || 0;
  }
  if (Math.abs(sumaPesos - 100) > 0.01) {
    problemas.push(`Suma de pesos de dimensiones = ${sumaPesos}, debería ser 100`);
  }
  // Verificar que cada dimensión tenga 4 criterios y cada criterio peso = criterioPeso
  for (const dim of protocol.dimensions) {
    if ((dim.criteria || []).length !== CONFIG.expectedCriteriosPorDimension) {
      problemas.push(`Dimensión ${dim.id} tiene ${dim.criteria.length} criterios, no 4`);
    }
  }
  const passed = problemas.length === 0;
  return {
    id: 'A11',
    name: 'Agregación matemática',
    passed,
    problemas,
    message: passed ? 'OK' : problemas.join('; '),
  };
}

/**
 * A12: Escalas de severidad
 */
function auditSeverityScales(protocol) {
  const levels = protocol.severity_levels || [];
  const esperados = [0, 1, 2, 3];
  const encontrados = levels.map(l => l.level);
  const faltantes = esperados.filter(e => !encontrados.includes(e));
  const passed = faltantes.length === 0;

  return {
    id: 'A12',
    name: 'Escalas de severidad',
    passed,
    niveles: encontrados,
    faltantes,
    message: passed ? 'OK' : `Faltan niveles: ${faltantes.join(', ')}`,
  };
}

/**
 * A13: Integridad del estándar
 */
function auditStandardIntegrity(protocol) {
  const elementos = {
    dimensiones: protocol.dimensions?.length || 0,
    criterios: 0,
    constructos: 0,
    atomos: 0,
    meta_reglas: protocol.meta_rules?.length || 0,
    versionado: true,
  };

  protocol.dimensions.forEach(d => {
    (d.criteria || []).forEach(c => {
      elementos.criterios++;
      if (c.construct) elementos.constructos++;
      elementos.atomos += (c.atoms || []).length;
    });
  });

  const passed = elementos.dimensiones === CONFIG.expectedDimensions &&
    elementos.criterios === CONFIG.expectedTotalCriterios &&
    elementos.constructos > 0 &&
    elementos.atomos > 0;

  return {
    id: 'A13',
    name: 'Integridad del estándar',
    passed,
    elementos,
    message: passed ? 'OK' : 'Faltan elementos fundamentales',
  };
}

/**
 * A14: Versionado
 */
function auditVersioning(protocol) {
  const sinVersion = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      if (!c.construct?.version) sinVersion.push(`Criterio ${c.id} (constructo)`);
      (c.atoms || []).forEach(a => {
        if (!a.version) sinVersion.push(`Átomo ${a.id}`);
      });
    });
  });

  const passed = sinVersion.length === 0;
  return {
    id: 'A14',
    name: 'Versionado',
    passed,
    sinVersion,
    message: passed ? 'OK' : `${sinVersion.length} objetos sin versión`,
  };
}

/**
 * A15: Objetos huérfanos
 */
function auditOrphanObjects(protocol) {
  const huerfanos = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      if (!c.construct) {
        huerfanos.push(`Criterio ${c.id} sin constructo`);
      }
      (c.atoms || []).forEach(a => {
        if (!a.id) {
          huerfanos.push(`Átomo sin ID en criterio ${c.id}`);
        }
        // Verificar que los patrones sean arrays
        if (a.patterns && !Array.isArray(a.patterns)) {
          huerfanos.push(`Átomo ${a.id} tiene patrones no array`);
        }
      });
    });
  });

  // Verificar meta-reglas huérfanas (dependencias)
  const metaRules = protocol.meta_rules || [];
  for (const rule of metaRules) {
    if (rule.dependencies) {
      for (const dep of rule.dependencies) {
        const existe = protocol.dimensions.some(d => d.criteria.some(c => c.id === dep));
        if (!existe) {
          huerfanos.push(`Meta-regla ${rule.id} depende de criterio inexistente: ${dep}`);
        }
      }
    }
  }

  const passed = huerfanos.length === 0;
  return {
    id: 'A15',
    name: 'Objetos huérfanos',
    passed,
    huerfanos,
    message: passed ? 'OK' : huerfanos.join('; '),
  };
}

/**
 * A16: Consistencia Ontológica Global (trazabilidad completa)
 */
function auditGlobalOntology(protocol) {
  const problemas = [];

  // Verificar que cada átomo pertenezca a un constructo (a través del criterio)
  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      if (!c.construct) {
        problemas.push(`Criterio ${c.id} no tiene constructo`);
      }
      (c.atoms || []).forEach(a => {
        // Verificar que el átomo tenga tipo
        if (!a.type) {
          problemas.push(`Átomo ${a.id} sin tipo ontológico`);
        }
        // Verificar que el átomo tenga definición operacional
        if (!a.definition || a.definition.length < 20) {
          problemas.push(`Átomo ${a.id} con definición operacional insuficiente`);
        }
      });
    });
  });

  // Verificar que cada meta-regla se refiera a criterios existentes
  const metaRules = protocol.meta_rules || [];
  for (const rule of metaRules) {
    if (rule.effect && rule.effect.target_criterion) {
      const target = rule.effect.target_criterion;
      const existe = protocol.dimensions.some(d => d.criteria.some(c => c.id === target));
      if (!existe) {
        problemas.push(`Meta-regla ${rule.id} apunta a criterio inexistente: ${target}`);
      }
    }
    if (rule.source_criterion) {
      const source = rule.source_criterion;
      const existe = protocol.dimensions.some(d => d.criteria.some(c => c.id === source));
      if (!existe) {
        problemas.push(`Meta-regla ${rule.id} usa criterio origen inexistente: ${source}`);
      }
    }
  }

  // Verificar coherencia de pesos
  const agg = protocol.aggregation || {};
  const pesos = agg.dimensions || [];
  let sumaPesos = 0;
  for (const dim of pesos) {
    sumaPesos += dim.weight || 0;
  }
  if (Math.abs(sumaPesos - 100) > 0.01) {
    problemas.push(`Suma de pesos de dimensiones = ${sumaPesos}, debería ser 100`);
  }

  const passed = problemas.length === 0;
  return {
    id: 'A16',
    name: 'Consistencia Ontológica Global',
    passed,
    problemas,
    message: passed ? 'OK' : `${problemas.length} problemas de ontología`,
  };
}

// ─── EJECUCIÓN DE AUDITORÍAS ──────────────────────────

function runAudits(protocol) {
  const resultados = [
    auditDimensions(protocol),
    auditCriteria(protocol),
    auditConstructs(protocol),
    auditConstructDefinitions(protocol),
    auditAtomCriterionConsistency(protocol),
    auditAtomCount(protocol),
    auditOntologicalTypes(protocol),
    auditOperationalDefinitions(protocol),
    auditSemanticCoverage(protocol),
    auditMetaRules(protocol),
    auditAggregation(protocol),
    auditSeverityScales(protocol),
    auditStandardIntegrity(protocol),
    auditVersioning(protocol),
    auditOrphanObjects(protocol),
    auditGlobalOntology(protocol),
  ];

  // Índices de madurez
  const indices = {
    SOEI: Math.round(resultados.filter(r => r.id === 'A16').reduce((acc, r) => acc + (r.passed ? 1 : 0), 0) / 1 * 100),
    SCI: Math.round(resultados.filter(r => r.id.startsWith('A1') || r.id.startsWith('A2')).reduce((acc, r) => acc + (r.passed ? 1 : 0), 0) / 2 * 100),
    SCC: (resultados.find(r => r.id === 'A9')?.cobertura || 0),
    OCI: Math.round(resultados.filter(r => r.id === 'A7' || r.id === 'A15').reduce((acc, r) => acc + (r.passed ? 1 : 0), 0) / 2 * 100),
    ACI: resultados.find(r => r.id === 'A11')?.passed ? 100 : 0,
    MRI: resultados.find(r => r.id === 'A10')?.passed ? 100 : 0,
    Madurez: Math.round(resultados.reduce((acc, r) => acc + (r.passed ? 1 : 0), 0) / resultados.length * 100),
  };

  return { resultados, indices };
}

// ─── GENERACIÓN DE INFORMES ────────────────────────────

function generateJSONReport(resultados, indices, protocol) {
  const report = {
    timestamp: new Date().toISOString(),
    version: '0.2',
    protocol_version: protocol.version || 'desconocida',
    auditorias: resultados.map(r => ({
      id: r.id,
      nombre: r.name,
      pasada: r.passed,
      detalles: r.message,
      ...r,
    })),
    indices,
  };
  return JSON.stringify(report, null, 2);
}

function generateMDReport(resultados, indices, protocol) {
  const lines = [];
  lines.push('# SOPHIA AUDIT REPORT');
  lines.push('');
  lines.push(`**Fecha:** ${new Date().toISOString()}`);
  lines.push(`**Versión del auditor:** 0.2`);
  lines.push(`**Versión del protocolo:** ${protocol.version || 'desconocida'}`);
  lines.push('');
  lines.push('## Índices de madurez');
  lines.push('');
  const idxMap = {
    SOEI: 'Sophia Ontological Exhaustiveness Index',
    SCI: 'Sophia Consistency Index',
    SCC: 'Semantic Coverage Coefficient',
    OCI: 'Ontology Closure Index',
    ACI: 'Aggregation Coherence Index',
    MRI: 'MetaRule Integrity Index',
    Madurez: 'Madurez global del estándar'
  };
  for (const [key, value] of Object.entries(indices)) {
    const label = idxMap[key] || key;
    lines.push(`- **${label}:** ${value}%`);
  }
  lines.push('');
  lines.push('## Auditorías realizadas');
  lines.push('');
  lines.push('| ID | Auditoría | Estado | Detalles |');
  lines.push('|----|-----------|--------|----------|');
  for (const r of resultados) {
    const status = r.passed ? '✅ OK' : '❌ FALLA';
    lines.push(`| ${r.id} | ${r.name} | ${status} | ${r.message} |`);
  }
  lines.push('');
  lines.push('## Inconsistencias detectadas');
  lines.push('');
  const fallos = resultados.filter(r => !r.passed);
  if (fallos.length === 0) {
    lines.push('✅ No se detectaron inconsistencias.');
  } else {
    for (const f of fallos) {
      lines.push(`- **${f.id}:** ${f.message}`);
    }
  }
  lines.push('');
  lines.push('## Recomendaciones');
  lines.push('');
  const prioridadAlta = [];
  const prioridadMedia = [];
  const prioridadBaja = [];

  for (const r of resultados) {
    if (!r.passed) {
      if (r.id.startsWith('A1') || r.id.startsWith('A2') || r.id.startsWith('A13') || r.id.startsWith('A16')) {
        prioridadAlta.push(`${r.id}: ${r.message}`);
      } else if (r.id.startsWith('A3') || r.id.startsWith('A4') || r.id.startsWith('A5') || r.id.startsWith('A10') || r.id.startsWith('A15')) {
        prioridadMedia.push(`${r.id}: ${r.message}`);
      } else {
        prioridadBaja.push(`${r.id}: ${r.message}`);
      }
    }
  }

  if (prioridadAlta.length > 0) {
    lines.push('### Prioridad alta');
    for (const p of prioridadAlta) lines.push(`- ${p}`);
  }
  if (prioridadMedia.length > 0) {
    lines.push('### Prioridad media');
    for (const p of prioridadMedia) lines.push(`- ${p}`);
  }
  if (prioridadBaja.length > 0) {
    lines.push('### Prioridad baja');
    for (const p of prioridadBaja) lines.push(`- ${p}`);
  }
  if (prioridadAlta.length === 0 && prioridadMedia.length === 0 && prioridadBaja.length === 0) {
    lines.push('✅ No se requieren recomendaciones. El estándar es consistente.');
  }

  lines.push('');
  lines.push('## Filosofía del módulo');
  lines.push('');
  lines.push('SOPHIA evalúa artefactos deliberativos.');
  lines.push('SOPHIA también es un artefacto deliberativo.');
  lines.push('Por lo tanto, SOPHIA debe permanecer abierta a evaluación, revisión y mejora.');
  lines.push('El auditor de SOPHIA constituye un mecanismo de transparencia epistemológica de segundo orden.');
  lines.push('En LogoDemocracy, incluso los criterios mediante los cuales evaluamos el conocimiento permanecen sujetos a escrutinio público.');

  return lines.join('\n');
}

// ─── MAIN ──────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const yamlPath = args.includes('--yaml') 
    ? args[args.indexOf('--yaml') + 1] 
    : CONFIG.protocolFile;

  console.log('🔍 SOPHIA AUDITOR v0.2');
  console.log(`📄 Cargando protocolo desde ${yamlPath}...`);

  const protocol = loadProtocol(yamlPath);
  try {
    validateSchema(protocol);
  } catch (err) {
    console.error('❌ Error de validación:', err.message);
    process.exit(1);
  }

  console.log('✅ Protocolo cargado y validado.');
  console.log('🔎 Ejecutando auditorías...');

  const { resultados, indices } = runAudits(protocol);

  console.log('✅ Auditoría completada.');
  console.log(`📊 Índice de madurez: ${indices.Madurez}%`);

  // Guardar JSON
  const jsonReport = generateJSONReport(resultados, indices, protocol);
  fs.writeFileSync(CONFIG.outputJSON, jsonReport, 'utf8');
  console.log(`📄 Informe JSON guardado en ${CONFIG.outputJSON}`);

  // Guardar Markdown
  const mdReport = generateMDReport(resultados, indices, protocol);
  fs.writeFileSync(CONFIG.outputMD, mdReport, 'utf8');
  console.log(`📄 Informe Markdown guardado en ${CONFIG.outputMD}`);

  console.log('✅ Proceso finalizado.');
}

// ─── EJECUCIÓN ──────────────────────────────────────────

if (require.main === module) {
  main();
}

module.exports = { runAudits, generateJSONReport, generateMDReport };
