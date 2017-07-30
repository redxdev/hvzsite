import Ember from 'ember';

export default Ember.Service.extend({
  routing: Ember.inject.service("-routing"),

  parseMessage(message) {
      if (typeof message === "string")
        return message;

      return "TODO";
  }
});
