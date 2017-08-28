import Ember from 'ember';
import config from '../config/environment';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model() {
    return {
      printURL: config.APP.apiURL + '/print'
    };
  },

  actions: {
    markPrinted() {
      Ember.$('#markPrintedButton').hide();

      this.get('ajax').post('/admin/users/markPrinted', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Marked all active players as printed.');
        Ember.$('#markPrintedButton').show();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to mark active players as printed.');
        Ember.$('#markPrintedButton').show();
      });
    }
  }
});
