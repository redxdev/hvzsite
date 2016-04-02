module.exports = {
  attributes: {
    title: {
      type: 'string'
    },

    question: {
      type: 'string'
    },

    body: {
      type: 'text'
    },

    options: {
      type: 'array'
    },

    team: {
      type: 'string',
      enum: ['all', 'human', 'zombie'],
      defaultsTo: 'all'
    },

    postDate: {
      type: 'datetime'
    },

    endDate: {
      type: 'datetime'
    },

    votes: {
      collection: 'Vote',
      via: 'poll'
    }
  }
};
