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
    const query = req.user ? { userId: req.user._id } : { sessionId: req.query.sessionId };
    let learningMap = await LearningMap.findOne(query);

    if (!learningMap && req.user) {
      learningMap = await LearningMap.create({ userId: req.user._id });
    }

    res.json({ learningMap: learningMap || { domains: {}, anchors: [], interaction_stats: {} } });
  } catch (error) {
    next(error);
  }
};
