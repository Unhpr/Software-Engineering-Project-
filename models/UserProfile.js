const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true },
  height: Number,
  weight: Number,
  bmi: Number,
  targetWeight: Number
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
