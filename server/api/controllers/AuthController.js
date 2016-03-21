var passport = require('passport');

// TODO: Redirect to error pages

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
            if (err) {
                return res.badRequest({message: err.message});
            }

            if (!user) {
                return res.serverError({message: "There was a problem logging you in."})
            }

            req.logIn(user, function (err) {
                if (err) {
                    return res.badRequest(err);
                }

                res.redirect('/'); // TODO: Flash message
            });
        })(req, res);
    },

    registerGoogle: passport.authenticate('google-register', {scope: ['profile', 'email']}),
    callbackRegisterGoogle: function (req, res) {
        passport.authenticate('google-register', {failureRedirect: '/error'}, function (err, user) {
            if (err) {
                return res.badRequest({message: err.message});
            }

            if (!user) {
                return res.serverError({message: "There was a problem creating your account."})
            }

            res.redirect('/'); // TODO: Flash message
        })(req, res);
    }
}
