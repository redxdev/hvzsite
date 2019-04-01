var Promise = require('bluebird');

module.exports = {
  dates: function (req, res) {
    res.ok({
      start: sails.config.hvz.startDate,
      end: sails.config.hvz.endDate,
      next: ((new Date()) < sails.config.hvz.startDate) ? sails.config.hvz.startDate : sails.config.hvz.endDate
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
      res.negotiate(err);
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

      case 'human':
        sort = {team: 1, humansTagged: -1, name: 1};
        break;

      case 'zombie':
        sort = {team: -1, humansTagged: -1, name: 1};
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

    var c = {
        access: 'player'
      };

    if (requireClan) {
      q.where({clan: {'!': ['']}});
      c.clan = {'!': ['']};
    }

    if (search !== undefined) {
      q.where({
        or: [
          {name: {'contains': search}},
          {clan: {'contains': search}}
        ]
      });
      c.or = [
        {name: {'contains': search}},
        {clan: {'contains': search}}
      ];
    }

    var limit = req.param('limit');
    if (limit !== undefined)
      q.limit(limit);

    var skip = req.param('skip');
    if (skip !== undefined)
      q.skip(skip);

    var team = req.param('team');
    if (team != undefined) {
      q.where({team: team});
      c.team = team;
    }

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

  moderators: function (req, res) {
    User.find({
      access: ['mod', 'admin', 'superadmin'],
      sort: {name: 1}
    }).exec(function (err, users) {
      if (err) {
        res.negotiate(err);
      }
      else {
        res.ok({
          players: users.map(function (user) {
            return user.getPublicData();
          })
        });
      }
    });
  },

  infections: function (req, res) {
    var q = InfectionSpread.find({
      sort: {createdAt: -1}
    });

    var c = {where:{}};

    var limit = req.param('limit');
    if (limit !== undefined)
      q.limit(limit);

    var skip = req.param('skip');
    if (skip !== undefined)
      q.skip(skip);

    var human = req.param('human');
    if (human !== undefined) {
      q.where({human: human});
      c.where.human = human;
    }

    var zombie = req.param('zombie');
    if (zombie !== undefined) {
      q.where({zombie: zombie});
      c.where.zombie = zombie;
    }

    q.populate('zombie').populate('human').exec(function (err, infections) {
      if (err) {
        res.negotiate(err);
      }
      else {
        InfectionSpread.count(c).exec(function (err, count) {
          if (err) {
            res.negotiate(err);
          }
          else {
            res.ok({
              infections: infections.map(function (infection) {
                return {
                  time: infection.createdAt,
                  hasLocation: infection.hasLocation,
                  latitude: infection.latitude,
                  longitude: infection.longitude,
                  zombie: {
                    id: infection.zombie.id,
                    name: infection.zombie.name
                  },
                  human: {
                    id: infection.human.id,
                    name: infection.human.name
                  }
                };
              }),

              total: count
            });

          }
        });
      }
    });
  }
};
