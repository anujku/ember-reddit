import Ember from 'ember';
import SubredditRouteMixin from 'ember-reddit/mixins/subreddit-route';

module('SubredditRouteMixin');

// Replace this with your real tests.
test('it works', function() {
  var SubredditRouteObject = Ember.Object.extend(SubredditRouteMixin);
  var subject = SubredditRouteObject.create();
  ok(subject);
});
