// models/FoodItem.js
const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);
