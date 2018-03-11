var Promise = require('bluebird');

module.exports = {
  infect: function (req, res) {
    var errors = [];

    var humanId = req.param('human');
    var zombieId = req.param('zombie');

    var hasLocation = req.param('location') || false;
    var latitude = req.param('latitude');
    var longitude = req.param('longitude');

    /*if (sails.config.hvz.endDate < new Date()) {
      errors.push("You cannot infect a player after the game has ended");
    }*/

    if (!humanId) {
      errors.push("Missing parameter 'human'");
    }

    if (!zombieId) {
      errors.push("Missing parameter 'zombie'");
    }

    if (hasLocation && (!latitude || !longitude)) {
      hasLocation = false;
      latitude = 0;
      longitude = 0;
    }

    if (!hasLocation) {
      latitude = 0;
      longitude = 0;
    }

    if (errors.length > 0) {
      return res.badRequest({
        message: "There was an error with your request",
        problems: errors
      });
    }

    HumanId.findOne({
      active: true,
      idString: humanId
    }).populate('user').exec(function (err, humanIdObj) {
      if (err) {
        res.negotiate(err);
      }
      else {
        User.findOne({
          team: 'zombie',
          zombieId: zombieId
        }).exec(function (err, zombie) {
          if (err) {
            res.negotiate(err);
          }
          else {
            var shouldCauseFailure = false;

            if (humanIdObj === undefined || !AuthService.hasPermission(humanIdObj.user, 'player')) {
              errors.push("Invalid human id.");
              shouldCauseFailure = true;
            }

            if (humanIdObj !== undefined && humanIdObj.user.team !== 'human') {
              errors.push("The human id entered belongs to a zombie.");
            }

            if (zombie == undefined || !AuthService.hasPermission(zombie, 'player')) {
              errors.push("Invalid zombie id.");
            }

            if (shouldCauseFailure) {
              req.user.failures++;
              req.user.save();
            }

            if (shouldCauseFailure || errors.length > 0) {
              return res.badRequest({
                message: "There was an error with your request",
                problems: errors
              });
            }

            var human = humanIdObj.user;

            InfectionSpread.create({
              hasLocation: hasLocation,
              latitude: latitude,
              longitude: longitude,
              zombie: zombie,
              human: human
            }, function (err, infection) {
              if (err) {
                res.negotiate(err);
              }
              else {
                BadgeRegistry.processInfectionBadges(human, zombie, infection)
                  .then(function () {
                    human.team = 'zombie';

                    humanIdObj.active = false;

                    zombie.humansTagged++;

                    Promise.join(
                      human.save(),
                      humanIdObj.save(),
                      zombie.save(),
                      function() {
                        NotificationService.sendToUser(human, "Infected", "You have been infected by " + zombie.name + "! Welcome to the horde.");
                        NotificationService.updateTags(human, {team: human.team});
                        FeedService.add(human, ["You have been infected by ", FeedService.user(zombie), "! Welcome to the horde."], FeedService.badgeImage('infected'));

                        Follower.find({user: human.id}).populate('follower').exec(function (err, followers) {
                          if (err) {
                            sails.log.error("There was a problem notifying followers of " + human.email);
                            sails.log.error(err);
                          }
                          else if (followers) {
                            var notify = [];
                            followers.forEach(function (follower) {
                              FeedService.add(follower.follower.id, [FeedService.user(human), " was infected by ", FeedService.user(zombie), "!"], FeedService.badgeImage('infected'));
                              notify.push(follower.follower);
                            });
                            NotificationService.sendToUsers(notify, "Infection", human.name + " was infected by " + zombie.name + "!");
                          }
                          
                          sails.log.info(zombie.email + " infected " + human.email);
  
                          res.ok({
                            human: human.getPublicData(),
                            zombie: zombie.getPublicData()
                          });
                        });
                      }
                    ).catch(function (err) {
                      res.negotiate(err);
                    });
                  }, function (err) {
                    InfectionSpread.destroy({id: infection.id}).exec(function () {
                      res.negotiate(err);
                    });
                  });
              }
            });
          }
        });
      }
    });
  },

  antivirus: function (req, res) {
    var errors = [];

    var zombieId = req.param('zombie');
    var avId = req.param('antivirus');

    if (sails.config.hvz.endDate < new Date()) {
      errors.push("You cannot infect a player after the game has ended");
    }

    if (!zombieId) {
      errors.push("Missing parameter 'zombie'");
    }

    if (!avId) {
      errors.push("Missing parameter 'antivirus'");
    }

    if (errors.length > 0) {
      return res.badRequest({
        message: "There was an error with your request",
        problems: errors
      });
    }

    AntivirusId.findOne({
      idString: avId
    }).exec(function (err, av) {
      if (err) {
        res.negotiate(err);
      }
      else {
        if (av === undefined) {
          req.user.failures++;
          req.user.save();

          return res.badRequest({
            message: "There was a problem using the antivirus.",
            problems: ['Invalid antivirus']
          });
        }

        if (!av.active) {
          return res.badRequest({
            message: "There was a problem using the antivirus.",
            problems: ['That antivirus has already been used.']
          });
        }

        if (av.expirationTime < new Date()) {
          return res.badRequest({
            message: "There was a problem using the antivirus.",
            problems: ['That antivirus has expired.']
          });
        }

        User.findOne({
          team: 'zombie',
          zombieId: zombieId
        }).exec(function (err, zombie) {
          if (err) {
            res.negotiate(err);
          }
          else {
            if (zombie == undefined || !AuthService.hasPermission(zombie, 'player')) {
              return res.badRequest({
                message: "There was a problem using the antivirus.",
                problems: ['Invalid zombie id.']
              });
            }

            if (zombie.usedAV) {
              return res.badRequest({
                message: "There was a problem using the antivirus.",
                problems: ['The zombie has already used an antivirus.']
              });
            }

            if (zombie.oz) {
              return res.badRequest({
                message: "There was a problem using the antivirus.",
                problems: ['Original zombies may not use an antivirus.']
              });
            }

            av.active = false;
            av.user = zombie.id;

            zombie.team = 'human';
            zombie.usedAV = true;
            zombie.addBadge('antivirus');

            Promise.join(
              av.save(),
              zombie.save(),
              function () {
                NotificationService.sendToUser(zombie, "Antivirus", "You have been brought back to life by an antivirus!");
                NotificationService.updateTags(zombie, {team: zombie.team});
                FeedService.add(zombie, ["You have been brought back to life by an antivirus!"], FeedService.badgeImage('antivirus'));

                Follower.find({user: zombie.id}).populate('follower').exec(function (err, followers) {
                  if (err) {
                    sails.log.error("There was a problem notifying followers of " + zombie.email);
                    sails.log.error(err);
                  }
                  else if (followers) {
                    var notify = [];
                    followers.forEach(function (follower) {
                      FeedService.add(follower.follower.id, [FeedService.user(zombie), " has used an antivirus!"], FeedService.badgeImage('antivirus'));
                      notify.push(follower.follower);
                    });
                    NotificationService.sendToUsers(notify, "Antivirus", zombie.name + " has used an antivirus!");
                  }
                  
                  sails.log.info(zombie.email + " used an antivirus");

                  res.ok({
                    zombie: zombie.getPublicData()
                  });
                });
              }
            ).catch(function (err) {
              res.negotiate(err);
            });
          }
        });
      }
    });
  },

  badge: function(req, res){
    var errors = [];
   
    var badgecode = req.param('badgecode');

    if (!badgecode) {
      errors.push("Missing parameter 'badgecode'");
    }

    if (errors.length > 0) {
      return res.badRequest({
        message: "There was an error with your request",
        problems: errors
      });
    }

    BadgeCode.findOne({
      idString: badgecode
    }).exec(function (err, bc) {
      if (err) {
        res.negotiate(err);
      }
      else {
        if (bc === undefined) {
          req.user.failures++;
          req.user.save();

          return res.badRequest({
            message: "There was a problem using the badge code.",
            problems: ['Invalid badge code']
          });
        }

        if (!bc.active) {
          return res.badRequest({
            message: "There was a problem using the badge code.",
            problems: ['That badge code has already been used.']
          });
        }
        bc.active = false;
        bc.user = req.user.id;
        req.user.addBadge(bc.badgeID);
        bc.save();
        req.user.save();
        res.ok({
          badge: bc.badgeID
        });
      }
    });
  }
};
