const express = require('express');

const router = express.Router();

const {
  getProfile,
  getLearningMap,
  getUserInfo,
  updateUserInfo
} = require('../controllers/profileController');

const { optionalAuth, requireAuth } = require('../middlewares/auth');

router.get('/profile', optionalAuth, getProfile);
router.get('/learning-map', optionalAuth, getLearningMap);
router.get('/user-info', requireAuth, getUserInfo);
router.put('/user-info', requireAuth, updateUserInfo);

module.exports = router;
