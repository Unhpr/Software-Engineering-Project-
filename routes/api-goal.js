const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');


router.post('/add', async (req, res) => {
  const { email, goalType, target, distance, time, deadline } = req.body;

  try {
    const newGoal = new UserGoal({
      email,
      goalType,
      target,
      distance: distance ? Number(distance) : null,
      time: time ? Number(time) : null,
      deadline: deadline ? new Date(deadline) : null
    });

    await newGoal.save();
    res.redirect('/dashboard'); // or another success page
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
