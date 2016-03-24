import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    willTransition() {
      window.scrollTo(0, 0);
    }
  }
});
