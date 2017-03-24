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

      badgeList: this.get('ajax').request('/admin/badges', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }),

      localUser: this.get('user').getUserInfo()
    }).then((result) => {
      var player = result.player.user;
      player.avatar = config.APP.apiURL + '/api/v2/avatar/' + params.playerId;
      player.qrLoginURL = config.APP.apiURL + '/auth/l/qr/' + params.playerId;
      return {
        player: player,
        infections: result.infections.infections,
        badgeList: result.badgeList.badges,
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
    },

    sendNotificationDialog() {
      Ember.$('#sendNotificationModal').modal();
    },

    sendNotification(id) {
      Ember.$('#sendNotificationnModal button').hide();
      Ember.$('#notificationTitle').prop('disabled', true);
      Ember.$('#notificationMessage').prop('disabled', true);
      Ember.$('#notificationUrl').prop('disabled', true);

      var url = Ember.$('#notificationUrl').val().trim();
      if (url.length === 0) {
        url = undefined;
      }

      this.get('ajax').post('/admin/users/' + id + '/notify', {
        data: {
          apikey: this.get('user').getApiKey(),
          title: Ember.$('#notificationTitle').val(),
          message: Ember.$('#notificationMessage').val(),
          url: url
        }
      }).then(() => {
        Ember.$("#sendNotificationModal").modal('hide');
        Ember.$("#sendNotificationModal button").show();

        Ember.$('#notificationTitle').prop('disabled', false);
        Ember.$('#notificationTitle').val('');

        Ember.$('#notificationMessage').prop('disabled', false);
        Ember.$('#notificationMessage').val('');

        Ember.$('#notificationUrl').prop('disabled', false);
        Ember.$('#notificationUrl').val('');

        this.get('toast').success("Sent notification.");
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to send notification. Does the user have any devices registered?");
        Ember.$("#sendNotificationModal button").show();
        Ember.$('#notificationTitle').prop('disabled', false);
        Ember.$('#notificationMessage').prop('disabled', false);
        Ember.$('#notificationUrl').prop('disabled', false);
      });
    },

    badgesDialog() {
      Ember.$('#badgesModal').modal();
    },

    giveBadge(id, badgeId) {
      Ember.$('.give-badge-button').prop('disabled', true);

      this.get('ajax').put('/admin/users/' + id + '/badge', {
        data: {
          apikey: this.get('user').getApiKey(),
          badgeId: badgeId
        }
      }).then(() => {
        Ember.$('#badgesModal').modal('hide');
        Ember.$('.give-badge-button').prop('disabled', false);

        this.get('toast').success('Gave badge.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to give badge.");
        Ember.$('.give-badge-button').prop('disabled', false);
      });
    },

    removeBadge(id, badgeId) {
      Ember.$('.give-badge-button').prop('disabled', true);

      this.get('ajax').request('/admin/users/' + id + '/badge', {
        data: {
          apikey: this.get('user').getApiKey(),
          badgeId: badgeId
        },
        method: 'DELETE'
      }).then(() => {
        Ember.$('#badgesModal').modal('hide');
        Ember.$('.give-badge-button').prop('disabled', false);

        this.get('toast').success('Removed badge.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to remove badge.");
        Ember.$('.give-badge-button').prop('disabled', false);
      });
    }
  }
});
