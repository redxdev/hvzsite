import Ember from 'ember';
import config from '../config/environment';
import ResetScrollMixin from '../mixins/reset-scroll';

/* globals CKEDITOR */
export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript(config.APP.ckeditor.script, () => {
          CKEDITOR.config.extraPlugins = config.APP.ckeditor.extraPlugins;
          CKEDITOR.replace('missionBody');
        });
      });
    },

    save() {
      Ember.$('#saveButton').hide();

      var title = Ember.$('#missionTitle').val();
      var team = Ember.$('#missionTeam').val();
      var body = CKEDITOR.instances.missionBody.getData();

      var postDate = Ember.$('#missionPostDate').val();
      if (postDate.trim() === '') {
        this.get('toast').warning("You didn't enter a time for the mission!");
        Ember.$('#saveButton').show();
        return;
      }

      postDate = new Date(postDate);
      postDate = new Date(postDate.getTime() /*+ postDate.getTimezoneOffset()*60000*/);

      var endDate = Ember.$('#missionEndDate').val();
      if(endDate.trim() === '') {
        this.get('toast').warning("You didn't enter an end time for the mission! Defaulting to a month!");
        endDate = new Date().setMonth(new Date().getMonth() + 1);
      }
      endDate = new Date(endDate);
      endDate = new Date(endDate.getTime());

      this.get('ajax').post('/admin/missions', {
        data: {
          title: title,
          body: body,
          team: team,
          postDate: postDate,
          endDate: endDate,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Created new mission.');
        this.transitionTo('admin-missions');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create mission.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
