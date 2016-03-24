import Ember from "ember";

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  useLocation: false,
  locationId: null,
  latitude: null,
  longitude: null,
  accuracy: null,

  beforeModel() {
    if (this.get('locationId')) {
      navigator.geolocation.clearWatch(this.get('locationId'));
    }

    this.set('locationId', navigator.geolocation.watchPosition((loc) => {
      Ember.$('#location-status').html("SENDING (accuracy: " + loc.coords.accuracy + " meters)");
      this.set('useLocation', true);
      this.set('latitude', loc.coords.latitude);
      this.set('longitude', loc.coords.longitude);
    }, (err) => {
      console.log(err);
      Ember.$('#location-status').innerHTML = "NOT SENDING";
      this.set('useLocation', false);
    }, {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0
    }));
  },

  model() {
    if (this.get('user').isLoggedIn()) {
      return this.get('user').getUserProfile().then((result) => {
        var profile = result.profile;
        if (profile.team === 'zombie') {
          return {humanId: '', zombieId: profile.zombieId};
        }
        else {
          var goodId = '';
          for (var i = 0; i < profile.humanIds.length; ++i) {
            var id = profile.humanIds[i];
            if (id.active) {
              goodId = id.idString;
              break;
            }
          }

          return {humanId: goodId, zombieId: ''};
        }
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve your id');
        return {humanId: '', zombieId: ''};
      });
    }
    else {
      return {notLoggedIn: true};
    }
  },

  actions: {
    willTransition() {
      if (this.get('locationId')) {
        navigator.geolocation.clearWatch(this.get('locationId'));
        this.set('locationId', null);
      }

      this.set('useLocation', false);
    },

    submitInfection() {
      var humanId = Ember.$("#humanId").val().trim();
      var zombieId = Ember.$("#zombieId").val().trim();

      var hasError = false;
      if (humanId === '') {
        this.get('toast').error("You didn't enter an id for the human!");
        hasError = true;
      }
      else if (humanId.length !== 8) {
        this.get('toast').error("The human id doesn't look valid.");
        hasError = true;
      }

      if (zombieId === '') {
        this.get('toast').error("You didn't enter an id for the zombie!");
        hasError = true;
      }
      else if (zombieId.length !== 8) {
        this.get('toast').error("The zombie id doesn't look valid.");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      Ember.$("#infectButton").hide();

      this.get('ajax').post('/game/infect', {
        data: {
          human: humanId,
          zombie: zombieId,
          location: this.get('useLocation'),
          latitude: this.get('latitude'),
          longitude: this.get('longitude'),
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success('<strong>' + result.human.name + '</strong> has joined the horde, courtesy of <strong>' + result.zombie.name + '</strong>');
        Ember.$('#humanId').val('');
        Ember.$('#infectButton').show();
      }).catch((err) => {
        if (err.errors[0] && err.errors[0].detail && err.errors[0].detail.problems) {
          console.log(err);
          err.errors[0].detail.problems.forEach((message) => {
            this.get('toast').error(message);
          });
        }
        else {
          this.get('errorHandler').handleError(err, 'There was a problem processing the infection.');
        }

        Ember.$('#infectButton').show();
      });
    }
  }
});
