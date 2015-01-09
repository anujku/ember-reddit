import Ember from 'ember';
import t3Controller from '../controllers/t3row';


export default Ember.View.extend({
	templateName: 't3row',
	classNames: ['t3'],
	controller: t3Controller.create(),

	hasSelfText: Ember.computed('context.selftext_html', function() {
		return !!this.get('context.selftext_html');
	}),

	renderedSelfText: Ember.computed('context.selftext_html', function() {
		return Ember.$('<div>').html(this.get('context.selftext_html')).text();
	}),

	didInsertElement: function() {
		
	}
});
