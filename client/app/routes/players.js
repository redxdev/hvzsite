import Ember from "ember";
import config from "../config/environment";

// TODO: REMEMBER TO DO PLAYER.AVATAR!
export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  queryParams: {
    sort: {
      refreshModel: true,
    },
    searchTerm: {
      refreshModel: true,
      as: 'search'
    }
  },

  model(params) {
    var sort = params.sort || 'team';
    var searchTerm = params.searchTerm || null;
    var endpoint = sort === 'mods' ? '/status/moderators' : '/status/players';

    return this.get('ajax').request(endpoint, {
      data: {
        sort: sort,
        search: searchTerm
      }
    }).then((result) => {
      return {
        players: result.players.map((player) => {
          player.avatar = config.APP.apiURL + '/api/v2/avatar/' + player.id;
          return player;
        }),

        sort: sort
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to load player list.');
    });
  },

  actions: {
    search() {
      var searchTerm = Ember.$('#searchTerm').val();
      this.transitionTo('players', {queryParams: {searchTerm: searchTerm}});
    }
  }
});
