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
    other: ['apikey'],
    follow: ['apikey', 'isActive'],
    unfollow: ['apikey', 'isActive'],
    setClan: ['apikey', 'isActive'],
    addNotificationKey: ['apikey', 'isActive']
  },

  FeedController: {
    get: ['apikey', 'isActive'],
    view: ['apikey', 'isActive']
  },

  ContentController: {
    missions: ['apikey'], // isActive is handled by the controller itself
    polls: ['apikey'], // isActive is handled by the controller itself
    vote: ['apikey', 'isActive']
  },

  GameController: {
    infect: ['apikey', 'isActive', 'preventFailed'],
    antivirus: ['apikey', 'isActive', 'preventFailed'],
    badge: ['apikey', 'isActive', 'preventFailed']
  },

  AdminGameController: {
    infectOZ: ['apikey', 'isAdmin']
  },

  AdminUserController: {
    list: ['apikey', 'isModerator'],
    get: ['apikey', 'isModerator'],
    update: ['apikey', 'isAdmin'],
    activate: ['apikey', 'isModerator'],
    uploadAvatar: ['apikey', 'isModerator'],
    create: ['apikey', 'isAdmin'],
    generateId: ['apikey', 'isModerator'],
    infect: ['apikey', 'isAdmin'],
    oz: ['apikey', 'isAdmin'],
    heal: ['apikey', 'isAdmin'],
    destroy: ['apikey', 'isAdmin'],
    listBadges: ['apikey', 'isModerator'],
    addBadge: ['apikey', 'isModerator'],
    removeBadge: ['apikey', 'isAdmin'],
    sendNotification: ['apikey', 'isSuperAdmin'],
    sendNotificationToGroup: ['apikey', 'isSuperAdmin'],
    print: ['apikey', 'isAdmin'],
    markPrinted: ['apikey', 'isAdmin'],
    loginKey: ['apikey', 'isSuperAdmin']
  },

  AdminContentController: {
    rules: ['apikey', 'isAdmin'],
    rule: ['apikey', 'isAdmin'],
    updateRule: ['apikey', 'isAdmin'],
    createRule: ['apikey', 'isAdmin'],
    destroyRule: ['apikey', 'isAdmin'],

    missions: ['apikey', 'isModerator'],
    mission: ['apikey', 'isModerator'],
    updateMission: ['apikey', 'isAdmin'],
    createMission: ['apikey', 'isAdmin'],
    destroyMission: ['apikey', 'isAdmin'],

    newsPosts: ['apikey', 'isAdmin'],
    newsPost: ['apikey', 'isAdmin'],
    updateNewsPost: ['apikey', 'isAdmin'],
    createNewsPost: ['apikey', 'isAdmin'],
    destroyNewsPost: ['apikey', 'isAdmin'],
    markImportantPost: ['apikey', 'isAdmin'],
    markUnimportantPost: ['apikey', 'isAdmin'],
    markFrontpagePost: ['apikey', 'isAdmin'],
    markNotFrontpagePost: ['apikey', 'isAdmin'],

    polls: ['apikey', 'isModerator'],
    poll: ['apikey', 'isAdmin'],
    updatePoll: ['apikey', 'isAdmin'],
    createPoll: ['apikey', 'isAdmin'],
    destroyPoll: ['apikey', 'isAdmin']
  },

  AdminAntivirusController: {
    list: ['apikey', 'isAdmin'],
    get: ['apikey', 'isAdmin'],
    create: ['apikey', 'isAdmin'],
    update: ['apikey', 'isAdmin'],
    destroy: ['apikey', 'isAdmin']
  },

  AdminBadgecodeController: {
    list: ['apikey', 'isAdmin'],
    get: ['apikey', 'isAdmin'],
    create: ['apikey', 'isAdmin'],
    update: ['apikey', 'isAdmin'],
    destroy: ['apikey', 'isAdmin']
  }
};
