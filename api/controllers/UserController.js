var fs = require('fs');
var path = require('path');

module.exports = {
    get: function (req, res) {
        var id = req.param("id");

        User.findOne({id: id}).populate("humanIds").exec(function (err, user) {
            if (err) {
                return res.negotiate(err);
            }

            if (user === undefined) {
                return res.notFound({message: "Unknown user id " + id});
            }

            var humanIds = [];
            for (var i = 0; i < user.humanIds.length; ++i) {
                var id = user.humanIds[i];
                humanIds.push({id: id.idString, active: id.active});
            }

            res.ok({
                name: user.name,
                email: user.email,
                authMethod: user.authMethod,
                apiKey: user.apiKey,
                access: user.access,
                team: user.team,
                zombieId: user.zombieId,
                humanIds: humanIds,
                humansTagged: user.humansTagged,
                badges: user.badges,
                printed: user.printed,
                clan: user.clan,
                failures: user.failures,
                maxFailures: user.maxFailures,
                usedAV: user.usedAV
            });
        });
    },

    list: function (req, res) {
        var search = req.param('search');
        if (search === '')
            search = undefined;

        var q = User.find({
            sort: {name: 1}
        });

        if (search !== undefined) {
            q.where({
                or: [
                    {name: {'contains': search}},
                    {clan: {'contains': search}},
                    {email: {'contains': search}}
                ]
            });
        }

        q.exec(function (err, users) {
                if (err) {
                    res.negotiate(err);
                }
                else {
                    var result = [];
                    res.ok({
                        players: users.map(function (user) {
                            return user.getPublicData();
                        })
                    });
                }
            }
        );
    },

    update: function (req, res) {
        var id = req.param('id');
        User.findOne({id: id})
            .exec(function (err, user) {
                if (err) {
                    return res.negotiate(err);
                }

                if (user === undefined) {
                    return res.notFound({message: 'Unknown user id ' + id});
                }

                if (!AuthService.hasPermission(req.user, user)) {
                    return res.forbidden({message: 'You cannot modify a user with a higher rank than you (you are: ' + req.user.access + ', you need: ' + user.access + ')'});
                }

                var errors = [];
                var changed = false;

                var name = req.param('name');
                if (name !== undefined) {
                    user.name = name;
                    changed = true;
                }

                var email = req.param('email');
                if (email !== undefined) {
                    user.email = email;
                    changed = true;
                }

                var access = req.param('access');
                if (access !== undefined) {
                    if (AuthService.getPermissionLevel(access) === sails.config.permissions.unknown) {
                        errors.push('Unknown access level ' + access);
                    }
                    else if(!AuthService.hasPermission(req.user, access)) {
                        errors.push('Cannot set a user\'s access level to one higher than your own');
                    }
                    else {
                        user.access = access;
                        changed = true;
                    }
                }

                var team = req.param('team');
                if (team !== undefined) {
                    if (team !== 'human' && team !== 'zombie') {
                        errors.push('Unknown team ' + team);
                    }
                    else {
                        user.team = team;
                        changed = true;
                    }
                }

                var printed = req.param('printed');
                if (printed !== undefined) {
                    user.printed = printed == 'true'
                    changed = true;
                }

                var clan = req.param('clan');
                if (clan !== undefined) {
                    if (clan.length > 32) {
                        errors.push('Clan name must be 32 characters or less');
                    }
                    else {
                        user.clan = clan;
                        changed = true;
                    }
                }

                var usedAV = req.param('usedAV');
                if (usedAV !== undefined) {
                    user.usedAV = usedAV == 'true';
                    changed = true;
                }

                if (errors.length > 0) {
                    return res.badRequest({message: 'There was a problem with your request', errors: errors});
                }

                if (!changed) {
                    return res.badRequest({message: 'You didn\'t change anything!'});
                }

                user.save(function (err, user) {
                    if (err) {
                        return res.serverError(err);
                    }

                    sails.log.info("User " + user.email + " was modified by " + req.user.email);

                    return res.ok({message: 'Modified user ' + user.email});
                });
            });
    },

    uploadAvatar: function (req, res) {
        var id = req.param('id');
        User.findOne({id: id})
            .exec(function (err, user) {
                if (err) {
                    return res.negotiate(err);
                }

                if (user === undefined) {
                    return res.notFound({message: 'Unknown user id ' + id});
                }

                req.file('avatar').upload({
                    maxBytes: 5000000,
                    dirname: 'avatars'
                }, function (err, uploadedFiles) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    if (uploadedFiles.length === 0) {
                        return res.badRequest({message: 'No files were uploaded'});
                    }

                    user.avatarPath = uploadedFiles[0].fd;
                    user.save(function (err, user) {
                        if (err) {
                            return res.negotiate(err);
                        }

                        sails.log.info('Avatar for ' + user.email + ' modified by ' + req.user.email);
                        res.ok({message: 'Avatar successfully changed'});
                    });
                });
            });
    },

    create: function (req, res) {
        var name = req.param('name');
        var email = req.param('email');

        if (name === undefined || email === undefined) {
            return res.badRequest({message: 'Missing name or email parameter'});
        }

        AuthService.createUser(name, email)
            .then(function (user) {
                sails.log.info('User ' + user.email + ' was created by ' + req.user.email);
                res.ok({message: 'Created user ' + email, id: user.id});
            }, function (err) {
                res.negotiate(err);
            });
    }
};
