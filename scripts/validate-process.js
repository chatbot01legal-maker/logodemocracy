/**
 * ==========================================================
 * validate-process.js
 * Auditoría del endpoint Rey Filósofo
 * LogoDemocracy
 * ==========================================================
 */

const BASE_URL = "http://localhost:5000";
const ENDPOINT = `${BASE_URL}/api/reyfilosofo/process`;

function generateSessionId() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
}

async function executeTest(title, body, malformed = false) {
  console.log("\n==================================================");
  console.log(title);
  console.log("==================================================");

  try {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (malformed) {
      options.body = '{ "sessionId":"abc", "content":"hola" ';
    } else {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(ENDPOINT, options);

    console.log("STATUS:", response.status);
    console.log("STATUS TEXT:", response.statusText);

    console.log("\nHEADERS");

    for (const [k, v] of response.headers.entries()) {
      console.log(`${k}: ${v}`);
    }

    const raw = await response.text();

    console.log("\nBODY");
    console.log(raw);

    try {

      const json = JSON.parse(raw);

      console.log("\nJSON FORMATEADO");

      console.log(JSON.stringify(json, null, 2));

      console.log("\nCAMPOS RAÍZ");

      console.log(Object.keys(json));

    } catch {

      console.log("\nLa respuesta NO es JSON.");

    }

  } catch (err) {

    console.error("ERROR DE RED");

    console.error(err);

  }
}

async function main() {

  console.log("\n");
  console.log("===============================================");
  console.log("LogoDemocracy");
  console.log("Auditoría Endpoint Rey Filósofo");
  console.log("===============================================");
  console.log("Endpoint:", ENDPOINT);

  await executeTest(
    "PRUEBA 1 - Payload válido",
    {
      sessionId: generateSessionId(),
      provider_module: "AcademiaContextProvider",
      content: "Hola. Esta es una prueba válida."
    }
  );

  await executeTest(
    "PRUEBA 2 - Sin sessionId",
    {
      provider_module: "AcademiaContextProvider",
      content: "Hola."
    }
  );

  await executeTest(
    "PRUEBA 3 - Sin content",
    {
      sessionId: generateSessionId(),
      provider_module: "AcademiaContextProvider"
    }
  );

  await executeTest(
    "PRUEBA 4 - JSON malformado",
    null,
    true
  );

  await executeTest(
    "PRUEBA 5 - Usando 'message' en vez de 'content'",
    {
      sessionId: generateSessionId(),
      provider_module: "AcademiaContextProvider",
      message: "Prueba usando message."
    }
  );

  console.log("\n===============================================");
  console.log("Fin de la auditoría");
  console.log("===============================================\n");

}

main();
