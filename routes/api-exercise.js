const express = require('express');
const router = express.Router();
const ExerciseItem = require('../models/ExerciseItem');
const User = require('../models/UserProfile');

router.post('/items', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, type, duration, distance } = req.body;

    const newItem = new ExerciseItem({
      name,
      type,
      duration,
      distance,
      completed: false,
      userId: user._id
    });

    await newItem.save();
    res.status(201).json({ message: 'Exercise saved', data: newItem });
  } catch (err) {
    console.error('Error saving exercise:', err);
    res.status(500).json({ error: 'Failed to save exercise' });
  }
});

// in your router (e.g. routes/exercise.js)
router.patch('/items/:id/complete', async (req, res) => {
  try {
    const item = await ExerciseItem.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Marked completed', data: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});


router.get('/items', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findOne({ username });
    const items = await ExerciseItem.find({ userId: user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

module.exports = router;
