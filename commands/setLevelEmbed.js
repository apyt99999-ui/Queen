const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const LevelConfig = require("../models/LevelConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-level-embed")
    .setDescription("تخصيص رسالة الارتقاء Embed")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName("title").setDescription("عنوان الإمبيد"))
    .addStringOption(o => o.setName("description").setDescription("وصف الإمبيد"))
    .addStringOption(o => o.setName("color").setDescription("لون HEX"))
    .addStringOption(o => o.setName("image").setDescription("رابط صورة أو GIF"))
    .addStringOption(o => o.setName("thumbnail").setDescription("رابط صورة مصغرة"))
    .addStringOption(o => o.setName("footer").setDescription("نص الفوتر")),

  async execute(interaction) {
    const data = {};
    for (const opt of ["title","description","color","image","thumbnail","footer"]) {
      const v = interaction.options.getString(opt);
      if (v) data[`embed.${opt}`] = v;
    }

    await LevelConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: data },
      { upsert: true }
    );

    interaction.reply({ content: "✅ تم حفظ رسالة الارتقاء", ephemeral: true });
  }
};
