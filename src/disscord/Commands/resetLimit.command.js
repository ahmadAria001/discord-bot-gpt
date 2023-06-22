module.exports = async (interaction) => {
  let conn = require("../../database/connect.mongo").client;

  let options = interaction.options.getUser("user");
  await interaction.deferReply({ ephemeral: true });

  if (options.bot)
    return await interaction.editReply({
      content: `User <@${options.id}> is a bot, Cannot reset token of a bot `,
      ephemeral: true,
    });

  try {
    await conn.connect();
    let collection = conn.db("discordBot").collection("interactions");

    const idUser = options.id;
    const dataUser = await collection.findOne({ userId: idUser });

    if (dataUser != null) {
      result = await collection.updateOne(
        { userId: idUser },
        {
          $set: {
            "interactions.tokenUsed": 0,
          },
        }
      );

      await interaction.editReply({
        content: `Token usage has been reseted for user <@${options.id}>`,
      });
      return;
    }

    await interaction.editReply({
      content: `User <@${options.id}> haven't interact with the ai yet!`,
    });
    return;
  } catch (error) {
    throw error;
  } finally {
    await conn.close();
  }
};
