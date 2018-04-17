const SchemaMongoose = require("mongoose").Schema;

class Group{
    constructor(db){

        if(db){
            this.db = db;
    
            let _schema = this.schema();
    
            // pre save
    
            // methods
            _schema.methods.post = this.post;
            _schema.methods.validateResume = this.validateResume;
    
            this.model = this.db.model("Group",_schema);
        }
    }

    schema(){

        let userSchema = new SchemaMongoose({
            reference_id: String,
            name: String
        })
        
        return new SchemaMongoose({
            title: String,
            users: [userSchema],
            resume: [
                {
                    user: userSchema,
                    on_group: Boolean,
                    unread: Number,
                    last_unread: {
                        _id: SchemaMongoose.Types.ObjectId,
                        created_at: Date
                    },
                    last_read: {
                        _id: SchemaMongoose.Types.ObjectId,
                        created_at: Date
                    },
                    added_at: {
                        type: Date,
                        default: Date.now
                    },
                    removed_at: Date
                }
            ],
            messages: [
                {
                    type: { 
                        type: String,
                        enum: ["message", "attachment", "notification"]
                    },
                    text: String,
                    file: {
                        link: String,
                        size: Number
                    },
                    compile: [
                        {
                            term: String,
                            values: [Object]
                        }
                    ],
                    read: [userSchema],
                    posted_by: userSchema,
                    created_at: {
                        type: Date,
                        default: Date.now
                    },
                    deleted_at: Date,
                    deleted_by: userSchema
                }
            ],
            notification: [ 
                {
                    type: { type: String, enum: [ "rest", "socket", "email" ]},
                    endpoint: String,
                    rule: [Object]
                }
            ],
            log: [
                {   
                    text: String,
                    created_at: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            created_at: {
                type: Date,
                deafult: Date.now
            }
        })
    }

    validateResume(){

        if(this.resume){
            let referenceId = new Set();

            this.resume.forEach( item => {
                referenceId.add(item.user.reference_id);
            })

            let users = this.messages.map( item => {
                let users = item.read.filter( _user => {
                    if(referenceId.has(_user.reference_id) === false){
                        referenceId.add(_user.reference_id);
                        return true;
                    }
                    return false;
                })
                return users;
            }).reduce((item, prev) => {
                prev = prev.concat(item);
                return prev;
            }, []);

            if(users.length){
                users.forEach( _user => {
                    this.resume.push({
                        user: _user 
                    })
                })
            }
            
        }else{
            let referenceId = new Set();
            let users = this.messages.map( item => {
                let users = item.read.filter( _user => {
                    if(referenceId.has(_user.reference_id) === false){
                        referenceId.add(_user.reference_id);
                        return true;
                    }
                    return false;
                })
                return users;
            }).reduce((item, prev) => {
                prev = prev.concat(item);
                return prev;
            }, []);

            console.log(users);

            if(users.length){
                users.forEach( _user => {
                    this.resume.push({
                        user: _user 
                    })
                })
            }
        }

        this.resume = this.resume.map( resume => {

            let user = resume.user;
            let last_unread = {};
            let last_read = {};

            let total_readed = this.messages.filter(message => {
                let read = message.read.filter(_user => {
                    return _user.reference_id == user.reference_id;
                }).length;

                if(read){
                    if(!last_read.created_at){
                        last_read = message;
                    }else{
                        if(new Date(last_read.created_at) < new Date(message.created_at)){
                            last_read = message;
                        }
                    }
                }else{
                    if(!last_unread.created_at){
                        last_unread = message;
                    }else{
                        if(new Date(last_unread.created_at) < new Date(message.created_at)){
                            last_unread = message;
                        }
                    }
                }

                return read;
            }).length;

            let tota_messages = this.messages.length;

            let total_unread = tota_messages - total_readed;

            if(total_unread){
                let all_messages = this.messages;
                all_messages.reverse();

                for(let mesage of all_messages){
                    if(last_unread) break;

                    let users_read = mesage.read.map( _user => {
                        return _user.reference_id;
                    })
                    if(users_read.includes(user.reference_id)){
                        last_unread = {
                            _id: message._id,
                            timestamp: message.created_at
                        };
                        break;
                    }
                    
                }
            }

            let user_resume = {
                user: user,
                on_group: !!this.users.filter( _user => {
                    return user.reference_id == _user.reference_id;
                }).length,
                unread: total_unread,
                last_unread: last_unread || {},
                last_read: last_read || {}
            }

            return user_resume;
        });

       
    }


    post(message){
        if(!this.messages) this.messages = [];
        if(!this.log) this.log = [];

        this.users = [message.posted_by];
        
        this.messages.push(message);
        if(message.text){
            this.log.push({
                text: message.posted_by.name+" posted - "+(message.text.length > 30 ? message.text.slice(0,30)+"..." : message.text) 
            })
        }
        // todo file
        // todo compile

        this.validateResume();
    }
}

module.exports = Group