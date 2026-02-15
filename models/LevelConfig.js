const mongoose = require("mongoose");

const levelConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true },

  channelId: { type: String, default: null },

  embed: {
    title: { type: String, default: "🎉 Level Up!" },
    description: { type: String, default: "{user} وصل لفل **{level}** 🔥" },
    color: { type: String, default: "#ff0055" },
    image: { type: String, default: null },
    thumbnail: { type: String, default: null },
    footer: { type: String, default: null }
  }
});

module.exports = mongoose.model("LevelConfig", levelConfigSchema);
