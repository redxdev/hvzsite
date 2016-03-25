import Ember from "ember";

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  },

  model() {
    return this.get('user').getUserInfo().then((user) => {
      return {localUser: user};
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
    }
  }
});