import Ember from 'ember';

// TODO
// make util
var calcChildren = function(thing) {
	var total = 0;

	if (thing && thing.get('children')) {
		total += thing.get('children').length;

		for (var i = 0; i < thing.get('children').length; i++) {

			var childData = thing.get('children')[i].get('data');

			if (childData.replies) {
				total += calcChildren(childData.replies);
			}
		}
	}

	return total;
};

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
	})
});
