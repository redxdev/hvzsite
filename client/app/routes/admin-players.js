import Ember from 'ember';
import config from "../config/environment";
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  queryParams: {
    searchTerm: {
      refreshModel: true,
      as: 'search'
    },

    page: {
      refreshModel: true
    }
  },

  model(params) {
    var searchTerm = params.searchTerm || null;
    var page = params.page || 1;

    var lastCount = page * 10;

    page = Number(page);
    if (page < 1) {
      this.get('toast').error(page + ' is not a valid page!');
      return {players: [], nextPage: null, previousPage: null};
    }

    return this.get('ajax').request('/admin/users', {
      data: {
        search: searchTerm,
        limit: 10,
        skip: (page - 1) * 10,
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {
        players: result.players.map((player) => {
          player.avatar = config.APP.apiURL + '/api/v2/avatar/' + player.id;
          return player;
        }),

        nextPage: lastCount < result.total ? (page + 1) : null,
        previousPage: page > 1 ? (page - 1) : null
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to load player list.');
      return {players: [], nextPage: null, previousPage: null};
    });
  },

  actions: {
    search() {
      var searchTerm = Ember.$('#searchTerm').val();
      this.transitionTo('admin-players', {queryParams: {searchTerm: searchTerm, page: 1}});
    }
  }
});
