module.exports = {

  attributes: {
    name: {
      type: 'string'
    },

    email: {
      type: 'string',
      unique: true,
      index: true
    },

    authMethod: {
      type: 'string',
      enum: ['saml', 'google'],
      defaultsTo: 'saml'
    },

    apiKey: {
      type: 'string',
      size: 32,
      unique: true,
      index: true
    },

    active: {
      type: 'boolean',
      defaultsTo: false
    },

    access: {
      type: 'string',
      enum: ['player', 'mod', 'admin', 'superadmin'],
      defaultsTo: 'player'
    },

    signupDate: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },

    team: {
      type: 'string',
      enum: ['human', 'zombie'],
      defaultsTo: 'human'
    },

    zombieId: {
      type: 'string',
      index: true,
      unique: true
    },

    activeHumanIds: {
      type: 'array',
      defaultsTo: []
    },

    inactiveHumanIds: {
      type: 'array',
      defaultsTo: []
    },

    humansTagged: {
      type: 'integer',
      defaultsTo: 0
    },

    badges: {
      type: 'array',
      defaultsTo: []
    },

    printed: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};

