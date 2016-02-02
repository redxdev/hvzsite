module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    if (req.query.apikey == undefined) {
        return next();
    }

    AuthService.getUser(req.query.apikey)
        .then(function (user) {
            if (user) {
                req.logIn(user, function (err) {
                    if (err) {
                        return res.badRequest(err);
                    }

                    return next();
                });
            }
            else
                return next();
        }, function (err) {
            return next();
        });
}
