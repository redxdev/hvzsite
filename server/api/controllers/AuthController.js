var passport = require('passport');

function generateResult(success, message, key) {
  if (typeof message === 'object')
    message = message.message;

  var obj = {success: success, message: message};
  if (key)
    obj.key = key;

  return {
    result: JSON.stringify(obj),
    origin: sails.config.hvz.url
  }
}

module.exports = {
  logout: function (req, res) {
    if (!req.isAuthenticated()) {
      return res.view('result', generateResult(true, "You aren't logged in!"));
    }

    req.logout();
    return res.view('result', generateResult(true, "You have been logged out."));
  },

  apiKey: function (req, res) {
    var user = req.user;
    if (!user) {
      return res.unauthorized({message: "You are not logged in!"});
    }
    else {
      return res.ok({key: user.apiKey});
    }
  },

  // Passport Methods
  loginGoogle: function (req, res) {
    if (req.isAuthenticated()) {
      return res.view('result', generateResult(true, "You are already logged in."));
    }

    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
  },
  callbackGoogle: function (req, res) {
    passport.authenticate('google', {failureRedirect: '/error'}, function (err, user) {
      if (err) {
        sails.log.error(err);
        return res.view('result', generateResult(false, err));
      }

      if (!user) {
        return res.view('result', generateResult(false, 'There was a problem logging you in. Have you registered?'));
      }

      req.logIn(user, function (err) {
        if (err) {
          sails.log.error(err);
          return res.view('result', generateResult(false, err));
        }

        return res.view('result', generateResult(true, 'You have been logged in.', req.user.apiKey));
      });
    })(req, res);
  },

  registerGoogle: passport.authenticate('google-register', {scope: ['profile', 'email']}),
  callbackRegisterGoogle: function (req, res) {
    passport.authenticate('google-register', {failureRedirect: '/error'}, function (err, user) {
      if (err) {
        sails.log.error(err);
        return res.view('result', generateResult(false, err));
      }

      if (!user) {
        return res.view('result', generateResult(false, 'There was a problem creating your account.'));
      }

      return res.view('result', generateResult(true, 'You have been registered. Go see a moderator to activate your account!'));
    })(req, res);
  }
}
