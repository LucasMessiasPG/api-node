const BaseController = require("./_BaseController");

class ChatController extends BaseController{
    constructor(){ super() }


    async get(params){
        try {
            
            const ChatModel = this.Models.chat;
            let chat = await ChatModel.findOne(
                this.QueryBuilder.build("chat",{
                    query: { _id: params.url.chat_id }
                })
            ).populate("groups");

             chat.limitMessages();

            return this.response(null, "get chat", { chat: chat });
        } catch (error) {
            return this.response(error, "error on get chat");
        }
    }

    async create(params){
        try {
            const ChatModel = this.Models.chat;

            let chat = new ChatModel();

            await chat.save();
            return this.response(null, "chat created", { _id: chat._id });
        } catch (error) {
            return this.response(error, "error on create chat");
        }
    }
    
    async createGroup(params){
        try {

            const ChatModel     = this.Models.chat;
            const GroupModel    = this.Models.group;

            let chat = await ChatModel.findOne({
                _id: params.url.chat_id
            })

            if(!chat) return this.response(null, "chat not found", {}, 409);
            
            let group = new GroupModel();

            group.title = params.body.title;

            await group.save();
            if(!chat.groups) chat.groups = [];
            chat.groups.push(group);
            await chat.save();

            return this.response(null, "group created", { group: group })
        } catch (error) {
            return this.response(error, "erro on create group");
        }
    }
    
    async addUserOnGroup(params){
        try {

            const GroupModel    = this.Models.group;

            let group = await GroupModel.findOne({
                _id: params.url.group_id
            })

            if(!group) return this.response(null, "group not found", {}, 409);
            
            if(!group.users) group.users = [];

            if(params.body.list){
                // add list user

                for(let user of params.body.list){

                    let hasUser = !!group.users.filter(item => {
                        return item.reference_id == user.reference_id;
                    }).length;
        
                    if(hasUser) return this.response(null, "duplicate user: "+user.reference_id, {}, 409);
        
                    group.users.push({
                        reference_id: user.reference_id,
                        name: user.name
                    });

                }

            }else{
                // add single user

                let hasUser = !!group.users.filter(item => {
                    return item.reference_id == params.body.reference_id;
                }).length;
    
                if(hasUser) return this.response(null, "duplicate user", {}, 409);
    
                group.users.push({
                    reference_id: params.body.reference_id,
                    name: params.body.name
                });

            }

            group.validateResume();

            await group.save();
            return this.response(null, "user added", { group: group });
        } catch (error) {
            return this.response(error, "error on add user on group");
        }
    }

    async postMessage(params){
        try {
            
            const GroupModel = this.Models.group;
            let group = await GroupModel.findOne({ _id: params.url.group_id });

            if(!group) return this.response(null, "group not found", {}, 409);

            let message = {};

            message.type = "message";
            message.text = params.body.text;
            // todo file
            // todo compile
            message.read = [this.user];
            message.posted_by = this.user;

            group.post(message);

            await group.save();

            return this.response(null, "post message", { group: group });
            
        } catch (error) {
            return this.response(error, "error on post message");
        }
    }


    async postFile(params){
        try {
            
            throw "todo"

            return this.response(null, "post message", { group: group });
            
        } catch (error) {
            return this.response(error, "error on post message");
        }
    }
}

module.exports = ChatController;