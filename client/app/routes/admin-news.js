import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/admin/news', {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      return result;
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of news posts.');
      return {};
    });
  },

  actions: {
    markImportant(id) {
      Ember.$('.post-important-link').hide();

      this.get('ajax').post('/admin/news/' + id + '/important', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Marked post as important. All other posts have been marked as unimportant.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to mark post as important.');
        Ember.$('.post-important.link').show();
      });
    },

    markUnimportant(id) {
      Ember.$('.post-important-link').hide();

      this.get('ajax').post('/admin/news/' + id + '/unimportant', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Marked post as unimportant.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to mark post as unimportant.');
        Ember.$('.post-important.link').show();
      });
    },

    markFrontpage(id) {
      Ember.$('.post-frontpage-link').hide();

      this.get('ajax').post('/admin/news/' + id + '/frontpage', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Placed post on the front page. Other frontpage posts have been removed.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to place post on the front page.');
        Ember.$('.post-frontpage-link').show();
      });
    },

    markNotFrontpage(id) {
      Ember.$('.post-frontpage-link').hide();

      this.get('ajax').post('/admin/news/' + id + '/notfrontpage', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Removed post from the front page.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to remove post from the front page.');
        Ember.$('.post-frontpage-link').show();
      });
    }
  }
});
