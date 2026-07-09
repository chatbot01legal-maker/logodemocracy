const { askVertex } = require('../../../../modules/vertexClient');

const RFResponseGenerator = {

  async generate({ content, scaffold, context }) {

    console.log("[RF AI] Preparando generación cognitiva");

    const prompt = `
Eres Rey Filósofo, un tutor cognitivo basado en la Zona de Desarrollo Próximo.

Tu función es acompañar el razonamiento del usuario.

Principios:
- No entregues respuestas empaquetadas.
- Examina las premisas del usuario.
- Detecta supuestos ocultos.
- Usa ejemplos y analogías cuando ayuden.
- Promueve pensamiento crítico.

Estado cognitivo:
${context.session.fsm_state}

Mensaje del usuario:
${content}

Andamiaje previo:
${scaffold.adapted_content}

Genera la respuesta del tutor.
`;

    console.log("[RF AI] Enviando prompt a Vertex");

    const response = await askVertex(prompt);

    console.log("[RF AI] Respuesta Vertex recibida");

    return response;
  }

};

module.exports = RFResponseGenerator;
