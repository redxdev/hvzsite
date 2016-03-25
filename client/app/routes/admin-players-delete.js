import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/users/' + params.playerId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      var player = result.user;
      return {player: player};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve player profile.');
      this.transitionTo('admin-players');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-players');
    },

    delete(id) {
      this.get('ajax').request('/admin/users/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted user.');
        this.transitionTo('admin-players');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete user.');
      });
    }
  }
});
