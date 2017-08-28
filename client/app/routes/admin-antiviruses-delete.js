import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/antiviruses/' + params.antivirusId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      var expirationTime = new Date(result.antivirus.expirationTime);
      expirationTime = new Date(expirationTime.getTime() - expirationTime.getTimezoneOffset()*60000);
      result.antivirus.expirationTime = expirationTime.toISOString().slice(0,19);
      return {
        antivirus: result.antivirus
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve antivirus.');
      this.transitionTo('admin-antiviruses');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-antiviruses');
    },

    delete(id) {
      this.get('ajax').request('/admin/antiviruses/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted antivirus.');
        this.transitionTo('admin-antiviruses');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete antivirus.');
      });
    }
  }
});
