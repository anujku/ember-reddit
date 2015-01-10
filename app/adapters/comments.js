import Ember from 'ember';
import ajax from 'ic-ajax';
import parseListing from '../utils/parse-listing';

export default Ember.Object.extend({
	find: function(name, params) {

		console.log(params);

		// build the url
		var url = 'http://www.reddit.com/r/' + params.subreddit + '/comments/' + params.name;

		// remove unwanted keys on params
		delete params.subreddit;
		delete params.name;

		for (var key in params) {
			if (params[key] === null) {
				delete params[key];
			}
		}

		// make ajax call and return Ember.Object of listing
		return ajax({
			url: url + '.json',
			data: params
		}).then(function(result) {

			// assume two kinds, both 'listing'
			// first is the post
			// second are the list of comments
			return Ember.Object.create({
				post: parseListing(result[0]),
				comments: parseListing(result[1])
			});
		});
	}
});
