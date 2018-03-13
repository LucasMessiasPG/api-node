const BaseRouteController = require("./_BaseController");

class RouteController extends BaseRouteController{
    constructor(app, express){
        super(app, express, "v1");
    }


    getRoutes(){

        this.get("/", this.ExampleController, "test");
        // this.post(...)
        // this.patch(...)
        // this.put(...)
        // this.delete(...)

        return this.router;
    }

}

module.exports = RouteController;