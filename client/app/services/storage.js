import Ember from 'ember';

var _data = {};

export default Ember.Service.extend({
  setItem(id, val) {
    if (window.localStorage) {
      return window.localStorage.setItem(id, val);
    }
    else {
      return _data[id] = val;
    }
  },

  getItem(id) {
    if (window.localStorage) {
      return window.localStorage.getItem(id);
    }
    else {
      return _data.hasOwnProperty(id) ? _data[id] : undefined;
    }
  },

  removeItem(id) {
    if (window.localStorage) {
      return window.localStorage.removeItem(id);
    }
    else {
      return delete _data[id];
    }
  },

  clear() {
    if (window.localStorage) {
      return window.localStorage.clear();
    }
    else {
      _data = {};
    }
  }
});
