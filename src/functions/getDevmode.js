module.exports = async () => {
  try {
    await conn.connect();
    const collections = await conn.db("discordBot").collection("conf");

    const data = await collections.findOne({});

    devMode = data.container.devmode;
  } catch (error) {
    throw error;
  } finally {
    await conn.close();
  }

  return devmode;
};
