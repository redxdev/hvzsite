import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    Ember.$("[data-toggle='tooltip']").tooltip();
  }
});
