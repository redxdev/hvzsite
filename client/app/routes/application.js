import Ember from "ember";

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  user: Ember.inject.service(),
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  notificationParser: Ember.inject.service(),

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  },

  model() {
    return Ember.RSVP.hash({
      localUser: this.get('user').getUserInfo(),
      announcement: this.get('ajax').request('/content/announcements').then((result) => {
        if (result.posts.length > 0) {
          return result.posts[0];
        }
      }),
      date: this.get('ajax').request('/status/dates').then((dates) => {
        var val = new Date(dates.next);
        return {
          value: val,
          inPast: val < new Date()
        };
      }),
      notifications: this.get('ajax').request('/feed?stringify', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then((results) => {
        var unread = 0;
        var feed = results.feed;
        feed.forEach((f) => {
          if (f.viewed === false) {
            ++unread;
            f.class = "unviewed"
          }
          else {
            f.class = "viewed"
          }

          f.message = this.get('notificationParser').parseMessage(f.message);
        });
        return {
          unread: unread,
          feed: feed
        };
      })
    }).catch((err) => {
      this.get('errorHandler').handleError(err);
    });
  },

  actions: {
    register() {
      this.get('user').register();
    },

    login() {
      this.get('user').login().then(() => {
        this.transitionTo('status');
        this.refresh();
      }).catch(() => {
        this.transitionTo('status');
        this.refresh();
      });
    },

    logout() {
      this.get('user').logout().then(() => {
        this.transitionTo('status');
        this.refresh();
      }).catch(() => {
        this.transitionTo('status');
        this.refresh();
      });
    },

    openAnnouncement(id) {
      this.transitionTo('news', id);
    },

    notificationsViewed() {
      this.get('ajax').post('/feed/view', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, "Unable to mark your notifications as viewed.", true);
      });
    }
  }
});
