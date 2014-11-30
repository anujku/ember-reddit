import Ember from 'ember';

export default Ember.Mixin.create({
	model: function(params) {
		return this.store.find('subreddit', params);
	},

	afterModel: function(model) {
		for (var i = 0; i < model.children.length; i++) {
			model.children[i].data.index = i+1;
		}
	}
});
