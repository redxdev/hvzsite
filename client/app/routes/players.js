import Ember from "ember";
import config from "../config/environment";
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  queryParams: {
    sort: {
      refreshModel: true,
    },

    searchTerm: {
      refreshModel: true,
      as: 'search'
    },

    page: {
      refreshModel: true
    }
  },

  model(params) {
    var sort = params.sort || 'team';
    var searchTerm = params.searchTerm || null;
    var page = params.page || 1;
    var endpoint = sort === 'mods' ? '/status/moderators' : '/status/players';

    var lastCount = page * 10;

    page = Number(page);
    if (page < 1) {
      this.get('toast').error(page + ' is not a valid page!');
      return {players: [], nextPage: null, previousPage: null, sort: sort};
    }

    return this.get('ajax').request(endpoint, {
      data: {
        sort: sort,
        search: searchTerm,
        limit: 10,
        skip: (page - 1) * 10
      }
    }).then((result) => {
      return {
        players: result.players.map((player) => {
          player.avatar = config.APP.apiURL + '/api/v2/avatar/' + player.id;
          return player;
        }),

        sort: sort,
        nextPage: lastCount < result.total ? (page + 1) : null,
        previousPage: page > 1 ? (page - 1) : null
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to load player list.');
      return {players: [], nextPage: null, previousPage: null, sort: sort};
    });
  },

  actions: {
    search() {
      var searchTerm = Ember.$('#searchTerm').val();
      this.transitionTo('players', {queryParams: {searchTerm: searchTerm, page: 1}});
    },

    goToPlayer(id) {
      this.transitionTo('player', id);
    }
  }
});
