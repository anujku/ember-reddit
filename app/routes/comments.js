import Ember from 'ember';

export default Ember.Route.extend({

	model: function(params) {
		params.subreddit = this.paramsFor('subreddit').subreddit;
		return this.store.find('comments', params);
	},

	setupController: function(controller, model) {
		this._super(controller, model);

		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
	}
});
