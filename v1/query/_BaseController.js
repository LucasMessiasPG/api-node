const CoreQueryController = require("../../core/controller/BaseQueryController");
const UserQuery = require("./user.query");
const fs = require("fs");

class BaseQueryBuilder extends CoreQueryController{
    constructor(user){
        super();

        let normalizedPath = require("path").join(__dirname + "/./");

        fs.readdirSync(normalizedPath).forEach((file) => {
            if(file[0] == "_") return ;
            let QueryBuilder = require("./" + file);
            this.builder[file.split(".")[0].toLowerCase()] = new QueryBuilder(user);
        });
    }
}

module.exports = BaseQueryBuilder;