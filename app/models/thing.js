import Ember from 'ember';

export default Ember.Object.extend({
	isT1: Ember.computed('kind', function() {
		return this.get('kind') === 't1';
	}),

	isT2: Ember.computed('kind', function() {
		return this.get('kind') === 't2';
	}),

	isT3: Ember.computed('kind', function() {
		return this.get('kind') === 't3';
	}),

	isT4: Ember.computed('kind', function() {
		return this.get('kind') === 't4';
	}),

	isT5: Ember.computed('kind', function() {
		return this.get('kind') === 't5';
	})
});
