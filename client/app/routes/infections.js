import Ember from "ember";

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/status/infections').then(function (result) {
      return {
        infections: result.infections.map(function (inf) {
          return {human: inf.human.name, zombie: inf.zombie.name, time: new Date(inf.time)};
        })
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of infections.');
      return {infections: []};
    });
  }
});
