import Ember from "ember";
import config from '../config/environment';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/profile/' + params.playerId).then((result) => {
      return this.get('ajax').request('/status/infections', {
        data: {
          zombie: result.profile.id
        }
      }).then((inf) => {
        result.profile.avatar = config.APP.apiURL + '/api/v2/avatar/' + result.profile.id;
        return {
          profile: result.profile,
          infections: inf.infections
        };
      });
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve profile.');
      return {
        profile: {
          name: "?",
          email: "?",
          "team": "unknown",
          "humansTagged": 0,
          "badges": [],
          "clan": "?"
        },
        infections: []
      };
    });
  }
});
