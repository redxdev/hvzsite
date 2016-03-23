import Ember from 'ember';
import * as errors from 'ember-ajax/errors';

export default Ember.Service.extend({
  toast: Ember.inject.service(),

  handleError(error, defaultMessage, forceDefault) {
    forceDefault = forceDefault || false;
    var needsDefault = true;

    if (typeof error === 'object') {
      if (error instanceof errors.AjaxError) {
        error.errors.forEach((err) => {
          if (err.detail && err.detail.message) {
            this.get('toast').error(err.detail.message, error.message);
            needsDefault = false;
          }
        });
      }
    }

    if (needsDefault && defaultMessage) {
      this.get('toast').error(defaultMessage);
    }

    if (error instanceof errors.UnauthorizedError) {
      // TODO: redirect to login
    }

    console.log(error);
  }
});
