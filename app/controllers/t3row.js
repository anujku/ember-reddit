import Ember from 'ember';

export default Ember.Controller.extend({

	hasSelftext: Ember.computed('model.selftext_html', function() {
		return !!this.get('model.selftext_html');
	})
});
