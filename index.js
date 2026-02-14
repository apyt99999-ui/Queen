require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder, REST, Routes } = require("discord.js");
const mongoose = require("mongoose");
const xpMessage = require("./handlers/xpMessage");
const xpVoice = require("./handlers/xpVoice");
const profileImage = require("./utils/profileImage");
const User = require("./models/User");
require("./utils/resetXP");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

mongoose.connect(process.env.MONGO_URI);

const adminCommand = require("./commands/admin.js");
const topCommand = require("./commands/top.js");

// سجل جميع الأوامر مباشرة على السيرفر
const commands = [
  adminCommand.data?.toJSON?.(),
  topCommand.data.toJSON()
];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ الأوامر ظهرت مباشرة على السيرفر!");
  } catch (err) { console.error(err); }
})();

// رسائل
client.on("messageCreate", async (message) => {
  await xpMessage(message);

  if (message.content === "R") {
    const user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
    if (!user) return;
    const xpTable = require("./utils/xpNeeded");
    const nextLvl = Object.keys(xpTable).map(Number).sort((a,b)=>a-b).find(l => l > user.level) || user.level+5;
    const nextXP = xpTable[nextLvl] || (user.xp + 1000);
    const img = await profileImage(message.member, user, nextXP);
    const att = new AttachmentBuilder(img, { name: "rank.png" });
    message.reply({ files: [att] });
  }
});

client.on("voiceStateUpdate", xpVoice);
client.login(process.env.DISCORD_TOKEN);
