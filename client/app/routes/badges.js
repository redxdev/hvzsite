import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/content/badges').then((result) => {
      return result;
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of badges.');
      console.log(err);
      return {};
    });
  }
});
