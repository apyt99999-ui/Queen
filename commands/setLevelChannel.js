const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const LevelConfig = require("../models/LevelConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-level-channel")
    .setDescription("تحديد روم رسائل الارتقاء")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(o => o.setName("channel").setDescription("الروم").setRequired(true)),

  async execute(interaction) {
    await LevelConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { channelId: interaction.options.getChannel("channel").id },
      { upsert: true }
    );

    interaction.reply({ content: "✅ تم تحديد روم الارتقاء", ephemeral: true });
  }
};
