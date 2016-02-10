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

        getPublicData: function() {
            return {
                id: this.id,
                name: this.name,
                signupDate: this.createdAt,
                team: this.team,
                humansTagged: this.humansTagged,
                badges: this.badges,
                clan: this.clan,
                access: this.access
            };
        },

        addBadge: function (id) {
            if (sails.config.badges.registry[id] === undefined)
                sails.log.warn("Applying unknown badge " + id + " to " + this.email);

            this.badges.push(id);
        }
    }
};

