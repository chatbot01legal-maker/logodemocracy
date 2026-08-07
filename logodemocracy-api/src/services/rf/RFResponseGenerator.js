const { askVertex } = require('../../../../modules/vertexClient');

const RFResponseGenerator = {

  async generate({ content, scaffold, context }) {
    console.log("=== PAYLOAD RECIBIDO EN RFResponseGenerator ===");
    console.log(JSON.stringify({ content, context }, null, 2));
    console.log("===============================================");

    const fsmState = context?.session?.fsm_state || 'No definido';
    const scaffoldType = scaffold?.scaffold_type || 'ninguno';
    const adaptedContent = scaffold?.adapted_content || '';
    
    // Extracción tolerante: leemos tanto la auditoría como el activo núcleo
    const sophiaData = context?.sophiaAudit ? JSON.stringify(context.sophiaAudit, null, 2) : 'Sin auditoría previa';
    const assetData = context?.cognitiveAsset ? JSON.stringify(context.cognitiveAsset, null, 2) : 'Sin activo cognitivo';

    const prompt = `
Actúa estrictamente basándote en los parámetros de la auditoría, el activo cognitivo y el estado cognitivo.

Estado cognitivo:
${fsmState}

Tipo de andamiaje:
${scaffoldType}

Auditoría de Sofía (Metadata/Contexto analítico):
${sophiaData}

Activo Cognitivo (Resultado de la evaluación o datos núcleo):
${assetData}

Instrucción pedagógica / Resultado esperado:
${adaptedContent}

Mensaje original del usuario:
${content}

Genera tu respuesta respetando el tipo de andamiaje. Si el andamiaje es "ninguno" o si el resultado de Sofía exige una respuesta directa, responde directamente a la solicitud sin utilizar un estilo socrático ni hacer preguntas de vuelta. No cambies la estrategia.
`;

    try {
      return await askVertex(prompt);
    } catch (error) {
      if (error.message && error.message.includes('429')) {
        console.warn("[RFResponseGenerator] Advertencia: Límite de cuota de Vertex alcanzado (429).");
        return "El sistema está experimentando alta demanda en este momento (límite de peticiones de la IA alcanzado). Por favor, espera unos segundos e intenta nuevamente.";
      }
      throw error;
    }
  }

};

module.exports = RFResponseGenerator;

