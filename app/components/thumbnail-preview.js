import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['thumbnail-preview'],
	classNameBindings: ['hasValidUrl::self'],
	hasValidUrl: Ember.computed('url', function() {
		var url = this.get('url');
		return !(!url || url === 'self');
	})
});
