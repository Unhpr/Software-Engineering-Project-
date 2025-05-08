const express = require('express');
const router = express.Router();
const WeightLog = require('../models/WeightLog');

router.post('/add', async (req, res) => {
  const { email, weight, date } = req.body;

  try {
    const log = new WeightLog({
      email,
      weight,
      date: date ? new Date(date) : new Date()
    });

    await log.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send("Failed to log weight: " + err.message);
  }
});

module.exports = router;
