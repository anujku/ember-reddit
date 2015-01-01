import Ember from 'ember';

// this should only be used on a route with controller::subreddit
export default Ember.Mixin.create({
	queryParams: {
		t: { refreshModel: true },
		count: { refreshModel: true },
		after: { refreshModel: true },
		before: { refreshModel: true }
	},

	model: function(params) {
		return this.store.find('subreddit', params);
	},

	setupController: function(controller, model) {
		var isBefore = !!this.controller.get('before');
		var count = parseInt(this.controller.get('count'), 10) || 1;

		// adjust account for when isBefore
		if (isBefore && count !== 1) {
			count = count - 25;
		}
		

		for (var i = 0; i < model.children.length; i++) {
			model.children[i].data.index = count + i;
		}

		this._super(controller, model);
	}
});
