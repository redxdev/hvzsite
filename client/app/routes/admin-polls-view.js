import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  model(params) {
    return this.get('ajax').request('/admin/polls/' + params.pollId, {
      data: {
        apikey: this.get('user').getApiKey()
      }
    }).then((result) => {
      var votes = [];
      result.poll.options.forEach((option, i) => {
        var count = result.poll.votes[i];
        if (count === undefined) {
          count = 0;
        }

        var opt = {
          text: option,
          count: count
        };
        votes.push(opt);
      });

      votes.sort((a, b) => {
        if (a.count < b.count) {
          return 1;
        }
        else if (a.count > b.count) {
          return -1;
        }

        return 0;
      });
      result.poll.votes = votes;

      return {
        poll: result.poll
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve poll.');
      this.transitionTo('admin-polls');
    });
  }
});
