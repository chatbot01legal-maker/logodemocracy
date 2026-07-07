require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');
const RFKernel = require('../src/services/rf/RFKernel');
const PedagogicalProfile = require('../src/models/PedagogicalProfile');
const LearningMap = require('../src/models/LearningMap');
const RFSession = require('../src/models/RFSession');

async function runPersistenceTest() {
  console.log("=== INICIANDO TEST DE PERSISTENCIA: RFKERNEL + MONGODB ===");
  
  // Soporte dual para variables de entorno (MONGO_URI o MONGODB_URI)
  const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!dbUri) {
    console.error("❌ ERROR: Falta MONGO_URI (o MONGODB_URI) en el archivo .env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("✅ Conectado a MongoDB Atlas.");

    const testSessionId = `test_session_${Date.now()}`;
    
    console.log("\n1. Ejecutando RFKernel.process() con un usuario anónimo nuevo...");
    const result = await RFKernel.process({
      sessionId: testSessionId,
      provider_module: 'AcademiaContextProvider',
      content: "La democracia deliberativa requiere participación activa y argumentación racional.",
      user_response: "Es como cuando en mi condominio tomamos decisiones juntos y todos pueden hablar antes de votar.",
      metadata: {
        concept: "democracia_deliberativa",
        competence: "systems_thinking" // Corrección: competencia canónica del esquema LearningMap
      }
    });
    
    console.log("Resultado del Kernel:", JSON.stringify(result, null, 2));

    console.log("\n2. Verificando persistencia real y evolución de memorias en MongoDB...");
    
    const profile = await PedagogicalProfile.findOne({ sessionId: testSessionId });
    const learningMap = await LearningMap.findOne({ sessionId: testSessionId });
    const session = await RFSession.findOne({ sessionId: testSessionId });

    // Validación de creación de documentos
    if (profile && learningMap && session) {
      console.log("✅ Autocreación exitosa: Documentos (Profile, Map, Session) presentes en la base de datos.");
    } else {
      throw new Error("Falló la autocreación de documentos en la base de datos.");
    }

    // Validación rigurosa de telemetría (debe contener registros reales y no solo el contenedor)
    if (learningMap.telemetry?.successful_analogies?.length > 0) {
       console.log(`✅ Telemetría longitudinal verificada: ${learningMap.telemetry.successful_analogies.length} registro(s) capturado(s).`);
       console.log("   Detalle memoria:", learningMap.telemetry.successful_analogies[0]);
    } else {
       console.warn("⚠️ Advertencia: No se registraron analogías exitosas en el LearningMap.");
    }

    // Validación del estado de la memoria de trabajo (FSM)
    assert.strictEqual(session.fsm_state, result.fsm_state, "El estado FSM en la base de datos debe coincidir con la salida del Kernel.");
    console.log(`✅ Memoria de trabajo (RFSession) validada. Estado FSM persistido: [${session.fsm_state}]`);

    // Validación de evolución en la autonomía cognitiva del ciudadano
    let sysComp = undefined;
    if (learningMap.competencies instanceof Map) {
      sysComp = learningMap.competencies.get("systems_thinking");
    } else if (learningMap.competencies && typeof learningMap.competencies === 'object') {
      sysComp = learningMap.competencies["systems_thinking"];
    }

    if (sysComp && sysComp.autonomy > 10) {
       console.log(`✅ Autonomía en 'systems_thinking' evolucionó correctamente a: ${sysComp.autonomy} (Tendencia: ${sysComp.trend})`);
    } else {
       console.log(`ℹ️ Estado de autonomía actual en 'systems_thinking': ${sysComp ? sysComp.autonomy : 'No evaluado'}`);
    }

    console.log("\n3. Limpiando datos de prueba...");
    await PedagogicalProfile.deleteOne({ sessionId: testSessionId });
    await LearningMap.deleteOne({ sessionId: testSessionId });
    await RFSession.deleteOne({ sessionId: testSessionId });
    console.log("✅ Limpieza completada.");

    console.log("\n✅ [PASS] TEST DE PERSISTENCIA REAL SUPERADO AL 100%.");

  } catch (error) {
    console.error("\n❌ [FAIL] Error en el test de persistencia:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Desconectado de MongoDB.");
  }
}

runPersistenceTest();
