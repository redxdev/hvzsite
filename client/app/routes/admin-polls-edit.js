import Ember from 'ember';
import config from '../config/environment';

/* globals CKEDITOR */
export default Ember.Route.extend({
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
      var postDate = new Date(result.poll.postDate);
      postDate = new Date(postDate.getTime() - postDate.getTimezoneOffset() * 60000);
      result.poll.postDate = postDate.toISOString().slice(0, 19);

      var endDate = new Date(result.poll.endDate);
      endDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
      result.poll.endDate = endDate.toISOString().slice(0, 19);

      return {
        poll: result.poll
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve poll.');
      this.transitionTo('admin-polls');
    });
  },

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript(config.APP.ckeditor.script, () => {
          CKEDITOR.config.extraPlugins = config.APP.ckeditor.extraPlugins;
          CKEDITOR.replace('pollBody');
        });

        Ember.$('#poll-options').find('.needs-init').each((i, div) => {
          Ember.$(div).find('button').click(() => {
            div.remove();
          });
        });
      });
    },

    addOption() {
      var controls = document.createElement('div');
      controls.className = 'form-group';

      var group = document.createElement('div');
      group.className = 'input-group';
      controls.appendChild(group);

      var input = document.createElement('input');
      input.className = 'form-control';
      input.placeholder = 'option';
      group.appendChild(input);

      var span = document.createElement('span');
      span.className = 'input-group-btn';
      group.appendChild(span);

      var remove = document.createElement('button');
      remove.className = 'btn btn-danger';
      remove.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';
      remove.type = 'button';
      remove.onclick = () => {
        Ember.$(controls).remove();
      };
      span.appendChild(remove);

      Ember.$('#poll-options').append(controls);
    },

    save(id) {
      Ember.$('#saveButton').hide();

      var title = Ember.$('#pollTitle').val();
      var team = Ember.$('#pollTeam').val();
      var body = CKEDITOR.instances.pollBody.getData();
      var question = Ember.$('#pollQuestion').val();

      var postDate = Ember.$('#pollPostDate').val();
      if (postDate.trim() === '') {
        this.get('toast').warning("You didn't enter a time for the poll!");
        Ember.$('#saveButton').show();
        return;
      }

      var endDate = Ember.$('#pollEndDate').val();
      if (endDate.trim() === '') {
        this.get('toast').warning("You didn't enter an end time for the poll!");
        Ember.$('#saveButton').show();
        return;
      }

      postDate = new Date(postDate);
      postDate = new Date(postDate.getTime() + postDate.getTimezoneOffset()*60000);

      endDate = new Date(endDate);
      endDate = new Date(endDate.getTime() + endDate.getTimezoneOffset()*60000);

      var options = [];
      Ember.$('#poll-options').find('input').each((i, input) => {
        options.push(input.value);
      });

      options = JSON.stringify({options: options});

      this.get('ajax').put('/admin/polls/' + id, {
        data: {
          title: title,
          body: body,
          team: team,
          question: question,
          postDate: postDate,
          endDate: endDate,
          options: options,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Modified poll.');
        this.transitionTo('admin-polls');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to modify poll.');
        Ember.$('#saveButton').show();
      });
    }
  }
});
