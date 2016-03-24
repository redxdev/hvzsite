var Promise = require('bluebird');

module.exports = {
  infect: function (req, res) {
    var errors = [];

    var humanId = req.param('human');
    var zombieId = req.param('zombie');

    var hasLocation = req.param('location') || false;
    var latitude = req.param('latitude');
    var longitude = req.param('longitude');

    if (sails.config.hvz.endDate < new Date()) {
      errors.push("You cannot infect a player after the game has ended");
    }

    if (!humanId) {
      errors.push("Missing parameter 'human'");
    }

    if (!zombieId) {
      errors.push("Missing parameter 'zombie'");
    }

    if (hasLocation && (!latitude || !longitude)) {
      errors.push("Missing latitude or longitude when specifying location");
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
              errors.push("Invalid human id");
              shouldCauseFailure = true;
            }

            if (humanIdObj !== undefined && humanIdObj.user.team !== 'human') {
              errors.push("The human id entered belongs to a zombie");
            }

            if (zombie == undefined || !AuthService.hasPermission(zombie, 'player')) {
              errors.push("Invalid zombie id");
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
                        sails.log.info(zombie.email + " infected " + human.email);

                        res.ok({
                          human: human.getPublicData(),
                          zombie: zombie.getPublicData()
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
        errors: errors
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
            message: "Invalid antivirus"
          });
        }

        if (!av.active) {
          return res.badRequest({
            message: "That antivirus has already been used"
          });
        }

        if (av.expirationTime < new Date()) {
          return res.badRequest({
            message: "That antivirus has expired"
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
                message: "Invalid zombie id"
              });
            }

            if (zombie.usedAV) {
              return res.badRequest({
                message: "Zombie has already used an antivirus"
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
                sails.log.info(zombie.email + " has used an antivirus");

                res.ok({
                  zombie: zombie.getPublicData()
                });
              }
            ).catch(function (err) {
              res.negotiate(err);
            });
          }
        });
      }
    });
  }
};
