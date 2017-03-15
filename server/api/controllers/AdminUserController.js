var fs = require('fs');
var path = require('path');
var qrcode = require('yaqrcode');

module.exports = {
  get: function (req, res) {
    var id = req.param("id");

    User.findOne({id: id}).populate("humanIds").exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: "Unknown user id " + id});
      }

      var humanIds = [];
      for (var i = 0; i < user.humanIds.length; ++i) {
        var id = user.humanIds[i];
        humanIds.push({idString: id.idString, active: id.active});
      }

      var data = user.getAllData();
      data.humanIds = humanIds;

      if (!AuthService.hasPermission(req.user, 'superadmin')) {
        data.notificationKeys = ['unavailable'];
        data.apiKey = 'unavailable';
        data.failures = 0;
        data.maxFailures = 0;
      }

      res.ok({user: data});
    });
  },

  list: function (req, res) {
    var search = req.param('search');
    if (search === '')
      search = undefined;

    var q = User.find({
      sort: {name: 1}
    });

    var c = {};

    if (search !== undefined) {
      q.where({
        or: [
          {name: {'contains': search}},
          {clan: {'contains': search}},
          {email: {'contains': search}},
          {access: {'contains': search}}
        ]
      });

      c.or = [
        {name: {'contains': search}},
        {clan: {'contains': search}},
        {email: {'contains': search}},
        {access: {'contains': search}}
      ];
    }

    var limit = req.param('limit');
    if (limit !== undefined)
      q.limit(limit);

    var skip = req.param('skip');
    if (skip !== undefined)
      q.skip(skip);

    q.exec(function (err, users) {
        if (err) {
          res.negotiate(err);
        }
        else {
          User.count(c).exec(function (err, count) {
            if (err) {
              res.negotiate(err);
            }
            else {
              res.ok({
                players: users.map(function (user) {
                  return user.getPublicData();
                }),
                total: count
              });
            }
          });
        }
      }
    );
  },

  update: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id})
      .exec(function (err, user) {
        if (err) {
          return res.negotiate(err);
        }

        if (user === undefined) {
          return res.notFound({message: 'Unknown user id ' + id});
        }

        if (!AuthService.hasPermission(req.user, user)) {
          return res.forbidden({message: 'You cannot modify a user with a higher rank than you (you are: ' + req.user.access + ', you need: ' + user.access + ')'});
        }

        var errors = [];
        var changed = false;

        var name = req.param('name');
        if (name !== undefined) {
          user.name = name;
          changed = true;
        }

        if (user.name.trim() === '') {
          errors.push("You cannot leave the user's name empty.");
        }

        var email = req.param('email');
        if (email !== undefined) {
          user.email = email;
          changed = true;
        }

        if (user.email.trim() === '') {
          errors.push("You cannot leave the user's email empty.");
        }

        var access = req.param('access');
        if (access !== undefined) {
          if (AuthService.getPermissionLevel(access) === sails.config.permissions.unknown) {
            errors.push('Unknown access level ' + access);
          }
          else if (!AuthService.hasPermission(req.user, access)) {
            errors.push('Cannot set a user\'s access level to one higher than your own');
          }
          else {
            user.access = access;
            changed = true;
          }
        }

        var team = req.param('team');
        if (team !== undefined) {
          if (team !== 'human' && team !== 'zombie') {
            errors.push('Unknown team ' + team);
          }
          else {
            user.team = team;
            NotificationService.updateTags(user, {team: user.team});
            changed = true;
          }
        }

        var printed = req.param('printed');
        if (printed !== undefined) {
          user.printed = printed == 'true'
          changed = true;
        }

        var clan = req.param('clan');
        if (clan !== undefined) {
          if (clan.length > 32) {
            errors.push('Clan name must be 32 characters or less');
          }
          else {
            user.clan = clan;
            changed = true;
          }
        }

        var usedAV = req.param('usedAV');
        if (usedAV !== undefined) {
          user.usedAV = usedAV == 'true';
          changed = true;
        }

        if (errors.length > 0) {
          return res.badRequest({message: 'There was a problem with your request', errors: errors});
        }

        if (!changed) {
          return res.badRequest({message: 'You didn\'t change anything!'});
        }

        user.save(function (err) {
          if (err) {
            return res.negotiate(err);
          }

          sails.log.info("User " + user.email + " was modified by " + req.user.email);

          return res.ok({user: user.getPublicData()});
        });
      });
  },

  activate: function (req, res) {
    var id = req.param('id');
    var id = req.param('id');
    User.findOne({id: id})
      .exec(function (err, user) {
        if (err) {
          return res.negotiate(err);
        }

        if (user === undefined) {
          return res.notFound({message: 'Unknown user id ' + id});
        }

        if (user.access !== 'inactive') {
          return res.badRequest({message: 'User has already been activated.'});
        }

        user.access = 'player';

        user.save(function (err) {
          if (err) {
            return res.negotiate(err);
          }

          sails.log.info("User " + user.email + " was activated by " + req.user.email);

          return res.ok({user: user.getPublicData()});
        });
      });
  },

  uploadAvatar: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id})
      .exec(function (err, user) {
        if (err) {
          return res.negotiate(err);
        }

        if (user === undefined) {
          return res.notFound({message: 'Unknown user id ' + id});
        }

        req.file('avatar').upload({
          maxBytes: 5000000,
          dirname: 'avatars'
        }, function (err, uploadedFiles) {
          if (err) {
            return res.negotiate(err);
          }

          if (uploadedFiles.length === 0) {
            return res.badRequest({message: 'No files were uploaded'});
          }

          user.avatarPath = uploadedFiles[0].fd;
          user.save(function (err) {
            if (err) {
              return res.negotiate(err);
            }

            sails.log.info('Avatar for ' + user.email + ' modified by ' + req.user.email);
            res.ok({user: user.getPublicData()});
          });
        });
      });
  },

  create: function (req, res) {
    var name = req.param('name');
    var email = req.param('email');

    if (name === undefined || email === undefined) {
      return res.badRequest({message: 'Missing name or email parameter'});
    }

    AuthService.createUser(name, email).then(function (user) {
      sails.log.info('User ' + user.email + ' was created by ' + req.user.email);
      res.ok({user: user.getPublicData()});
    }).catch(function (err) {
      res.negotiate(err);
    });
  },

  generateId: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      TagGenerator.tag().then(function (tag) {
        return [
          user,
          HumanId.create({idString: tag, user: user})
        ]
      }).spread(function (user, tag) {
        res.ok({user: user.getPublicData(), tag: tag.idString});
      }).catch(function (err) {
        res.negotiate(err);
      });
    });
  },

  // this will not create an InfectionSpread entry, and can optionally OZ the player
  infect: function (req, res) {
    var id = req.param('id');
    var oz = req.param('oz');

    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      if (user.team === 'zombie') {
        return res.badRequest({message: 'User is already a zombie'});
      }

      user.team = 'zombie';
      if (oz) {
        user.addBadge('oz');
        user.oz = true;
      }
      else {
        user.addBadge('infected');
      }

      user.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info(user.email + ' was infected by ' + req.user.email);

        if (oz) {
          NotificationService.sendToUser(user, "Infected", "You are an OZ! Go out there and eat some brains!");
        }
        else {
          NotificationService.sendToUser(user, "Infected", "You have been infected! Welcome to the horde.");
        }

        
        NotificationService.updateTags(user, {team: user.team});

        res.ok({user: user.getPublicData()});
      });
    });
  },

  heal: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      if (user.team === 'human') {
        return res.badRequest({message: 'User is already a human'});
      }

      user.team = 'human';
      user.oz = false;
      user.addBadge('antivirus');

      user.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        NotificationService.updateTags(user, {team: user.team});

        sails.log.info(user.email + ' was healed by ' + req.user.email);

        res.ok({user: user.getPublicData()});
      });
    });
  },

  destroy: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      InfectionSpread.destroy({
        or: [
          {human: user.id},
          {zombie: user.id}
        ]
      }, function (err) {
        if (err) {
          return res.negotiate(err);
        }

        HumanId.destroy({user: user.id}, function (err) {
          if (err) {
            return res.negotiate(err);
          }

          User.destroy({id: user.id}).exec(function (err) {
            if (err) {
              return res.negotiate(err);
            }

            sails.log.info("User " + user.email + " was deleted by " + req.user.email);

            return res.ok({user: user.getPublicData()});
          });
        });
      });
    });
  },

  sendNotification: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      var title = req.param('title');
      var message = req.param('message');
      if (!message || message.length == 0) {
        return res.badRequest({message: 'A notification message must be specified.'});
      }

      NotificationService.sendToUser(user, title, message).then(function () {
        sails.log.info("Sent notification to " + user.email);
        res.ok({message: 'Sent notification to ' + user.name});
      }).catch(function (err) {
        sails.log.error(err);
        res.negotiate({message: "Unable to send notification."});
      });
    });
  },

  loginKey: function (req, res) {
    var id = req.param('id');
    User.findOne({id: id}).exec(function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (user === undefined) {
        return res.notFound({message: 'Unknown user id ' + id});
      }

      return res.view('loginKey', {
        qr: qrcode(
          sails.config.hvz.url + "setkey?key=" + user.apiKey,
          {size: 300}
        )
      });
    });
  },

  print: function (req, res) {
    var preview = req.param('preview');
    User.find({
      where: {
        or: [
          {access: 'player'},
          {access: 'hidden'},
          {access: 'mod'},
          {access: 'admin'},
          {access: 'superadmin'}
        ],
        printed: false
      },

      sort: {name: 1}
    }).populate("humanIds").exec(function (err, users) {
      if (err) {
        return res.negotiate(err);
      }

      return res.view('print', {
        preview: (preview) ? true : false,
        profiles: users.map(function (user) {
          if (user.avatarPath) {
            user.avatar = sails.config.hvz.url + "api/v2/avatar/" + user.id;
          }

          user.accessClass = '';
          if (AuthService.hasPermission(user, 'admin')) {
            user.accessClass = 'admin';
          }
          else if (AuthService.hasPermission(user, 'mod')) {
            user.accessClass = 'mod';
          }

          user.qrcode = qrcode(
            sails.config.hvz.url + "infect?zombie=" + user.zombieId + "&human=" + user.humanIds[1].idString,
            {size: 100});

          return user;
        })
      });
    });
  },

  markPrinted: function (req, res) {
    User.update({
      where: {
        or: [
          {access: 'player'},
          {access: 'hidden'},
          {access: 'mod'},
          {access: 'admin'},
          {access: 'superadmin'}
        ],
        printed: false
      }
    }, {
      printed: true
    }).exec(function (err) {
      if (err) {
        return res.negotiate(err);
      }

      sails.log.info("All active users were marked as printed by " + req.user.email);

      return res.ok({message: "All active users were marked as printed."});
    });
  }
};
