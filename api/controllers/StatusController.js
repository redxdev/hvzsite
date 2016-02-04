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
    }
};
