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
  this.route('infect');
  this.route('antivirus');

  this.route('admin-players', {path: '/admin/players'});
  this.route('admin-players-view', {path: '/admin/players/:playerId'});
});

export default Router;
