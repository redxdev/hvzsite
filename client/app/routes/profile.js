import Ember from "ember";
import config from '../config/environment';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('user').getUserProfile().then((result) => {
      return this.get('ajax').request('/status/infections', {
        data: {
          zombie: result.profile.id
        }
      }).then((inf) => {
        result.profile.avatar = config.APP.apiURL + '/api/v2/avatar/' + result.profile.id;
        var profiles = [];
        result.profile.followers.forEach((id) => {
          profiles.push(this.get('ajax').request('/profile/' + id).then((r) => r.profile));
        });
        return Ember.RSVP.Promise.all(profiles).then((followers) => {
          result.profile.followers = followers;
          return {
            profile: result.profile,
            infections: inf.infections
          }
        });
      });
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve your profile.');
      return {
        profile: {
          name: "?",
          email: "?",
          "team": "unknown",
          "zombieId": "?",
          "humansTagged": 0,
          "badges": [],
          "clan": "?",
          "humanIds": []
        },
        infections: []
      };
    });
  }
});
