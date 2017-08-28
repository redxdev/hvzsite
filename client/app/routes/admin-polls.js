import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  user: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      polls: this.get('ajax').request('/admin/polls', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }).then((result) => {
        return result.polls.map((poll) => {
          poll.postDate = new Date(poll.postDate);
          poll.endDate = new Date(poll.endDate);

          if (poll.endDate < new Date()) {
            poll.inPast = true;
          }
          else {
            poll.inPast = false;
          }

          return poll;
        });
      }),

      localUser: this.get('user').getUserInfo()
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of polls.');
      return {};
    });
  }
});
