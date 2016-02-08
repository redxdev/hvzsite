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

    '/': {
        view: 'homepage'
    },

    // StatusController
    'get /api/v2/status/dates': 'StatusController.dates',
    'get /api/v2/status/score': 'StatusController.score',
    'get /api/v2/status/players': 'StatusController.players',
    'get /api/v2/status/moderators': 'StatusController.moderators',
    'get /api/v2/status/infections': 'StatusController.infections',

    // ContentController
    'get /api/v2/content/rules': 'ContentController.rules',

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
    'post /api/v2/profile/clan': 'ProfileController.setClan'
};
