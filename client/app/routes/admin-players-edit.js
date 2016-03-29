import Ember from 'ember';


export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      player: this.get('ajax').request('/admin/users/' + params.playerId, {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }),

      localUser: this.get('user').getUserInfo()
    }).then((result) => {
      return {
        player: result.player.user,
        localUser: result.localUser
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve player profile.');
      this.transitionTo('admin-players');
    });
  },

  actions: {
    save(id) {
      var name = Ember.$('#playerName').val();
      var email = Ember.$('#playerEmail').val();
      var clan = Ember.$('#playerClan').val();
      var team = Ember.$('#playerTeam').val();
      var access = Ember.$('#playerAccess').val();
      var printed = Ember.$('#playerPrinted').prop('checked');
      var usedAV = Ember.$('#playerUsedAV').prop('checked');

      Ember.$('#saveButton').hide();

      this.get('ajax').put('/admin/users/' + id, {
        data: {
          name: name,
          email: email,
          access: access,
          team: team,
          printed: printed,
          clan: clan,
          usedAV: usedAV,
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.transitionTo('admin-players-view', result.user.id);
        this.get('toast').success('Saved user.');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to save user.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
