#!/usr/bin/env node
/**
 * enhance_aliases.js
 * 
 * Analiza sophia_protocol.yaml, extrae términos clave de los criterios
 * y los añade como aliases a los átomos existentes.
 * 
 * Uso: node enhance_aliases.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── CONFIGURACIÓN ─────────────────────────────────────
const YAML_FILE = path.join(__dirname, 'protocol', 'sophia_protocol.yaml');

// ─── CARGA DEL YAML ────────────────────────────────────
const doc = yaml.load(fs.readFileSync(YAML_FILE, 'utf8'));

// ─── DICCIONARIO DE CONCEPTOS → ÁTOMOS ──────────────
// Mapea conceptos comunes a átomos existentes
const CONCEPT_MAP = {
  'proposiciones': 'proposiciones',
  'resolucion': 'resolucion',
  'estabilidad': 'estabilidad',
  'significado': 'significado',
  'conceptos': 'conceptos',
  'eleccion': 'eleccion',
  'binaria': 'binaria',
  'multidimensional': 'multidimensional',
  'premisas': 'premisas',
  'conclusion': 'conclusion',
  'magnitud': 'magnitud',
  'correlacion': 'correlacion',
  'causalidad': 'causalidad',
  'anecdota': 'anecdota',
  'regla': 'regla',
  'circularidad': 'circularidad',
  'asuncion': 'asuncion',
  'origen': 'origen',
  'verificabilidad': 'verificabilidad',
  'datos': 'datos',
  'matiz': 'matiz',
  'certeza': 'certeza',
  'hecho': 'hecho',
  'juicio': 'juicio',
  'variables': 'variables',
  'entorno': 'entorno',
  'argumento': 'argumento',
  'contrario': 'contrario',
  'adjetivos': 'adjetivos',
  'intencion': 'intencion',
  'identidad': 'identidad',
  'ambiguas': 'ambiguas',
  'tangente': 'tangente',
  'nucleo': 'nucleo',
  'critica': 'critica',
  'propuesta': 'propuesta',
  'estandar': 'estandar',
  'prueba': 'prueba',
  'pluralidad': 'pluralidad',
  'evidencia': 'evidencia',
  'refutadora': 'refutadora',
  'persistencia': 'estabilidad',
  'definibilidad': 'definibilidad',
  'operacionalizacion': 'operacionalizacion',
  'vaguedad': 'vaguedad',
  'referencialidad': 'referencialidad',
  'hipotesis': 'hipotesis',
  'reencuadre': 'reencuadre',
  'apertura': 'apertura',
  'catastrofizacion': 'catastrofizacion',
  'absolutizacion': 'absolutizacion',
  'dramatizacion': 'dramatizacion',
  'apelacion': 'apelacion',
  'carga': 'carga',
  'modalidad': 'modalidad',
  'confianza': 'confianza',
  'alcance': 'alcance',
  'condicionalidad': 'condicionalidad'
};

// ─── PROCESAR CADA CRITERIO ───────────────────────────
let totalFaltantes = 0;
let totalCriterios = 0;

for (const dim of doc.dimensions) {
  for (const crit of dim.criteria) {
    totalCriterios++;
    // Texto a analizar (definición del constructo + definición del criterio)
    const texto = (crit.construct?.definition || '') + ' ' + (crit.definition || '');
    const atomos = crit.atoms.map(a => a.id);
    const conceptosFaltantes = [];

    // Buscar conceptos en el texto que no estén cubiertos
    for (const [concepto, atomoId] of Object.entries(CONCEPT_MAP)) {
      if (texto.toLowerCase().includes(concepto.toLowerCase())) {
        // Verificar si el concepto ya está cubierto por un átomo o alias
        const atomoExistente = crit.atoms.find(a => a.id === atomoId);
        const cubierto = atomoExistente && (
          atomoExistente.id === atomoId ||
          (atomoExistente.aliases && atomoExistente.aliases.some(a => a.toLowerCase() === concepto.toLowerCase()))
        );
        if (!cubierto) {
          conceptosFaltantes.push({ concepto, atomoId });
        }
      }
    }

    if (conceptosFaltantes.length > 0) {
      console.log(`\n📌 Criterio ${crit.id} (${crit.name})`);
      console.log(`   Conceptos faltantes: ${conceptosFaltantes.map(c => c.concepto).join(', ')}`);
      
      // Añadir aliases a los átomos correspondientes
      for (const { concepto, atomoId } of conceptosFaltantes) {
        const atomo = crit.atoms.find(a => a.id === atomoId);
        if (atomo) {
          if (!atomo.aliases) atomo.aliases = [];
          if (!atomo.aliases.includes(concepto)) {
            atomo.aliases.push(concepto);
            console.log(`   ✅ Añadido alias "${concepto}" a átomo "${atomoId}"`);
            totalFaltantes++;
          }
        } else {
          console.log(`   ⚠️  No se encontró átomo "${atomoId}" para el concepto "${concepto}"`);
        }
      }
    }
  }
}

// ─── GUARDAR YAML ──────────────────────────────────────
if (totalFaltantes > 0) {
  fs.writeFileSync(YAML_FILE, yaml.dump(doc, { indent: 2 }));
  console.log(`\n✅ Se añadieron ${totalFaltantes} aliases.`);
  console.log(`📄 Archivo actualizado: ${YAML_FILE}`);
} else {
  console.log('\n✅ No se encontraron conceptos faltantes.');
}

console.log(`📊 Criterios procesados: ${totalCriterios}`);
console.log(`🔍 Total de conceptos mapeados: ${Object.keys(CONCEPT_MAP).length}`);
