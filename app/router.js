import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.resource('frontpage', { path: '/' });
	this.resource('subreddit', { path: '/r/:subreddit' }, function() {
		this.route('sort', { path: ':sort' });
	});
	this.resource('user', { path: 'u/:user' });
});

export default Router;
