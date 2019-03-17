const Route = require("./route");

const { GET, POST, ALL } = Route;

class PredictionApi {
  getRoutes() {
    return [new Route(POST, "/prediction*", this._handlePost.bind(this))];
  }

  _handlePost(request, response) {
    response.send();
    const url = this._parseUrl(request);
    switch (url[1]) {
      case "predict_number":
        return this._handlePredictNumber();
    }
  }

  async _handlePredictNumber() {}

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
