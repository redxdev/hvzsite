module.exports = {
  rules: function (req, res) {
    Ruleset.find({sort: {position: 1}}).exec(function (err, rules) {
      if (err) {
        return res.negotiate(err);
      }

      res.ok({
        rules: rules.map(function (rule) {
          return {
            id: rule.id,
            title: rule.title,
            body: rule.body,
            position: rule.position
          };
        })
      });
    });
  },

  rule: function (req, res) {
    var id = req.param('id');
    Ruleset.findOne({id: id}).exec(function (err, rule) {
      if (err) {
        return res.negotiate(err);
      }

      if (rule === undefined) {
        return res.notFound({message: 'Unknown ruleset id ' + id});
      }

      res.ok({
        rule: {
          id: rule.id,
          title: rule.title,
          body: rule.body,
          position: rule.position
        }
      });
    });
  },

  updateRule: function (req, res) {
    var id = req.param('id');
    Ruleset.findOne({id: id}).exec(function (err, rule) {
      if (err) {
        return res.negotiate(err);
      }

      if (rule === undefined) {
        return res.notFound({message: 'Unknown ruleset id ' + id});
      }

      var changed = false;

      var title = req.param('title');
      if (title !== undefined) {
        rule.title = title;
        changed = true;
      }

      var body = req.param('body');
      if (body !== undefined) {
        rule.body = body;
        changed = true;
      }

      var position = req.param('position');
      if (position !== undefined) {
        rule.position = position;
        changed = true;
      }

      if (!changed) {
        return res.badRequest({message: 'You didn\'t change anything!'});
      }

      rule.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Rule #" + rule.id + " was modified by " + req.user.email);

        return res.ok({
          rule: {
            id: rule.id,
            title: rule.title,
            body: rule.body,
            position: rule.position
          }
        });
      });
    });
  },

  createRule: function (req, res) {
    var title = req.param('title');
    if (title === undefined)
      return res.badRequest({message: 'No title specified.'});

    var body = req.param('body');
    if (body === undefined)
      return res.badRequest({message: 'No body specified.'});

    var position = req.param('position') || 1;

    Ruleset.create({
      title: title,
      body: body,
      position: position
    }, function (err, rule) {
      if (err) {
        return res.negotiate(err);
      }

      sails.log.info("Rule #" + rule.id + " was created by " + req.user.email);

      return res.ok({
        rule: {
          id: rule.id,
          title: rule.title,
          body: rule.body,
          position: rule.position
        }
      })
    });
  },

  destroyRule: function (req, res) {
    var id = req.param('id');
    Ruleset.findOne({id: id}).exec(function (err, rule) {
      if (err) {
        return res.negotiate(err);
      }

      if (rule === undefined) {
        return res.notFound({message: 'Unknown rule id ' + id});
      }

      Ruleset.destroy({id: rule.id}).exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Rule #" + rule.id + " was deleted by " + req.user.email);

        return res.ok({message: 'Deleted rule ' + rule.id});
      });
    });
  },

  missions: function (req, res) {
    Mission.find({sort: {postDate: -1}}).exec(function (err, missions) {
      if (err) {
        return res.negotiate(err);
      }

      res.ok({
        missions: missions.map(function (mission) {
          return {
            id: mission.id,
            title: mission.title,
            body: mission.body,
            postDate: mission.postDate,
            team: mission.team
          };
        })
      });
    });
  },

  mission: function (req, res) {
    var id = req.param('id');
    Mission.findOne({id: id}).exec(function (err, mission) {
      if (err) {
        return res.negotiate(err);
      }

      if (mission === undefined) {
        return res.notFound({message: 'Unknown mission id ' + id});
      }

      res.ok({
        mission: {
          id: mission.id,
          title: mission.title,
          body: mission.body,
          postDate: mission.postDate,
          team: mission.team
        }
      });
    });
  },

  updateMission: function (req, res) {
    var id = req.param('id');
    Mission.findOne({id: id}).exec(function (err, mission) {
      if (err) {
        return res.negotiate(err);
      }

      if (mission === undefined) {
        return res.notFound({message: 'Unknown mission id ' + id});
      }

      var changed = false;

      var title = req.param('title');
      if (title !== undefined) {
        mission.title = title;
        changed = true;
      }

      var body = req.param('body');
      if (body !== undefined) {
        mission.body = body;
        changed = true;
      }

      var postDate = req.param('postDate');
      if (postDate !== undefined) {
        mission.postDate = new Date(postDate);
        changed = true;
      }

      var team = req.param('team');
      if (team !== undefined) {
        if (team !== 'human' && team !== 'zombie' && team !== 'all') {
          return res.badRequest({message: 'Unknown team ' + team});
        }

        mission.team = team;
        changed = true;
      }

      if (!changed) {
        return res.badRequest({message: 'You didn\'t change anything!'});
      }

      mission.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Mission #" + mission.id + " was modified by " + req.user.email);

        return res.ok({
          mission: {
            id: mission.id,
            title: mission.title,
            body: mission.body,
            postDate: mission.postDate,
            team: mission.team
          }
        });
      });
    });
  },

  createMission: function (req, res) {
    var title = req.param('title');
    if (title === undefined)
      return res.badRequest({message: 'No title specified.'});

    var body = req.param('body');
    if (body === undefined)
      return res.badRequest({message: 'No body specified.'});

    var postDate = req.param('postDate');
    if (postDate === undefined)
      return res.badRequest({message: 'No post date specified.'});

    var team = req.param('team');
    if (team === undefined)
      return res.badRequest({message: 'No team specified.'});

    if (team !== 'human' && team !== 'zombie' && team !== 'all')
      return res.badRequest({message: 'Unknown team ' + team});

    Mission.create({
      title: title,
      body: body,
      postDate: new Date(postDate),
      team: team
    }, function (err, mission) {
      if (err) {
        return res.negotiate(err);
      }

      sails.log.info("Mission #" + mission.id + " was created by " + req.user.email);

      return res.ok({
        mission: {
          id: mission.id,
          title: mission.title,
          body: mission.body,
          postDate: mission.postDate,
          team: mission.team
        }
      });
    });
  },

  destroyMission: function (req, res) {
    var id = req.param('id');
    Mission.findOne({id: id}).exec(function (err, mission) {
      if (err) {
        return res.negotiate(err);
      }

      if (mission === undefined) {
        return res.notFound({message: 'Unknown mission id ' + id});
      }

      Mission.destroy({id: mission.id}).exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Mission #" + mission.id + " was deleted by " + req.user.email);

        return res.ok({message: 'Deleted mission ' + mission.id});
      });
    });
  },

  newsPosts: function (req, res) {
    News.find({sort: {createdAt: -1}}).exec(function (err, posts) {
      if (err) {
        return res.negotiate(err);
      }

      res.ok({
        posts: posts.map(function (post) {
          return {
            id: post.id,
            title: post.title,
            summary: post.summary,
            body: post.body,
            postDate: post.createdAt,
            important: post.important
          };
        })
      });
    });
  },

  newsPost: function (req, res) {
    var id = req.param('id');
    News.findOne({id: id}).exec(function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      if (post === undefined) {
        return res.notFound({message: 'Unknown post id ' + id});
      }

      res.ok({
        post: {
          id: post.id,
          title: post.title,
          summary: post.summary,
          body: post.body,
          postDate: post.createdAt,
          important: post.important
        }
      });
    });
  },

  updateNewsPost: function (req, res) {
    var id = req.param('id');
    News.findOne({id: id}).exec(function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      if (post === undefined) {
        return res.notFound({message: 'Unknown post id ' + id});
      }

      var changed = false;

      var title = req.param('title');
      if (title !== undefined) {
        post.title = title;
        changed = true;
      }

      var summary = req.param('summary');
      if (summary !== undefined) {
        post.summary = summary;
        changed = true;
      }

      var body = req.param('body');
      if (body !== undefined) {
        post.body = body;
        changed = true;
      }

      if (!changed) {
        return res.badRequest({message: 'You didn\'t change anything!'});
      }

      post.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Post #" + post.id + " was modified by " + req.user.email);

        return res.ok({
          post: {
            id: post.id,
            title: post.title,
            summary: post.summary,
            body: post.body,
            postDate: post.createdAt,
            important: post.important
          }
        });
      });
    });
  },

  createNewsPost: function (req, res) {
    var title = req.param('title');
    if (title === undefined)
      return res.badRequest({message: 'No title specified.'});

    var summary = req.param('summary');
    if (summary === undefined)
      return res.badRequest({message: 'No summary specified'});

    var body = req.param('body');
    if (body === undefined)
      return res.badRequest({message: 'No body specified.'});

    News.create({
      title: title,
      summary: summary,
      body: body,
      important: false
    }, function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      sails.log.info("Post #" + post.id + " was created by " + req.user.email);

      return res.ok({
        post: {
          id: post.id,
          title: post.title,
          summary: post.summary,
          body: post.body,
          postDate: post.createdAt,
          important: post.important
        }
      });
    });
  },

  destroyNewsPost: function (req, res) {
    var id = req.param('id');
    News.findOne({id: id}).exec(function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      if (post === undefined) {
        return res.notFound({message: 'Unknown post id ' + id});
      }

      News.destroy({id: post.id}).exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Post #" + post.id + " was deleted by " + req.user.email);

        return res.ok({message: 'Deleted post ' + post.id});
      });
    });
  },

  markImportantPost: function (req, res) {
    var id = req.param('id');
    News.findOne({id: id}).exec(function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      if (post === undefined) {
        return res.notFound({message: 'Unknown post id ' + id});
      }

      News.update({important: true}, {important: false}).exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        post.important = true;
        post.save(function (err) {
          if (err) {
            return res.negotiate(err);
          }

          sails.log.info("Post #" + post.id + " was marked as important by " + req.user.email);

          res.ok({
            post: {
              id: post.id,
              title: post.title,
              summary: post.summary,
              body: post.body,
              postDate: post.createdAt,
              important: post.important
            }
          });
        });
      });
    });
  },

  markUnimportantPost: function (req, res) {
    var id = req.param('id');
    News.findOne({id: id}).exec(function (err, post) {
      if (err) {
        return res.negotiate(err);
      }

      if (post === undefined) {
        return res.notFound({message: 'Unknown post id ' + id});
      }

      post.important = false;
      post.save(function (err) {
        if (err) {
          return res.negotiate(err);
        }

        sails.log.info("Post #" + post.id + " was marked as unimportant by " + req.user.email);

        res.ok({
          post: {
            id: post.id,
            title: post.title,
            summary: post.summary,
            body: post.body,
            postDate: post.createdAt,
            important: post.important
          }
        });
      });
    });
  }
};
