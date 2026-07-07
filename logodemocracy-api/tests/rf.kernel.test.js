const assert = require('assert');
const RFKernel = require('../src/services/rf/RFKernel');

// Simulación de ejecución asíncrona autocontenida
(async () => {
  console.log("=== INICIANDO TEST UNITARIO: RFKERNEL RUNTIME ===");
  
  try {
    const payloadTest = {
      userId: null,
      sessionId: "demo-session-tablet-2026",
      provider_module: "SophiaContextProvider",
      content: "Habermas propone que la legitimidad de una norma depende de un discurso libre de dominación.",
      user_response: "Creo que esto es parecido a una asamblea escolar donde todos pueden hablar sin miedo al director.",
      metadata: {
        concept: "democracia deliberativa",
        competencies: ["critical_reading", "deliberation"]
      }
    };

    console.log("1. Procesando carga útil (Payload) en el Kernel...");
    const result = await RFKernel.process(payloadTest);

    console.log("\n--- RESULTADO CANÓNICO DEL KERNEL ---");
    console.log(JSON.stringify(result, null, 2));

    // Verificaciones de aserción deterministas
    assert.strictEqual(typeof result.adapted_content, 'string', "El contenido adaptado debe ser un string.");
    assert.strictEqual(typeof result.fsm_state, 'string', "Debe devolver un estado FSM válido.");
    assert.strictEqual(typeof result.scaffold_type, 'string', "Debe devolver un tipo de scaffold.");
    assert.strictEqual(result.transfer_detected, true, "La heurística debe detectar transferencia exitosa ante el ejemplo de la asamblea escolar.");

    console.log("\n✅ [PASS] EL RFKERNEL COMPILA, ORQUESTA Y TRABAJA CORRECTAMENTE EN AISLAMIENTO.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ [FAIL] ERROR DE EJECUCIÓN EN EL KERNEL:", error);
    process.exit(1);
  }
})();
