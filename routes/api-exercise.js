const express = require('express');
const router = express.Router();
const ExerciseItem = require('../models/ExerciseItem');
const User = require('../models/UserProfile');


router.post('/items', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name } = req.body;
    const newItem = new ExerciseItem({
      name,
      userId: user._id,
      completed: false
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error saving exercise:', err);
    res.status(500).json({ error: 'Failed to save exercise' });
  }
});


router.get('/items', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const items = await ExerciseItem.find({ userId: user._id });
    res.json(items);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

module.exports = router;
