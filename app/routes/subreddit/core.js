import Ember from 'ember';
import SubredditMixin from '../../mixins/subreddit-route';

export default Ember.Route.extend(SubredditMixin, {

	afterModel: function(model, transition) {
		console.log(transition);
		console.log(this.get('router'));
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('isFrontpage', false);

		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
	},

	renderTemplate: function() {
		this._super();

		this.render('tabmenu/subreddit', {
			into: 'application',
			outlet: 'tabmenu',
			controller: 'subreddit'
		});
	}

});
