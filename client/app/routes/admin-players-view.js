import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model(params) {
    return Ember.RSVP.hash({
      player: this.get('ajax').request('/admin/users/' + params.playerId, {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }),

      infections: this.get('ajax').request('/status/infections', {
        data: {
          zombie: params.playerId
        }
      }),

      localUser: this.get('user').getUserInfo()
    }).then((result) => {
      var player = result.player.user;
      player.avatar = config.APP.apiURL + '/api/v2/avatar/' + params.playerId;
      return {
        player: player,
        infections: result.infections.infections,
        localUser: result.localUser
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve player profile.');
      return {};
    });
  },

  actions: {
    generateId(id) {
      Ember.$('#generateButton').hide();

      this.get('ajax').post('/admin/users/' + id + '/generateId', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Generated new human id.');
        this.refresh();
        Ember.$('#generateButton').show();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'There was a problem generating a new human id.');
        Ember.$('#generateButton').show();
      });
    },

    infect(id, oz) {
      Ember.$('#infectGroup').hide();

      var data = {
        apikey: this.get('user').getApiKey()
      };

      if (oz) {
        data.oz = true;
      }

      this.get('ajax').post('/admin/users/' + id + '/infect', {
        data: data
      }).then(() => {
        if (oz) {
          this.get('toast').success('Made player into an OZ');
        }
        else {
          this.get('toast').success('Infected player.');
        }

        Ember.$('#infectGroup').show();
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to infect player.');
        Ember.$('#infectGroup').show();
      });
    },

    heal(id) {
      Ember.$('#healGroup').hide();

      this.get('ajax').post('/admin/users/' + id + '/heal', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Healed player.');
        Ember.$('#healGroup').show();
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to heal player.');
        Ember.$('#healGroup').show();
      });
    }
  }
});
