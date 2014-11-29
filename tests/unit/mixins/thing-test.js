import Ember from 'ember';
import ThingMixin from 'ember-reddit/mixins/thing';

module('ThingMixin');

// Replace this with your real tests.
test('it works', function() {
  var ThingObject = Ember.Object.extend(ThingMixin);
  var subject = ThingObject.create();
  ok(subject);
});
