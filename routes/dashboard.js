const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const { username, email, bmi, bmiFeedback: feedback } = req.session;
  res.render('dashboard', { username, email, bmi, feedback });
});

module.exports = router;
