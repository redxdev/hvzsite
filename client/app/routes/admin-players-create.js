import Ember from 'ember';


export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  actions: {
    save() {
      var name = Ember.$('#playerName').val();
      var email = Ember.$('#playerEmail').val();

      Ember.$('#saveButton').hide();

      this.get('ajax').post('/admin/users', {
        data: {
          name: name,
          email: email,
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        this.transitionTo('admin-players-view', result.user.id);
        this.get('toast').success('Created user.');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create user.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
