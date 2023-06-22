const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  const listModel = await require("../../openai/configure").aiModels();
  const client = require("../launcher").client;

  let data = listModel.data;
  let embedFields = [];

  let embedMessage = new EmbedBuilder()
    .setTitle("List Models")
    .setDescription(
      "This is the list of models available in OpenAi (This is only the first 25)"
    )
    .setAuthor({ name: client.user.username });

  for (let index = 0; index < 25; index++) {
    let template = { name: "", value: "", inline: false };
    template.name = data[index].id;
    template.value = data[index].owned_by;
    template.inline = true;

    embedFields.push(template);
  }

  embedMessage.addFields(embedFields);

  await interaction.reply({
    embeds: [embedMessage],
    content: "Here is the lsit of models",
    ephemeral: true,
  });
};
