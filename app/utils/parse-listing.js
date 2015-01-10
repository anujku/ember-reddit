import Ember from 'ember';
import thing from '../models/thing';

var parseListing = function(listing) {
	
	return Ember.Object.create({
		modhash: listing.data.modhash,
		children: listing.data.children.map(function (child) {
			if (!!child.data) {
				if (!!child.data.replies && !!child.data.replies.data) {
					child.data.replies = parseListing(child.data.replies);
				}
			}

			return thing.create(child);
		}),
		after: listing.data.after,
		before: listing.data.before
	});
};

export default parseListing;