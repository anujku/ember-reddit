import Ember from 'ember';
import SubredditControllerMixin from 'ember-reddit/mixins/subreddit-controller';

module('SubredditControllerMixin');

// Replace this with your real tests.
test('it works', function() {
  var SubredditControllerObject = Ember.Object.extend(SubredditControllerMixin);
  var subject = SubredditControllerObject.create();
  ok(subject);
});
