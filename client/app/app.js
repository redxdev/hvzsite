import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;

export var OneSignal = window.OneSignal || [];
export var OneSignalEnabled = config.APP.onesignal.enabled === true;

if (OneSignalEnabled) {
  OneSignal.push(['init', config.APP.onesignal.config]);
}