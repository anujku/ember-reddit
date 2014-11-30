import Ember from 'ember';
import SubredditMixin from '../mixins/subreddit-controller';

export default Ember.Route.extend(SubredditMixin, {
	controllerName: 'subreddit',
	templateName: 'subreddit'
});
