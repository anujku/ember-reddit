import Ember from 'ember';
import ajax from 'ic-ajax';
import thing from '../models/thing';
import parseListing from '../utils/parse-listing';

export default Ember.Object.extend({
	find: function(name, params) {

		// build the url
		var url = 'https://www.reddit.com/';

		// add subreddit and sort onto url, then remove prop from params, as we don't want them in the ajax:data
		if (params.subreddit) {
			url += 'r/' + params.subreddit;
			delete params.subreddit;
		}

		var aboutUrl = url + '/about.json';

		if (params.sort) {
			url += '/' + params.sort;
			delete params.sort;
		}		
		

		for (var key in params) {
			if (params[key] === null) {
				delete params[key];
			}
		}

		// make ajax call and return Ember.Object of listing
		var listing = ajax({
			url: url + '.json',
			data: params
		}).then(function(result) {
			return parseListing(result);
		});

		// also make a call to /r/{subreddit}/about.json
		var about = ajax({
			url: aboutUrl
		}).then(function(result) {
			return thing.create(result);
		});

		return Ember.RSVP.hash({listing: listing, about: about});
	}
});
