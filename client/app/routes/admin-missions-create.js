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
        CKEDITOR.replace('missionBody');
        /* jshint ignore:end */
      });
    },

    save() {
      /* jshint ignore:start */
      Ember.$('#saveButton').hide();

      var title = Ember.$('#missionTitle').val();
      var team = Ember.$('#missionTeam').val();
      var postDate = Ember.$('#missionPostDate').val();
      var body = CKEDITOR.instances.missionBody.getData();

      if (postDate.trim() === '') {
        this.get('toast').warning("You didn't enter a time for the mission!");
        Ember.$('#saveButton').show();
        return;
      }

      this.get('ajax').post('/admin/missions', {
        data: {
          title: title,
          body: body,
          team: team,
          postDate: new Date(postDate),
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Created new mission.');
        this.transitionTo('admin-missions');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create mission.');
        Ember.$('#saveButton').show();
      });
      /* jshint ignore:end */
    }
  }
});
