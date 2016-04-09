import Ember from 'ember';

/* globals CKEDITOR */
export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/news/' + params.postId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {
        post: result.post
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve post.');
      this.transitionTo('admin-news');
    });
  },

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript('//cdn.ckeditor.com/4.5.8/standard/ckeditor.js', () => {
          CKEDITOR.replace('postBody');
        });
      });
    },

    save(id) {
      Ember.$('#saveButton').hide();

      var title = Ember.$('#postTitle').val();
      var summary = Ember.$('#postSummary').val();
      var body = CKEDITOR.instances.postBody.getData();

      this.get('ajax').put('/admin/news/' + id, {
        data: {
          title: title,
          summary: summary,
          body: body,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Updated post.');
        this.transitionTo('admin-news');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to save post.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
