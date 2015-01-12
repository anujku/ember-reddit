import Ember from 'ember';
import decodeHtml from '../utils/decode-html';

export default Ember.ObjectController.extend({
	queryParams: ['t', 'count', 'after', 'before'],
	t: null,
	count: null,
	after: null,
	before: null,

	currentSub: null,

	isFrontpage: false,

	hasAfter: Ember.computed('model.listing.after', function() {
		return !!this.get('model.listing.after');
	}),

	hasBefore: Ember.computed('model.listing.before', function() {
		return !!this.get('model.listing.before');
	}),

	nextCount: Ember.computed('count', function() {
		if (!!this.get('count')) {
			return this.get('count') * 2;
		}

		return 25;
	}),

	prevCount: Ember.computed('count', function() {
		if (!!this.get('count')) {
			return parseInt(this.get('count'), 10) + 1;
		}

		return 0;
	}),

	renderedDescription: Ember.computed('model.about.data.description_html', function() {
		return decodeHtml(this.get('model.about.data.description_html'));
	}),

	subscribersString: Ember.computed('model.about.data.subscribers', function() {
		var subscribers = this.get('model.about.data.subscribers');

		if (Ember.$.isNumeric(subscribers)) {
			return subscribers.toLocaleString();
		}

		return '';
	}),

	activeAccountsString: Ember.computed('model.about.data.accounts_active', function() {
		var accounts = this.get('model.about.data.accounts_active');

		if (Ember.$.isNumeric(accounts)) {
			return accounts.toLocaleString();
		}

		return '';
	})
});