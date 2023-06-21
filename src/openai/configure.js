const { Configuration, OpenAIApi } = require("openai");
let tiktoken = require("@dqbd/tiktoken");
const { client } = require("../database/connect.mongo");

let openAi;

module.exports = () => {
  const config = new Configuration({ apiKey: process.env.OPENAI_KEY });
  const Ai = new OpenAIApi(config);
  openAi = Ai;

  return openAi;
};

module.exports.createMessage = async (message, userId, author) => {
  let msg = [{ role: "user", content: message }];

  let isExceed = await calcToken(userId, msg);
  console.log(isExceed);

  if (isExceed.content != null) return isExceed;

  let response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: msg,
  });

  // return response.data.usage;
  console.log(response.data.usage);
  isExceed.token = response.data.usage.total_tokens;

  let resultUpdate = await updateToken(isExceed, author);

  console.log(resultUpdate);

  return response.data.choices[0].message;
};

let calcToken = async (userId, words) => {
  const db = require("../database/connect.mongo").client;

  let enc;
  enc = tiktoken.get_encoding("cl100k_base");
  enc = tiktoken.encoding_for_model("gpt-3.5-turbo");

  let numToken = 0;

  for (let index = 0; index < words.length; index++) {
    numToken += 4;
    // console.log(words[index]);

    for (let key in words[index]) {
      numToken += enc.encode(words[index][key]).length;
      if (key == "name") numToken += -1;
    }
  }
  numToken += 3;

  let amountWord = calcWord(words[0].content);
  let isExceed = {
    role: "system",
    content: null,
    token: 0,
    words: 0,
    interaction: 1,
    idUser: userId,
  };

  isExceed.words = amountWord;
  isExceed.token = numToken;

  try {
    await db.connect();

    const database = db.db("discordBot");

    const collectionsInteraction = database.collection("interactions");
    const collectionsConfig = database.collection("conf");

    const dataUser = await collectionsInteraction.findOne({ userId: userId });
    const dataConfig = await collectionsConfig.findOne({
      "container.config": 1,
    });

    let limitConf = dataConfig.container.openAi.limit;

    if (dataUser != null || dataUser != undefined) {
      if (dataUser.interactions.tokenUsed >= limitConf) {
        isExceed.content = "Exceed Token Limit";
      }

      if (dataUser.interactions.tokenUsed + numToken >= limitConf) {
        isExceed.content = "Exceed Token Limit";
      }
    }

    if (isExceed != null || isExceed != undefined) return isExceed;
  } catch (error) {
    throw error;
  } finally {
    await db.close();
  }

  return isExceed;
};

const calcWord = (messageContent) => {
  let amountOfWord = messageContent.split(/\s+/).length;
  return amountOfWord;
};

const updateToken = async (resourcecs, author) => {
  let conn = require("../database/connect.mongo").client;

  let result;

  try {
    await conn.connect();
    let collection = conn.db("discordBot").collection("interactions");

    const idUser = resourcecs.idUser;
    const dataUser = await collection.findOne({ userId: idUser });

    if (dataUser != null) {
      let amountInterac1tion = dataUser.interactions.amount;
      let amountToken = dataUser.interactions.tokenUsed;
      let amountWord = dataUser.interactions.words;

      result = await collection.updateOne(
        { userId: idUser },
        {
          $set: {
            "interactions.amount": amountInterac1tion + resourcecs.interaction,
            "interactions.words": amountWord + resourcecs.words,
            "interactions.tokenUsed": amountToken + resourcecs.token,
            "interactions.lastInteraction": Math.floor(Date.now() / 1000),
          },
        }
      );

      return result;
    }

    resourcecs = await collection.insertOne({
      userId: idUser,
      userName: author.username,
      interactions: {
        amount: resourcecs.interaction,
        words: resourcecs.words,
        tokenUsed: resourcecs.token,
        lastInteraction: Math.floor(Date.now() / 1000),
      },
    });
  } catch (error) {
    throw error;
  } finally {
    await conn.close();
  }

  return result;
};
