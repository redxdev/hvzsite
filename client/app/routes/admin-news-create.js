import Ember from 'ember';
import config from '../config/environment';

/* globals CKEDITOR */
export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript(config.APP.ckeditor.script, () => {
          CKEDITOR.config.extraPlugins = config.APP.ckeditor.extraPlugins;
          CKEDITOR.replace('postBody');
        });
      });
    },

    save() {
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
    }
  }
});
