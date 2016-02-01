var randomstring = require('randomstring');
var Promise = require('bluebird');

module.exports = {
    apiKey: function () {
        return new Promise(function (resolve, reject) {
            var result = randomstring.generate(32, "alphanumeric");
            User.findOne({apiKey: result}, function (err, found) {
                if (err) {
                    reject(err);
                    return;
                }

                if (found !== undefined) {
                    reject(new Error("generated existing api key"));
                    return;
                }

                resolve(result)
            });
        });
    },

    tag: function () {
        return new Promise(function (resolve, reject) {
            var result = randomstring.generate(8, "abcdefghjkmnpqrstuvwxyz234567890");
            User.findOne({zombieId: result}, function (err, found) {
                if (err) {
                    reject(err);
                    return;
                }

                if (found !== undefined) {
                    reject(new Error("generated existing tag"));
                    return;
                }

                User.findOne({humanIds: [result]}, function (err, found) {
                    if (err) {
                        reject(err);
                    }

                    if (found !== undefined) {
                        reject(new Error("generated existing tag"));
                        return;
                    }

                    resolve(result);
                });
            });
        });
    }
};
