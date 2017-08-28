import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/admin/antiviruses', {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      result.antiviruses.reverse();
      return result;
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of antiviruses.');
      return {};
    });
  }
});
