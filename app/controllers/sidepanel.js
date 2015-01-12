import Ember from 'ember';
import decodeHtml from '../utils/decode-html';

export default Ember.Controller.extend({
	renderedDescription: Ember.computed('model.data.description_html', function() {
		return decodeHtml(this.get('model.data.description_html'));
	}),

	subscribersString: Ember.computed('model.data.subscribers', function() {
		var subscribers = this.get('model.data.subscribers');

		if (Ember.$.isNumeric(subscribers)) {
			return subscribers.toLocaleString();
		}

		return '';
	}),

	activeAccountsString: Ember.computed('model.data.accounts_active', function() {
		var accounts = this.get('model.data.accounts_active');

		if (Ember.$.isNumeric(accounts)) {
			return accounts.toLocaleString();
		}

		return '';
	})
});
