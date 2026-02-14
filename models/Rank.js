const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema({
  guildId: String,
  level: Number,
  roleId: String,
  xpMultiplier: { type: Number, default: 1 }
});

module.exports = mongoose.model("Rank", rankSchema);
