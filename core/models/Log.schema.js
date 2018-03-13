const SchemaMongoose = require("mongoose").Schema;

class Log{
    constructor(db){

        if(db){
            this.db = db;
    
            let _schema = this.schema();
    
            // pre save
    
            // methods
    
            this.model = this.db.model("Log",_schema);
        }
    }

    schema(){
        return new SchemaMongoose({
            message: String,
            type: {
                type: String,
                enum: [ "log", "error" ],
                default: "log"
            },
            data: Object,
            user: {
                username: String,
                name: String,
                _id: SchemaMongoose.Types.ObjectId
            },
            url: String,
            error: {
                message: String,
                stack: Array,
                type: {
                    type: String
                }
            }
        })
    }
}

module.exports = Log