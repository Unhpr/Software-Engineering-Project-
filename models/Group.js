// models/Group.js
const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Group', groupSchema);
