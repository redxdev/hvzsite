var passport = require('passport');

module.exports = {
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },

    apiKey: function (req, res) {
        var user = req.user;
        if (!user) {
            return res.unauthorized({message: "You are not logged in!"});
        }
        else if (!user.active) {
            return res.forbidden({message: "Your account must be activated by a moderator."});
        }
        else {
            return res.ok({key: user.apiKey});
        }
    },

    // Passport Methods
    loginGoogle: passport.authenticate('google', {scope: ['profile', 'email']}),
    callbackGoogle: function (req, res) {
        passport.authenticate('google', {failureRedirect: '/error'}, function (err, user) {
            if (err || !user) {
                return res.badRequest({message: "There was a problem logging you in."});
            }

            req.logIn(user, function (err) {
                if (err) {
                    return res.badRequest(err);
                }

                res.redirect('/');
            });
        })(req, res);
    }
}
