import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,

  didTransition() {
    this._super(...arguments);

    Ember.$('.navbar-collapse').collapse('hide');
  }
});

Router.map(function() {
  this.route('status', {path: '/'});
  this.route('news', {path: '/news/:postId'});
  this.route('profile');
  this.route('players');
  this.route('infections');
  this.route('map');
  this.route('spread');
  this.route('missions');
  this.route('rules');
  this.route('infect');
  this.route('antivirus');
  this.route('contact');
  this.route('credits');

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
  this.route('admin-rules-delete', {path: '/admin/rules/:ruleId/delete'});

  this.route('admin-missions', {path: '/admin/missions'});
  this.route('admin-missions-create', {path: '/admin/missions/create'});
  this.route('admin-missions-edit', {path: '/admin/missions/:missionId/edit'});
  this.route('admin-missions-delete', {path: '/admin/missions/:missionId/delete'});

  this.route('admin-news', {path: '/admin/news'});
  this.route('admin-news-create', {path: '/admin/news/create'});
  this.route('admin-news-edit', {path: '/admin/news/:postId/edit'});
  this.route('admin-news-delete', {path: '/admin/news/:postId/delete'});

  this.route('admin-antiviruses', {path: '/admin/antiviruses'});
  this.route('admin-antiviruses-create', {path: '/admin/antiviruses/create'});
  this.route('admin-antiviruses-edit', {path: '/admin/antiviruses/:antivirusId/edit'});
  this.route('admin-antiviruses-delete', {path: '/admin/antiviruses/:antivirusId/delete'});

  // 404
  this.route('not-found', {path: '/*path'});
});

export default Router;
