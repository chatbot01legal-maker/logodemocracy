const { sendChatMessage } = require('./api-client');
const { buildContext } = require('./context-builder');
const { evaluateResponse } = require('./evaluator');
const { generateReport } = require('./reporter');
const fs = require('fs');
const path = require('path');
const config = require('../config');

function loadTestCases() {
  const convDir = path.join(config.FIXTURES_DIR, 'conversations');

  if (!fs.existsSync(convDir)) {
    console.log(`⚠️  No se encontró el directorio de casos: ${convDir}`);
    return [];
  }

  const files = fs.readdirSync(convDir).filter(f => f.endsWith('.json'));
  const allTests = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(convDir, file), 'utf8');
    const data = JSON.parse(content);

    if (data.tests && Array.isArray(data.tests)) {
      allTests.push(
        ...data.tests.map(t => ({
          ...t,
          suite: file
        }))
      );
    }
  }

  return allTests;
}

async function runTestCase(testCase) {
  console.log(
    `▶️  ${testCase.id} (${testCase.mode}): ${testCase.description}`
  );

  try {
    const context = buildContext(testCase.context);

    const response = await sendChatMessage(
      testCase.userMessage,
      context
    );

    const evalResult = evaluateResponse(response, testCase);

    const status = evalResult.autoPassed ? '✅' : '❌';

    console.log(
      `   ${status} ${
        evalResult.autoErrors.length > 0
          ? evalResult.autoErrors[0]
          : 'Auto OK'
      }`
    );

    return evalResult;

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);

    return {
      testId: testCase.id,
      mode: testCase.mode,
      description: testCase.description,
      autoPassed: false,
      autoErrors: [`Error de ejecución: ${error.message}`],
      responseText: null,
      semanticGuide: {
        observations: []
      }
    };
  }
}

async function main() {
  console.log('🧠 REY FILÓSOFO - BATERÍA DEFINITIVA');
  console.log('====================================');
  console.log(`Endpoint: ${config.API_BASE}${config.CHAT_ENDPOINT}`);
  console.log('');

  let testCases = loadTestCases();

  if (testCases.length === 0) {
    console.log('❌ No se encontraron casos de prueba.');
    console.log(
      `   Verifica que existan archivos .json en ${config.FIXTURES_DIR}/conversations/`
    );
    process.exit(1);
  }

  // Permite ejecutar únicamente los IDs indicados:
  // node index.js RF-A01 RF-A02 RF-A03 RF-A04
  const requestedIds = process.argv
    .slice(2)
    .map(id => id.trim())
    .filter(Boolean);

  if (requestedIds.length > 0) {
    const requestedSet = new Set(requestedIds);

    testCases = testCases.filter(tc =>
      requestedSet.has(tc.id)
    );

    console.log(
      `🎯 Seleccionadas ${testCases.length} pruebas: ${requestedIds.join(', ')}`
    );
    console.log('');

    const foundIds = new Set(testCases.map(tc => tc.id));
    const missingIds = requestedIds.filter(id => !foundIds.has(id));

    if (missingIds.length > 0) {
      console.log(
        `⚠️  IDs no encontrados: ${missingIds.join(', ')}`
      );
      console.log('');
    }

    if (testCases.length === 0) {
      console.log('❌ Ninguna de las pruebas solicitadas existe.');
      process.exit(1);
    }
  } else {
    console.log(`📋 Cargados ${testCases.length} casos.`);
    console.log('');
  }

  const results = [];

  for (const tc of testCases) {
    const result = await runTestCase(tc);
    results.push(result);
  }

  const total = results.length;
  const autoPassed = results.filter(r => r.autoPassed).length;
  const autoFailed = total - autoPassed;

  const summary = {
    total,
    autoPassed,
    autoFailed
  };

  generateReport(results, summary);

  console.log('');
  console.log('====================================');
  console.log(`📊 Total: ${total}`);
  console.log(`✅ Auto OK: ${autoPassed}`);
  console.log(`❌ Auto fallo: ${autoFailed}`);
  console.log('====================================');
}

main().catch(console.error);
