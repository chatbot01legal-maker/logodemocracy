const RFKernel = require('../services/rf/RFKernel');

const rfController = {
  async process(req, res, next) {
    try {
      // Extraer campos del body
      const { sessionId, provider_module, content, message, user_response, metadata } = req.body;

      // 1. Validar sessionId (obligatorio)
      if (!sessionId) {
        return res.status(400).json({
          error: "El campo 'sessionId' es mandatorio para el rastreo de estados del Rey Filósofo."
        });
      }

      // 2. Validar contenido
      const inputContent =
        (content && content.trim())
          ? content.trim()
          : (message && message.trim())
            ? message.trim()
            : null;

      if (!inputContent) {
        return res.status(400).json({
          error: "El campo 'content' (o 'message') es obligatorio y no puede estar vacío."
        });
      }

      // Usuario autenticado opcional
      const userId = req.user ? req.user._id : null;

      // 3. Invocar kernel
      console.log("[RF CONTROLLER] Antes de RFKernel.process");
      const result = await RFKernel.process({
        userId,
        sessionId,
        provider_module: provider_module || 'AcademiaContextProvider',
        content: inputContent,
        user_response,
        metadata
      });
      
      console.log("[RF CONTROLLER] Después de RFKernel.process", result);
      // 4. Mantener contrato de salida intacto
      return res.status(200).json(result);

    } catch (error) {
      // Registrar error en servidor
      console.error("[rfController Error]:", error);

      // Delegar al middleware global
      next(error);
    }
  }
};

module.exports = rfController;
