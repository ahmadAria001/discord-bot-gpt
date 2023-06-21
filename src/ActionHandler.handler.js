let connections = require("./database/connect.mongo").client;

require("./database/connect.mongo")
  .testConnection()
  .then((res) => {
    console.log(res);
    return res;
  })
  .catch(console.dir);

let ai = require("./openai/configure")();
// console.log(ai);

require("./disscord/launcher").launcher();

module.exports.conn = connections;
