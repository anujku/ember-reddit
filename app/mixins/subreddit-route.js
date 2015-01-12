import Ember from 'ember';

export default Ember.Mixin.create({
	queryParams: {
		t: { refreshModel: true },
		count: { refreshModel: true },
		after: { refreshModel: true },
		before: { refreshModel: true }
	},

	controllerName: 'subreddit',
	templateName: 'subreddit/index',

	model: function(params) {
		params.subreddit = params.subreddit || this.paramsFor('subreddit').subreddit;
		return this.store.find('subreddit', params);
	},

	afterModel: function(model, transition) {
		// console.log(transition);
		// console.log(this.get('router'));
		console.log(model);
	},

	setupController: function(controller, model) {
		var isBefore = !!this.controller.get('before');
		var count = parseInt(this.controller.get('count'), 10) || 1;

		// adjust account for when isBefore
		if (isBefore && count !== 1) {
			count = count - 25;
		}

		for (var i = 0; i < model.listing.get('children').length; i++) {
			model.listing.get('children')[i].data.index = count + i;
		}

		this._super(controller, model);

		controller.set('isFrontpage', false);

		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
	},

	renderTemplate: function(controller, model) {
		this._super();

		this.render('tabmenu/subreddit', {
			into: 'application',
			outlet: 'tabmenu',
			controller: 'subreddit'
		});

		console.log(model.about);

		this.render('sidepanel', {
			into: 'application',
			outlet: 'sidepanel',
			controller: 'sidepanel',
			model: model.about
		});
	}
});
