module.exports = async (interaction) => {
  if (
    interaction.user.id == process.env.OWNER_ID &&
    interaction.guildId == process.env.GUILD_ID
  ) {
    const conn = require("../../database/connect.mongo").client;

    try {
      await conn.connect();

      const collections = conn.db("discordBot").collection("conf");

      const data = await collections.findOne({});

      let devMode = data.container.devmode;

      if (devMode) {
        let result = await collections.updateOne(
          { "container.config": 1 },
          {
            $set: { "container.devmode": false },
          }
        );

        console.log(result);

        await interaction.reply({
          content: `Developer Mode has been disabled`,
          ephemeral: true,
        });

        return;
      }

      let result = await collections.updateOne(
        { "container.config": 1 },
        {
          $set: { "container.devmode": true },
        }
      );

      console.log(result);
      await interaction.reply({
        content: `Developer Mode has been enabled`,
        ephemeral: true,
      });
    } catch (error) {
      throw error;
    } finally {
      await conn.close();
      return;
    }
  }

  await interaction.reply({
    content: `You are in the developer server or not the owner of this bot`,
    ephemeral: true,
  });
};
