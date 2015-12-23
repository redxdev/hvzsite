module.exports = {

  attributes: {
    idString: {
      type: 'string',
      index: true,
      unique: true
    },

    active: {
      type: 'boolean',
      default: true
    },

    description: {
      type: 'string'
    },

    user: {
      model: 'User'
    }
  }
};

