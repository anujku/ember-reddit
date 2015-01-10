import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['midcol'],
	classNameBindings: ['like:likes:dislikes', 'voted::unvoted'],

	showScore: true,

	displayScore: Ember.computed('score', 'likes', function() {
		if (this.get('likes') === true) {
			return this.get('score') + 1;
		}
		else if (this.get('likes') === false) {
			return this.get('score') - 1;
		}
		else {
			return this.get('score');
		}
	}),

	voted: Ember.computed('likes', function() {
		return this.get('likes') !== null;
	}),

	like: Ember.computed('likes', function() {
		return this.get('likes') !== true;
	})

});
