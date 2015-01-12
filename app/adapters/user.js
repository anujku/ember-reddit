import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Object.extend({
	find: function(name, id) {
		
		return ajax('https://www.reddit.com/user/' + id + '.json').then(function(result) {
			return result.data;
		});
	}
});
