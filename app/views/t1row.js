import Ember from 'ember';

export default Ember.View.extend({
	templateName: 't1row',
	classNames: ['t1', 'comment'],
	classNameBindings: ['isCollapsed:collapsed:noncollapsed'],

	isCollapsed: false,

	renderedBody: Ember.computed('context.body_html', function() {
		return Ember.$('<div>').html(this.get('context.body_html')).text();
	}),

	actions: {
		toggleCollapse: function() {
			this.toggleProperty('isCollapsed');
		}
	},

	hasChildren: Ember.computed('context.replies', function() {
		return !!this.get('context.replies.children') && this.get('context.replies.children').length !== 0;
	}),

	children: Ember.computed('context.replies', function() {
		return this.get('context.replies.children');
	})
});
