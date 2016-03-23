var passport = require('passport');

// TODO: Redirect to error pages

module.exports = {
  logout: function (req, res) {
    if (!req.isAuthenticated()) {
      return res.view('result', {result: "{success: false, message: 'You aren\\'t logged in!.'}"});
    }

    req.logout();
    return res.view('result', {result: "{success: true, message: 'You have been logged out.'}"});
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
      return res.view('result', {result: "{success: true, message: 'You are already logged in.', key: '" + req.user.apiKey + "'}"});
    }

    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
  },
  callbackGoogle: function (req, res) {
    passport.authenticate('google', {failureRedirect: '/error'}, function (err, user) {
      if (err) {
        sails.log.error(err);
        return res.view('result', {result: "{success: false, message: 'There was a problem logging you in.'}"});
      }

      if (!user) {
        return res.view('result', {result: "{success: false, message: 'There was a problem logging you in. Did you register?'}"});
      }

      req.logIn(user, function (err) {
        if (err) {
          sails.log.error(err);
          return res.view('result', {result: "{success: false, message: 'There was a problem logging you in. Did you register?'}"});
        }

        return res.view('result', {result: "{success: true, message: 'You have been logged in.', key: '" + req.user.apiKey + "'}"});
      });
    })(req, res);
  },

  registerGoogle: passport.authenticate('google-register', {scope: ['profile', 'email']}),
  callbackRegisterGoogle: function (req, res) {
    passport.authenticate('google-register', {failureRedirect: '/error'}, function (err, user) {
      if (err) {
        sails.log.error(err);
        return res.view('result', {result: "{success: false, message: 'There was a problem creating your account.'}"});
      }

      if (!user) {
        return res.view('result', {result: "{success: false, message: 'There was a problem creating your account.'}"});
      }

      return res.view('result', {result: "{success: true, message: 'You have been registered. Go see a moderator to activate your account!'}"});
    })(req, res);
  }
}
