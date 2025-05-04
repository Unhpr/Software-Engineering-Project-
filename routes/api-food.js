const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');

router.post('/add', async (req, res) => {
  const { name, calories } = req.body;
  try {
    await FoodItem.create({ name, calories });
    res.json({ message: 'Food item added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add food' });
  }
});

router.get('/items', async (req, res) => {
  const items = await FoodItem.find();
  res.json(items);
});

module.exports = router;
