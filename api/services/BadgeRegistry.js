var moment = require('moment');
var Promise = require('bluebird');

var registry = sails.config.badges.registry;

// Check over the badges
for (var id in registry) {
    if (registry.hasOwnProperty(id)) {
        var badge = registry[id];
        if (badge.name === undefined) {
            sails.log.warn("Badge " + id + " is missing a name");
            badge.name = id;
        }

        if (badge.description === undefined) {
            sails.log.warn("Badge " + id + " is missing a description");
            badge.description = id;
        }

        if (badge.image === undefined) {
            sails.log.warn("Badge " + id + " is missing an image");
            badge.image = id + '.png';
        }

        if (badge.access === undefined) {
            sails.log.warn("Badge " + id + " is missing an access specifier, defaulting to 'internal'");
            badge.access = 'internal';
        }
    }
}

function applyKillstreak(recent, streak, badge, zombie) {
    var available = [];
    recent.forEach(function (infection) {
        if (!(infection.killstreaks.length > streak && infection.killstreaks[streak] === true)) {
            available.push(infection);
        }
    });

    if (available.length >= streak) {
        zombie.addBadge(badge);

        available.forEach(function (infection) {
            var streaks = infection.killstreaks;
            for (var i = streak; i > 1; --i) {
                streaks[i] = true;
            }

            infection.killstreaks = streaks;
        });
    }
}

module.exports = {
    processInfectionBadges: function (human, zombie, newInfection) {
        return new Promise(function (resolve, reject) {
            human.addBadge('infected');

            var now = new Date();
            var hour = now.getHours();
            var day = now.getDay();

            if (hour >= 6 && hour < 8)
                zombie.addBadge('earlyBird');
            else if (hour >= 23)
                human.addBadge('missionNotOver');

            if (day == 0)
                human.addBadge('badStart');
            else if (day >= 4)
                human.addBadge('soClose');

            InfectionSpread.findOne({
                createdAt: {
                    '<': now,
                    '>': moment().subtract(1, 'hours').toDate()
                },
                human: zombie.id
            }).exec(function (err, found) {
                if (err) {
                    return reject(err);
                }
                else if (found !== undefined) {
                    zombie.addBadge('quickTurnaround');
                }

                InfectionSpread.find({
                    createdAt: {
                        '<=': now,
                        '>=': moment().subtract(10, 'hours').toDate()
                    },
                    zombie: zombie.id
                }).exec(function (err, infections) {
                    if (err) {
                        return reject(err);
                    }

                    applyKillstreak(infections, 2, 'streak2', zombie);
                    applyKillstreak(infections, 3, 'streak3', zombie);
                    applyKillstreak(infections, 4, 'streak4', zombie);
                    applyKillstreak(infections, 5, 'streak5', zombie);
                    applyKillstreak(infections, 6, 'streak6', zombie);
                    applyKillstreak(infections, 7, 'streak7', zombie);
                    applyKillstreak(infections, 8, 'streak8', zombie);
                    applyKillstreak(infections, 9, 'streak9', zombie);
                    applyKillstreak(infections, 10, 'streak10', zombie);

                    infections.forEach(function (infection) {
                        infection.save({populate: false});
                    });

                    resolve();
                });
            });
        });
    }
};
