import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/missions/' + params.missionId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return {mission: result.mission};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve mission.');
      this.transitionTo('admin-missions');
    });
  },

  actions: {
    cancel() {
      this.transitionTo('admin-missions');
    },

    delete(id) {
      this.get('ajax').request('/admin/missions/' + id, {
        data: {
          apikey: this.get('user').getApiKey()
        },
        method: 'DELETE'
      }).then(() => {
        this.get('toast').success('Deleted mission.');
        this.transitionTo('admin-missions');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to delete mission.');
      });
    }
  }
});
