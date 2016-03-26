import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/rules/' + params.ruleId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {rule: result.rule};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve rule.');
      this.transitionTo('admin-rules');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-rules');
    },

    delete(id) {
      this.get('ajax').request('/admin/rules/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted rule.');
        this.transitionTo('admin-rules');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete rule.');
      });
    }
  }
});
