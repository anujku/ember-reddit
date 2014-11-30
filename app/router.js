import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.route('subredditDefault', { path: 'r/:subreddit' });
	this.route('subreddit', { path: 'r/:subreddit/:sort' });
	this.route('comments', { path: 'r/:subreddit/comments/:name' });

	this.route('user', { path: 'u/:user' });
	this.route('domain', { path: 'domain/:domain'});
});

export default Router;
