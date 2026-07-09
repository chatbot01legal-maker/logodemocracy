const PedagogicalProfile = require('../models/PedagogicalProfile');

/*
 * Controlador diseñado específicamente para empatar con la llamada fetch en rey-filosofo.js (línea 416):
 * POST /api/reyfilosofo/microtests/save
 * Payload: { userId, sessionId, testId, answers, variables }
 */
exports.saveMicrotest = async (req, res, next) => {
  try {
    const { userId, sessionId, testId, answers, variables } = req.body;
    
    // Identificamos por token (req.user), por userId explícito en body, o por sessionId anónimo
    const targetUserId = req.user ? req.user._id : (userId || null);
    const query = targetUserId ? { userId: targetUserId } : { sessionId: sessionId };

    if (!targetUserId && !sessionId) {
      return res.status(400).json({ error: 'Se requiere identificación de sesión o usuario.' });
    }

    let profile = await PedagogicalProfile.findOne(query);
    if (!profile) {
      profile = new PedagogicalProfile(query);
    }

    // 1. Agregar el test a completados si no existe
    if (testId && !profile.completed_tests.includes(testId)) {
      profile.completed_tests.push(testId);
    }

    // 2. Mapear variables al esquema de alto nivel si corresponden
    if (variables) {
      if (variables.estilo_explicativo)
  profile.estilo_explicativo = variables.estilo_explicativo;

if (variables.nivel_abstraccion_inicial)
  profile.nivel_abstraccion_inicial = variables.nivel_abstraccion_inicial;

if (variables.necesidad_andamiaje)
  profile.necesidad_andamiaje = variables.necesidad_andamiaje;
      // 3. Fusionar todas las variables crudas computadas por el frontend en raw_variables
      for (const [key, val] of Object.entries(variables)) {
        profile.raw_variables.set(key, val);
      }
    }

    await profile.save();

    res.json({
      status: 'success',
      message: `Microtest ${testId} registrado en Memoria 1 (Perfil Estable).`,
      profile
    });
  } catch (error) {
    next(error);
  }
};

exports.listCompletedTests = async (req, res, next) => {
  try {
    const query = req.user ? { userId: req.user._id } : { sessionId: req.query.sessionId };
    const profile = await PedagogicalProfile.findOne(query).select('completed_tests');
    res.json({ completed_tests: profile ? profile.completed_tests : [] });
  } catch (error) {
    next(error);
  }
};
