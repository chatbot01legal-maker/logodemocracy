// controllers/rfController.js

const RFKernel = require('../services/rf/RFKernel');

const rfController = {

  async process(req, res, next) {

    const requestId = Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8);

    console.log("\n==============================");
    console.log("[RF REQUEST START]", requestId);
    console.log("==============================");

    try {

      console.log("[RF BODY]", JSON.stringify(req.body, null, 2));


      // Extraer campos del body (Abriendo el sobre)
      const {
        sessionId,
        provider_module,
        content,
        message,
        user_response,
        metadata,
        cognitiveSession,
        context
      } = req.body;


      console.log("[RF VALIDATION] sessionId:", sessionId);
      console.log("[RF VALIDATION] content:", content);
      console.log("[RF VALIDATION] message:", message);


      // 1. Validar sessionId
      if (!sessionId) {

        console.error("[RF ERROR] Falta sessionId");

        return res.status(400).json({
          error: "El campo 'sessionId' es mandatorio para el rastreo de estados del Rey Filósofo."
        });

      }



      // 2. Resolver contenido

      const inputContent =
        (content && content.trim())
          ? content.trim()
          : (message && message.trim())
            ? message.trim()
            : null;


      console.log("[RF INPUT CONTENT]", inputContent);


      if (!inputContent) {

        console.error("[RF ERROR] Contenido vacío");

        return res.status(400).json({
          error: "El campo 'content' (o 'message') es obligatorio y no puede estar vacío."
        });

      }



      // Usuario autenticado opcional
      const userId = req.user ? req.user._id : null;


      console.log("[RF USER]", userId || "anonymous");

      console.log("[RF PROVIDER]",
        provider_module || "AcademiaContextProvider"
      );


      console.log("[RF KERNEL CALL START]", requestId);



      // 3. Invocar kernel pasando el sobre externo
      const result = await RFKernel.process({

        userId,

        sessionId,

        provider_module:
          provider_module || 'AcademiaContextProvider',

        content: inputContent,

        user_response,

        metadata,
        
        externalContext: context || cognitiveSession

      });



      console.log("[RF KERNEL CALL END]", requestId);

      console.log(
        "[RF KERNEL RESULT]",
        JSON.stringify(result, null, 2)
      );



      // Validación defensiva del contrato

      if (!result) {

        console.error(
          "[RF ERROR] RFKernel devolvió null/undefined"
        );

        return res.status(500).json({
          error: "El motor Rey Filósofo no devolvió respuesta."
        });

      }



      // 4. Mantener contrato intacto

      console.log(
        "[RF RESPONSE SEND]",
        requestId
      );


      return res.status(200).json(result);



    } catch (error) {


      console.error("\n==============================");
      console.error("[RF CONTROLLER ERROR]", requestId);
      console.error("==============================");

      console.error("Mensaje:", error.message);

      console.error("Stack:", error.stack);



      // Respuesta explícita para frontend
      return res.status(500).json({

        error:
          "Error interno en el procesamiento del Rey Filósofo.",

        requestId,

        detail:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined

      });

    }

  }

};


module.exports = rfController;

