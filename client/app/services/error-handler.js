import Ember from 'ember';
import * as errors from 'ember-ajax/errors';

export default Ember.Service.extend({
  toast: Ember.inject.service(),
  user: Ember.inject.service(),
  routing: Ember.inject.service("-routing"),

  handleError(error, defaultMessage, forceDefault) {
    forceDefault = forceDefault || false;
    var needsDefault = true;

    if (typeof error === 'object') {
      if (error instanceof errors.AjaxError &&
        !(error instanceof errors.UnauthorizedError) &&
        !(error instanceof errors.ForbiddenError)) {
        error.errors.forEach((err) => {
          if (err.detail && err.detail.message) {
            this.get('toast').error(err.detail.message, error.message);
            needsDefault = false;
          }
        });
      }
    }

    if (error instanceof errors.UnauthorizedError) {
      console.error(error);
      console.log("Unauthorized: Moving to index");
      this.get('routing').transitionTo('status');
      this.get('toast').error('You are not logged in!');
      return;
    }

    if (error instanceof errors.ForbiddenError) {
      console.error(error);
      console.log("Forbidden: Moving to index");
      this.get('routing').transitionTo('status');
      this.get('toast').error('You are not permitted to do that.');
    }

    if (needsDefault && defaultMessage) {
      this.get('toast').error(defaultMessage);
    }

    console.error(error);
  }
});
