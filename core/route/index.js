const V1Route = require("../../v1/route/route.controller");

class CoreRouteController{
    constructor(app, express){
        this.app = app;
        this.express = express;
        this.router = express.Router({mergeParams: true});
    }

    getRoutes(){
        let v1Route = new V1Route(this.app, this.express);
        
		this.router.use(v1Route.getRoutes());

		return this.router;
    }
}

module.exports = CoreRouteController;