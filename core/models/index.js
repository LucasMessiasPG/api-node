const fs = require("fs");

class Schema{
    constructor(db){
        this.db = db
        this.models = {};

        let normalizedPath = require("path").join(__dirname);

        fs.readdirSync(normalizedPath).forEach((file) => {
            if(file === "index.js") return ;
            let _Schema = require("./" + file);
            this.models[_Schema.name.toLowerCase()] = new _Schema(this.db);
        });
    }

    getModels(){
        let models = {};

        for(let i in this.models){
            models[i] = this.models[i].model;
        }
        return models;
    }

    getModel(name){
        name = name.toLowerCase();
        return this.models[name].model;
    }

    
}


module.exports = Schema