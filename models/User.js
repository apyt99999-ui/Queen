const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  textXP: { type: Number, default: 0 },
  voiceXP: { type: Number, default: 0 },
  dailyXP: { type: Number, default: 0 },
  weeklyXP: { type: Number, default: 0 },
  monthlyXP: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
  lastMessage: Date
});

module.exports = mongoose.model("User", userSchema);
