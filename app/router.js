import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.resource('subreddit', { path: '/r/:subreddit_id'});
	this.resource('user', { path: 'u/:user_id'});
});

export default Router;
