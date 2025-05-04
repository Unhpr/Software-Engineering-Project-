// models/ExerciseItem.js
const mongoose = require('mongoose');
const ExerciseItemSchema = new mongoose.Schema({
  name: String,
  type: String, // e.g., cardio, strength
});
module.exports = mongoose.model('ExerciseItem', ExerciseItemSchema);
