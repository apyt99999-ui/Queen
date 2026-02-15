require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  REST,
  Routes,
  Collection
} = require("discord.js");

const mongoose = require("mongoose");

const xpMessage = require("./handlers/xpMessage");
const xpVoice = require("./handlers/xpVoice");
const profileImage = require("./utils/profileImage");
const User = require("./models/User");

require("./utils/resetXP");

// ====== CLIENT ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ====== DB ======
mongoose.connect(process.env.MONGO_URI);

// ====== COMMANDS ======
const adminCommand = require("./commands/admin.js");
const topCommand = require("./commands/top.js");

client.commands = new Collection();
client.commands.set(adminCommand.data.name, adminCommand);
client.commands.set(topCommand.data.name, topCommand);

// ====== REGISTER SLASH COMMANDS (GUILD) ======
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: [
          adminCommand.data.toJSON(),
          topCommand.data.toJSON()
        ]
      }
    );
    console.log("✅ Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

// ====== SLASH COMMAND EXECUTION ======
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ حصل خطأ أثناء تنفيذ الأمر",
        ephemeral: true
      });
    }
  }
});

// ====== TEXT XP + R ======
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  await xpMessage(message);

  if (message.content === "R") {
    const user = await User.findOne({
      userId: message.author.id,
      guildId: message.guild.id
    });
    if (!user) return;

    const img = await profileImage(message.member, user);
    const att = new AttachmentBuilder(img, { name: "rank.png" });

    message.reply({ files: [att] });
  }
});

// ====== VOICE XP ======
client.on("voiceStateUpdate", xpVoice);

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
