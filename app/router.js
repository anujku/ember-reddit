import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("subreddit", {
    path: "r/:subreddit"
  }, function() {
    this.route("hot", {
      path: "/"
    });

    this.route("new");
    this.route("rising");
    this.route("controversial");
    this.route("top");
    this.route("gilded");
    this.route("promoted");

    this.resource("comments", {
      path: "comments/:name"
    });
  });

  this.route("user", {
    path: "u/:user"
  });

  this.route("domain", {
    path: "domain/:domain"
  });
});

export default Router;