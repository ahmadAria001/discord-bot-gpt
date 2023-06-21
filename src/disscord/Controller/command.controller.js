module.exports.commands = async (interaction) => {
  const client = require("../launcher").client;

  if (interaction.commandName === "ping")
    require("../Commands/ping.command")(interaction);

  if (interaction.commandName === "init")
    require("../Commands/init.command")(interaction);

  if (interaction.commandName === "registercommand") {
    if (interaction.user.id == process.env.OWNER_ID) {
      require("../commandRegsiter").registerCommand();
      interaction.reply({
        content: `${interaction.user} has used </registercommand:1119111148214693978> command`,
      });
    }
  }

  if (interaction.commandName === "devmode")
    require("../Commands/devMode.command")(interaction);

  if (interaction.commandName === "avatar")
    require("../Commands/avatar.command")(interaction);
};
