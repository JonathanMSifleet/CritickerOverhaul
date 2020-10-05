const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, ' A user must have a name'],
    trim: true,
    unqiue: true,
    maxlength: [20, 'User name cannot be longer than 40 characters'],
    minlength: [3, 'User name cannot be shorter than 10 characters'],
    validator: [
      validator.isAlphanumeric,
      'Username must not contain special characters'
    ]
  },
  firstName: {
    type: String,
    required: [true, ' A user must have a name'],
    trim: true,
    maxlength: [16, 'User name cannot be longer than 40 characters'],
    minlength: [3, 'User name cannot be shorter than 10 characters'],
    validator: [validator.isAlpha, 'Username must only contain  characters']
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    trim: true,
    lowercase: [true, 'Email address must be lowercase'],
    validate: [validator.isEmail, 'Not a valid email']
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    maxlength: [64, 'Password max length is 64 characters'],
    minlength: [8, 'Password min length is 8 characters'],
    required: [true, 'Please enter a password'],
    select: false
  },
  token: {
    type: String,
    select: false
  }
});

// encrypt password:
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); // second parameter defines salt rounds
  next();
});

// check if password is correct:
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;