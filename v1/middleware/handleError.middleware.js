class HandlerError{
    constructor(){}

    catch(err, req, res, next){
        if(!err) return next();
        let response = req.thow(err);
        return res.status(500).json(response);
    }
}

module.exports = HandlerError;