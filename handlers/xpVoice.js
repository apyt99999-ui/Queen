const User = require("../models/User");
const voiceTimes = new Map();

module.exports = async (oldState, newState) => {
  if (!newState.guild) return;
  const id = newState.id;

  if (!oldState.channel && newState.channel) voiceTimes.set(id, Date.now());

  if (oldState.channel && !newState.channel) {
    const joined = voiceTimes.get(id);
    if (!joined) return;
    const minutes = Math.floor((Date.now() - joined) / 60000);
    if (minutes < 2) return;

    let user = await User.findOne({ userId: id, guildId: newState.guild.id });
    if (!user) user = new User({ userId: id, guildId: newState.guild.id });
    user.voiceXP += minutes * 2;
    await user.save();
    voiceTimes.delete(id);
  }
};
