import Ember from 'ember';

/* jshint ignore:start */
import config from '../config/environment';
/* jshint ignore:end */

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  toast: Ember.inject.service(),

  playerId: null,

  model(params) {
    this.set('playerId', params.playerId);

    return this.get('ajax').request('/admin/users/' + params.playerId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      var player = result.user;
      return {player: player};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve player profile.');
      this.transitionTo('admin-players');
    });
  },


  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        /* jshint ignore:start */
        Webcam.set({
          width: 300,
          height: 300,
          image_format: 'jpeg',
          jpeg_quality: 100,
          upload_name: 'avatar'
        });

        Webcam.attach("#webcam");
        /* jshint ignore:end */
      });
    },

    willTransition() {
      /* jshint ignore:start */
      Webcam.reset();
      /* jshint ignore:end */
    },

    takePicture() {
      /* jshint ignore:start */
      Webcam.freeze();
      Webcam.snap((data) => {
        Webcam.upload(data,
          config.APP.apiURL + '/api/v2/admin/users/' + this.get('playerId') + '/avatar?apikey=' + this.get('user').getApiKey(), (code, text) => {
            if (code !== 200) {
              this.get('toast').error('There was a problem uploading the new avatar.');
              console.log(text);
            }
            else {
              this.get('toast').success('Uploaded new avatar.');
              this.transitionTo('admin-players-view', this.get('playerId'));
            }
          });
      });
      /* jshint ignore:end */
    }
  }
});
