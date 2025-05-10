const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/UserProfile');
const { v4: uuidv4 } = require('uuid');


router.post('/create', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name } = req.body;
    const inviteCode = uuidv4().slice(0, 8);

    const group = new Group({
      name,
      inviteCode,
      members: [userId],
      createdBy: userId
    });
    await group.save();

    res.status(201).json({ message: 'Group created', group });
  } catch (err) {
    console.error('Group creation error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});


router.post('/join', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { inviteCode } = req.body;
    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.json({ message: 'Joined group', group });
  } catch (err) {
    console.error('Join group error:', err);
    res.status(500).json({ error: 'Failed to join group' });
  }
});


router.get('/mine', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (err) {
    console.error('Fetch groups error:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});


router.get('/members', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group.findOne({ members: userId }).populate('members', 'username email');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json(group.members);
  } catch (err) {
    console.error('Failed to fetch members:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});


router.post('/leave', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group.findOne({ members: userId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();

    res.json({ message: 'Left the group' });
  } catch (err) {
    console.error('Leave group error:', err);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});


router.delete('/delete', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group.findOne({ createdBy: userId });
    if (!group) return res.status(404).json({ error: 'No group found to delete' });

    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    console.error('Delete group error:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

module.exports = router;
