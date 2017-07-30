// This is designed to work with https://github.com/redxdev/hvz-rit-archive

var Promise = require('bluebird');
var jetpack = require('fs-jetpack');

module.exports = {
    archiveGame: function (file) {
        var archive = {};
        sails.log.info("Loading score...");
        Promise.join(
            User.count({team: 'human', access: 'player'}),
            User.count({team: 'zombie', access: 'player'}),
            function (humans, zombies) {
                archive.scores = {humans: humans, zombies: zombies, winners: []};

                sails.log.info("Loading winners...");
                User.find({team: 'human', access: 'player'}).exec(function (err, users) {
                    users.forEach(function (user) {
                        archive.scores.winners.push(user.name);
                    });

                    sails.log.info("Loading missions...");
                    Mission.find({sort: {postDate: 1}}).exec(function (err, missions) {
                        archive.missions = [];
                        missions.forEach(function (mission) {
                            archive.missions.push({
                                title: mission.title,
                                team: mission.team,
                                body: mission.body
                            });
                        });

                        sails.log.info("Saving...");
                        jetpack.write(file, archive);
                        sails.log.info("Complete!");
                    });
                });
            }
        );
    }
}