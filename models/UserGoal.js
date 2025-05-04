// models/UserGoal.js
const mongoose = require('mongoose');
const userGoalSchema = new mongoose.Schema({
  email: String,
  goal: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('UserGoal', userGoalSchema);
