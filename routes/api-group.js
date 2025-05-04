// routes/api-group.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

router.post('/create', async (req, res) => {
  const { name, members, inviteCode } = req.body;
  const newGroup = new Group({ name, members, inviteCode });
  await newGroup.save();
  res.send({ message: 'Group created' });
});

router.get('/:code', async (req, res) => {
  const group = await Group.findOne({ inviteCode: req.params.code });
  res.send(group);
});

module.exports = router;
