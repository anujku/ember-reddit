import Ember from 'ember';

export default Ember.View.extend({
	templateName: 'thing',
	tagName: 'div',
	classNames: ['thing', 'link'],
	classNameBindings: ['name']
});
