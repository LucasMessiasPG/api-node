const BaseRouteController = require("./_BaseController");

class RouteController extends BaseRouteController{
    constructor(app, express){
        super(app, express, "v1");
    }


    getRoutes(){

        this.post( "/chat",                                 this.ChatController,    "create",               { userNotRequired: true });
        this.get(  "/chat/:chat_id",                        this.ChatController,    "get",                  { userNotRequired: true });
        this.post( "/chat/:chat_id/group",                  this.ChatController,    "createGroup",          { userNotRequired: true });
        this.post( "/chat/:chat_id/group/:group_id/user",   this.ChatController,    "addUserOnGroup",       { userNotRequired: true });
        this.post( "/chat/:chat_id/group/:group_id/message",this.ChatController,    "postMessage",          { userNotRequired: true });

        return this.router;
    }

}

module.exports = RouteController;