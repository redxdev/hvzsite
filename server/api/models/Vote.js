module.exports = {
  attributes: {
    user: {
      model: 'User'
    },

    poll: {
      model: 'Poll'
    },

    option: {
      type: 'integer',
      defaultsTo: 0
    }
  }
};
