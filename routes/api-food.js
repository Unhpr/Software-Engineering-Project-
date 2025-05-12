const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const User = require('../models/UserProfile');

router.post('/', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, calories, mealType } = req.body;
    const newFood = new FoodItem({
      name,
      calories,
      mealType,
      userId: user._id
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    console.error('Error saving food:', err);
    res.status(500).json({ error: 'Failed to save food' });
  }
});

router.get('/', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await FoodItem.find({ userId: user._id });
    res.json(items);
  } catch (err) {
    console.error('Fetch food error:', err);
    res.status(500).json({ error: 'Failed to fetch food' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;