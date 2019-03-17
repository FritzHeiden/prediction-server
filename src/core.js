const os = require("os");

const ExpressWebServer = require("./express-web-server");
const PredictionApi = require("./prediction-api");

class PredictionServer {
  constructor() {
    this._webServer = new ExpressWebServer();
  }

  async initialize() {
    const predictionApi = new PredictionApi();
    this._webServer.addRoutes(predictionApi.getRoutes());
  }

  async start(port) {
    const ip = this._getIpAddress();
    await this._webServer.start(port);
    return { ip, port };
  }

  _getIpAddress() {
    let ip = "";
    const netInterfaces = os.networkInterfaces();
    Object.keys(netInterfaces).forEach(netInterface => {
      if (netInterface === "lo") return;
      const protocols = netInterfaces[netInterface];
      protocols.forEach(protocol => {
        if (protocol.family.toLowerCase() !== "ipv4") return;
        ip = protocol.address;
      });
    });
    return ip;
  }
}

module.exports = PredictionServer;
