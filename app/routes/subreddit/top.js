import Ember from 'ember';
import SubredditCoreRoute from './core';

export default SubredditCoreRoute.extend({

	model: function(params) {
		params.sort = 'top';
		return this._super(params);
	}
});
