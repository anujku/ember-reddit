import Ember from 'ember';
import calcChildren from '../utils/calc-children';

export default Ember.Controller.extend({
	queryParams: ['sort'],
	sort: null,

	currentSub: null,

	hasPost: Ember.computed('model.listings.post.children', function() {
		var postChildren = this.get('model.listings.post.children');
		return postChildren && postChildren.length !== 0;
	}),

	postThing: Ember.computed('model.listings.post.children', function() {
		return this.get('model.listings.post.children').objectAt(0);
	}),

	totalNumComments: Ember.computed('model.listings.comments', function() {
		return calcChildren(this.get('model.listings.comments'));
	}),

	plurarizeComment: Ember.computed('totalNumComments', function() {
		return this.get('totalNumComments') === 1 ? 'comment' : 'comments';
	})
});
