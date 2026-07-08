const RFKernel = require('../services/rf/RFKernel');

const rfController = {
  async process(req, res) {
    try {
      // Mapeo flexible: permitimos 'message' (frontend) o 'content' (API externa)
      const { sessionId, provider_module, content, message, user_response, metadata } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          error: "El campo 'sessionId' es mandatorio para el rastreo de estados del Rey Filósofo."
        });
      }

      const userId = req.user ? req.user._id : null;

      // Unificamos la entrada: priorizamos content, si no existe usamos message
      const inputContent = content || message || "";

      // Invocación del motor cognitivo
      const result = await RFKernel.process({
        userId,
        sessionId,
        provider_module: provider_module || 'AcademiaContextProvider',
        content: inputContent,
        user_response,
        metadata
      });

      return res.status(200).json(result);

    } catch (error) {
      console.error("[rfController Error]:", error.message);
      return res.status(500).json({
        error: "Error interno en la ejecución del pipeline del Rey Filósofo."
      });
    }
  }
};

module.exports = rfController;
