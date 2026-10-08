const fs = require('fs');
const path = require('path');
const config = require('../config');

function generateReport(results, summary) {
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    summary,
    results: results.map(r => ({
      testId: r.testId,
      mode: r.mode,
      description: r.description,
      autoPassed: r.autoPassed,
      autoErrors: r.autoErrors,
      responsePreview: r.responseText ? r.responseText.substring(0, 500) : '',
      fullResponse: r.responseText,
      semanticGuide: r.semanticGuide,
      // Espacio para puntuaciones humanas
      humanScores: null
    }))
  };

  const reportDir = config.REPORTS_DIR;
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const filename = `report-${Date.now()}.json`;
  const filepath = path.join(reportDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

  // Resumen en consola
  console.log('\n===== RESUMEN DE LA BATERÍA =====');
  console.log(`Total pruebas: ${summary.total}`);
  console.log(`Automáticas OK: ${summary.autoPassed}`);
  console.log(`Automáticas FAIL: ${summary.autoFailed}`);
  console.log('===================================');
  console.log(`Reporte detallado: ${filepath}`);
  console.log('\n📋 INSTRUCCIONES PARA EVALUACIÓN HUMANA:');
  console.log('1. Abre el archivo JSON del reporte.');
  console.log('2. Para cada prueba, revisa la respuesta y asigna puntuaciones (0-3) en las dimensiones indicadas en "semanticGuide".');
  console.log('3. Calcula el porcentaje de cumplimiento (suma de puntuaciones / (número_dimensiones * 3)).');
  console.log('4. Clasifica el resultado:');
  console.log('   - GREEN: >=85% y sin fallos CRITICAL');
  console.log('   - YELLOW: 70-84% o problemas HIGH');
  console.log('   - RED: <70% o cualquier fallo CRITICAL');
  console.log('===================================');
  return report;
}

module.exports = { generateReport };
