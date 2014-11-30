import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.resource('subreddit', { path: '/r/:subreddit' }, function() {
		this.route('comments', { path: 'comments/:name'});
		this.route('sort', { path: ':sort' });
	});
	this.resource('user', { path: 'u/:user' });
	this.resource('domain', { path: 'domain/:domain'});
});

export default Router;
