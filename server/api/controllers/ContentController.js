module.exports = {
  rules: function (req, res) {
    Ruleset.find({sort: {position: 1}})
      .exec(function (err, rules) {
        if (err) {
          res.negotiate(err);
        }
        else {
          res.ok({
            rules: rules.map(function (rule) {
              return {
                id: rule.id,
                title: rule.title,
                body: rule.body
              };
            })
          });
        }
      });
  },

  news: function (req, res) {
    News.find({
        sort: {createdAt: -1}
      })
      .exec(function (err, posts) {
        if (err) {
          res.negotiate(err)
        }
        else {
          res.ok({
            posts: posts.map(function (post) {
              return {
                id: post.id,
                title: post.title,
                summary: post.summary,
                body: post.body,
                postDate: post.createdAt,
                important: post.important,
                frontpage: post.frontpage
              };
            })
          });
        }
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
          important: post.important,
          frontpage: post.frontpage
        }
      })
    });
  },

  announcements: function (req, res) {
    News.find({
        important: true,
        sort: {createdAt: -1}
      })
      .exec(function (err, posts) {
        if (err) {
          res.negotiate(err)
        }
        else {
          res.ok({
            posts: posts.map(function (post) {
              return {
                id: post.id,
                title: post.title,
                summary: post.summary,
                body: post.body,
                important: post.important,
                postDate: post.createdAt,
                frontpage: post.frontpage
              };
            })
          });
        }
      });
  },

  frontpage: function (req, res) {
    News.find({
      frontpage: true,
      sort: {createdAt: -1}
    })
    .exec(function (err, posts) {
        if (err) {
          res.negotiate(err)
        }
        else {
          res.ok({
            posts: posts.map(function (post) {
              return {
                id: post.id,
                title: post.title,
                summary: post.summary,
                body: post.body,
                important: post.important,
                postDate: post.createdAt,
                frontpage: post.frontpage
              };
            })
          });
        }
      });
  },

  missions: function (req, res) {
    if (sails.config.hvz.endDate < new Date()) {
      Mission.find({
          postDate: {
            '<=': new Date()
          },

          sort: {postDate: -1}
        })
        .exec(function (err, missions) {
          if (err) {
            res.negotiate(err);
          }
          else {
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
          }
        });
    }
    else {
      if (!AuthService.hasPermission(req.user, 'player')) {
        return res.forbidden({message: "You do not have permission to access this page."});
      }

      Mission.find({
          team: ['all', req.user.team],
          postDate: {
            '<=': new Date()
          },
          endDate: {
            '>=': new Date()
          },

          sort: {postDate: -1}
        })
        .exec(function (err, missions) {
          if (err) {
            res.negotiate(err);
          }
          else {
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
          }
        });
    }
  },

  polls: function (req, res) {
    if (sails.config.hvz.endDate < new Date()) {
      Poll.find({
        postDate: {
          '<=': new Date()
        },

        sort: {postDate: -1}
      }).exec(function (err, polls) {
        if (err) {
          return res.negotiate(err);
        }

        if (req.user) {
          Vote.find({user: req.user.id}).exec(function (err, votes) {
            if (err) {
              return res.negotiate(err);
            }

            var voteMap = {};
            votes.forEach(function (vote) {
              voteMap[vote.poll] = vote.option;
            });

            res.ok({
              polls: polls.map(function (poll) {
                return {
                  id: poll.id,
                  title: poll.title,
                  question: poll.question,
                  body: poll.body,
                  options: poll.options,
                  team: poll.team,
                  postDate: poll.postDate,
                  endDate: poll.endDate,
                  vote: voteMap[poll.id]
                }
              })
            });
          });
        }
        else {
          res.ok({
            polls: polls.map(function (poll) {
              return {
                id: poll.id,
                title: poll.title,
                question: poll.question,
                body: poll.body,
                options: poll.options,
                team: poll.team,
                postDate: poll.postDate,
                endDate: poll.endDate
              }
            })
          });
        }
      });
    }
    else {
      if (!AuthService.hasPermission(req.user, 'player')) {
        return res.forbidden({message: "You do not have permission to access this page."});
      }

      Poll.find({
        team: ['all', req.user.team],
        postDate: {
          '<=': new Date()
        },

        sort: {postDate: -1}
      }).exec(function (err, polls) {
        if (err) {
          return res.negotiate(err);
        }

        Vote.find({user: req.user.id}).exec(function (err, votes) {
          if (err) {
            return res.negotiate(err);
          }

          var voteMap = {};
          votes.forEach(function (vote) {
            voteMap[vote.poll] = vote.option;
          });

          res.ok({
            polls: polls.map(function (poll) {
              return {
                id: poll.id,
                title: poll.title,
                question: poll.question,
                body: poll.body,
                options: poll.options,
                team: poll.team,
                postDate: poll.postDate,
                endDate: poll.endDate,
                vote: voteMap[poll.id]
              }
            })
          });
        });
      });
    }
  },

  vote: function (req, res) {
    var id = req.param('id');
    var option = req.param('option');
    option = Number(option);
    if (isNaN(option)) {
      return res.badRequest({message: 'Invalid parameter for \'option\''});
    }

    Poll.findOne({
      id: id,
      postDate: {
        '<=': new Date()
      },
      team: ['all', req.user.team]
    }).exec(function (err, poll) {
      if (err) {
        return res.negotiate(err);
      }

      if (poll === undefined) {
        return res.notFound({message: 'Unknown poll id ' + id});
      }

      if (poll.endDate <= new Date()) {
        return res.badRequest({message: 'That poll has ended.'});
      }
      
      if (option < 0 || option >= poll.options.length) {
        return res.badRequest({message: 'Invalid option index'});
      }

      Vote.findOne({user: req.user.id, poll: poll.id}).exec(function (err, vote) {
        if (err) {
          return res.negotiate(err);
        }

        if (vote !== undefined) {
          // update the vote, rather than creating a new one
          vote.option = option;
          vote.save(function (err) {
            if (err) {
              return res.negotiate(err);
            }

            sails.log.info("User " + req.user.email + " changed their vote to option #" + option + " on poll #" + poll.id);

            return res.ok({
              vote: {
                poll: poll.id,
                option: vote.option
              }
            });
          });
        }
        else {
          Vote.create({user: req.user.id, poll: poll.id, option: option}).exec(function (err, vote) {
            if (err) {
              return res.negotiate(err);
            }

            if (vote === undefined) {
              return res.serverError({message: 'Unable to create vote object'});
            }

            sails.log.info("User " + req.user.email + " voted for option #" + option + " on poll #" + poll.id);

            return res.ok({
              vote: {
                poll: poll.id,
                option: vote.option
              }
            });
          });
        }
      });
    });
  },

  badges: function(req, res) {
    badgeList = sails.config.badges.registry;
    returnList = [];
    Object.keys(badgeList).forEach(function(key){
      visibility = badgeList[key]['visibility'];
      if(visibility !== undefined && visibility !== 'hidden'){
        tempBadge = {
          name: '???',
          description: '???',
          image: badgeList[key]['image']
        }
        if(visibility.indexOf('name') > -1) {
          tempBadge['name'] = badgeList[key]['name'];
        }
        if(visibility.indexOf('description') > -1) {
          tempBadge['description'] = badgeList[key]['description'];
        }
        returnList.push(tempBadge);
      }
    });
    return res.ok({
      badges: returnList
    })
  }
};