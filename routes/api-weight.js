// routes/api-weight.js
const express = require('express');
const router  = express.Router();
const WeightLog = require('../models/WeightLog');

router.post('/add', async (req, res) => {
  const userEmail = req.session.email;         
  const { weight, date } = req.body;

  if (!userEmail) return res.redirect('/login');

  try {
    const log = new WeightLog({
      email: userEmail,
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
