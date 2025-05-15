// routes/dashboard.js
const express      = require('express');
const router       = express.Router();
const UserProfile  = require('../models/UserProfile');
const WeightLog    = require('../models/WeightLog');

router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  // load user profile
  const user = await UserProfile.findById(req.session.userId).lean();
  if (!user) return res.redirect('/login');

  // get latest weight log, or fallback to stored weight
  const lastLog = await WeightLog
    .findOne({ email: user.email })
    .sort({ date: -1 })
    .lean();

  const weight = lastLog ? lastLog.weight : user.weight;
  const heightM = user.height / 100;
  const bmi     = parseFloat((weight / (heightM * heightM)).toFixed(2));

  // feedback
  let feedback = 'Your BMI is normal.';
  if (bmi < 18.5) feedback = "You're underweight. Consider a weight-gain goal.";
  else if (bmi >= 25) feedback = "You're overweight. Consider a weight-loss goal.";

  // fetch recent logs
  const weightLogs = await WeightLog
    .find({ email: user.email })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  res.render('dashboard', {
    username   : user.username,
    email      : user.email,
    bmi,
    feedback,
    weightLogs
  });
});

module.exports = router;
