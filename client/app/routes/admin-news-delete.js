import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/news/' + params.postId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {post: result.post};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve post.');
      this.transitionTo('admin-news');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-news');
    },

    delete(id) {
      this.get('ajax').request('/admin/news/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted post.');
        this.transitionTo('admin-news');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete post.');
      });
    }
  }
});
