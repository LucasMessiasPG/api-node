const CONFIG    = require("./env/config");
const mongoose  = require("mongoose");
const Models    = require('./models');
const JWT       = require('jsonwebtoken');
const AWS       = require('aws-sdk');

  

function configExpress(params){

    const express           = require("express");
    const app               = express();
    const http              = require("http").Server(app);
    const bodyParser        = require('body-parser');
    const Route             = require('./route');
    const Middleware        = require('./middleware');
    const HandlerException  = require('./lib/exception/Handler');
    const morgan            = require('morgan');
    
    new HandlerException(app)

    app.use(morgan('tiny'));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    let route = new Route(app, express);

    let middleware = new Middleware(app);

    middleware.init();
    
    app.use((req, res, next) => {
        req.db = params.db;
        req.models = params.schemas.getModels();
        return next();
    });
    
    app.use(route.getRoutes());
    
    middleware.catch();

    return http;
}

module.exports = function(){

    mongoose.Promise = global.Promise;
    
    mongoose.connect(CONFIG.database);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const schemas = new Models(db);
    return Promise.resolve({ db: db, schemas: schemas })
    .then(configExpress);
};