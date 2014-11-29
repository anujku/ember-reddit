import Ember from 'ember';
import thingmixin from '../mixins/thing';

export default Ember.Object.extend(thingmixin, {
	// passed in on create
	kind: null,
	data: null
});
