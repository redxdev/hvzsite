var passport = require('passport');
var Promise = require('bluebird');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne(id).populate('humanIds').exec(function (err, user) {
    if (err) {
      done(err);
    }
    else {
      done(null, user);
    }
  });
});

function createUser(name, email, authMethod) {
  authMethod = authMethod || 'google';

  sails.log.info('Creating user "' + name + '" with email "' + email + '", using auth method ' + authMethod);

  return Promise.join(
    TagGenerator.apiKey(),
    TagGenerator.tag(),
    function (apiKey, zombieTag) {
      return [apiKey, zombieTag];
    }
  ).spread(function (apiKey, zombieTag) {
    return [
      User.create({
        name: name,
        email: email,
        authMethod: authMethod,
        apiKey: apiKey,
        zombieId: zombieTag
      }),
      TagGenerator.tag(),
      TagGenerator.tag()
    ];
  }).spread(function (user, tag1, tag2) {
    return new Promise(function (resolve, reject) {
      return HumanId.create([
        {idString: tag1, user: user},
        {idString: tag2, user: user}
      ]).exec(function (err, tag1, tag2) {
        if (err) {
          User.destroy({id: user.id})
            .exec(function () {
              reject(err);
            });
        }
        else {
          resolve(user);
        }
      });
    });
  });
}

function createSuperAdmin(name, email, authMethod) {
  authMethod = authMethod || 'google';
  createUser(name, email, authMethod).then(function (user) {
    user.access = 'superadmin';
    user.save(function (err) {
      if (err) {
        sails.log.error(err);
        return;
      }
      sails.log.info("Created new superadmin " + email);
    });
  });
}

function createActiveUser(name, email, authMethod) {
  authMethod = authMethod || 'google';
  createUser(name, email, authMethod).then(function (user) {
    user.access = 'player';
    user.save(function (err) {
      if (err) {
        sails.log.error(err);
        return;
      }

      sails.log.info("Created new active user " + email);
    });
  });
}

//
// Configure passport strategies here!
//

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use('google', new GoogleStrategy({
    clientID: sails.config.auth.google.clientID,
    clientSecret: sails.config.auth.google.clientSecret,
    callbackURL: sails.config.hvz.url + "auth/c/google"
  },
  function (accessToken, refreshToken, profile, done) {
    var name = profile.displayName;
    var email = undefined;
    for (var i = 0; i < profile.emails.length; ++i) {
      email = profile.emails[i].value;
      if (profile.emails[i].type == 'account')
        break;
    }

    if (email == undefined) {
      return done(new Error("No email retrieved from google"));
    }

    User.findOne({email: email}).populate('humanIds').exec(function (err, user) {
      if (err) {
        done(err);
      }
      else if (user === undefined) {
        done(new Error("Whoops! You don't seem to be registered!"));
      }
      else if (user.authMethod !== 'google') {
        done(new Error("Cannot authenticate using method 'google'"));
      }
      else if (!hasPermission(user, 'player')) {
        done(new Error("Your account is not yet activated. Attend a registration session!"));
      }
      else {
        done(null, user);
      }
    });
  }
));

passport.use('google-register', new GoogleStrategy({
    clientID: sails.config.auth.google.clientID,
    clientSecret: sails.config.auth.google.clientSecret,
    callbackURL: sails.config.hvz.url + "auth/rc/google"
  },
  function (accessToken, refreshToken, profile, done) {
    var name = profile.displayName;
    var email = undefined;
    for (var i = 0; i < profile.emails.length; ++i) {
      email = profile.emails[i].value;
      if (profile.emails[i].type == 'account')
        break;
    }

    if (email == undefined) {
      return done(new Error("No email retrieved from google"));
    }

    User.findOne({email: email}, function (err, user) {
        if (err) {
          done(err);
        }
        else if (user !== undefined) {
          return done(new Error("You seem to already be registered! Try logging in instead."));
        }
        else if (user == undefined) {
          var ok = false;
          if (sails.config.auth.signupDomains.length == 0)
            ok = true;
          else {
            for (var i = 0; i < sails.config.auth.signupDomains.length; ++i) {
              var domain = sails.config.auth.signupDomains[i];
              if (StringUtil.endsWith(email, domain)) {
                ok = true;
                break;
              }
            }
          }

          if (ok) {
            createUser(name, email, 'google')
              .then(function (user) {
                done(null, user);
              }, function (err) {
                done(err);
              });
          }
          else {
            done(new Error("You cannot sign up using " + email + " as your email. Contact an administrator!"));
          }
        }
      }
    );
  }
));

function getPermissionLevel(role) {
  if (typeof role == 'object')
    role = role.access;

  if (typeof role == 'string')
    role = sails.config.permissions[role];

  if (role == undefined)
    return sails.config.permissions.unknown;

  return role;
}

function hasPermission(role, minRole) {
  role = getPermissionLevel(role);
  minRole = getPermissionLevel(minRole);
  console.log(role + " vs " + minRole);
  return role >= minRole && minRole > sails.config.permissions.unknown;
}

//
// Exports
//

module.exports = {
  createUser: createUser,
  createSuperAdmin: createSuperAdmin,
  createActiveUser: createActiveUser,
  getUser: function (apiKey) {
    return new Promise(function (resolve, reject) {
      User.findOne({apiKey: apiKey}).populate('humanIds').exec(function (err, user) {
        if (err) {
          reject(err);
        }
        else if (user == undefined) {
          reject(new Error("Invalid API key"));
        }
        else {
          resolve(user);
        }
      })
    });
  },
  getPermissionLevel: getPermissionLevel,
  hasPermission: hasPermission,
};
