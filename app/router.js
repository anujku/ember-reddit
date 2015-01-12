import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.resource('subreddit', { path: 'r/:subreddit' }, function() {
		this.route('sort', { path: ':sort' });

		this.resource('comments', { path: 'comments/:name' });
		this.resource('related', { path: 'related/:name' })
	});

	this.route('user', { path: 'u/:user' });

	this.route('domain', { path: 'domain/:domain' });
});

export default Router;