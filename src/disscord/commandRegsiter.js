module.exports.registerCommand = async () => {
  const { REST, Routes, SlashCommandBuilder } = require("discord.js");

  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!"),
    new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("get User avatar image")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Select a user from the choice ")
          .setRequired(false)
      ),
    new SlashCommandBuilder()
      .setName("init")
      .setDescription("Init mongo db database building"),
    new SlashCommandBuilder()
      .setName("registercommand")
      .setDescription("Reregister Commands"),
    new SlashCommandBuilder()
      .setName("devmode")
      .setDescription("Actiave Dev Mode (Can Only Triggered By Owner)"),
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
    return "Command Registered";
  } catch (error) {
    console.error(error);
    throw error;
  }
};
