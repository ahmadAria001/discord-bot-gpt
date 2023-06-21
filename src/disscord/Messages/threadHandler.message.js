module.exports = async (message) => {
  let content = message.content.toString();

  let messages = content;

  let channel = message.channel;
  let isForAi = await channel.messages
    .fetchPinned({ limit: 100 })
    .then((msg) =>
      msg.map((el) => {
        return el.embeds.length;
      })
    )
    .catch((err) => console.log(err));

  if (isForAi < 1) return;

  let response = await require("../../openai/configure").createMessage(
    messages,
    message.author.id
  );

  await message.reply({ content: response.content });
};
