const express = require('express');
const router = express.Router();
const UserGoal = require('../models/UserGoal');


router.get('/api/goal-check/status/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const goals = await UserGoal.find({ username });
    console.log("Fetched goals:", goals); 

    res.render('goal-status', {
      goals,
      username,
    });
  } catch (err) {
    console.error('Error fetching goal status:', err);
    res.status(500).send("Failed to fetch goals");
  }
});

module.exports = router;
