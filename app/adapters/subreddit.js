import Ember from 'ember';
import ajax from 'ic-ajax';
import thing from '../models/thing';

export default Ember.Object.extend({
	find: function(name, id) {

		return ajax('http://www.reddit.com/r/' + id + '.json').then(function(result) {

			// assume kind == 'Listing'
			return Ember.Object.create({
				modhash: result.data.modhash,
				children: result.data.children.map(function (child) {
					return thing.create(child);
				})
			});
		});
	}
});
