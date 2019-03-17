const ExpressWebServer = require("./express-web-server");

const { GET, POST, ALL } = ExpressWebServer;

class Route {
  constructor(method, path, handler) {
    this._method = method;
    this._path = path;
    this._handler = handler;
  }

  getMethod() {
    return this._method;
  }

  getPath() {
    return this._path;
  }

  getHandler() {
    return this._handler;
  }
}

Route.GET = GET;
Route.POST = POST;
Route.ALL = ALL;

module.exports = Route;
