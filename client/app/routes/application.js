import Ember from "ember";

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  user: Ember.inject.service(),
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  beforeModel() {
    // This is done so we refresh every so often just in case there is a new announcement.
    // Also just in case the state of the navbar gets out of sync with the user's access
    // level, like if their access level is changed while they are logged in.
    var refreshFunc = () => {
      this.refresh();
      Ember.run.later(this, refreshFunc, 30000);
    };
    Ember.run.later(this, refreshFunc, 30000);

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
  },
});
