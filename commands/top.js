const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("عرض التوب اليومي/الأسبوعي/الشهري")
    .addStringOption(o =>
      o.setName("type")
       .setDescription("اختر النوع")
       .setRequired(true)
       .addChoices(
         { name: "اليومي", value: "daily" },
         { name: "الأسبوعي", value: "weekly" },
         { name: "الشهري", value: "monthly" }
       )
    ),

  async execute(interaction) {
    const type = interaction.options.getString("type"); // daily / weekly / monthly

    // جلب جميع المستخدمين من DB
    let users = await User.find({ guildId: interaction.guild.id });

    // ترتيب حسب الكتابي
    const topText = users
      .sort((a,b) => b[`${type}XP`] - a[`${type}XP`])
      .slice(0,5)
      .map((u,i) => `-${i+1} <@${u.userId}> (${u[`${type}XP`]} XP)`)
      .join("\n");

    // ترتيب حسب الصوتي
    const topVoice = users
      .sort((a,b) => b[`${type}VoiceXP`] - a[`${type}VoiceXP`])
      .slice(0,5)
      .map((u,i) => `-${i+1} <@${u.userId}> (${u[`${type}VoiceXP`]} XP)`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#000000")
      .setTitle(`🏆 توب ${type}`)
      .setDescription(`**التوب الكتابي ${type}**\n${topText}\n[—————————]\n**التوب الصوتي ${type}**\n${topVoice}`)
      .setFooter({ text: "استخدم /top type:daily/weekly/monthly" });

    await interaction.reply({ embeds: [embed] });
  }
};
