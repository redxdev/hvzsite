import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model() {
    return new Ember.RSVP.hash({
        score: this.get('ajax').request('/status/score').catch((err) => {
            this.get('errorHandler').handleError(err, 'Unable to retrieve team scores.');
            return {humans: 0, zombies: 0};
        }),

        stats: {
            averageInfectionsPerDay: 'Coming Soon',
            infectionsToday: 'Coming Soon',
            antivirusesUsed: 'Coming Soon'
        }
    });
  },

  actions: {
      infectOZ() {
          Ember.$('#infect-oz-button').hide();
          this.get('ajax').post('/admin/game/infectoz', {
              data: {
                  apikey: this.get('user').getApiKey()
              }
          }).then((res) => {
              this.get('toast').success(res.message);
              Ember.$('#infect-oz-button').show();
          }).catch((err) => {
              this.get('errorHandler').handleError(err, 'Unable to infect OZs');
              Ember.$('#infect-oz-button').show();
          });
      }
  }
});
