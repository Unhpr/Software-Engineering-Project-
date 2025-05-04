// models/Group.js
const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  name: String,
  members: [String],
  inviteCode: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Group', groupSchema);
