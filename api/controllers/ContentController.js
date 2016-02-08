module.exports = {
    rules: function (req, res) {
        Ruleset.find({sort: {position: 1}})
            .exec(function (err, rules) {
                if (err) {
                    res.serverError(err);
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
    }
};
