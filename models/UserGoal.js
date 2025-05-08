// models/UserGoal.js
const mongoose = require('mongoose');

const UserGoalSchema = new mongoose.Schema({
  email: { type: String, required: true },
  goalType: { type: String, required: true },
  target: { type: String },
  distance: { type: Number },
  time: { type: Number },
  deadline: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserGoal', UserGoalSchema);
