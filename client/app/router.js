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
  this.route('admin-players-create', {path: '/admin/players/create'});
  this.route('admin-print', {path: '/admin/print'});
  this.route('admin-rules', {path: '/admin/rules'});
  this.route('admin-rules-create', {path: '/admin/rules/create'});
  this.route('admin-rules-edit', {path: '/admin/rules/:ruleId/edit'});

  // 404
  this.route('not-found', {path: '/*path'});
});

export default Router;
