import Ember from 'ember';

export default Ember.Mixin.create({
	model: function(params) {
		this.set('currentSub', params.subreddit || '');

		console.log(this.get('currentSub'));
		
		return this.store.find('subreddit', params);
	},

	afterModel: function(model) {
		for (var i = 0; i < model.children.length; i++) {
			model.children[i].data.index = i+1;
		}
	},

	setupController: function(controller, model) {
		this.controller.set('model', model);
		this.controller.set('currentSub', this.get('currentSub'));
	}
});
