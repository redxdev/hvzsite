/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    fingerprint: {
      enabled: false
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // bootstrap
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  // bootswatch
  app.import('bower_components/bootswatch/cyborg/bootstrap.css');

  // bootstrap-dropmenu
  app.import('bower_components/bootstrap-dropmenu/dist/stylesheets/bootstrap-dropmenu.css');

  // bootstrap-notifications
  app.import('bower_components/bootstrap-notifications/dist/stylesheets/bootstrap-notifications.css');

  // jQuery Countdown
  app.import('bower_components/jquery.countdown/dist/jquery.countdown.js');

  // webcam
  app.import('bower_components/webcamjs/webcam.js');

  return app.toTree();
};
