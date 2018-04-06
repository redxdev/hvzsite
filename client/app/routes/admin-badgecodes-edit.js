import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/badgecodes/' + params.badgecodeID, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {
        badgecode: result.badgecode
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve badge code.');
      this.transitionTo('admin-badgecodes');
    });
  },

  actions: {
    save(id) {
      Ember.$('#saveButton').hide();

      var description = Ember.$('#badgecodeDescription').val();

      var badgeID = Ember.$('#badgeID').val();
      if (badgeID.trim() === '') {
        this.get('toast').warning("You need to enter a badge id");
        Ember.$('#saveButton').show();
        return;
      }

      this.get('ajax').put('/admin/badgecodes/' + id, {
        data: {
          description: description,
          badgeID: badgeID.toLowerCase(),
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Saved badge code.');
        this.transitionTo('admin-badgecodes');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to save badge code.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
