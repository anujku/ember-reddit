import Ember from 'ember';
import ajax from 'ic-ajax';
import thing from '../models/thing';

export default Ember.Object.extend({
	find: function(name, params) {

		// build the url
		var url = 'http://www.reddit.com/';

		// add subreddit and sort onto url, then remove prop from params, as we don't want them in the ajax:data
		if (params.subreddit) {
			url += 'r/' + params.subreddit;
			delete params.subreddit;
		}

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
		return ajax({
			url: url + '.json',
			data: params
		}).then(function(result) {

			// assume kind == 'Listing'
			return Ember.Object.create({
				modhash: result.data.modhash,
				children: Ember.A(result.data.children.map(function (child) {
					return thing.create(child);
				})),
				after: result.data.after,
				before: result.data.before
			});
		});
	}
});
