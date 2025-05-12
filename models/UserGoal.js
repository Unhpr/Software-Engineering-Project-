// models/UserGoal.js
const mongoose = require('mongoose');

const UserGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', 
    required: true
  },
  goalType:  { type: String, required: true },
  target:    { type: String },                // keep optional if you like
  distance:  { type: Number, required: true },// e.g. in km
  time:      { type: Number, required: true },// e.g. in minutes
  deadline:  { type: Date,   required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserGoal', UserGoalSchema);
