import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model() {
    if (this.get('user').isLoggedIn()) {
      return this.get('user').getUserProfile().then((result) => {
        var profile = result.profile;
        if (profile.team === 'zombie') {
          return {zombieId: profile.zombieId, usedAV: profile.usedAV, oz: profile.oz};
        }
        else {
          return {zombieId: '', usedAV: profile.usedAV, oz: profile.oz};
        }
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to retrieve your id');
        return {zombieId: '', usedAV: false};
      });
    }
    else {
      return {notLoggedIn: true};
    }
  },

  actions: {
    submitAntivirus() {
      var antivirusId = Ember.$("#antivirusId").val().trim();
      var zombieId = Ember.$("#zombieId").val().trim();

      var hasError = false;
      if (antivirusId === '') {
        this.get('toast').error("You didn't enter an id for the antivirus!");
        hasError = true;
      }
      else if (antivirusId.length !== 8) {
        this.get('toast').error("The antivirus doesn't look valid.");
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

      Ember.$("#antivirusButton").hide();

      this.get('ajax').post('/game/antivirus', {
        data: {
          antivirus: antivirusId,
          zombie: zombieId,
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success('<strong>' + result.zombie.name + '</strong> has joined the realm of the living once more!');
        Ember.$('#antivirusId').val('');
        Ember.$('#antivirusButton').show();
        this.refresh();
      }).catch((err) => {
	Ember.$('#antivirusId').val('');
        Ember.$('#antivirusButton').show();
        if (err.errors[0] && err.errors[0].detail && err.errors[0].detail.problems) {
          console.log(err);
          err.errors[0].detail.problems.forEach((message) => {
            this.get('toast').error(message);
          });
        }
        else {
          this.get('errorHandler').handleError(err, 'There was a problem processing the antivirus.');
        }

        Ember.$('#antivirusButton').show();
      });
    }
  }
});
