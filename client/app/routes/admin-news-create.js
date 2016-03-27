import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        /* jshint ignore:start */
        CKEDITOR.replace('postBody');
        /* jshint ignore:end */
      });
    },

    save() {
      /* jshint ignore:start */
      Ember.$('#saveButton').hide();

      var title = Ember.$('#postTitle').val();
      var summary = Ember.$('#postSummary').val();
      var body = CKEDITOR.instances.postBody.getData();

      this.get('ajax').post('/admin/news', {
        data: {
          title: title,
          summary: summary,
          body: body,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Created new post.');
        this.transitionTo('admin-news');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create post.');
        Ember.$('#saveButton').show();
      });
      /* jshint ignore:end */
    }
  }
});
