#!/usr/bin/env node
/**
 * generate_yaml.js
 * 
 * Extrae PROTOCOL desde sophia.js y genera sophia_protocol.yaml
 * en la carpeta protocol/.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── CONFIGURACIÓN ─────────────────────────────────────
const SOPHIA_JS = path.join(__dirname, 'sophia.js');
const OUTPUT_DIR = path.join(__dirname, 'protocol');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sophia_protocol.yaml');

// ─── CARGA Y EXTRACCIÓN ──────────────────────────────
function loadSophiaProtocol() {
  const source = fs.readFileSync(SOPHIA_JS, 'utf8');
  // Buscar la definición de PROTOCOL
  const match = source.match(/const\s+PROTOCOL\s*=\s*({[\s\S]*?});/);
  if (!match) throw new Error('No se encontró PROTOCOL en sophia.js');
  // Evaluar el objeto (usamos Function constructor para evitar eval)
  const protocol = new Function(`return (${match[1]})`)();
  return protocol;
}

// ─── CONVERSIÓN A YAML ──────────────────────────────
function convertToYAML(protocol) {
  // Estructura esperada por el auditor
  const yamlStructure = {
    version: protocol.version || '0.92-beta',
    metadata: {
      total_atoms: 0,
      total_criteria: 0,
      total_dimensions: protocol.fases.length,
      description: 'Ontología pública de la deliberación'
    },
    aggregation: {
      dimensions: protocol.fases.map((f, i) => ({
        id: f.id,
        name: f.nombre,
        weight: 25  // peso por defecto, se puede ajustar
      })),
      criteria_weight: 25,
      max_penalty_per_criterion: 25
    },
    severity_levels: [
      { level: 0, value: 0, label: 'Sin infracción' },
      { level: 1, value: 5, label: 'Leve' },
      { level: 2, value: 12.5, label: 'Grave' },
      { level: 3, value: 25, label: 'Crítico' }
    ],
    dimensions: [],
    meta_rules: [] // por ahora vacío, se puede completar después
  };

  // Procesar cada fase
  let totalAtoms = 0;
  let totalCriteria = 0;
  for (const fase of protocol.fases) {
    const dim = {
      id: fase.id,
      name: fase.nombre,
      description: fase.descripcion,
      weight: 25,
      criteria: []
    };
    for (const crit of fase.criterios) {
      totalCriteria++;
      const c = {
        id: crit.id,
        name: crit.nombre,
        construct: {
          name: crit.constructo || 'Sin constructo',
          definition: crit.definicion || '',
          version: '1.0',
          aliases: []
        },
        atoms: [],
        meta_rules_applicable: crit.meta_reglas_aplicables || [],
        severity_level: 2  // por defecto, se puede inferir
      };
      // Procesar átomos
      for (const atom of crit.atomos) {
        totalAtoms++;
        c.atoms.push({
          id: atom.id,
          name: atom.id,
          type: 'Entidad', // tipo por defecto, se puede mejorar
          definition: atom.definicion || '',
          version: atom.version || '1.0',
          patterns: atom.patrones || [],
          aliases: []
        });
      }
      dim.criteria.push(c);
    }
    yamlStructure.dimensions.push(dim);
  }

  // Actualizar metadata
  yamlStructure.metadata.total_atoms = totalAtoms;
  yamlStructure.metadata.total_criteria = totalCriteria;

  return yamlStructure;
}

// ─── MAIN ──────────────────────────────────────────────
function main() {
  console.log('🔧 Generando sophia_protocol.yaml desde sophia.js...');
  try {
    const protocol = loadSophiaProtocol();
    const yamlData = convertToYAML(protocol);
    // Crear directorio si no existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    const yamlString = yaml.dump(yamlData, { indent: 2 });
    fs.writeFileSync(OUTPUT_FILE, yamlString, 'utf8');
    console.log(`✅ Protocolo guardado en ${OUTPUT_FILE}`);
    console.log(`📊 Dimensiones: ${yamlData.dimensions.length}`);
    console.log(`📊 Criterios: ${yamlData.metadata.total_criteria}`);
    console.log(`📊 Átomos: ${yamlData.metadata.total_atoms}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
