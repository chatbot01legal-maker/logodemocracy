const PedagogicalProfile = require('../models/PedagogicalProfile');
const brujulaEngine = require('../services/rf/brujulaEngine');

/*
 * Controlador diseñado específicamente para empatar con la llamada fetch en rey-filosofo.js (línea 416):
 * POST /api/reyfilosofo/microtests/save
 * Payload: { userId, sessionId, testId, answers, variables }
 */
exports.saveMicrotest = async (req, res, next) => {
  try {
    const {
      userId,
      sessionId,
      testId,
      answers,
      variables,
      attempt
    } = req.body;
    
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

    // 1.5. Conservar cada intento como evidencia acumulativa.
    // Nunca se reemplaza un intento anterior.
    if (attempt && typeof attempt === 'object') {
      // Motor determinista de "brujula" (Nivel A/B del contrato v1.0.0).
      // attempt.evidence es la ÚNICA fuente de los indicadores: no se
      // reconstruyen desde "answers". Aditivo: no toca ningún otro campo
      // de "attempt". Los demás 9 Microtests no entran a este bloque.
      //
      // "generated_at" se añade AQUÍ, fuera de brujulaEngine.buildProfile
      // (que es puro y no usa Date.now()), precisamente para no romper el
      // determinismo estricto exigido por A.11.7. Es un campo adicional
      // documentado sobre deterministic_profile (ver política en
      // brujulaEngine.js): marca cuándo se persistió el registro, y es
      // semánticamente distinto de "attempt.timestamp" (cuándo el usuario
      // completó el intento). No participa en el cálculo de rule_version.
      if (testId === 'brujula' && Array.isArray(attempt.evidence)) {
        const indicators = attempt.evidence.map((e) => e && e.indicator);
        const deterministicProfile = brujulaEngine.buildProfile(indicators);
        attempt.deterministic_profile = Object.assign(
          {},
          deterministicProfile,
          { generated_at: new Date().toISOString() }
        );
      }

      profile.microtest_evidence = profile.microtest_evidence || [];
      profile.microtest_evidence.push(attempt);
      profile.markModified('microtest_evidence');
    }

    // 2. Mapear variables pedagógicas al perfil operativo.
    // Estas variables alimentan directamente ContextAdapter/LearningStrategy.
    if (variables) {
      const profileFields = [
        'estilo_explicativo',
        'preferencia_ejemplos',
        'contexto_ejemplo',
        'tipo_analogia_dominante',
        'orientacion',
        'pensamiento_sistemico',
        'preferencia_formato',
        'nivel_abstraccion_inicial',
        'secuencia_preferida',
        'necesidad_andamiaje',
        'tipo_andamiaje_preferido',
        'estrategias_metacognitivas',
        'enfoque_resolucion'
      ];

      for (const field of profileFields) {
        if (variables[field] !== undefined && variables[field] !== null) {
          profile[field] = variables[field];
        }
      }

      // 3. Conservar todas las variables originales como evidencia cruda.
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
    const query = req.user
      ? { userId: req.user._id }
      : { sessionId: req.query.sessionId };

    if (!req.user && !req.query.sessionId) {
      return res.json({ completed_tests: [] });
    }

    const profile = await PedagogicalProfile.findOne(query).select('completed_tests');

    res.json({
      completed_tests: profile ? (profile.completed_tests || []) : []
    });
  } catch (error) {
    console.error('[Microtests] Error listando microtests:', error);

    if (!req.user && req.query.sessionId) {
      return res.json({ completed_tests: [] });
    }

    next(error);
  }
};
