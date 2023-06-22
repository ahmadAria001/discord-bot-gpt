module.exports = async (interaction) => {
  if (interaction.member.id == process.env.OWNER_ID) {
    let dbClient = require("../../database/connect.mongo").client;

    try {
      await dbClient.connect();

      const config = await dbClient
        .db("discordBot")
        .collection("conf")
        .findOne({ "container.config": 1 }).isInit;

      if (config === false) {
        const collections = dbClient
          .db("discordBot")
          .collection("interactions");

        await collections.insertOne({
          userId: interaction.user.id,
          userName: interaction.user.username,
          interactions: {
            amount: 0,
            words: 0,
            tokenUsed: 0,
            lastInteraction: Math.floor(Date.now() / 1000),
          },
        });

        return await interaction.reply(
          `Init Completed in Namespace ${collections.namespace} with User ID ${
            interaction.user.id
          } and Username ${
            interaction.user.username
          } with Last Interaction is <t:${Math.floor(Date.now() / 1000)}:R>`
        );
      }

      await interaction.reply(`Database Already Initialized Failed`);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await dbClient.close();
      return;
    }
  }
};
