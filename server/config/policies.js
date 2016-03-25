/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {
  AuthController: {
    apiKey: ['isActive']
  },

  ProfileController: {
    mine: ['apikey', 'isActive'],
    setClan: ['apikey', 'isActive']
  },

  ContentController: {
    missions: ['apikey', 'isActive']
  },

  GameController: {
    infect: ['apikey', 'isActive', 'preventFailed'],
    antivirus: ['apikey', 'isActive', 'preventFailed']
  },

  AdminUserController: {
    list: ['apikey', 'isModerator'],
    get: ['apikey', 'isModerator'],
    update: ['apikey', 'isAdmin'],
    activate: ['apikey', 'isModerator'],
    uploadAvatar: ['apikey', 'isModerator'],
    create: ['apikey', 'isAdmin'],
    generateId: ['apikey', 'isModerator'],
    infect: ['apikey', 'isModerator'],
    heal: ['apikey', 'isModerator'],
    destroy: ['apikey', 'isAdmin']
  },

  AdminContentController: {
    rules: ['apikey', 'isAdmin'],
    updateRule: ['apikey', 'isAdmin'],
    createRule: ['apikey', 'isAdmin'],
    destroyRule: ['apikey', 'isAdmin']
  }
};
