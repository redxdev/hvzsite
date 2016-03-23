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

    user: {
      model: 'User'
    }
  }
}
