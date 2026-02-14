const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("../models/User");
const Rank = require("../models/Rank");
const Config = require("../models/Config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("أوامر الأدمن الخاصة باللفل والرتب")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName("setrank")
        .setDescription("حدد رتبة لفل معين")
        .addIntegerOption(opt => opt.setName("level").setDescription("الفل الذي تريد تحديد الرتبة له").setRequired(true))
        .addRoleOption(opt => opt.setName("role").setDescription("الرتبة").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("setxp")
        .setDescription("تحدد XP لعضو معين")
        .addUserOption(opt => opt.setName("user").setDescription("العضو").setRequired(true))
        .addNumberOption(opt => opt.setName("amount").setDescription("كم XP").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("multiplier")
        .setDescription("ضاعف XP لرتبة معينة")
        .addRoleOption(opt => opt.setName("role").setDescription("الرتبة").setRequired(true))
        .addNumberOption(opt => opt.setName("value").setDescription("قيمة المضاعفة").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("setchannel")
        .setDescription("حدد الشات الذي يرسل فيه رسالة الارتقاء")
        .addChannelOption(opt => opt.setName("channel").setDescription("الشات").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("setmessage")
        .setDescription("خصص رسالة الارتقاء بالكامل")
        .addStringOption(opt => opt.setName("message").setDescription("رسالة مع {user} و {level}").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("reset")
        .setDescription("تصفر لفل عضو")
        .addUserOption(opt => opt.setName("user").setDescription("العضو").setRequired(true))
    ),
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (!interaction.member.permissions.has("Administrator")) return interaction.reply({ content: "🚫 فقط الأدمن يمكنه استخدام هذه الأوامر.", ephemeral: true });

    if (sub === "setrank") {
      const level = interaction.options.getInteger("level");
      const role = interaction.options.getRole("role");
      await Rank.findOneAndUpdate(
        { guildId: interaction.guild.id, level },
        { roleId: role.id },
        { upsert: true }
      );
      return interaction.reply(`✅ تم تحديد رتبة ${role.name} للفل ${level}`);
    }

    if (sub === "setxp") {
      const userOpt = interaction.options.getUser("user");
      const amount = interaction.options.getNumber("amount");
      const userData = await User.findOneAndUpdate(
        { userId: userOpt.id, guildId: interaction.guild.id },
        { xp: amount },
        { upsert: true, new: true }
      );
      return interaction.reply(`✅ تم تحديد XP ${amount} للعضو ${userOpt.username}`);
    }

    if (sub === "multiplier") {
      const role = interaction.options.getRole("role");
      const value = interaction.options.getNumber("value");
      await Rank.findOneAndUpdate(
        { guildId: interaction.guild.id, roleId: role.id },
        { xpMultiplier: value },
        { upsert: true }
      );
      return interaction.reply(`✅ تم مضاعفة XP للرتبة ${role.name} ×${value}`);
    }

    if (sub === "setchannel") {
      const channel = interaction.options.getChannel("channel");
      await Config.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { levelChannelId: channel.id },
        { upsert: true }
      );
      return interaction.reply(`✅ تم تحديد شات اللفل: ${channel.name}`);
    }

    if (sub === "setmessage") {
      const msg = interaction.options.getString("message");
      await Config.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { levelMessage: msg },
        { upsert: true }
      );
      return interaction.reply(`✅ تم تخصيص رسالة الارتقاء`);
    }

    if (sub === "reset") {
      const userOpt = interaction.options.getUser("user");
      await User.findOneAndUpdate(
        { userId: userOpt.id, guildId: interaction.guild.id },
        { xp: 0, level: 1, textXP:0, voiceXP:0 }
      );
      return interaction.reply(`✅ تم تصفير لفل العضو ${userOpt.username}`);
    }
  }
};
