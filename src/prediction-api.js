const Route = require("./route");
const FileSystem = require("./file-system");

const { GET, POST, ALL } = Route;

const NO_NUMBER_RECOGNIZED = "no_number_recognized";

class PredictionApi {
  getRoutes() {
    return [new Route(POST, "/prediction*", this._handlePost.bind(this))];
  }

  _handlePost(request, response) {
    console.log("POST", request.url);
    const url = this._parseUrl(request);
    switch (url[1]) {
      case "predict_number":
        return this._handlePredictNumber(request, response);
    }
  }

  async _handlePredictNumber(request, response) {
    console.log("PREDICTING ...");
    const base64 = request.body;
    const buffer = Buffer.from(base64, "base64");
    await FileSystem.writeFile(`./image-${Date.now()}.jpg`, buffer);
    response.set("Content-Type", "text/plain");
    console.log("DONE PREDICTING");
    response.send(NO_NUMBER_RECOGNIZED);
  }

  _parseUrl(request) {
    let url = request.url;
    if (url.indexOf("?") !== -1) {
      url = url.split("?")[0];
    }
    url = url.split("/");
    return url.filter(part => part !== "");
  }
}

module.exports = PredictionApi;
