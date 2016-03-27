import Ember from "ember";

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

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
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve game dates.');
        return {value: new Date(), inPast: true};
      }),

      score: this.get('ajax').request('/status/score').catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve team scores.');
        return {humans: 0, zombies: 0};
      }),

      infections: this.get('ajax').request('/status/infections', {
        data: {
          limit: 5
        }
      }).then(function (infections) {
        return infections.infections.map(function (inf) {
          return {human: inf.human.name, zombie: inf.zombie.name, time: new Date(inf.time)};
        });
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve list of infections.');
        return [];
      }),

      topPlayers: this.get('ajax').request('/status/players', {
        data: {
          limit: 5,
          team: 'zombie',
          sort: 'team'
        }
      }).then(function (players) {
        return players.players.map(function (player) {
          return {id: player.id, name: player.name, humansTagged: player.humansTagged};
        });
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve list of players.');
        return [];
      }),

      posts: this.get('ajax').request('/content/news').then(function (result) {
        return result.posts;
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve news posts.');
        return [];
      })
    });
  }
});
