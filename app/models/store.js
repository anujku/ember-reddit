import Ember from 'ember';

export default Ember.Object.extend({
	find: function(name, params) {

		var adapter = this.container.lookup('adapter:' + name);
		return adapter.find(name, params).then(function(record) {
			return record;
		});
	}
});