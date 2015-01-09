import Ember from 'ember';

export default Ember.View.extend({
	templateName: 't3row',
	classNames: ['t3'],

	hasSelfText: Ember.computed('context.selftext_html', function() {
		return !!this.get('context.selftext_html');
	}),

	renderedSelfText: Ember.computed('context.selftext_html', function() {
		return Ember.$('<div>').html(this.get('context.selftext_html')).text();
	}),

	isExpandoExpanded: false,

	actions: {
		expandSelfText: function() {
			this.toggleProperty('isExpandoExpanded');
			console.log(this.get('isExpandoExpanded'));
		}
	}
});
