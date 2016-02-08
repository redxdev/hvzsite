var Promise = require('bluebird');

module.exports = {
    dates: function (req, res) {
        res.ok({
            start: sails.config.hvz.startDate,
            end: sails.config.hvz.endDate
        });
    },

    score: function (req, res) {
        Promise.join(
            User.count({team: 'human', access: 'player'}),
            User.count({team: 'zombie', access: 'player'}),
            function (humans, zombies) {
                res.ok({humans: humans, zombies: zombies});
            }
        ).catch(function (err) {
            res.serverError(err);
        });
    },

    players: function (req, res) {
        var sort = req.param('sort');
        if (sort === undefined)
            sort = 'team';

        var requireClan = false;
        switch (sort) {
            case 'team':
                sort = {humansTagged: -1, team: -1, name: 1};
                break;

            case 'clan':
                sort = {clan: 1, name: 1};
                requireClan = true;
                break;

            default:
                return res.badRequest({message: 'Unknown sort method "' + sort + '"'});
        }

        var search = req.param('search');
        if (search === '')
            search = undefined;

        var q = User.find({
            where: {
                access: 'player'
            },

            sort: sort
        });

        if (requireClan)
            q.where({clan: {'!': ['']}});

        if (search !== undefined) {
            q.where({ or: [
                {name: {'contains': search}},
                {clan: {'contains': search}}
            ]});
        }

        q.exec(function (err, users) {
            if (err) {
                res.serverError(err);
            }
            else {
                var result = [];
                for (var i = 0; i < users.length; ++i) {
                    var user = users[i];
                    result.push({
                        id: user.id,
                        name: user.name,
                        signupDate: user.signupDate,
                        team: user.team,
                        humansTagged: user.humansTagged,
                        badges: user.badges,
                        clan: user.clan
                    });
                }

                res.ok(result);
            }
        });
    },

    moderators: function (req, res) {
        // TODO
        res.serverError("TODO");
    }
};
