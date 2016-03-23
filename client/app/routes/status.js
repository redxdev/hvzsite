import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  setupController(controller, model) {
    this._super(controller, model);

    Ember.run.schedule('afterRender', this, function () {
      Ember.$("#countdown").countdown(model.date.value, function (event) {
        Ember.$(this).html(event.strftime('' +
          '<strong>%-D</strong> day%!D ' +
          '<strong>%-H</strong> hour%!H ' +
          '<strong>%-M</strong> minute%!M ' +
          '<strong>%-S</strong> second%!S'
        ));
      });
    });
  },

  model() {
    return new Ember.RSVP.hash({
      date: this.get('ajax').request('/status/dates').then(function (dates) {
        var val = new Date(dates.next);
        return {
          value: val,
          inPast: val < new Date()
        };
      }),
      score: this.get('ajax').request('/status/score'),
      infections: this.get('ajax').request('/status/infections', {
        data: {
          limit: 5
        }
      }).then(function (infections) {
        return {values: infections.infections.map(function (inf) {
          return {human: inf.human.name, zombie: inf.zombie.name, time: new Date(inf.time)};
        })};
      })
    });
  }
});
