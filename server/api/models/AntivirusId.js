var moment = require('moment');

module.exports = {

    attributes: {
        idString: {
            type: 'string',
            index: true,
            unique: true
        },

        active: {
            type: 'boolean',
            defaultsTo: true
        },

        description: {
            type: 'text'
        },

        user: {
            model: 'User'
        },

        expirationTime: {
            type: 'datetime',
            defaultsTo: function () {
                return moment().add(1, 'days').toDate();
            }
        }
    }
};

