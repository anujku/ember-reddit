import Ember from 'ember';

export default Ember.Controller.extend({

	hasSelftext: Ember.computed('context.data.selftext_html', function() {
		console.log(this.get('context.data.selftext_html'));
		return !!this.get('context.data.selftext_html');
	}),

	isExpandoExpanded: false,

	actions: {
		expandSelfText: function() {
			this.toggleProperty('isExpandoExpanded');
			console.log(this.get('isExpandoExpanded'));
		},

		showContext: function() {
			console.log(this);
			console.log(this.get('view'));
			console.log(this.get('context'));
			console.log(this.get('model'));
		}
	}
});
