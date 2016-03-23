module.exports = {

  attributes: {
    hasLocation: {
      type: 'boolean',
      defaultsTo: false
    },

    latitude: {
      type: 'float',
      defaultsTo: 0
    },

    longitude: {
      type: 'float',
      defaultsTo: 0
    },

    zombie: {
      model: 'User'
    },

    human: {
      model: 'User'
    },

    killstreaks: {
      type: 'array',
      defaultsTo: []
    }
  }
};

