import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  loginWindow: null,

  isLoggedIn() {
    return window.localStorage.getItem("apikey") !== null;
  },

  login() {
    return new Promise((resolve, reject) => {
      var loginWindow = this.get('loginWindow');
      if (loginWindow) {
        loginWindow.close();
      }

      loginWindow = window.open(config.APP.apiURL + "/auth/l/" + config.APP.loginMethod);
      window.onbeforeunload = () => {
        reject();
      };

      window.onmessage = (event) => {
        if (event.origin !== config.APP.apiURL) {
          console.error("Bad origin " + event.origin);
          console.error(event);
          return;
        }

        if (event.data.success === true) {
          this.get('toast').success(event.data.message);
          this.set('apikey', event.data.key);
          window.localStorage.setItem("apikey", event.data.key);
          console.log("API Key: " + event.data.key);
          resolve();
        }
        else {
          this.get('toast').error(event.data.message);
          reject();
        }
      };
      this.set('loginWindow', loginWindow);
    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      window.localStorage.removeItem("apikey");

      var loginWindow = this.get('loginWindow');
      if (loginWindow) {
        loginWindow.close();
      }

      loginWindow = window.open(config.APP.apiURL + "/auth/logout");
      window.onbeforeunload = () => {
        reject();
      };

      window.onmessage = (event) => {
        if (event.origin !== config.APP.apiURL) {
          console.error("Bad origin " + event.origin);
          console.error(event);
          return;
        }

        if (event.data.success === true) {
          this.get('toast').success(event.data.message);
          resolve();
        }
        else {
          this.get('toast').error(event.data.message);
          reject();
        }
      };
      this.set('loginWindow', loginWindow);
    });
  }
});
