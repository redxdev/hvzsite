module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (!AuthService.hasPermission(req.user, 'player')) {
            return res.forbidden({message: "Your account is not active."});
        }

        return next();
    }

    return res.unauthorized({message: "You are not logged in."});
}
