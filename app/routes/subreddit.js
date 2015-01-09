import Ember from 'ember';
import SubredditMixin from '../mixins/subreddit-route';

export default Ember.Route.extend(SubredditMixin, {
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('isFrontpage', false);

		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
	},

	afterModel: function(model, transition) {
		console.log(transition);
		console.log(this.get('router'));
	}
});
