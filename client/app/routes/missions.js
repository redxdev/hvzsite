import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/content/missions', {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then(function (result) {
      return {
        missions: result.missions.map(function(mission) {
          mission.postDate = new Date(mission.postDate);
          return mission;
        })
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of missions.');
      return {missions: []};
    });
  },

  actions: {
    goToMission(id) {
      Ember.$('body').scrollTop(Ember.$('#mission-' + id).offset().top);
    }
  }
});
