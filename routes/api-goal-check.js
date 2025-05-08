const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');
const UserProfile = require('../models/UserProfile');

router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const goals = await UserGoal.find({ email });
    const user = await UserProfile.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    const statusReport = goals.map(goal => {
      let met = false;
      let message = "Goal in progress.";

      if (goal.goalType === 'Weight Loss' && goal.target) {
        const targetWeight = parseFloat(goal.target);
        met = user.weight <= targetWeight;
        message = met ? "🎉 Goal achieved!" : "Keep working on your goal!";
      }

      return {
        goalType: goal.goalType,
        target: goal.target,
        distance: goal.distance,
        time: goal.time,
        deadline: goal.deadline,
        met,
        message
      };
    });

    res.render('goal-status', { goals: statusReport, username: user.username });
  } catch (err) {
    res.status(500).send('Server error');
  }
});



module.exports = router;
