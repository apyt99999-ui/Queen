const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("عرض التوب اليومي/الأسبوعي/الشهري")
    .addStringOption(opt => opt.setName("type").setDescription("daily, weekly, monthly, all").setRequired(true))
    .addIntegerOption(opt => opt.setName("count").setDescription("عدد الأعضاء").setRequired(false)),

  async execute(interaction) {
    const type = interaction.options.getString("type");
    let count = interaction.options.getInteger("count") || 5;

    let sortField;
    if (type === "daily") sortField = "dailyXP";
    else if (type === "weekly") sortField = "weeklyXP";
    else if (type === "monthly") sortField = "monthlyXP";
    else sortField = "xp";

    const topUsers = await User.find({ guildId: interaction.guild.id }).sort({ [sortField]: -1 }).limit(count);

    const embed = new EmbedBuilder()
      .setTitle(`🏆 التوب ${type}`)
      .setColor("#00FF00");

    topUsers.forEach((u, i) => {
      const member = interaction.guild.members.cache.get(u.userId);
      if (member) embed.addFields({ name: `#${i+1} ${member.user.username}`, value: `${u[sortField]} XP`, inline: false });
    });

    interaction.reply({ embeds: [embed] });
  }
};
