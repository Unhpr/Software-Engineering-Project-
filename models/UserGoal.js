// models/UserGoal.js
const mongoose = require('mongoose');

const UserGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', 
    required: true
  },
  goalType:  { type: String, required: true },
  target:    { type: String },                
  distance:  { type: Number, required: true },
  time:      { type: Number, required: true },
  deadline:  { type: Date,   required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserGoal', UserGoalSchema);
