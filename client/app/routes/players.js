import Ember from "ember";
import config from "../config/environment";

// TODO: REMEMBER TO DO PLAYER.AVATAR!
export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/status/players').then((result) => {
      return {
        players: result.players.map((player) => {
          player.avatar = config.APP.apiURL + '/api/v2/avatar/' + player.id;
          return player;
        })
      };
    });
  },

  didRender() {
    Ember.$("[data-toggle='tooltip']").tooltip();
    console.log(Ember.$("[data-toggle='tooltip']"));
  }
});
