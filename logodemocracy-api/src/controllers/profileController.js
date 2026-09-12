const PedagogicalProfile = require('../models/PedagogicalProfile');
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
