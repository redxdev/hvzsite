module.exports = {
    mine: function (req, res) {
        res.ok({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            access: req.user.access,
            signupDate: req.user.signupDate,
            team: req.user.team,
            zombieId: req.user.zombieId,
            activeHumanIds: req.user.activeHumanIds,
            inactiveHumanIds: req.user.inactiveHumanIds,
            humansTagged: req.user.humansTagged,
            badges: req.user.badges,
            clan: req.user.clan
        });
    },

    other: function (req, res) {
        var id = req.param("id");
        User.findOne({id: id}).exec(function (err, found) {
            if (err) {
                return res.serverError(err);
            }

            if (found == null || !AuthService.hasPermission(found, 'player')) {
                return res.notFound({message: "Unknown user id " + id});
            }

            res.ok({
                id: found.id,
                name: found.name,
                signupDate: found.signupDate,
                team: found.team,
                humansTagged: found.humansTagged,
                badges: found.badges,
                clan: found.clan,
                access: found.access
            });
        });
    },

    setClan: function (req, res) {
        if (req.param('name') === undefined) {
            return res.badRequest({message: "'name' parameter not specified"});
        }

        var name = req.param('name');
        if (name.length > 32) {
            return res.badRequest({message: "Clan name must be 32 characters or less."});
        }

        req.user.clan = name;
        req.user.save(function (err) {
            if (err) {
                return res.serverError(err);
            }

            sails.log.info("Set " + req.user.email + " clan to " + name);
            res.ok({message: 'Clan name set to "' + name + '"'});
        });
    }
}
