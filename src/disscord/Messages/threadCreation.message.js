module.exports.threadCreation = async (message) => {
  let thread = await message.startThread({
    name: `${message.author.username} requested thread`,
    reason: `${message.author.username} requested thread creation`,
  });
  const { EmbedBuilder } = require("discord.js");

  let authorUrl = message.author.avatarURL({ size: 2048 });

  let embedMessage = new EmbedBuilder()
    .setTitle(`Thread Creation Requst by ${message.author.username}`)
    .setDescription(
      `${message.author} requested for thread at <t:${Math.floor(
        message.createdTimestamp / 1000
      )}:R>`
    )
    .setAuthor({ name: message.author.username, iconURL: authorUrl })
    .setColor("Green");

  let threadMessage = await thread.send({
    content: `Is there something you want to talk about, ${message.author}? I'm here to assist you in any way I can. 🤖`,
    embeds: [embedMessage], 
  });

  await threadMessage.pin();
};
