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
    .catch((err) => console.error(err));

  if (isForAi < 1) return;

  await message.channel.sendTyping();

  let response = await require("../../openai/configure").createMessage(
    messages,
    message.author.id,
    message.author
  );

  await message.reply({ content: response.content });
};
