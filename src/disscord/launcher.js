const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

module.exports.client = client;
module.exports.launcher = () => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  require("./Controller/main.controller").initialize();

  client.login(process.env.TOKEN);
};
