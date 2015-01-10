import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['sort'],
	sort: null,

	currentSub: null,

	hasPost: Ember.computed('model.post.children', function() {
		var postChildren = this.get('model.post.children');
		return postChildren && postChildren.length !== 0;
	}),

	postThing: Ember.computed('model.post.children', function() {
		return this.get('model.post.children').objectAt(0);
	})
});
