module.exports = async (interaction) => {
  if (interaction.member.id == process.env.OWNER_ID) {
    let editor = require("../../ActionHandler.handler").jsonEditor();

    let dbInit = editor.get("container.mongodb.isInit");

    if (dbInit === false) {
      let dbClient = require("../../ActionHandler.handler").conn;

      try {
        await dbClient.connect();

        const collections = await dbClient
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

        await interaction.reply(
          `Init Completed in Namespace ${collections.namespace} with User ID ${
            interaction.user.id
          } and Username ${
            interaction.user.username
          } with Last Interaction is <t:${Math.floor(Date.now() / 1000)}:R>`
        );

        editor.set("container.mongodb.isInit", true);
        editor.save();
      } catch (error) {
        throw error;
      } finally {
        await dbClient.close();
        console.log("Connection CLosed");
        return;
      }
    }

    await interaction.reply(`Database Already Initialized Failed`);
  }
};
