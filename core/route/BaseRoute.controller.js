const fs = require("fs");
const BaseController = require("../controller/BaseController");
  
class BaseRouteController{
    constructor(app, express, version){
        this.app = app;
        this.version = version;
        this.router = express.Router({mergeParams: true});

        let normalizedPath = require("path").join(__dirname, "../../"  + this.version + "/controllers");

        fs.readdirSync(normalizedPath).forEach((file) => {
            if(file[0] == "_") return ;
            let controller = require("../../" + this.version + "/controllers/" + file);
            this[controller.name] = controller;
        });

    }

    get(path, Controller, method, opt){ 
        return this.route("GET", path, Controller, method, opt); }

    post(path, Controller, method, opt){ 
        return this.route("POST", path, Controller, method, opt); }

    put(path, Controller, method, opt){ 
        return this.route("PUT", path, Controller, method, opt); }

    patch(path, Controller, method, opt){ 
        return this.route("PATCH", path, Controller, method, opt); }

    delete(path, Controller, method, opt){ 
        return this.route("DELETE", path, Controller, method, opt); }


    route(protocol, path, Controller, method, opt = {}){

        if(typeof opt.userNotRequired == "undefined") opt.userNotRequired = false;

        if(["GET","POST","PUT","PATCH","DELETE"].indexOf(protocol.toUpperCase()) === -1){
			throw new Error("Invalid protocol: " + protocol.toUpperCase() );
		}

		if(path.startsWith("/")){
			path = path.slice(1);
        }
        if(typeof Controller != "function"){
            throw new Error("try init a file not controller");
        }

        let context = new Controller();

        if(typeof context[method] != "function"){
            throw new Error(method + " is not a method on " + context.name);
        }

        let normalizedPathQuery = require("path").join(__dirname, "../../"  + this.version + "/query/_BaseController");

        let BaseQueryBuilder = require(normalizedPathQuery);

		this.router
        .route("/api/" + this.version + "/" + path)
        [protocol.toLowerCase()]
        ((req, res, next) => {

            if(opt.userNotRequired === false){
                if(!req.user || !req.user.username){
                    return res.status(400).json({success: false, message: "token not found"});
                }
            }else{
                req.user = {
                    name: "Lucas Messias",
                    reference_id: "1234"
                };
            }

            context.initRequest(req, res, next);

            context.QueryBuilder = new BaseQueryBuilder(req.user);
            return context[method](context.normalizeParams())
            .catch(err => {
                return req.thow(err, req, res);
            });
            
        });

		this.app.use(this.router);
		return this;
    }
}

module.exports = BaseRouteController