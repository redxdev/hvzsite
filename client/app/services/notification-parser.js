import Ember from 'ember';

export default Ember.Service.extend({
  routing: Ember.inject.service("-routing"),
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  parseMessage(message) {
    if (typeof message === "string")
      return new Ember.RSVP.Promise((resolve) => {
        resolve([{string: true, value: message}])
      });

    var parts = [];
    message.forEach((part) => {
      if (typeof part === "string") {
        parts.push(new Ember.RSVP.Promise((resolve) => {
          resolve({string: true, value: part});
        }));
        return;
      }

      switch (part.t) {
      default:
        parts.push(new Ember.RSVP.Promise((resolve) => {
          resolve({string: true, value: "NT?"});
        }));
        break;

      case 'u':
        parts.push(new Ember.RSVP.Promise((resolve, reject) => {
          this.get('ajax').request('/profile/' + part.i).then((result) => {
            resolve({
              user: true,
              value: result.profile.name,
              id: part.i
            });
          }).catch((err) => {
            reject(err);
          });
        }));
        break;
      }
    });

    return Ember.RSVP.Promise.all(parts);
  }
});
