var createError = require('http-errors');

const error = function(){
    return createError("404", "Page doesnt exist daddy wa");
}
exports.hasAuth = function(req, res, next){
    if(req.user){
            next();
        }
        else {
            next(error());
    }
}