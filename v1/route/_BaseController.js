const CoreBaseRouteController = require("../../core/route/BaseRoute.controller");

class BaseRouteController extends CoreBaseRouteController{
    constructor(app, express, version){ super(app, express, version) }
}

module.exports = BaseRouteController;