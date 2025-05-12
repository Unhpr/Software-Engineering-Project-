const express = require('express');
const router = express.Router();
const Goal = require('../models/UserGoal');
const User = require('../models/UserProfile');



router.post('/add', async (req, res) => {
  const { goalType, target, distance, time, deadline } = req.body;
  // simple validation
  if (!goalType || !distance || !time || !deadline) {
    return res.status(400).send('All fields are required');
  }

  try {

    const username = req.session.username;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const goal = new Goal({
      userId:   req.session.userId,               // from your session
      goalType,                                  // e.g. "run", "swim"
      target,                                    // optional text target
      distance: Number(distance),                // e.g. kilometers
      time:     Number(time),                    // e.g. minutes
      deadline: new Date(deadline)               // e.g. "2025-06-01"
    });

    await goal.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send("Failed to create goal: " + err.message);
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
