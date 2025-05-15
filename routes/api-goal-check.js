const express      = require('express');
const router       = express.Router();
const UserGoal     = require('../models/UserGoal');
const UserProfile  = require('../models/UserProfile');

router.get('/status', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');

  try {
    const user = await UserProfile.findById(userId);
    if (!user) return res.redirect('/login');

    
    const goals = await UserGoal.find({ userId });

    const statusReport = goals.map(goal => {
      let met = false;
      if (goal.goalType === 'Weight Loss') {
        met = user.weight <= parseFloat(goal.target);
      }
      

      return {
        goalType: goal.goalType,
        target:   goal.target,
        met,
        message:  met ? 'Goal achieved!' : 'Goal in progress.'
      };
    });

    res.render('goal-status', {
      username: user.username,
      goals:    statusReport
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = router;
