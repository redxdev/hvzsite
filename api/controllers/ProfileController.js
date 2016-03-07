var SkipperDisk = require('skipper-disk');

module.exports = {
    mine: function (req, res) {
        var humanIds = [];
        for (var i = 0; i < req.user.humanIds.length; ++i) {
            var id = req.user.humanIds[i];
            humanIds.push({id: id.idString, active: id.active});
        }

        res.ok({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            access: req.user.access,
            signupDate: req.user.signupDate,
            team: req.user.team,
            zombieId: req.user.zombieId,
            humanIds: humanIds,
            humansTagged: req.user.humansTagged,
            badges: req.user.badges,
            clan: req.user.clan,
            apiKey: req.user.apiKey
        });
    },

    other: function (req, res) {
        var id = req.param("id");
        User.findOne({id: id}).exec(function (err, found) {
            if (err) {
                return res.negotiate(err);
            }

            if (found == null || !AuthService.hasPermission(found, 'player')) {
                return res.notFound({message: "Unknown user id " + id});
            }

            res.ok(found.getPublicData());
        });
    },

    setClan: function (req, res) {
        if (req.param('name') === undefined) {
            return res.badRequest({message: "'name' parameter not specified"});
        }

        if (sails.config.hvz.endDate < new Date()) {
            return res.badRequest({message: "You cannot change your clan after the game has ended"});
        }

        var name = req.param('name');
        if (name.length > 32) {
            return res.badRequest({message: "Clan name must be 32 characters or less."});
        }

        req.user.clan = name;
        req.user.save(function (err, user) {
            if (err) {
                return res.negotiate(err);
            }

            sails.log.info("Set " + req.user.email + " clan to " + name);
            res.ok({user: user.getPublicData()});
        });
    },

    avatar: function (req, res) {
        var id = req.param('id');
        User.findOne({id: id})
            .exec(function (err, user) {
                if (err) {
                    return res.negotiate(err);
                }

                if (user === undefined) {
                    return res.notFound()
                }

                if (user.avatarPath === null) {
                    return res.notFound();
                }

                var fileAdapter = SkipperDisk();
                fileAdapter.read(user.avatarPath)
                    .on('error', function (err) {
                        return res.negotiate(err);
                    })
                    .pipe(res);
            });
    }
}
