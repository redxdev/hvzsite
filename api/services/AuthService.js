var passport = require('passport');
var Promise = require('bluebird');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne(id).exec(function (err, user) {
        if (err) {
            done(err);
        }
        else {
            done(null, user);
        }
    });
});

function createUser(name, email, authMethod) {
    return new Promise(function (resolve, reject) {
        Promise.join(
            TagGenerator.apiKey(),
            TagGenerator.tag(),
            TagGenerator.tag(),
            TagGenerator.tag(),
            function (apiKey, humanTag1, humanTag2, zombieTag) {
                User.create({
                    name: name,
                    email: email,
                    authMethod: authMethod,
                    apiKey: apiKey,
                    zombieId: zombieTag,
                    activeHumanIds: [humanTag1, humanTag2]
                }, function (err, user) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(user);
                    }
                });
            }
        ).error(function (err) {
            reject(err);
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

        User.findOne({email: email}, function (err, user) {
            if (err) {
                done(err);
            }
            else if (user == undefined) {
                createUser(name, email, 'google')
                    .then(function (user) {
                        done(null, user);
                    }, function (err) {
                        done(err);
                    });
            }
            else if (user.authMethod !== 'google') {
                done(new Error("Cannot authenticate using method 'google'"));
            }
            else {
                done(null, user);
            }
        });
    }
));

//
// Exports
//

module.exports = {
    createUser: createUser,
    getUser: function (apiKey) {
        return new Promise(function (resolve, reject) {
            User.findOne({apiKey: apiKey}).exec(function (err, user) {
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
    }
};
