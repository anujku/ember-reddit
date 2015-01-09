import Ember from 'ember';
import SubredditCoreRoute from './core';

export default SubredditCoreRoute.extend({

	model: function(params) {
		params.sort = 'controversial';
		return this._super(params);
	}
});
