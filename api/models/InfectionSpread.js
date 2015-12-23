module.exports = {

  attributes: {
    time: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date()
      }
    },

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

