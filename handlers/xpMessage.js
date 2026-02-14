const User = require("../models/User");
const Rank = require("../models/Rank");
const Config = require("../models/Config");
const calcLevel = require("../utils/levelSystem");
const xpTable = require("../utils/xpNeeded");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  if (!message.guild || message.author.bot) return;
  let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
  if (!user) user = new User({ userId: message.author.id, guildId: message.guild.id });
  if (user.blocked) return;
  if (user.lastMessage && Date.now() - user.lastMessage < 60000) return;

  let xp = Math.floor(Math.random() * 8) + 5;
  const ranks = await Rank.find({ guildId: message.guild.id });
  for (const r of ranks) if (message.member.roles.cache.has(r.roleId)) xp *= r.xpMultiplier;

  user.xp += xp;
  user.textXP += xp;
  user.dailyXP += xp;
  user.weeklyXP += xp;
  user.monthlyXP += xp;

  const newLevel = calcLevel(user.xp);

  if (newLevel > user.level) {
    user.level = newLevel;
    let config = await Config.findOne({ guildId: message.guild.id }) || await Config.create({ guildId: message.guild.id });
    if (config.levelChannelId) {
      const ch = message.guild.channels.cache.get(config.levelChannelId);
      if (ch) {
        const msg = config.levelMessage.replace("{user}", `<@${message.author.id}>`).replace("{level}", newLevel);
        const embed = new EmbedBuilder().setColor("#ffffff").setDescription(msg);
        ch.send({ embeds: [embed] });
      }
    }

    const rank = await Rank.findOne({ guildId: message.guild.id, level: newLevel });
    if (rank) {
      const role = message.guild.roles.cache.get(rank.roleId);
      if (role) message.member.roles.add(role);
    }
  }

  user.lastMessage = Date.now();
  await user.save();
};
