import Ember from "ember";

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  user: Ember.inject.service(),
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  },

  model() {
    return Ember.RSVP.hash({
      localUser: this.get('user').getUserInfo(),
      announcement: this.get('ajax').request('/content/announcements').then((result) => {
        if (result.posts.length > 0) {
          return result.posts[0];
        }
      })
    }).catch((err) => {
      this.get('errorHandler').handleError(err);
    });
  },

  actions: {
    register() {
      this.get('user').register();
    },

    login() {
      this.get('user').login().then(() => {
        this.transitionTo('status');
        this.refresh();
      }).catch(() => {
        this.transitionTo('status');
        this.refresh();
      });
    },

    logout() {
      this.get('user').logout().then(() => {
        this.transitionTo('status');
        this.refresh();
      }).catch(() => {
        this.transitionTo('status');
        this.refresh();
      });
    },

    openAnnouncement(id) {
      this.transitionTo('news', id);
    }
  }
});
