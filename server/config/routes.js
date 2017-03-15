/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // StatusController
  'get /api/v2/status/dates': 'StatusController.dates',
  'get /api/v2/status/score': 'StatusController.score',
  'get /api/v2/status/players': 'StatusController.players',
  'get /api/v2/status/moderators': 'StatusController.moderators',
  'get /api/v2/status/infections': 'StatusController.infections',

  // ContentController
  'get /api/v2/content/rules': 'ContentController.rules',
  'get /api/v2/content/news': 'ContentController.news',
  'get /api/v2/content/news/:id': 'ContentController.newsPost',
  'get /api/v2/content/announcements': 'ContentController.announcements',
  'get /api/v2/content/frontpage': 'ContentController.frontpage',
  'get /api/v2/content/missions': 'ContentController.missions',
  'get /api/v2/content/polls': 'ContentController.polls',
  'post /api/v2/content/polls/:id': 'ContentController.vote',

  // GameController
  'post /api/v2/game/infect': 'GameController.infect',
  'post /api/v2/game/antivirus': 'GameController.antivirus',

  // AuthController
  'get /auth/l/google': 'AuthController.loginGoogle',
  'get /auth/c/google': 'AuthController.callbackGoogle',
  'get /auth/r/google': 'AuthController.registerGoogle',
  'get /auth/rc/google': 'AuthController.callbackRegisterGoogle',

  'get /auth/logout': 'AuthController.logout',

  'get /api/v2/auth/apikey': 'AuthController.apiKey',

  // ProfileController
  'get /api/v2/profile': 'ProfileController.mine',
  'get /api/v2/profile/:id': 'ProfileController.other',
  'post /api/v2/profile/clan': 'ProfileController.setClan',
  'get /api/v2/avatar/:id': 'ProfileController.avatar',
  'post /api/v2/profile/notificationKey': 'ProfileController.addNotificationKey',

  // AdminUserController
  'get /api/v2/admin/users': 'AdminUserController.list',
  'get /api/v2/admin/users/:id': 'AdminUserController.get',
  'put /api/v2/admin/users/:id': 'AdminUserController.update',
  'post /api/v2/admin/users/:id/activate': 'AdminUserController.activate',
  'post /api/v2/admin/users/:id/avatar': 'AdminUserController.uploadAvatar',
  'post /api/v2/admin/users': 'AdminUserController.create',
  'post /api/v2/admin/users/:id/generateId': 'AdminUserController.generateId',
  'post /api/v2/admin/users/:id/infect': 'AdminUserController.infect',
  'post /api/v2/admin/users/:id/heal': 'AdminUserController.heal',
  'delete /api/v2/admin/users/:id': 'AdminUserController.destroy',
  'post /api/v2/admin/users/:id/notification': 'AdminUserController.sendNotification',
  'post /api/v2/admin/users/markPrinted': 'AdminUserController.markPrinted',
  'get /print': 'AdminUserController.print',
  'get /auth/l/qr/:id': 'AdminUserController.loginKey',

  // AdminContentController rules
  'get /api/v2/admin/rules': 'AdminContentController.rules',
  'get /api/v2/admin/rules/:id': 'AdminContentController.rule',
  'put /api/v2/admin/rules/:id': 'AdminContentController.updateRule',
  'post /api/v2/admin/rules': 'AdminContentController.createRule',
  'delete /api/v2/admin/rules/:id': 'AdminContentController.destroyRule',

  // AdminContentController missions
  'get /api/v2/admin/missions': 'AdminContentController.missions',
  'get /api/v2/admin/missions/:id': 'AdminContentController.mission',
  'put /api/v2/admin/missions/:id': 'AdminContentController.updateMission',
  'post /api/v2/admin/missions': 'AdminContentController.createMission',
  'delete /api/v2/admin/missions/:id': 'AdminContentController.destroyMission',

  // AdminContentController news posts
  'get /api/v2/admin/news': 'AdminContentController.newsPosts',
  'get /api/v2/admin/news/:id': 'AdminContentController.newsPost',
  'put /api/v2/admin/news/:id': 'AdminContentController.updateNewsPost',
  'post /api/v2/admin/news': 'AdminContentController.createNewsPost',
  'delete /api/v2/admin/news/:id': 'AdminContentController.destroyNewsPost',
  'post /api/v2/admin/news/:id/important': 'AdminContentController.markImportantPost',
  'post /api/v2/admin/news/:id/unimportant': 'AdminContentController.markUnimportantPost',
  'post /api/v2/admin/news/:id/frontpage': 'AdminContentController.markFrontpagePost',
  'post /api/v2/admin/news/:id/notfrontpage': 'AdminContentController.markNotFrontpagePost',

  // AdminContentController polls
  'get /api/v2/admin/polls': 'AdminContentController.polls',
  'get /api/v2/admin/polls/:id': 'AdminContentController.poll',
  'put /api/v2/admin/polls/:id': 'AdminContentController.updatePoll',
  'post /api/v2/admin/polls': 'AdminContentController.createPoll',
  'delete /api/v2/admin/polls/:id': 'AdminContentController.destroyPoll',

  // AdminAntivirusController
  'get /api/v2/admin/antiviruses': 'AdminAntivirusController.list',
  'get /api/v2/admin/antiviruses/:id': 'AdminAntivirusController.get',
  'post /api/v2/admin/antiviruses': 'AdminAntivirusController.create',
  'put /api/v2/admin/antiviruses/:id': 'AdminAntivirusController.update',
  'delete /api/v2/admin/antiviruses/:id': 'AdminAntivirusController.destroy',

  // Assets
  '/*': {
    controller: 'AppController',
    action: 'serve',
    skipAssets: true
  }
};
