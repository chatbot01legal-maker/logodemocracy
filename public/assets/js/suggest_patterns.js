#!/usr/bin/env node
/**
 * suggest_patterns.js
 * 
 * Analiza los átomos en sophia.js y sugiere patrones para aquellos que están vacíos.
 * También puede actualizar directamente sophia.js con los nuevos patrones.
 * 
 * Uso: node suggest_patterns.js [--write]
 */

const fs = require('fs');
const path = require('path');

const SOPHIA_JS = path.join(__dirname, 'sophia.js');
const WRITE_MODE = process.argv.includes('--write');

// ─── CARGA SOPHIA.JS ──────────────────────────────────
const source = fs.readFileSync(SOPHIA_JS, 'utf8');

// Extraer PROTOCOL (para inspección)
const match = source.match(/const\s+PROTOCOL\s*=\s*({[\s\S]*?});/);
if (!match) throw new Error('No se encontró PROTOCOL');
const protocol = new Function(`return (${match[1]})`)();

// ─── DICCIONARIO DE SUGERENCIAS ──────────────────────
// Mapea átomos a patrones sugeridos basados en su definición
const SUGGESTIONS = {
  'estabilidad': ['constante', 'fluctuación', 'cambio'],
  'significado': ['definición', 'significa', 'sentido'],
  'conceptos': ['concepto', 'idea', 'noción'],
  'argumento': ['argumento', 'tesis', 'razón'],
  'problema': ['problema', 'cuestión', 'asunto'],
  'enunciado': ['enunciado', 'afirmación', 'declaración'],
  'declarativo': ['declara', 'afirma', 'niega'],
  'lenguaje': ['lenguaje', 'discurso', 'palabras'],
  'identidad': ['identidad', 'afiliación', 'pertenencia'],
  'palabras': ['palabra', 'término', 'vocablo'],
  'nucleo': ['núcleo', 'centro', 'eje'],
  'estandar': ['estándar', 'criterio', 'exigencia'],
  'prueba': ['prueba', 'demostración', 'evidencia'],
  'evidencia': ['evidencia', 'prueba', 'dato'],
  'refutadora': ['refuta', 'desmiente', 'contradice'],
  'origen': ['fuente', 'autor', 'procedencia'],
  'verificabilidad': ['verificable', 'comprobable', 'contrastable'],
  'datos': ['dato', 'cifra', 'número', 'porcentaje'],
  'matiz': ['probablemente', 'posiblemente', 'quizás'],
  'certeza': ['seguro', 'indudable', 'claramente'],
  'hecho': ['hecho', 'realidad', 'objetivo'],
  'juicio': ['bueno', 'malo', 'justo', 'injusto'],
  'variables': ['variable', 'factor', 'condición'],
  'entorno': ['contexto', 'entorno', 'circunstancia'],
  'tangente': ['digresión', 'tangente', 'fuera de tema'],
  'critica': ['crítica', 'objeción', 'pero'],
  'propuesta': ['propongo', 'sugiero', 'alternativa', 'solución'],
  'pluralidad': ['pluralidad', 'diversidad', 'perspectivas'],
  'modalidad_epistemica': ['podría', 'es posible', 'sugiere'],
  'grado_confianza': ['confianza', 'seguridad', 'certeza'],
  'alcance_predictivo': ['a corto plazo', 'en el futuro', 'tendencia'],
  'condicionalidad': ['si', 'en caso de', 'depende de'],
  'hiperbole': ['exagerado', 'enorme', 'infinito'],
  'dramatizacion': ['catástrofe', 'tragedia', 'colapso'],
  'apelacion_moral': ['deber', 'justicia', 'bien común'],
  'carga_afectiva': ['indignante', 'esperanzador', 'temible'],
  'catastrofizacion': ['catástrofe', 'desastre', 'apocalipsis'],
  'absolutizacion': ['siempre', 'nunca', 'todos', 'ninguno'],
  'definibilidad': ['definimos', 'entendemos por'],
  'operacionalizacion': ['medible', 'cuantificable', 'indicador'],
  'vaguedad': ['aproximadamente', 'más o menos', 'cierto'],
  'referencialidad': ['refiere', 'alude', 'menciona'],
  'pregunta_relevante': ['¿', 'qué pasaría si', 'cómo'],
  'hipotesis': ['hipótesis', 'supongo', 'podría ser'],
  'reencuadre': ['desde otra óptica', 'reformulando'],
  'apertura_critica': ['estoy abierto', 'corrijan', 'puedo estar equivocado']
};

// ─── PROCESAR CADA ÁTOMO ──────────────────────────────
let modificados = 0;
let total = 0;

for (const fase of protocol.fases) {
  for (const criterio of fase.criterios) {
    for (const atomo of criterio.atomos) {
      total++;
      if (atomo.patrones.length === 0) {
        const sugeridos = SUGGESTIONS[atomo.id] || [];
        if (sugeridos.length > 0) {
          console.log(`\n🔍 Átomo "${atomo.id}" en criterio ${criterio.id}`);
          console.log(`   Definición: ${atomo.definicion}`);
          console.log(`   💡 Patrones sugeridos: ${sugeridos.join(', ')}`);
          modificados++;
        } else {
          console.log(`\n⚠️ Átomo "${atomo.id}" en criterio ${criterio.id} no tiene sugerencias automáticas.`);
          console.log(`   Definición: ${atomo.definicion}`);
          console.log(`   📝 Añade manualmente: ["palabra1", "palabra2"]`);
        }
      }
    }
  }
}

console.log(`\n📊 Total de átomos revisados: ${total}`);
console.log(`📊 Átomos con sugerencias: ${modificados}`);

if (modificados > 0 && WRITE_MODE) {
  console.log('✍️  Modo --write activado, pero este script solo sugiere, no modifica automaticamente.');
  console.log('📝 Para actualizar sophia.js, edita manualmente los arrays "patrones" con las sugerencias.');
} else if (modificados > 0) {
  console.log('\n💡 Para aplicar las sugerencias, edita manualmente sophia.js o usa --write con cuidado.');
}
