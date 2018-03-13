const setupHttp    = require('./core/server');
const CONFIG  = require('./core/env/config');

setupHttp()
.then(function(http){
    http.listen(CONFIG.port, () => {
        console.log("Server running on port: "+CONFIG.port);
    });
});