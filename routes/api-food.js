const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodItem');
const User = require('../models/UserProfile');


router.post('/log', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, calories } = req.body;
    const newLog = new FoodLog({
      name,
      calories,
      userId: user._id,
      date: new Date()
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error saving food log:', err);
    res.status(500).json({ error: 'Failed to save food log' });
  }
});


router.get('/log', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const logs = await FoodLog.find({ userId: user._id });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching food logs:', err);
    res.status(500).json({ error: 'Failed to fetch food logs' });
  }
});

module.exports = router;
