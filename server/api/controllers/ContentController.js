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
                important: post.important
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
          important: post.important
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
                postDate: post.createdAt
              };
            })
          });
        }
      });
  },

  missions: function (req, res) {
    Mission.find({
        team: ['all', req.user.team],
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
};
