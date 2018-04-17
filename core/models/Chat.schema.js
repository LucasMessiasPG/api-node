const SchemaMongoose = require("mongoose").Schema;
const GroupSchema = require("./Group.schema");

class Chat{
    constructor(db){

        if(db){
            this.db = db;
    
            let _schema = this.schema();
    
            // pre save
    
            // methods
            _schema.methods.limitMessages = this.limitMessages
    
            this.model = this.db.model("Chat",_schema);
        }
    }

    schema(){
        return new SchemaMongoose({
            config: Object,
            groups: [{
                type: SchemaMongoose.Types.ObjectId, 
                ref: 'Group'
            }]
        })
    }

    limitMessages(limit = 10, skip = 0){

        if(limit < 1){
            limit = 1;
        }

        if(skip < 0){
            skip = 0
        }

        if(!this.groups || !this.groups.length) return this;

        this.groups = this.groups.map(group => {
            group.messages = group.messages.reverse().slice(skip,(skip+limit));
            group.messages.reverse();
            return group;
        });

        return this;
    }
}

module.exports = Chat