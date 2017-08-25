var Promise = require('bluebird');

module.exports = {
    infectOZ: function (req, res) {
        sails.log.info(req.user.email + ' is infecting OZs...');
        User.find({oz: true}, function (err, users) {
            if (err)
                return res.negotiate(err);

            var promises = [];
            users.forEach(function (user) {
                if (user.team === 'zombie')
                    return;

                user.team = 'zombie';
                user.addBadge('oz');
                promises.push(new Promise(function (resolve, reject) {
                    user.save(function (err) {
                        if (err) {
                            return reject(err);
                        }

                        sails.log.info(user.email + ' has been OZ\'d');

                        NotificationService.updateTags(user, {team: user.team});
                        NotificationService.sendToUser(user, "Infected", "You are an OZ! Go out there and eat some brains!");
                        FeedService.add(user, ["You are an OZ! Go out there and eat some brains!"], FeedService.badgeImage("oz"));
                        Follower.find({user: user.id}).populate('follower').exec(function (err, followers) {
                            if (err) {
                              sails.log.error(err);
                            }
                            else if (followers) {
                              var notify = [];
                              followers.forEach(function (follower) {
                                FeedService.add(follower.follower.id, [FeedService.user(user), " has become an OZ!"], FeedService.badgeImage('infected'));
                                notify.push(follower.follower);
                              });
                              NotificationService.sendToUsers(notify, "Infection", user.name + " has become an OZ!");
                            }
                          });
                        resolve();
                    });
                }));
            });

            Promise.all(promises).then(function () {
                res.ok({message: 'Started the infection with ' + promises.length + ' users.'});
            }).catch(function (err) {
                res.negotiate(err);
            });
        });
    }
};