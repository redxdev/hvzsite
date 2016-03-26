import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/missions/' + params.missionId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      result.mission.postDate = new Date(result.mission.postDate).toISOString().slice(0,19);
      return {
        mission: result.mission
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve mission.');
      return {};
    });
  },

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        /* jshint ignore:start */
        CKEDITOR.replace('missionBody');
        /* jshint ignore:end */
      });
    },

    /* jshint ignore:start */
    save(id) {
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

      this.get('ajax').put('/admin/missions/' + id, {
        data: {
          title: title,
          body: body,
          team: team,
          postDate: postDate,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Saved mission.');
        this.transitionTo('admin-missions');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to save mission.');
        Ember.$('#saveButton').show();
      });
    }
    /* jshint ignore:end */
  }
});
