import Ember from "ember";
import config from "../config/environment";

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  loginWindow: null,
  userInfoCache: null,

  isLoggedIn() {
    return window.localStorage.getItem("apikey") !== null;
  },

  getApiKey() {
    return window.localStorage.getItem("apikey");
  },

  register() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var loginWindow = this.get('loginWindow');
      if (loginWindow) {
        loginWindow.close();
      }

      loginWindow = window.open(config.APP.apiURL + "/auth/r/" + config.APP.loginMethod);
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
  },

  login() {
    return new Ember.RSVP.Promise((resolve, reject) => {
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
    return new Ember.RSVP.Promise((resolve, reject) => {
      window.localStorage.removeItem("apikey");
      this.set('userInfoCache', null);

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

        this.get('routing').transitionTo('status');
        console.log(event.data);

        if (event.data.success === true) {
          this.get('toast').success('You have been logged out.');
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

  getUserProfile() {
    return this.get('ajax').request("/profile", {
      data: {
        apikey: this.getApiKey()
      }
    });
  },

  getUserInfo() {
    if (!this.isLoggedIn()) {
      this.set('userInfoCache', null);
      return new Ember.RSVP.Promise((resolve) => {
        resolve({
          profile: null,
          loggedIn: false,
          isModerator: false,
          isAdmin: false,
          isSuperAdmin: false
        });
      });
    }

    if (this.get('userInfoCache') !== null) {
      return new Ember.RSVP.Promise((resolve) => {
        resolve(this.get('userInfoCache'));
      });
    }

    return this.getUserProfile().then((result) => {
      var profile = result.profile;
      this.set('userInfoCache', {
        profile: profile,
        loggedIn: true,
        isModerator: this.isModerator(profile.access),
        isAdmin: this.isAdmin(profile.access),
        isSuperAdmin: this.isSuperAdmin(profile.access)
      });
      return this.get('userInfoCache');
    });
  },

  isModerator(access) {
    return access === "mod" || access === "admin" || access === "superadmin";
  },

  isAdmin(access) {
    return access === "admin" || access === "superadmin";
  },

  isSuperAdmin(access) {
    return access === "superadmin";
  }
});
