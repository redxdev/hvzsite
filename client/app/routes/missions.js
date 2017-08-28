import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),
  toast: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      missions: this.get('ajax').request('/content/missions', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      }),

      polls: this.get('ajax').request('/content/polls', {
        data: {
          apikey: this.get('user').getApiKey()
        }
      })
    }).then(function (result) {
      var missions = result.missions.missions.map(function (mission) {
        mission.postDate = new Date(mission.postDate);
        mission.type = 'mission';
        return mission;
      });

      var polls = result.polls.polls.map(function (poll) {
        poll.postDate = new Date(poll.postDate);
        poll.endDate = new Date(poll.endDate);
        poll.type = 'poll';

        if (poll.endDate < new Date()) {
          poll.inPast = true;
        }
        else {
          poll.inPast = false;
        }

        if (poll.inPast) {
          poll.closed = true;
        }
        else {
          poll.closed = false;
        }

        poll.options = poll.options.map(function (opt, i) {
          return {text: opt, value: i};
        });

        return poll;
      });

      missions = missions.concat(polls);
      missions.sort((a, b) => {
        if (a.postDate < b.postDate) {
          return 1;
        }
        else if (a.postDate > b.postDate) {
          return -1;
        }

        return 0;
      });

      return {missions: missions};
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of missions.');
    });
  },

  actions: {
    goToMission(id) {
      Ember.$('html').scrollTop(Ember.$('#mission-' + id).offset().top);
    },

    goToPoll(id) {
      Ember.$('html').scrollTop(Ember.$('#poll-' + id).offset().top);
    },

    submitPoll(id) {
      var value = Ember.$('input:radio[name=poll-' + id + '-option]:checked').val();
      if (value === undefined) {
        this.get('toast').error("You didn't select an option to vote on!");
        return;
      }

      Ember.$('#poll-' + id + '-submit').hide();
      this.get('ajax').post('/content/polls/' + id, {
        data: {
          option: value,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('You have successfully voted.');
        this.refresh();
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to submit vote.');
        Ember.$('#poll-' + id + '-submit').show();
      });
    }
  }
});
