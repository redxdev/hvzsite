import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('status', {path: '/'});
  this.route('profile');
  this.route('players');
  this.route('infections');
  this.route('missions');
  this.route('rules');
});

export default Router;
