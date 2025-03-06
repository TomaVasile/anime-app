const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['simple', 'premium'], default: 'simple' },
  isAdmin: { type: Boolean },
  avatar: { type: String, default: 'http://localhost:3000/user-avatar/avatar.jpg' }
});

module.exports = mongoose.model('User', userSchema);