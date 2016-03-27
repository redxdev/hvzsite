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
      defaultsTo: 'google'
    },

    apiKey: {
      type: 'string',
      size: 32,
      unique: true,
      index: true
    },

    access: {
      type: 'string',
      enum: ['inactive', 'player', 'mod', 'admin', 'superadmin'],
      defaultsTo: 'inactive'
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

    humanIds: {
      collection: 'humanid',
      via: 'user'
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
    },

    clan: {
      type: 'string',
      size: 32,
      defaultsTo: ''
    },

    failures: {
      type: 'integer',
      defaultsTo: 0
    },

    maxFailures: {
      type: 'integer',
      defaultsTo: 100
    },

    usedAV: {
      type: 'boolean',
      defaultsTo: false
    },

    avatarPath: {
      type: 'string',
      defaultsTo: null
    },

    getPublicData: function () {
      return {
        id: this.id,
        name: this.name,
        signupDate: this.createdAt,
        team: this.team,
        humansTagged: this.humansTagged,
        badges: BadgeRegistry.getBadges(this.badges),
        clan: this.clan,
        access: this.access,
        hasAvatar: this.avatarPath !== null
      };
    },

    getAllData: function () {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        authMethod: this.authMethod,
        apiKey: this.apiKey,
        access: this.access,
        team: this.team,
        zombieId: this.zombieId,
        humansTagged: this.humansTagged,
        badges: BadgeRegistry.getBadges(this.badges),
        printed: this.printed,
        clan: this.clan,
        failures: this.failures,
        maxFailures: this.maxFailures,
        usedAV: this.usedAV,
        hasAvatar: this.avatarPath !== null
      }
    },

    addBadge: function (id) {
      if (sails.config.badges.registry[id] === undefined)
        sails.log.warn("Applying unknown badge " + id + " to " + this.email);

      this.badges.push(id);
    }
  }
};

