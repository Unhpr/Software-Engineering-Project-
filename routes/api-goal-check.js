const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');
const UserProfile = require('../models/UserProfile');

// ✅ This version doesn't need :email — it uses session email
router.get('/status', async (req, res) => {
  const email = req.session.email;
  if (!email) return res.redirect('/login');

  try {
    const goals = await UserGoal.find({ email });
    const user = await UserProfile.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    const statusReport = goals.map(goal => {
      if (goal.goal?.type === 'weight') {
        const target = parseFloat(goal.goal.value);
        const met = user.weight <= target;
        return {
          ...goal.goal,
          met,
          message: met ? '🎉 Goal achieved! Consider setting a new target.' : 'Goal in progress.'
        };
      }
      return { ...goal.goal, met: false, message: 'Unknown goal type' };
    });

    res.render('goal-status', { goals: statusReport, username: user.username });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
