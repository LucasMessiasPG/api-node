const BaseController = require("./_BaseController");

class ExampleController extends BaseController{
    constructor(){ super() }

    async test(params){
        return this.response(null, "hello world");
    }
}

module.exports = ExampleController;