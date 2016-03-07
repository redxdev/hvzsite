module.exports = {
    rules: function (req, res) {
        Ruleset.find({sort: {position: 1}}).exec(function (err, rules) {
            if (err) {
                return res.negotiate(err);
            }

            res.ok({
                rules: rules.map(function (rule) {
                    return {
                        title: rule.title,
                        body: rule.body,
                        position: rule.position
                    };
                })
            });
        });
    }
}
