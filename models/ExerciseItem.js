const mongoose = require('mongoose');

const ExerciseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },        // e.g., "Cardio", "Strength"
  duration: { type: Number },                    // in minutes
  distance: { type: Number },                    // in km
  completed: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ExerciseItem', ExerciseItemSchema);
