import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/polls/' + params.pollId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {poll: result.poll};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve poll.');
      this.transitionTo('admin-polls');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-polls');
    },

    delete(id) {
      this.get('ajax').request('/admin/polls/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted poll.');
        this.transitionTo('admin-polls');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete poll.');
      });
    }
  }
});
