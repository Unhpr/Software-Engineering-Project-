const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');
const UserProfile = require('../models/UserProfile');

router.get('/status', async (req, res) => {
  const email = req.session.email;
  if (!email) return res.redirect('/login');

  try {
    const goals = await UserGoal.find({ email });
    const user = await UserProfile.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    const statusReport = goals.map(goal => {
      const targetWeight = parseFloat(goal.target);
      const met = goal.goalType === 'Weight Loss' && user.weight <= targetWeight;
      return {
        goalType: goal.goalType,
        target: goal.target,
        met,
        message: met ? "🎉 Goal achieved!" : "Goal in progress."
      };
    });

    res.render('goal-status', { goals: statusReport, username: user.username });
  } catch (err) {
    res.status(500).send('Server error');
  }
});




module.exports = router;
