module.exports = {

  attributes: {
    title: {
      type: 'string'
    },

    body: {
      type: 'text'
    },

    postDate: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },

    team: {
      type: 'string',
      enum: ['all', 'human', 'zombie'],
      defaultsTo: 'all'
    }
  }
};

