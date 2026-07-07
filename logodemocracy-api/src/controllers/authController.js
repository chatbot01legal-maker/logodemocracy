const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PedagogicalProfile = require('../models/PedagogicalProfile');
const LearningMap = require('../models/LearningMap');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, sessionId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son obligatorios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, name });

    /* MIGRACIÓN O CREACIÓN ATÓMICA DE MEMORIAS 1 y 2 */
    let profile = null;
    let learningMap = null;

    if (sessionId) {
      // Si el usuario era invitado y tenía progreso local, vinculamos su cuenta real
      profile = await PedagogicalProfile.findOneAndUpdate(
        { sessionId, userId: { $exists: false } },
        { $set: { userId: user._id } },
        { new: true }
      );
      learningMap = await LearningMap.findOneAndUpdate(
        { sessionId, userId: { $exists: false } },
        { $set: { userId: user._id } },
        { new: true }
      );
    }

    if (!profile) {
      profile = await PedagogicalProfile.create({ userId: user._id });
    }
    if (!learningMap) {
      learningMap = await LearningMap.create({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
