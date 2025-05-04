// models/FoodItem.js
const mongoose = require('mongoose');
const FoodItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
});
module.exports = mongoose.model('FoodItem', FoodItemSchema);
