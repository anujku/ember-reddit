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

	hasMediaEmbed: Ember.computed('context.media_embed', function() {
		return !!this.get('context.media_embed').content;
	}),

	renderedMediaEmbed: Ember.computed('context.media_embed', function() {
		return Ember.$('<div>').html(this.get('context.media_embed').content).text();
	}),

	isExpandoExpanded: false,

	actions: {
		expandExpando: function() {
			this.toggleProperty('isExpandoExpanded');
		}
	}
});
