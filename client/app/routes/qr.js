import Ember from "ember";

export default Ember.Route.extend({
    beforeModel(transition) {
        var params = transition.params.qr;
        var code = params.code;
        var human = '';
        var zombie = '';
        if (code.length > 8) {
            human = code.substring(0, 8);
            zombie = code.substring(8, code.length);
        }
        else {
            human = code;
        }

        this.transitionTo('infect', {queryParams: {'human': human, 'zombie': zombie}});
    }
});
