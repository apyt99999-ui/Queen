const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  guildId: String,
  levelChannelId: String,
  levelMessage: { type: String, default: "🎉 {user} وصل لفل {level}" }
});

module.exports = mongoose.model("Config", configSchema);
