import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/content/rules').catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of rules.');
      return {rules: []};
    });
  },

  actions: {
    goToRule(id) {
      Ember.$('body').scrollTop(Ember.$('#rule-' + id).offset().top);
    }
  }
});
