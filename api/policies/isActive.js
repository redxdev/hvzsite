module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (!AuthService.hasPermission(req.user, 'player')) {
            return res.forbidden("Your account is not active.");
        }

        return next();
    }

    return res.unauthorized("You are not logged in.");
}
