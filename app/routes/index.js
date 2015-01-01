import Ember from 'ember';
import SubredditMixin from '../mixins/subreddit-route';

export default Ember.Route.extend(SubredditMixin, {
	controllerName: 'subreddit',
	templateName: 'subreddit',

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('isFrontpage', true);
	}
});
