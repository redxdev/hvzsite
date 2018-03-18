import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  actions:{
  	submitBadge() {
      var badgecode = Ember.$("#badgecode").val().trim();

      var hasError = false;
      if (badgecode === '') {
        this.get('toast').error("You didn't enter a badgecode!");
        hasError = true;
      }
      else if (badgecode.length !== 10) {
        this.get('toast').error("The badge code doesn't look valid.");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      Ember.$("#badgeButton").hide();

      this.get('ajax').post('/game/badge', {
        data: {
          badgecode: badgecode,
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success('You have earned the <strong>' + result.badge + '</strong> badge!');
        Ember.$('#badgecode').val('');
        Ember.$('#badgeButton').show();
        this.refresh();
      }).catch((err) => {
        if (err.message && err.problems) {
          console.log(err);
          err.problems.forEach((problem) => {
            this.get('toast').error(problem);
          });
        }
        else {
          this.get('errorHandler').handleError(err, 'There was a problem processing the antivirus.');
        }

        Ember.$('#badgeButton').show();
      });
    }
  }
 });
