const { askVertex } = require('../../../../modules/vertexClient');

const RFResponseGenerator = {

  async generate({ content, scaffold, context }) {
    // 1. Log estructurado para confirmar qué payload está recibiendo la función
    console.log("=== PAYLOAD RECIBIDO EN RFResponseGenerator ===");
    console.log(JSON.stringify({ content, context }, null, 2));
    console.log("===============================================");

    // Extracción segura para evitar errores si algo viene undefined
    const fsmState = context?.session?.fsm_state || 'No definido';
    const scaffoldType = scaffold?.scaffold_type || 'ninguno';
    const adaptedContent = scaffold?.adapted_content || '';
    const sophiaData = context?.sophiaAudit ? JSON.stringify(context.sophiaAudit, null, 2) : 'Sin auditoría previa';

    const prompt = `
Actúa estrictamente basándote en los parámetros de la auditoría y el estado cognitivo.

Estado cognitivo:
${fsmState}

Tipo de andamiaje:
${scaffoldType}

Auditoría de Sofía (Contexto analítico):
${sophiaData}

Instrucción pedagógica / Resultado esperado:
${adaptedContent}

Mensaje original del usuario:
${content}

Genera tu respuesta respetando el tipo de andamiaje. Si el andamiaje es "ninguno" o si el resultado de Sofía exige una respuesta directa, responde directamente a la solicitud sin utilizar un estilo socrático ni hacer preguntas de vuelta. No cambies la estrategia.
`;

    return await askVertex(prompt);
  }

};

module.exports = RFResponseGenerator;


