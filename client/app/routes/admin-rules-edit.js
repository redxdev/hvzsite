import Ember from 'ember';
import config from '../config/environment';

/* globals CKEDITOR */
export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/rules/' + params.ruleId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {
        rule: result.rule
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve rule.');
      this.transitionTo('admin-rules');
    });
  },

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript(config.APP.ckeditor.script, () => {
          CKEDITOR.replace('ruleBody');
        });
      });
    },

    save(id) {
      Ember.$('#saveButton').hide();

      var title = Ember.$('#ruleTitle').val();
      var position = Ember.$('#rulePosition').val();
      var body = CKEDITOR.instances.ruleBody.getData();

      this.get('ajax').put('/admin/rules/' + id, {
        data: {
          title: title,
          position: position,
          body: body,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Updated rule.');
        this.transitionTo('admin-rules');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to save rule.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
