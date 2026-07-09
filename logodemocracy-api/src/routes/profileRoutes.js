const express = require('express');

const router = express.Router();

const {
  getProfile,
  getLearningMap
} = require('../controllers/profileController');

router.get('/profile', getProfile);

router.get('/learning-map', getLearningMap);

module.exports = router;
