const express = require("express");

const GET = "get";
const POST = "post";
const ALL = "all";

class ExpressWebServer {
  constructor() {
    this._app = express();
  }

  addRoute(route) {
    switch (route.getMethod()) {
      case GET:
        this._app.get(route.getPath(), route.getHandler());
        return;
      case POST:
        this._app.post(route.getPath(), route.getHandler());
        return;
      case ALL:
        this._app.all(route.getPath(), route.getHandler());
        return;
    }
  }

  addRoutes(routes) {
    routes.forEach(route => this.addRoute(route));
  }

  async start(port) {
    return new Promise(resolve => {
      this._app.listen(port, resolve);
    });
  }
}

ExpressWebServer.GET = GET;
ExpressWebServer.POST = POST;
ExpressWebServer.ALL = ALL;

module.exports = ExpressWebServer;
