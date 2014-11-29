import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'a',
	classNames: ['thumbnail-preview'],
	classNameBindings: ['hasValidSrc::self'],
	attributeBindings: ['url:href'],

	hasValidSrc: Ember.computed('src', function() {
		var src = this.get('src');
		return !(!src || src === 'self');
	})
});
