const config = require("./config.json");
const { ExpressServer } = require("./core/expressServer");
const { Channel } = require("./core/channel");
const {checkFiles} = require("./core/files");

async function start() {
  try {
    if (config.port === "") throw "Please set port in config.json";
    if (config.token === "") throw "Please set channel token in config.json";
    if (config.webhookUrl === "")
      throw "Please set webhook url (from ngrok, for example) in config.json";
    checkFiles()
    const channel = new Channel(config.token);
    await channel.checkHealth();

    await channel.setWebHook();

    const expressServer = new ExpressServer(config.port);
    expressServer.launch();
  } catch (e) {
    console.log(e);
  }
}
start().then(() => console.log("Start succesfull"));
