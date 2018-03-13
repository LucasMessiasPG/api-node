const SchemaMongoose = require("mongoose").Schema;
const bcrypt = require("bcrypt-nodejs");

class User{
    constructor(db){

        if(db){
            this.db = db;
    
            let _schema = this.schema();
    
            // pre save
            // _schema.pre("save", this.register);
            _schema.pre("save", this.examplePreSave);
    
            // methods
            _schema.methods.exampleMethod = this.exampleMethod;
    
            this.model = this.db.model("Example",_schema);
        }
    }

    schema(){
        return new SchemaMongoose({
            example: String
        })
    }

    async exampleMethod(){
        // todo
        return true;
    }

    examplePreSave(next){
        // todo
        return next();
    }
}

module.exports = User