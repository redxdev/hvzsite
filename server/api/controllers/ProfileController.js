var SkipperDisk = require('skipper-disk');

module.exports = {
  mine: function (req, res) {
    var profile = req.user.getAllData();
    var humanIds = [];
    for (var i = 0; i < req.user.humanIds.length; ++i) {
      var id = req.user.humanIds[i];
      humanIds.push({idString: id.idString, active: id.active});
    }

    profile.humanIds = humanIds;

    Follower.find({user: req.user.id}).exec(function (err, followers) {
      if (err)
        return res.negotiate(err);

      profile.followers = [];
      if (followers) {
        followers.forEach(function (follower) {
          profile.followers.push(follower.follower);
        });
      }
      
      res.ok({
        profile: profile
      });
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

      if (req.user != null && req.user.id != id) {
        var profile = found.getPublicData();
        Follower.findOne({user: found.id, follower: req.user.id}).exec(function (err, follower) {
          if (err)
            return res.negotiate(err);

          if (follower == null) {
            profile.following = false;
          }
          else {
            profile.following = true;
          }

          res.ok({profile: profile});
        });
      }
      else {
        res.ok({profile: found.getPublicData()});
      }
    });
  },

  follow: function (req, res) {
    var id = req.param("id");
    if (id == req.user.id) {
      return res.badRequest({message: "You cannot follow yourself!"});
    }

    User.findOne({id: id}).exec(function (err, found) {
      if (err) {
        return res.negotiate(err);
      }

      if (found == null || !AuthService.hasPermission(found, 'player')) {
        return res.notFound({message: "Unknown user id " + id});
      }

      Follower.findOrCreate({user: id, follower: req.user.id}, {user: id, follower: req.user.id}).exec(function (err, follower) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info(req.user.email + " is now following " + found.email);
        return res.ok({message: "You are now following " + found.name});
      });
    });
  },

  unfollow: function (req, res) {
    var id = req.param("id");
    if (id === req.user.id) {
      return res.badRequest({message: "You cannot unfollow yourself!"});
    }

    User.findOne({id: id}).exec(function (err, found) {
      if (err) {
        return res.negotiate(err);
      }

      if (found == null || !AuthService.hasPermission(found, 'player')) {
        return res.notFound({message: "Unknown user id " + id});
      }

      Follower.findOne({user: id, follower: req.user.id}).exec(function (err, follower) {
        if (err) {
          return res.negotiate(err);
        }

        if (follower == null)
          return res.badRequest({message: "You aren't following " + found.name + "!"});

        Follower.destroy({id: follower.id}, function (err) {
          if (err) {
            return res.negotiate(err);
          }
          
          sails.log.info(req.user.email + " unfollowed " + found.email);
          res.ok({message: "You are no longer following " + found.name});
        });
      });
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
    req.user.save(function (err) {
      if (err) {
        return res.negotiate(err);
      }

      sails.log.info("Set " + req.user.email + " clan to " + name);
      res.ok({user: req.user.getPublicData()});
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
          return res.notFound();
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
  },

  addNotificationKey: function (req, res) {
    var user = req.user;
    var key = req.param('key').trim();

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) {
      res.badRequest({message: "Invalid UUID for notification key"});
      return;
    }

    if (user.notificationKeys.includes(key)) {
      res.ok({message: "Notification key " + key + " already set"});
      return;
    }

    user.notificationKeys.push(key);

    if (user.notificationKeys.length >= 15) {
      user.notificationKeys.shift(); // lots of devices, let's remove the oldest one.
    }

    user.save(function (err) {
      if (err) {
        return res.negotiate(err);
      }

      NotificationService.updateTags(user, {team: user.team});

      sails.log.info("Added notification key " + key + " to " + req.user.email);
      res.ok({message: "Added notification key " + key});
    });
  }
}
