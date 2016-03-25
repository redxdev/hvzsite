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
  this.route('admin-players-edit', {path: '/admin/players/:playerId/edit'});
  this.route('admin-players-delete', {path: '/admin/players/:playerId/delete'});
  this.route('admin-players-avatar', {path: '/admin/players/:playerId/avatar'});
});

export default Router;
