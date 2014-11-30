import Ember from 'ember';

export default Ember.ObjectController.extend({
	queryParams: ['t', 'count', 'after'],
	t: null,
	count: null,
	after: null
});