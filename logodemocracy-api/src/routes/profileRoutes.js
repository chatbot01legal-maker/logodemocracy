const express = require('express');

const router = express.Router();

const {
  getProfile,
  getLearningMap
} = require('../controllers/profileController');

const { optionalAuth } = require('../middlewares/auth');

router.get('/profile', optionalAuth, getProfile);
router.get('/learning-map', optionalAuth, getLearningMap);

module.exports = router;
