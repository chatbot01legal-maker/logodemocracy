const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['citizen', 'consultant', 'admin'],
    default: 'citizen'
  },

  /* Perfil personal (opcional, editable por el usuario) */
  display_name: {
    type: String,
    default: null,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    default: null,
    trim: true,
    maxlength: 300
  },
  education_level: {
    type: String,
    enum: ['basica', 'media', 'tecnica', 'universitaria', 'posgrado', 'prefiero_no_decir'],
    default: null
  },
  avatar_id: {
    type: String,
    default: null
  },
  interests: {
    type: [String],
    default: []
  },
  age_range: {
    type: String,
    enum: ['menos_18', '18_25', '26_35', '36_50', '51_65', 'mas_65', 'prefiero_no_decir'],
    default: null
  },
  pronouns: {
    type: String,
    enum: ['el', 'ella', 'elle', 'prefiero_no_decir'],
    default: null
  },
  nationality: {
    type: String,
    default: null,
    trim: true,
    maxlength: 60
  },
  country: {
    type: String,
    default: null,
    trim: true,
    maxlength: 60
  },

  /*
   * Recuperación de contraseña.
   * Nunca almacenamos el token original:
   * solamente su hash y su fecha de expiración.
   */
  passwordResetTokenHash: {
    type: String,
    default: null,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    default: null,
    select: false
  }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
