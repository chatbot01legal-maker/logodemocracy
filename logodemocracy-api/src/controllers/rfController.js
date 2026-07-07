const RFKernel = require('../services/rf/RFKernel');

const rfController = {
  async process(req, res) {
    try {
      const { sessionId, provider_module, content, user_response, metadata } = req.body;

      if (!sessionId) {
        return res.status(400).json({ 
          error: "El campo 'sessionId' es mandatorio para el rastreo de estados del Rey Filósofo." 
        });
      }

      // Extraemos el ID del usuario si optionalAuth validó el token JWT
      const userId = req.user ? req.user._id : null;

      // Invocación del motor cognitivo unificado
      const result = await RFKernel.process({
        userId,
        sessionId,
        provider_module: provider_module || 'AcademiaContextProvider',
        content,
        user_response,
        metadata
      });

      // Retorno del formato canónico aprobado
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
