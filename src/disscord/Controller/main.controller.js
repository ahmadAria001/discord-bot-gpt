module.exports.initialize = () => {
  const conn = require("../../database/connect.mongo").client;
  const client = require("../launcher").client;

  client.on("interactionCreate", async (interaction) => {
    let devmode = await require("../../functions/getDevmode");

    if (devmode && interaction.guildId != process.env.GUILD_ID) {
      await interaction.reply({
        content: `Sorry, bot is currently under Maintenace`,
        ephemeral: true,
      });
      return;
    }

    if (interaction.isCommand)
      require("./command.controller").commands(interaction);
  });

  client.on("messageCreate", async (message) => {
    let devmode = await require("../../functions/getDevmode");

    if (devmode && message.guildId != process.env.GUILD_ID) {
      await interaction.reply({
        content: `Sorry, bot is currently under Maintenace`,
        ephemeral: true,
      });
      return;
    }

    if (message.author.bot) return;

    require("./messages.controller")(message);
  });
};
