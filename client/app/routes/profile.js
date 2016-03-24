import Ember from "ember";

export default Ember.Route.extend({
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('user').getUserProfile().then((result) => {
      return {profile: result.profile};
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
        }
      };
    });
  }
});
