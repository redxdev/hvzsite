import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
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
      Ember.$('html').scrollTop(Ember.$('#rule-' + id).offset().top);
    }
  }
});
