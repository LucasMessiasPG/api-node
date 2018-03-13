const CONFIG = require("../../env/config");
const mongoose = require("mongoose");

class HandlerExeception{
    constructor(app, opt = {}){
        this.app = app;
        this.limitStack = opt.limitStack || 4;

        this.unhandledRejection();
        this.uncaughtException();

        app.use((req, res, next) => {
            req.thow = (err, _req, _res) =>     {

                if(!err) err = new Error("undefined error");
                
                this.processError(err, _req);

                let responseError = {
                    success: false,
                    timestamp: new Date().getTime(),
                    message: "whoops =("
                }

                if(CONFIG.debug && err instanceof Error){
                    let stack = err.stack.split("\n").slice(0,this.limitStack).map(line => { return "-> " + line.replace("    ","") });
                    responseError.stack = stack;
                    responseError.error = err.message || err.toString();
                }

                if(_res){
                    return _res.json(responseError);
                }
                return responseError;
            }

            return next();
        });
        
    }

    unhandledRejection(){
        
        let self = this;

        process.on('unhandledRejection', error => {
            self.processError(error);
        });
    }
    
    uncaughtException(){

        let self = this;

        process.on('uncaughtException',function(error){
            self.processError(error);
        })
    }


    processError(err, req){
        if(typeof err == "string") err = new Error(err);

        console.error("");
        console.error("");
        console.error("----------------------");
        console.error("New Error: " + new Date().toISOString());
        console.error("Message: " + err.message)
        console.error("----------------------");
        console.error("Stack:")
        let stack = err.stack.split("\n").slice(0,this.limitStack).map(line => { return "-> " + line.replace("    ","") });
        for(let line of stack){
            console.error(line);
        }
        console.error("----------------------");
        
        this.saveLog(err, req);
        
    }

    saveLog(err, req){
        let LogModel = mongoose.model("Log");
        let log = new LogModel();

        log.type = "error";
        log.message = "Catcher a error";

        if(req){
            let user = req.user;
            log.user = user;
            log.url = req.protocol + "://" + req.get('host') + req.originalUrl;

            // todo decoded header for get data request (useagent);
        }

        log.error.message = err.message;
        log.error.type = err.name;
        log.error.stack = err.stack.split("\n").map(line => { return "-> " + line.replace("    ","") });

        log.save();
        console.error("Log save: "+log._id.toString());
        console.error("----------------------");
    }

}

module.exports = HandlerExeception;

