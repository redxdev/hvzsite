var Promise = require('bluebird');
var unirest = require('unirest');

var config = sails.config.onesignal;

function sendToUsers(users, title, message, options) {
    options = options || {};

    if (config.enabled !== true) {
        return new Promise(function (resolve, reject) {resolve();});
    }

    if (users.length === 0) {
        return new Promise(function (resolve, reject) {resolve("No users specified");});
    }

    var keys = [];
    users.forEach(function (user) {
        keys = keys.concat(user.notificationKeys);
    });

    if (keys.length === 0) {
        return new Promise(function (resolve, reject) {resolve("No keys for any user, skipping notification call.");});
    }

    // There's a hard limit of 2000 devices per REST call for this endpoint, so we need to split
    // up the calls.
    var groups = [];
    while (keys.length > 0) {
        groups.push(keys.splice(0, 2000));
    }

    var url = options.url;
    if (url !== undefined) {
        url = url.trim();
        if (url.length === 0)
            url = undefined;
    }

    var promises = [];
    groups.forEach((group) => {
        promises.push(new Promise(function (resolve, reject) {
            unirest.post('https://onesignal.com/api/v1/notifications')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                .send({
                    app_id: config.appId,
                    chrome_web_icon: config.defaultIconUrl,
                    include_player_ids: group,
                    headings: {'en': title},
                    contents: {'en': message},
                    url: url
                })
                .end(function (response) {
                    if (response.status != 200) {
                        console.log("Unable to send notification to users: ", response.body);
                        reject(response.body);
                    }
                    else {
                        resolve(response.body);
                    }
                });
        }));
    });

    return Promise.all(promises);
}

function sendToSegments(segments, title, message, options) {
    options = options || {};

    if (config.enabled !== true) {
        return new Promise(function (resolve, reject) {resolve();});
    }

    if (segments.length === 0) {
        return new Promise(function (resolve, reject) {reject("No segments specified");});
    }

    var url = options.url;
    if (url !== undefined) {
        url = url.trim();
        if (url.length === 0)
            url = undefined;
    }

    return new Promise(function (resolve, reject) {
        unirest.post('https://onesignal.com/api/v1/notifications')
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + config.restKey
            })
            .send({
                app_id: config.appId,
                chrome_web_icon: config.defaultIconUrl,
                included_segments: segments,
                headings: {'en': title},
                contents: {'en': message},
                url: url
            })
            .end(function (response) {
                if (response.status != 200) {
                    console.log("Unable to send notification to segments: ", response.body);
                    reject(response.body);
                }
                else {
                    resolve(response.body);
                }
            });
    });
}

module.exports = {
    sendToUser: function (user, title, message, options) {
        return sendToUsers([user], title, message, options);
    },

    sendToUsers: sendToUsers,

    sendToSegment: function (segment, title, message, options) {
        return sendToSegments([segment], title, message, options);
    },

    sendToSegments: sendToSegments,

    sendToAll: function (title, message, options) {
        return sendToSegments(['All'], title, message, options);
    },

    updateTags: function (user, tags) {
        return new Promise(function (resolve, reject) {
            if (config.enabled !== true) {
                resolve();
                return;
            }

            var promises = [];
            user.notificationKeys.forEach(function (key) {
                promises.push(new Promise(function (resolve, reject) {
                    unirest.put('https://onesignal.com/api/v1/players/' + key)
                        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                        .send({
                            app_id: config.appId,
                            tags: tags
                        })
                        .end(function (response) {
                            if (response.status != 200) {
                                console.log("Unable to change tags for notification key " + key, response.body);
                                reject(response.body);
                            }
                            else {
                                resolve(response.body);
                            }
                        });
                }));
            });

            Promise.all(promises).then(function () {
                resolve();
            }).catch(function () {
                reject();
            });
        });
    }
};