const express = require('express');
const router = express.Router();
const ExerciseItem = require('../models/ExerciseItem');

router.get('/items', async (req, res) => {
  const items = await ExerciseItem.find();
  res.json(items);
});

module.exports = router;
