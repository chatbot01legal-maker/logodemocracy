const PedagogicalProfile = require('../models/PedagogicalProfile');
const User = require('../models/User');
const LearningMap = require('../models/LearningMap');

exports.getProfile = async (req, res, next) => {
  try {
    const query = req.user ? { userId: req.user._id } : { sessionId: req.query.sessionId };
    let profile = await PedagogicalProfile.findOne(query);

    if (!profile && req.user) {
      profile = await PedagogicalProfile.create({ userId: req.user._id });
    }

    res.json({ profile: profile || { completed_tests: [], raw_variables: {} } });
  } catch (error) {
    next(error);
  }
};

exports.getLearningMap = async (req, res, next) => {
  try {
    const query = req.user
      ? { userId: req.user._id }
      : { sessionId: req.query.sessionId };

    if (!req.user && !req.query.sessionId) {
      return res.status(400).json({
        error: 'Se requiere sessionId para usuario invitado.'
      });
    }

    let learningMap = await LearningMap.findOne(query);

    if (!learningMap) {
      learningMap = await LearningMap.create(query);
    }

    res.json({ learningMap });
  } catch (error) {
    next(error);
  }
};


/* =========================================================
   PERFIL PERSONAL DEL USUARIO
========================================================= */

const VALID_EDUCATION = [
  'basica', 'media', 'tecnica', 'universitaria', 'posgrado', 'prefiero_no_decir'
];

function _userInfoResponse(user) {
  return {
    email: user.email,
    name: user.name,
    display_name: user.display_name || null,
    bio: user.bio || null,
    education_level: user.education_level || null,
    avatar_id: user.avatar_id || null,
    interests: user.interests || [],
    age_range: user.age_range || null,
    pronouns: user.pronouns || null,
    nationality: user.nationality || null,
    country: user.country || null
  };
}

exports.getUserInfo = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const user = await User.findById(req.user._id).select(
      'email name display_name bio education_level avatar_id interests age_range pronouns nationality country'
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ user: _userInfoResponse(user) });
  } catch (error) {
    next(error);
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Se requiere sesión.' });
    }

    const update = {};

    if ('display_name' in req.body) {
      const v = req.body.display_name;
      if (v !== null && typeof v !== 'string') {
        return res.status(400).json({ error: 'display_name debe ser texto o null.' });
      }
      const clean = v === null ? null : v.trim();
      if (clean !== null && clean.length > 50) {
        return res.status(400).json({ error: 'display_name supera 50 caracteres.' });
      }
      update.display_name = clean || null;
    }

    if ('bio' in req.body) {
      const v = req.body.bio;
      if (v !== null && typeof v !== 'string') {
        return res.status(400).json({ error: 'bio debe ser texto o null.' });
      }
      const clean = v === null ? null : v.trim();
      if (clean !== null && clean.length > 300) {
        return res.status(400).json({ error: 'bio supera 300 caracteres.' });
      }
      update.bio = clean || null;
    }

    if ('education_level' in req.body) {
      const v = req.body.education_level;
      if (v !== null && !VALID_EDUCATION.includes(v)) {
        return res.status(400).json({ error: 'education_level inválido.' });
      }
      update.education_level = v;
    }

    if ('avatar_id' in req.body) {
      const v = req.body.avatar_id;
      if (v !== null && typeof v !== 'string') {
        return res.status(400).json({ error: 'avatar_id debe ser texto o null.' });
      }
      update.avatar_id = v || null;
    }

    if ('interests' in req.body) {
      const v = req.body.interests;
      if (!Array.isArray(v)) {
        return res.status(400).json({ error: 'interests debe ser una lista.' });
      }
      const clean = v
        .filter(function (i) { return typeof i === 'string'; })
        .map(function (i) { return i.trim(); })
        .filter(function (i) { return i.length > 0 && i.length <= 30; })
        .slice(0, 20);
      update.interests = clean;
    }

    if ('age_range' in req.body) {
      const v = req.body.age_range;
      const valid = ['menos_18', '18_25', '26_35', '36_50', '51_65', 'mas_65', 'prefiero_no_decir'];
      if (v !== null && !valid.includes(v)) {
        return res.status(400).json({ error: 'age_range inválido.' });
      }
      update.age_range = v;
    }

    if ('pronouns' in req.body) {
      const v = req.body.pronouns;
      const valid = ['el', 'ella', 'elle', 'prefiero_no_decir'];
      if (v !== null && !valid.includes(v)) {
        return res.status(400).json({ error: 'pronouns inválido.' });
      }
      update.pronouns = v;
    }

    if ('nationality' in req.body) {
      const v = req.body.nationality;
      if (v !== null && typeof v !== 'string') {
        return res.status(400).json({ error: 'nationality debe ser texto o null.' });
      }
      const clean = v === null ? null : v.trim();
      if (clean !== null && clean.length > 60) {
        return res.status(400).json({ error: 'nationality supera 60 caracteres.' });
      }
      update.nationality = clean || null;
    }

    if ('country' in req.body) {
      const v = req.body.country;
      if (v !== null && typeof v !== 'string') {
        return res.status(400).json({ error: 'country debe ser texto o null.' });
      }
      const clean = v === null ? null : v.trim();
      if (clean !== null && clean.length > 60) {
        return res.status(400).json({ error: 'country supera 60 caracteres.' });
      }
      update.country = clean || null;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('email name display_name bio education_level avatar_id interests age_range pronouns nationality country');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    console.log('[PROFILE] Actualizado para userId=' + req.user._id);
    res.json({ user: _userInfoResponse(user) });
  } catch (error) {
    next(error);
  }
};
