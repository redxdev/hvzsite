module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.unauthorized("You are not logged in!");
}
