import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    save() {
      Ember.$('#saveButton').hide();

      var description = Ember.$('#antivirusDescription').val();

      var expirationTime= Ember.$('#antivirusExpirationTime').val();
      if (expirationTime.trim() === '') {
        this.get('toast').warning("You didn't enter an expiration time for the antivirus!");
        Ember.$('#saveButton').show();
        return;
      }

      expirationTime = new Date(expirationTime);
      expirationTime = new Date(expirationTime.getTime() + expirationTime.getTimezoneOffset()*60000);

      this.get('ajax').post('/admin/antiviruses', {
        data: {
          description: description,
          expirationTime: expirationTime,
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.get('toast').success('Created new antivirus #' + result.antivirus.id);
        this.transitionTo('admin-antiviruses');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create antivirus.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
