const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');


router.post('/add', async (req, res) => {
  const { email, goal } = req.body;
  const newGoal = new UserGoal({ email, goal });
  await newGoal.save();
  res.send({ message: 'Goal saved' });
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
