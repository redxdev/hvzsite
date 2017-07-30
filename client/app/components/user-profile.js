import Ember from "ember";

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),
  toast: Ember.inject.service(),

  didInsertElement() {
    Ember.$("[data-toggle='tooltip']").tooltip();
  },

  actions: {
    toggleApiKey() {
      Ember.$('#apikey').toggleClass('hidden');
    },

    editClan() {
      Ember.$('#changeClanModal').modal();
    },

    saveClan() {
      Ember.$('#changeClanModal button').hide();
      Ember.$('#clanInput').prop('disabled', true);

      this.get('ajax').post('/profile/clan', {
        data: {
          apikey: this.get('user').getApiKey(),
          name: Ember.$('#clanInput').val()
        }
      }).then(() => {
        Ember.$("#changeClanModal").modal('hide');
        Ember.$("#changeClanModal button").show();
        Ember.$('#clanInput').prop('disabled', false);
        this.get('toast').success("Changed clan");
        this.set('profile.clan', Ember.$('#clanInput').val());
      }).catch((err) => {
        Ember.$("#changeClanModal button").show();
        Ember.$('#clanInput').prop('disabled', false);
      });
    },
    
    follow(id) {
      this.get('ajax').post('/profile/' + id + '/follow', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success(result.message);
        this.set('profile.following', true);
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to follow user.");
      });
    },

    unfollow(id) {
      this.get('ajax').post('/profile/' + id + '/unfollow', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success(result.message);
        this.set('profile.following', false);
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to unfollow user.");
      });
    }
  }
});
