import Ember from 'ember';
import calcChildren from '../utils/calc-children';
import decodeHtml from '../utils/decode-html';

export default Ember.View.extend({
	templateName: 't1row',
	classNames: ['t1', 'comment'],
	classNameBindings: ['isCollapsed:collapsed:noncollapsed'],

	isCollapsed: false,

	renderedBody: Ember.computed('context.body_html', function() {
		return decodeHtml(this.get('context.body_html'));
	}),

	actions: {
		toggleCollapse: function() {
			this.toggleProperty('isCollapsed');
		}
	},

	hasChildren: Ember.computed('context.replies', function() {
		return !!this.get('context.replies.children') && this.get('context.replies.children').length;
	}),

	children: Ember.computed('context.replies', function() {
		return this.get('context.replies.children');
	}),

	numChildren: Ember.computed('context.replies', function() {
		return calcChildren(this.get('context.replies'));
	}),

	plurarizeChild: Ember.computed('numChildren', function() {
		return this.get('numChildren') === 1 ? 'child' : 'children';
	}),

	plurarizePoint: Ember.computed('context.score', function() {
		return this.get('context.score') === 1 ? 'point' : 'points';
	})
});
