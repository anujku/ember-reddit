import Ember from 'ember';

export function formatNumber(input) {
	if (!Ember.$.isNumeric(input)) {
		Ember.Logger.warn('value for input was not Numeric');
		return '--';
	}

	var value = parseInt(input, 10);

	if (value > 0) {
		return new Ember.Handlebars.SafeString('<span class="pos">' + input + '</span>');
	}
	else if (value < 0) {
		return new Ember.Handlebars.SafeString('<span class="neg">' + input + '</span>');
	}
	else {
		return input;
	}
}

export default Ember.Handlebars.makeBoundHelper(formatNumber);
