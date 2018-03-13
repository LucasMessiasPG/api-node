
const fs = require('fs');


class CoreMiddlewareBase {
    constructor(app){
        this.app = app;
        this.getMiddlwares();
    }

    init(){
        for(let name in this.list){
            let _Middleware = this.list[name];
            let _middleware = new _Middleware();

            if(typeof _middleware.init == 'function'){
                this.app.use(function(req, res, next){
                    return _middleware.init(req, res, next);
                })
            }
        }
    }

    catch(opt){
        for(let name in this.list){
            let _Middleware = this.list[name];
            let _middleware = new _Middleware(opt);

            if(typeof _middleware.catch == 'function'){
                this.app.use(function(err, req, res, next){
                    return _middleware.catch(err, req, res, next);
                })
            }

        }
    }

    getMiddlwares(){

        this.list = {};

        let normalizedPath = require("path").join(__dirname, "../../v1/middleware");

        fs.readdirSync(normalizedPath).forEach((file) => {
            let _middleware = require("../../v1/middleware/" + file);
            this.list[_middleware.name] = _middleware;
        });
    }

}

module.exports = CoreMiddlewareBase;