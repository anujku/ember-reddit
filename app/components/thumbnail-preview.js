import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'a',
	classNames: ['thumbnail'],
	classNameBindings: ['isSelf:self', 'isDefault:default'],
	attributeBindings: ['url:href'],

	isSelf: Ember.computed('src', function() {
		return this.get('src') === 'self';
	}),

	isDefault: Ember.computed('src', function() {
		return this.get('src') === 'default';
	}),

	hasValidSrc: Ember.computed('src', function() {
		var src = this.get('src');
		return !(!src || this.get('isSelf') || this.get('isDefault'));
	})
});
