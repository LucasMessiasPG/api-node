const JWT = require("jsonwebtoken");
const CONFIG = require("../../core/env/config");

class TokenMiddleware{
    constructor(){}

    init(req, res, next){
        let token = req.body.token || req.params.token || req.headers["x-access-token"] || req.query.token;

        if(!token){
            req.user = {};
            return next();
        }
        try{
            var decoded = JWT.verify(token, CONFIG.secret);
            req.user = decoded;
            return next();  
        }catch(err){
            req.user = {};
            return next();
        }

    }
}

module.exports = TokenMiddleware;