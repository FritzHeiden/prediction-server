const Route = require("./route");

const { GET } = Route;

class StatusApi {
  getRoutes() {
    return [new Route(GET, "/status*", this._handleGet.bind(this))];
  }

  _handleGet(request, response) {
    response.send();
    console.log("GET ", request.url);
  }
}

module.exports = StatusApi;
