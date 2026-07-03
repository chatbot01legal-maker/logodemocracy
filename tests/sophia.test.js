const { analyzeDocument } = require('../modules/sophiaService');

async function runTests() {
  console.log('🧪 Iniciando Suite de Tests SOPHIA-HYBRID...\n');
  
  const texts = [
    "todos los inmigrantes destruyen países",
    "quizás exista incertidumbre en este modelo",
    "el cambio climático es un engaño total",
    "la democracia siempre funciona de manera perfecta",
    "las vacunas provocan autismo porque lo leí en un blog"
  ];
  
  for (const [index, text] of texts.entries()) {
    console.log(`\n=== 📄 Evaluando Texto ${index + 1} ===`);
    console.log(`"${text}"`);
    try {
      const result = await analyzeDocument(text);
      console.log(`✅ Engine: ${result.engine} | Versión: ${result.protocol_version}`);
      console.log(`📊 IRD Local: ${result.local?.IRD_global || 'N/A'}`);
      console.log(`🤖 LLM Fallacies: ${result.llm?.additional_fallacies?.join(', ') || 'Ninguna'}`);
    } catch (error) {
      console.error(`❌ Falló la evaluación:`, error.message);
    }
  }
  
  console.log('\n🏁 Suite finalizada.');
}

runTests();
