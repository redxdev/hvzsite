module.exports = {

  attributes: {
    title: {
      type: 'string'
    },

    summary: {
      type: 'text'
    },

    body: {
      type: 'text'
    },

    important: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
