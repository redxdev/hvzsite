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
  },

  actions: {
    /* globals google */
    didTransition() {
      Ember.run.scheduleOnce('afterRender', () => {
        this.get('ajax').request('/status/infections').then((result) => {
          if (result.infections.length === 0) {
            return;
          }

          // Processing to categorize infections into hours
          var infectionMap = {};
          var infections = [];
          result.infections.forEach((inf) => {
            var date = new Date(inf.time);
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
            var key = date.getFullYear() + " " + date.getMonth() + " " + date.getDate() + " " + date.getHours();
            if (infectionMap[key]) {
              infectionMap[key][1]++;
            }
            else {
              var obj = [date, 1];
              infectionMap[key] = obj;
              infections.push(obj);
            }
          });

          Ember.$.getScript('https://www.google.com/jsapi', function () {
            google.load('visualization', '1.1', {packages:['bar'], callback: () => {
              Ember.$('#infection-chart').css('height', '250px');
              var data = new google.visualization.DataTable();

              data.addColumn('datetime', 'Time');
              data.addColumn('number', 'Infections');

              data.addRows(infections);

              var options = google.charts.Bar.convertOptions({
                title: 'Infection Timeline',
                colors: ['#00af04'],
                legend: {position: 'none'},
                backgroundColor: 'transparent',
                chartArea: {
                  backgroundColor: 'transparent'
                }
              });

              var chart = new google.charts.Bar(document.getElementById('infection-chart'));
              chart.draw(data, options);
            }});
          });
        }).catch((err) => {
          this.get('errorHandler').handleError(err, 'Unable to load list of infections');
        });
      });
    }
  }
});
