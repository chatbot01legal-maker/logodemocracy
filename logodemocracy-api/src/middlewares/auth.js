const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado o sesión inválida.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token expirado o inválido.' });
  }
};

/* Middleware opcional para capturar identidad en rutas híbridas (Sincronizado / Invitado) */
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    }
  } catch (e) {
    // Si el token falla en ruta opcional, simplemente procedemos como anónimo
    req.user = null;
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
