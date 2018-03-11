import Ember from 'ember';
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	ajax: Ember.inject.service(),
	toast: Ember.inject.service(),
	errorHandler: Ember.inject.service(),
	user: Ember.inject.service(),

	actions: {
		save() {
			Ember.$('#saveButton').hide();

			var description = Ember.$('#badgecodeDescription').val();

			var badgeID = Ember.$('#badgeID').val();
			if (badgeID.trim() === '') {
				this.get('toast').warning("You didn't enter a badge id for the badge code!");
				Ember.$('#saveButton').show();
				return;
			}

			this.get('ajax').post('/admin/badgecodes', {
				data: {
					description: description,
					badgeID: badgeID,
					apikey: this.get('user').getApiKey()
				}
			}).then((result) => {
				this.get('toast').success('Created new badge code #' + result.badgecode.id);
				this.transitionTo('admin-badgecodes');
			}).catch((err) => {
				this.get('errorHandler').handleError(err, 'Unable to create badge code.');
				Ember.$('#saveButton').show();
			});
		}
	}
});
