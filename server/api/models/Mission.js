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

    endDate: {
    	type: 'datetime',
    	defaultsTo: function () {
    		return sails.config.hvz.endDate; //Defaults to Sat, 13 Sep 275,760 00:00:00 UTC. Really hope HvZ is still around, but someone might come up with a different server by 275,760
    	}
    },

    team: {
      type: 'string',
      enum: ['all', 'human', 'zombie'],
      defaultsTo: 'all'
    }
  }
};

