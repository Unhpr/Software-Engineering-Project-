const express       = require('express');
const router        = express.Router();       
const Group         = require('../models/Group');
const { v4: uuidv4 } = require('uuid');


router.post('/create', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { name } = req.body;

  try {
    const inviteCode = uuidv4().slice(0, 8);
    const group = new Group({
      name,
      inviteCode,
      members:   [userId],
      createdBy: userId
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/join', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { identifier } = req.body;  // group name or invite code
  try {
    const group = await Group.findOne({
      $or: [
        { inviteCode: identifier },
        { name: identifier }
      ]
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.members.includes(userId))
      return res.status(400).json({ error: 'You are already in this group' });

    group.members.push(userId);
    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/mine', async (req, res) => {
  const userId = req.session.userId?.toString();
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const groups = await Group
    .find({ members: userId })
    .select('_id name createdBy');

  res.json(groups.map(g => ({
    _id:      g._id,
    name:     g.name,
    canDelete: g.createdBy.toString() === userId
  })));
});


// Get members of a specific group
router.get('/members/:groupId', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group
      .findOne({ _id: req.params.groupId, members: userId })
      .populate('members', 'username');  // pull in usernames
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json(group.members);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/leave/:groupId', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();
    res.json({ message: 'Left group' });
  } catch (err) {
    console.error('Leave group error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a group (only if you created it)
router.delete('/delete/:groupId', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    console.error('Delete group error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
