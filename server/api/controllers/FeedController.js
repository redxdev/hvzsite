var Promise = require('bluebird');

module.exports = {
	get: function (req, res) {
        Feed.Find({relevantUser: req.user}, function (err, entries) {
            if (err)
                return res.negotiate(err);
            
            if (req.param('stringify') !== undefined) {
                var promises = [];
                entries.forEach(function (entry) {
                    promises.push(entry.getMessageString().then(function (message) {
                        return {viewed: entry.viewed, message: message};
                    }));
                });

                Promise.all(promises).then(function (results) {
                    res.ok({
                        feed: results
                    })
                });
            }
            else {
                var results = [];
                entries.forEach(function (entry) {
                    results.push({viewed: entry.viewed, message: entry.message});
                });

                res.ok({
                    feed: results
                });
            }
        });
    }
};

