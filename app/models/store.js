import Ember from 'ember';

export default Ember.Object.extend({
	find: function(name, id) {

		var adapter = this.container.lookup('adapter:' + name);
		return adapter.find(name, id).then(function(record) {
			return record;
		});
	}
});