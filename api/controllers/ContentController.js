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
            postDate: {
                '<=': new Date()
            },

            sort: {postDate: -1}
        })
            .exec(function (err, posts) {
                if (err) {
                    res.negotiate(err)
                }
                else {
                    res.ok({
                        posts: posts.map(function (post) {
                            return {
                                title: post.title,
                                summary: post.summary,
                                body: post.body,
                                postDate: post.postDate,
                                important: post.important
                            };
                        })
                    });
                }
            });
    },

    announcements: function (req, res) {
        News.find({
            postDate: {
                '<=': new Date()
            },
            important: true,

            sort: {postDate: -1}
        })
            .exec(function (err, posts) {
                if (err) {
                    res.negotiate(err)
                }
                else {
                    res.ok({
                        posts: posts.map(function (post) {
                            return {
                                title: post.title,
                                summary: post.summary,
                                body: post.body,
                                postDate: post.postDate,
                                important: post.important
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
