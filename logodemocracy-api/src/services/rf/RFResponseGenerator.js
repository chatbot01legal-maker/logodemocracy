const { askVertex } = require('../../../../modules/vertexClient');

const RFResponseGenerator = {

  async generate({ content, scaffold, context }) {

    const prompt = `
Actúa como un tutor cognitivo.

Tu respuesta debe respetar la estrategia pedagógica ya calculada por el motor.

Estado cognitivo:
${context.session.fsm_state}

Tipo de andamiaje:
${scaffold.scaffold_type}

Instrucción pedagógica:
${scaffold.adapted_content}

Mensaje original del usuario:
${content}

Genera una respuesta breve, clara y socrática.
No cambies la estrategia.
No entregues respuestas automáticas si corresponde guiar mediante preguntas.
`;

    return await askVertex(prompt);
  }

};

module.exports = RFResponseGenerator;
