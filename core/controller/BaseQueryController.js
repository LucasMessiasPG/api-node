class BaseQueryController{
    constructor(){
        this.builder = {};
    }

    build(model = "", group = "basic", opt = {}, opt2){
        model = model.toLowerCase();
        if(!this.builder[model]) throw new Error("Model: "+model+" dont has query builder");

        if(typeof group == "object"){
            opt = group;
            if(!opt.group) opt.group = "basic";
            group = opt.group;
        }

        if(opt2){
            let aux = opt
            opt = {};
            opt.query = aux;
            opt.params = opt2;
        }

        return this.builder[model][group](opt.query, opt.params);
    }
}

module.exports = BaseQueryController;