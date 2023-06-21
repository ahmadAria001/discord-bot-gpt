module.exports = async (interaction) => {
  let imgUrl;
  let target;
  let options = interaction.options.getUser("user");

  if (
    options != null ||
    options != undefined
    // interaction.options._hoistedOptions != null ||
    // interaction.options._hoistedOptions != undefined ||
  ) {
    target = interaction.options.getUser("user");

    imgUrl = target.avatarURL({ size: 2048 });

    if (imgUrl == null) imgUrl = "User doesnt has profile Image";

    await interaction.reply({ content: imgUrl, ephemeral: true });
    return;
  }

  if (interaction.user.avatarURL() == null) {
    imgUrl = "User doesnt has profile Image";
    await interaction.reply({ content: imgUrl, ephemeral: true });
    return;
  }

  imgUrl = interaction.user.avatarURL({ size: 2048 });
  await interaction.reply({ content: imgUrl, ephemeral: true });
};
