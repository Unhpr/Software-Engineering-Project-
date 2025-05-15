const express = require('express');
const router  = express.Router();

router.use((req, res, next) => {
  if (!req.session.username) return res.redirect('/login');
  next();
});

router.get('/', (req, res) => {
  res.render('diet');
});

module.exports = router;
