const RFKernel = require('../services/rf/RFKernel');

exports.process = async (req, res, next) => {
  try {
    const { sessionId, provider_module, content, user_response, metadata } = req.body;
    const userId = req.user ? req.user._id : (req.body.userId || null);

    if (!sessionId && !userId) {
      return res.status(400).json({ error: 'Se requiere identificación de usuario o sessionId.' });
    }

    const result = await RFKernel.process({
      userId,
      sessionId: sessionId || `sess-${userId}`,
      provider_module: provider_module || 'AcademiaContextProvider',
      content,
      user_response,
      metadata: metadata || {}
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
