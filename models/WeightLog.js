const mongoose = require('mongoose');

const WeightLogSchema = new mongoose.Schema({
  email: String,
  weight: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeightLog', WeightLogSchema);
