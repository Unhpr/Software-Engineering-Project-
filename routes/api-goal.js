const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');


// routes/api-goal.js
router.post('/add', async (req, res) => {
  const { email, goalType, target, distance, time, deadline } = req.body;

  try {
    const newGoal = new UserGoal({
      email,
      goalType,
      target,
      distance: distance ? Number(distance) : undefined,
      time: time ? Number(time) : undefined,
      deadline: deadline ? new Date(deadline) : undefined
    });

    await newGoal.save();
    res.redirect('/dashboard'); 
  } catch (err) {
    res.status(500).send("Failed to save goal: " + err.message);
  }
});




router.get('/:email', async (req, res) => {
  const goals = await UserGoal.find({ email: req.params.email });
  res.send(goals);
});


router.get('/all', async (req, res) => {
  try {
    const goals = await UserGoal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch goals.' });
  }
});

module.exports = router;
