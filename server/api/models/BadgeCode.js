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

    badgeID: {
      type: 'string'
    }
  }
};

