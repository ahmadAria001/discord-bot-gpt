module.exports = async (message) => {
  const client = require("../launcher").client;

  if (!message.channel.isThread()) {
    if (
      message.mentions.has(client.user) &&
      message.content.includes("create thread")
    ) {
      require("../Messages/threadCreation.message").threadCreation(message);
    }
  }

  if (message.channel.isThread()) {
    require("../Messages/threadHandler.message")(message);
  }
};
