const express = require('express');
const router = express.Router();
const Goal = require('../models/UserGoal');
const User = require('../models/UserProfile');


router.post('/', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { goalType, target, deadline } = req.body;

    const newGoal = new Goal({
      goalType,
      target,
      deadline,
      userId: user._id
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal saved!", data: newGoal });
  } catch (err) {
    console.error('Error saving goal:', err);
    res.status(500).json({ error: 'Failed to save goal' });
  }
});


router.get('/', async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const goals = await Goal.find({ userId: user._id });
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

module.exports = router;
