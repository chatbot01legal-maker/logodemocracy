const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PedagogicalProfile = require('../models/PedagogicalProfile');
const LearningMap = require('../models/LearningMap');
const { sendPasswordResetEmail } = require('../services/emailService');

const PASSWORD_RESET_EXPIRES_MS = 60 * 60 * 1000;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const normalizeEmail = (email) => {
  return String(email || '').trim().toLowerCase();
};

const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, sessionId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son obligatorios.' });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name
    });

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
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

/*
 * Solicitud de recuperación.
 *
 * La respuesta pública es siempre la misma para evitar revelar
 * si un correo está registrado.
 */
exports.forgotPassword = async (req, res, next) => {
  const genericResponse = {
    message: 'Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer la contraseña.'
  };

  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(200).json(genericResponse);
    }

    const user = await User.findOne({ email })
      .select('+passwordResetTokenHash +passwordResetExpires');

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = hashResetToken(resetToken);
    const resetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRES_MS);

    user.passwordResetTokenHash = resetTokenHash;
    user.passwordResetExpires = resetExpires;
    await user.save();

    const resetBaseUrl =
      process.env.PASSWORD_RESET_URL || 'https://logodemocracy.tech/';

    const separator = resetBaseUrl.includes('?') ? '&' : '?';
    const resetUrl =
      `${resetBaseUrl}${separator}reset_token=${encodeURIComponent(resetToken)}`;

    try {
      await sendPasswordResetEmail({
        toEmail: user.email,
        toName: user.name,
        resetUrl
      });
    } catch (emailError) {
      /*
       * No devolvemos el error al usuario porque eso podría revelar
       * que el correo existe. Invalidamos el token si el envío falló.
       */
      console.error(
        '[Auth] Error enviando correo de recuperación:',
        emailError.message
      );

      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      await user.save();
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = String(req.body.token || '');
    const newPassword = String(req.body.password || '');

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        error: 'El enlace de recuperación y la nueva contraseña son obligatorios.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    const resetTokenHash = hashResetToken(resetToken);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpires: { $gt: new Date() }
      },
      {
        $set: { passwordHash },
        $unset: {
          passwordResetTokenHash: 1,
          passwordResetExpires: 1
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        error: 'El enlace de recuperación no es válido o ha expirado.'
      });
    }

    // Igual que en el login normal:
    // el cambio de contraseña también deja la sesión iniciada.
    const token = generateToken(user._id);

    return res.json({
      message: 'Contraseña actualizada correctamente.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
