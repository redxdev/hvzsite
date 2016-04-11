import Ember from 'ember';

export default Ember.Route.extend({
  toast: Ember.inject.service(),
  storage: Ember.inject.service(),

  queryParams: {
    key: {
      refreshModel: true
    }
  },
  key: null,

  model(params) {
    this.set('key', params.key);
  },

  actions: {
    didTransition() {
      var key = this.get('key');
      if (key) {
        this.get('storage').setItem('apikey', key);
        this.get('toast').success('Updated session API key.');
        console.log('Updated API Key: ' + key);
      }
      else {
        this.get('toast').error('No API key specified.');
      }

      this.transitionTo('status');
    }
  }
});
