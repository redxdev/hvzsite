import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/content/news/' + params.postId).then((result) => {
      return {post: result.post};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve post.');
      return {};
    });
  }
});
