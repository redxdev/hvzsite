var Promise = require('bluebird');
var _ = require('lodash');

function addMultiple(opts) {
    return new Promise(function (resolve, reject) {
        Feed.create(opts, function (err, entries) {
            if (err)
                reject(err);

            resolve(entries);
        });
    });
}

function add(relevantUser, message, image) {
    return new Promise(function (resolve, reject) {
        Feed.create({
            relevantUser: relevantUser,
            message: message,
            image: image
        }, function (err, entry) {
            if (err) {
                reject(err);
            }

            resolve(entry);
        });
    });
}

module.exports = {
    add: add,
    addMultiple: addMultiple,
    user: function (userOrId) {
        if (_.isObject(userOrId))
            return {t: 'u', i: userOrId.id};
        else
            return {t: 'u', i: userOrId};
    },
    userImage: function (userOrId) {
        var id;
        if (_.isObject(userOrId))
            id = userOrId.id;
        else
            id = userOrId;

        return sails.config.hvz.url + 'api/v2/avatar/' + id;
    }
}