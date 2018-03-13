
const SimpleValidateObject = require("simple-validate-object");
const QueryBuilder = require("./BaseQueryController");

class BaseController{
    constructor(){}

    initRequest(req, res, next){
        this.req = req;
        this.res = res;
        this.next = next;

        this.user = req.user;
        this.Models = req.models;
        this.Validator = new SimpleValidateObject();
    }

    normalizeParams(){

        let params = {};
        params.body = this.req.body || {};
        params.url = this.req.params || {};
        params.query = this.req.query || {};

        return params;

    }

    validate(rules, obj){
        let err = this.Validator.validate(rules, obj);
        err.hasError = !err.isValid;
        return err;
    }

    response(err, message, data, status){
        if(err){
            let response = this.req.thow(err);
            return this.res.status(status || 400).json(response);
        }

        let success = !err && (typeof status == "undefined" || ( status && status == 200 ) ); 

        return this.res.status(status || (err ? 400 : 200) ).json({ timestamp: new Date().getTime(), success: success, message: message, data: data })
    }

    exists(obj){
        return typeof obj != "undefined";
    }

    debug(){
        console.log("")
        console.log("")
        console.log("")
        console.log("------")
        console.log("-> DEBUG:")
        let items = arguments;
        for(let i in items){
            console.log(items[i]);
        }
        console.log("------")
        console.log("")
        console.log("")
        console.log("")
    }

    async log(message, data){

        const LogModel = this.req.Models.log;
        let log = new LogModel();

        log.message = message;
        log.type = "log";
        log.data = data;

        log.user = this.user;
        log.url = this.req.protocol + "://" + this.req.get('host') + this.req.originalUrl;

        // todo decoded header for get data request (useagent);

        await log.save();

        return log;
        
    }
}

module.exports = BaseController;