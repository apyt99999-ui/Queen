const { EmbedBuilder } = require("discord.js");
const LevelConfig = require("../models/LevelConfig");

module.exports = async (member, userData) => {
  const cfg = await LevelConfig.findOne({ guildId: member.guild.id });
  if (!cfg || !cfg.channelId) return;

  const ch = member.guild.channels.cache.get(cfg.channelId);
  if (!ch) return;

  const r = (t) =>
    t?.replace(/{user}/g, `<@${member.id}>`)
      ?.replace(/{username}/g, member.user.username)
      ?.replace(/{level}/g, userData.level)
      ?.replace(/{xp}/g, userData.xp);

  const e = cfg.embed;

  const embed = new EmbedBuilder()
    .setColor(e.color || "#ff0055")
    .setTitle(r(e.title))
    .setDescription(r(e.description));

  if (e.image) embed.setImage(e.image);
  if (e.thumbnail) embed.setThumbnail(e.thumbnail);
  if (e.footer) embed.setFooter({ text: r(e.footer) });

  ch.send({ embeds: [embed] });
};
