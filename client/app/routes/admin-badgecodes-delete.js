import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/badgecodes/' + params.badgecodeID, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {
        badgecode: result.badgecode
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve badge code.');
      this.transitionTo('admin-badgecodes');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-badgecodes');
    },

    delete(id) {
      this.get('ajax').request('/admin/badgecodes/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted badge code.');
        this.transitionTo('admin-badgecodes');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete badge code.');
      });
    }
  }
});
