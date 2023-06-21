const { EmbedBuilder } = require("discord.js");

module.exports = (options) => {
  let embedMessage = new EmbedBuilder()
    .setTitle(options.name)
    .setDescription(options.desc)
    .setAuthor(options.author)
    .setColor(options.color)
    .setThumbnail(options.thumbnail)
    .setFields(
      options.fields.map((field) => {
        return field;
      })
    )
    .setImage(options.img)
    .setFooter(options.footer);

  return embedMessage;
};
