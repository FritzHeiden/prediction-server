const Route = require("./route");
const ImagePredictor = require("./image-predictor");
const FileSystem = require("./file-system");

const { GET, POST, ALL } = Route;

const NO_NUMBER_RECOGNIZED = "no_number_recognized";

class PredictionApi {
  /**
   * @constructor
   * @param {ImagePredictor} imagePredictor
   */
  constructor(imagePredictor) {
    this._imagePredictor = imagePredictor;
  }

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
    const base64 = request.body;
    const buffer = Buffer.from(base64, "base64");
    const prediction = await this._imagePredictor.predictNumber(buffer);
    // await FileSystem.writeFile(`./image-${Date.now()}.jpg`, buffer);
    response.set("Content-Type", "text/plain");
    response.send(JSON.stringify({ prediction }));
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
