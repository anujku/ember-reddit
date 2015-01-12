import Ember from 'ember';

export default Ember.Route.extend({

	model: function(params) {
		params.subreddit = this.paramsFor('subreddit').subreddit;
		return this.store.find('comments', params);
	},

	setupController: function(controller, model) {
		this._super(controller, model);

		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
	},

	renderTemplate: function(controller, model) {
		this._super();

		this.render('tabmenu/comments', {
			into: 'application',
			outlet: 'tabmenu',
			controller: controller,
			model: model
		});

		this.render('sidepanel', {
			into: 'application',
			outlet: 'sidepanel',
			controller: 'sidepanel',
			model: model.about
		});
	}
});
