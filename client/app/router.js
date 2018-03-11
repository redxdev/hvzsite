import Ember from 'ember';
import config from './config/environment';
import {OneSignal, OneSignalEnabled} from './app';

const Router = Ember.Router.extend({
  user: Ember.inject.service(),
  location: config.locationType,

  didTransition() {
    this._super(...arguments);

    Ember.$('.navbar-collapse').collapse('hide');

    if (this.get('user').isLoggedIn()) {
      this.get('user').getUserInfo().then((result) => {
        if (result.profile) {
          if (result.profile.team === 'human') {
            Ember.$('meta[name=theme-color]').prop('content', '#eb4600');
          }
          else {
            Ember.$('meta[name=theme-color]').prop('content', '#00af04');
          }

          if (OneSignalEnabled) {
            OneSignal.push(() => {
              OneSignal.getUserId((userId) => {
                if (userId !== null) {
                  this.get('user').addNotificationKey(userId).catch((err) => {
                    console.error("Error while adding notification key", err);
                  });
                }
              });
            });
          }
        }
        else {
          Ember.$('meta[name=theme-color]').prop('content', '#3a3a3a');
        }
      }).catch((err) => {
        console.error('Unable to retrieve user info for theme');
        console.error(err);
        Ember.$('meta[name=theme-color]').prop('content', '#3a3a3a');
      });
    }
    else {
      Ember.$('meta[name=theme-color]').prop('content', '#3a3a3a');
    }
  }
});

Router.map(function() {
  this.route('status', {path: '/'});
  this.route('news', {path: '/news/:postId'});
  this.route('profile');
  this.route('players');
  this.route('player', {path: '/players/:playerId'});
  this.route('infections');
  this.route('map');
  this.route('spread');
  this.route('missions');
  this.route('rules');
  this.route('infect');
  this.route('qr', {path: '/q/:code'});
  this.route('antivirus');
  this.route('contact');
  this.route('credits');
  this.route('apikey', {path: '/setkey'});

  this.route('admin-game', {path: '/admin/game'});

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

  this.route('admin-polls', {path: '/admin/polls'});
  this.route('admin-polls-create', {path: '/admin/polls/create'});
  this.route('admin-polls-view', {path: '/admin/polls/:pollId'});
  this.route('admin-polls-edit', {path: '/admin/polls/:pollId/edit'});
  this.route('admin-polls-delete', {path: '/admin/polls/:pollId/delete'});

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

  this.route('admin', function() {});
  this.route('admin-badgecodes', {path: '/admin/badgecodes'});
  this.route('admin-badgecodes-create', {path: '/admin/badgecodes/create'});
  this.route('admin-badgecodes-edit', {path: '/admin/badgecodes/:badgecodeID/edit'});
  this.route('admin-badgecodes-delete', {path: '/admin/badgecodes/:badgecodeID/delete'});
  this.route('badge');
});

export default Router;
