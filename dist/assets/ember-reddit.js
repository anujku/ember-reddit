define("ember-reddit/adapters/about", 
  ["ember","ic-ajax","ember-reddit/models/thing","ember-reddit/utils/parse-listing","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ajax = __dependency2__["default"];
    var thing = __dependency3__["default"];
    var parseListing = __dependency4__["default"];

    __exports__["default"] = Ember.Object.extend({
    	find: function(name, params) {

    		//params = $.extend({}, params);
    		var isFrontpage = false;

    		// build the url
    		var url = 'https://www.reddit.com/';

    		// add subreddit
    		if (params.subreddit) {
    			url += 'r/' + params.subreddit;
    		}
    		else {
    			isFrontpage = true;
    		}

    		// if we're not on the frontpage
    		if (!isFrontpage) {
    			return ajax({
    				url: url + '/about.json'
    			}).then(function(result) {
    				return thing.create(result);
    			})
    		}

    		// else, just return an instance of thing with an empty object to it's constructor
    		return Ember.RSVP.resolve(thing.create({}));
    	}
    });
  });
define("ember-reddit/adapters/comments", 
  ["ember","ic-ajax","ember-reddit/utils/parse-listing","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ajax = __dependency2__["default"];
    var parseListing = __dependency3__["default"];

    __exports__["default"] = Ember.Object.extend({
    	find: function(name, params) {

    		console.log(params);

    		// build the url
    		var url = 'https://www.reddit.com/comments/' + params.name;

    		// remove unwanted keys on params
    		delete params.subreddit;
    		delete params.name;

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

    			// assume two kinds, both 'listing'
    			// first is the post
    			// second are the list of comments
    			return Ember.Object.create({
    				post: parseListing(result[0]),
    				comments: parseListing(result[1])
    			});
    		});
    	}
    });
  });
define("ember-reddit/adapters/subreddit", 
  ["ember","ic-ajax","ember-reddit/models/thing","ember-reddit/utils/parse-listing","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ajax = __dependency2__["default"];
    var thing = __dependency3__["default"];
    var parseListing = __dependency4__["default"];

    __exports__["default"] = Ember.Object.extend({
    	find: function(name, params) {

    		// build the url
    		var url = 'https://www.reddit.com/';

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
    			return parseListing(result);
    		});
    	}
    });
  });
define("ember-reddit/adapters/user", 
  ["ember","ic-ajax","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ajax = __dependency2__["default"];

    __exports__["default"] = Ember.Object.extend({
    	find: function(name, id) {
    		
    		return ajax('https://www.reddit.com/user/' + id + '.json').then(function(result) {
    			return result.data;
    		});
    	}
    });
  });
define("ember-reddit/app", 
  ["ember","ember/resolver","ember/load-initializers","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("ember-reddit/components/thumbnail-preview", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
    	tagName: 'a',
    	classNames: ['thumbnail'],
    	classNameBindings: ['isSelf:self', 'isDefault:default', 'isNsfw:nsfw'],
    	attributeBindings: ['url:href'],

    	isSelf: Ember.computed('src', function() {
    		return this.get('src') === 'self';
    	}),

    	isDefault: Ember.computed('src', function() {
    		return this.get('src') === 'default' || this.get('src') === '';
    	}),

    	hasValidSrc: Ember.computed('src', function() {
    		var src = this.get('src');
    		return !(!src || this.get('isSelf') || this.get('isDefault'));
    	})
    });
  });
define("ember-reddit/components/time-ago", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
    	tagName: 'time',
    	attributeBindings: ['utc:title', 'iso8601:datetime'],

    	dateMoment: Ember.computed('datetime', function() {
    		return moment.unix(this.get('datetime')).utc();
    	}),

    	iso8601: Ember.computed('dateMoment', function() {
    		return this.get('dateMoment').format();
    	}),

    	utc: Ember.computed('dateMoment', function() {
    		return this.get('dateMoment').format('ddd MMM HH:mm:ss YYYY z');
    	}),

    	ago: Ember.computed('dateMoment', function() {
    		return this.get('dateMoment').fromNow();
    	}),

    	from: Ember.computed('dateMoment', function() {
    		return this.get('dateMoment').fromNow(true);
    	}),

    	noSuffix: false
    });
  });
define("ember-reddit/components/vote-score", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
    	tagName: 'div',
    	classNames: ['midcol'],
    	classNameBindings: ['like:likes:dislikes', 'voted::unvoted'],

    	showScore: true,

    	displayScore: Ember.computed('score', 'likes', function() {
    		if (this.get('likes') === true) {
    			return this.get('score') + 1;
    		}
    		else if (this.get('likes') === false) {
    			return this.get('score') - 1;
    		}
    		else {
    			return this.get('score');
    		}
    	}),

    	voted: Ember.computed('likes', function() {
    		return this.get('likes') !== null;
    	}),

    	like: Ember.computed('likes', function() {
    		return this.get('likes') !== true;
    	})

    });
  });
define("ember-reddit/controllers/comments", 
  ["ember","ember-reddit/utils/calc-children","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var calcChildren = __dependency2__["default"];

    __exports__["default"] = Ember.Controller.extend({
    	queryParams: ['sort'],
    	sort: null,

    	currentSub: null,

    	hasPost: Ember.computed('model.listings.post.children', function() {
    		var postChildren = this.get('model.listings.post.children');
    		return postChildren && postChildren.length !== 0;
    	}),

    	postThing: Ember.computed('model.listings.post.children', function() {
    		return this.get('model.listings.post.children').objectAt(0);
    	}),

    	totalNumComments: Ember.computed('model.listings.comments', function() {
    		return calcChildren(this.get('model.listings.comments'));
    	}),

    	plurarizeComment: Ember.computed('totalNumComments', function() {
    		return this.get('totalNumComments') === 1 ? 'comment' : 'comments';
    	})
    });
  });
define("ember-reddit/controllers/sidepanel", 
  ["ember","ember-reddit/utils/decode-html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var decodeHtml = __dependency2__["default"];

    __exports__["default"] = Ember.Controller.extend({

    	hasModel: Ember.computed('model.data', function() {
    		return !!this.get('model.data');
    	}),

    	renderedDescription: Ember.computed('model.data.description_html', function() {
    		return decodeHtml(this.get('model.data.description_html'));
    	}),

    	subscribersString: Ember.computed('model.data.subscribers', function() {
    		var subscribers = this.get('model.data.subscribers');

    		if (Ember.$.isNumeric(subscribers)) {
    			return subscribers.toLocaleString();
    		}

    		return '';
    	}),

    	activeAccountsString: Ember.computed('model.data.accounts_active', function() {
    		var accounts = this.get('model.data.accounts_active');

    		if (Ember.$.isNumeric(accounts)) {
    			return accounts.toLocaleString();
    		}

    		return '';
    	})
    });
  });
define("ember-reddit/controllers/subreddit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
    	queryParams: ['t', 'count', 'after', 'before'],
    	t: null,
    	count: null,
    	after: null,
    	before: null,

    	currentSub: null,

    	isFrontpage: false,

    	hasAfter: Ember.computed('model.listing.after', function() {
    		return !!this.get('model.listing.after');
    	}),

    	hasBefore: Ember.computed('model.listing.before', function() {
    		return !!this.get('model.listing.before');
    	}),

    	nextCount: Ember.computed('count', function() {
    		if (!!this.get('count')) {
    			return this.get('count') * 2;
    		}

    		return 25;
    	}),

    	prevCount: Ember.computed('count', function() {
    		if (!!this.get('count')) {
    			return parseInt(this.get('count'), 10) + 1;
    		}

    		return 0;
    	})
    });
  });
define("ember-reddit/helpers/format-number", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    function formatNumber(input) {
    	if (!Ember.$.isNumeric(input)) {
    		Ember.Logger.warn('value for input was not Numeric');
    		return '--';
    	}

    	var value = parseInt(input, 10);

    	if (value > 0) {
    		return new Ember.Handlebars.SafeString('<span class="pos">' + input + '</span>');
    	}
    	else if (value < 0) {
    		return new Ember.Handlebars.SafeString('<span class="neg">' + input + '</span>');
    	}
    	else {
    		return input;
    	}
    }

    __exports__.formatNumber = formatNumber;__exports__["default"] = Ember.Handlebars.makeBoundHelper(formatNumber);
  });
define("ember-reddit/initializers/ember-cli-auto-register-helpers", 
  ["ember","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var initialize = function() {
      var matcher = new RegExp(config.modulePrefix + '/helpers/.*');

      Ember.A(Ember.keys(window.require.entries)).filter(function(path) {
        return matcher.test(path);
      }).forEach(function(path) {
        var helperName = path.replace(config.modulePrefix + '/helpers/','');
        Ember.Handlebars.registerHelper(helperName, window.require(path)['default']);
      });
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: 'ember-cli-auto-register-helpers',

      initialize: initialize
    };
  });
define("ember-reddit/initializers/export-application-global", 
  ["ember","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: 'export-application-global',

      initialize: initialize
    };
  });
define("ember-reddit/initializers/inject-store", 
  ["ember-reddit/models/store","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Store = __dependency1__["default"];

    function initialize(container, app) {
    	app.register('store:main', Store);
    	app.inject('route', 'store', 'store:main');
    	app.inject('controller', 'store', 'store:main');
    }

    __exports__.initialize = initialize;__exports__["default"] = {
    	name: 'inject-store',
    	initialize: initialize
    };
  });
define("ember-reddit/mixins/subreddit-route", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create({
    	queryParams: {
    		t: { refreshModel: true },
    		count: { refreshModel: true },
    		after: { refreshModel: true },
    		before: { refreshModel: true }
    	},

    	controllerName: 'subreddit',
    	templateName: 'subreddit/index',

    	model: function(params) {
    		params.subreddit = params.subreddit || this.paramsFor('subreddit').subreddit;

    		// need to use unique instances of params for each of these
    		return Ember.RSVP.hash({
    			listing: this.store.find('subreddit', Ember.$.extend({}, params)),
    			about: this.store.find('about', Ember.$.extend({}, params))
    		});
    	},

    	afterModel: function(model, transition) {
    		// console.log(transition);
    		// console.log(this.get('router'));
    	},

    	setupController: function(controller, model) {
    		var isBefore = !!this.controller.get('before');
    		var count = parseInt(this.controller.get('count'), 10) || 1;

    		// adjust account for when isBefore
    		if (isBefore && count !== 1) {
    			count = count - 25;
    		}

    		for (var i = 0; i < model.listing.get('children').length; i++) {
    			model.listing.get('children')[i].data.index = count + i;
    		}

    		this._super(controller, model);

    		controller.set('isFrontpage', false);

    		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
    	},

    	renderTemplate: function(controller, model) {
    		this._super();

    		this.render('tabmenu/subreddit', {
    			into: 'application',
    			outlet: 'tabmenu',
    			controller: 'subreddit'
    		});

    		this.render('sidepanel', {
    			into: 'application',
    			outlet: 'sidepanel',
    			controller: 'sidepanel',
    			model: model.about
    		});
    	}
    });
  });
define("ember-reddit/models/store", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    
    __exports__["default"] = Ember.Object.extend({
    	find: function(name, params) {
    
    		var adapter = this.container.lookup('adapter:' + name);
    		return adapter.find(name, params).then(function(record) {
    			return record;
    		});
    	}
    });
  });
define("ember-reddit/models/thing", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Object.extend({
    	isT1: Ember.computed('kind', function() {
    		return this.get('kind') === 't1';
    	}),

    	isT2: Ember.computed('kind', function() {
    		return this.get('kind') === 't2';
    	}),

    	isT3: Ember.computed('kind', function() {
    		return this.get('kind') === 't3';
    	}),

    	isT4: Ember.computed('kind', function() {
    		return this.get('kind') === 't4';
    	}),

    	isT5: Ember.computed('kind', function() {
    		return this.get('kind') === 't5';
    	})
    });
  });
define("ember-reddit/router", 
  ["ember","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
    	location: config.locationType
    });

    Router.map(function() {
    	this.resource('subreddit', { path: 'r/:subreddit' }, function() {
    		this.route('sort', { path: ':sort' });

    		this.resource('comments', { path: 'comments/:name' });
    		this.resource('related', { path: 'related/:name' })
    	});

    	this.route('user', { path: 'u/:user' });

    	this.route('domain', { path: 'domain/:domain' });
    });

    __exports__["default"] = Router;
  });
define("ember-reddit/routes/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
    });
  });
define("ember-reddit/routes/comments", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({

    	model: function(params) {
    		params.subreddit = this.paramsFor('subreddit').subreddit;

    		return Ember.RSVP.hash({
    			listings: this.store.find('comments', Ember.$.extend({}, params)),
    			about: this.store.find('about', Ember.$.extend({}, params))
    		});
    	},

    	setupController: function(controller, model) {
    		this._super(controller, model);

    		// TODO, remove this
    		controller.set('currentSub', this.paramsFor('subreddit').subreddit);
    	},

    	renderTemplate: function(controller, model) {
    		this._super();

    		this.render('tabmenu/comments', {
    			into: 'application',
    			outlet: 'tabmenu',
    			controller: controller,
    			model: model
    		});

    		this.render('sidepanel', {
    			into: 'application',
    			outlet: 'sidepanel',
    			controller: 'sidepanel',
    			model: model.about
    		});
    	}
    });
  });
define("ember-reddit/routes/index", 
  ["ember","ember-reddit/mixins/subreddit-route","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SubredditMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(SubredditMixin, {

    	setupController: function(controller, model) {
    		this._super(controller, model);
    		controller.set('isFrontpage', true);
    	}
    });
  });
define("ember-reddit/routes/subreddit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    
    __exports__["default"] = Ember.Route.extend({
    });
  });
define("ember-reddit/routes/subreddit/index", 
  ["ember","ember-reddit/mixins/subreddit-route","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SubredditRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(SubredditRouteMixin, {
    });
  });
define("ember-reddit/routes/subreddit/related", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
    });
  });
define("ember-reddit/routes/subreddit/sort", 
  ["ember","ember-reddit/mixins/subreddit-route","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SubredditRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(SubredditRouteMixin, {
    });
  });
define("ember-reddit/routes/user", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
    	model: function(params) {
    		return this.store.find('user', params.user_id);
    	}
    });
  });
define("ember-reddit/templates/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<div id=\"header\">\n	<div id=\"sr-header-area\">\n		todo: my subreddits\n	</div>\n	<div id=\"header-bottom-left\">\n		");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "reddit.com", "application", {"name":"link-to","hash":{
        'class': ("default-header"),
        'id': ("header-img")
      },"hashTypes":{'class': "STRING",'id': "STRING"},"hashContexts":{'class': depth0,'id': depth0},"types":["STRING","STRING"],"contexts":[depth0,depth0],"data":data}))));
      data.buffer.push("\n		");
      data.buffer.push(escapeExpression(((helpers.outlet || (depth0 && depth0.outlet) || helperMissing).call(depth0, "tabmenu", {"name":"outlet","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n	</div>\n</div>\n\n<div class=\"side\">\n	");
      data.buffer.push(escapeExpression(((helpers.outlet || (depth0 && depth0.outlet) || helperMissing).call(depth0, "sidepanel", {"name":"outlet","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n</div>\n\n<div class=\"content\" role=\"main\">\n	");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n\n<div class=\"footer-parent\">\n	<div class=\"footer rounded\">\n		<div class=\"col\">\n			<ul class=\"flat-vert hover\">\n				<li class=\"flat-vert title\">about</li>\n				<li><a href=\"http://www.reddit.com/blog/\" class=\"choice\">blog</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/about/\" class=\"choice\">about</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/about/team/\" class=\"choice\">team</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/code/\" class=\"choice\">source code</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/advertising/\" class=\"choice\">advertise</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/r/redditjobs/\" class=\"choice\">jobs</a></li>\n			</ul>\n		</div>\n		<div class=\"col\">\n			<ul class=\"flat-vert hover\">\n				<li class=\"flat-vert title\">help</li>\n				<li><a href=\"http://www.reddit.com/wiki/\" class=\"choice\">wiki</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/wiki/faq\" class=\"choice\">FAQ</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/wiki/reddiquette\" class=\"choice\">reddiquette</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/rules/\" class=\"choice\">rules</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/contact/\" class=\"choice\">contact us</a></li>\n			</ul>\n		</div>\n		<div class=\"col\">\n			<ul class=\"flat-vert hover\">\n				<li class=\"flat-vert title\">tools</li>\n				<li><a href=\"http://i.reddit.com\" class=\"choice\">mobile</a></li>\n				<li><span class=\"separator\"></span><a href=\"https://addons.mozilla.org/firefox/addon/socialite/\" class=\"choice\">firefox extension</a></li>\n				<li><span class=\"separator\"></span><a href=\"https://chrome.google.com/webstore/detail/algjnflpgoopkdijmkalfcifomdhmcbe\" class=\"choice\">chrome extension</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/buttons/\" class=\"choice\">buttons</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/widget/\" class=\"choice\">widget</a></li>\n			</ul>\n		</div>\n		<div class=\"col\">\n			<ul class=\"flat-vert hover\">\n				<li class=\"flat-vert title\">&lt;3</li>\n				<li><a href=\"http://www.reddit.com/gold/about/\" class=\"buygold choice\">reddit gold</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://www.reddit.com/store/\" class=\"choice\">store</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://redditgifts.com\" class=\"choice\">redditgifts</a></li>\n				<li><span class=\"separator\"></span><a href=\"https://redditama.reddit.com\" class=\"choice\">reddit AMA app</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://reddit.tv\" class=\"choice\">reddit.tv</a></li>\n				<li><span class=\"separator\"></span><a href=\"http://radioreddit.com\" class=\"choice\">radio reddit</a></li>\n			</ul>\n		</div>\n	</div>\n	<p class=\"bottommenu\">By encrypter8 with love, for reddit.com, r/emberjs, and r/redditdev</p>\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/comments", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("		");
      data.buffer.push(escapeExpression(((helpers.render || (depth0 && depth0.render) || helperMissing).call(depth0, "thing", "postThing", {"name":"render","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data}))));
      data.buffer.push("\n");
      return buffer;
    },"3":function(depth0,helpers,partials,data) {
      data.buffer.push("		<p id=\"noresults\" class=\"error\">theredoesn't seem to be anything here</p>\n");
      },"5":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("			");
      data.buffer.push(escapeExpression(((helpers.render || (depth0 && depth0.render) || helperMissing).call(depth0, "thing", "thing", {"name":"render","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data}))));
      data.buffer.push("\n");
      return buffer;
    },"7":function(depth0,helpers,partials,data) {
      data.buffer.push("			<p id=\"noresults\" class=\"error\">theredoesn't seem to be anything here</p>\n");
      },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("<div id=\"siteTable\" class=\"sitetable linklisting\">\n");
      stack1 = helpers['if'].call(depth0, "hasPost", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.program(3, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n\n<div class=\"commentarea\">\n	<div class=\"panestack-title\">\n		<span class=\"title\">");
      stack1 = helpers._triageMustache.call(depth0, "totalNumComments", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "plurarizeComment", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n	</div>\n	<div class=\"menuarea\"></div>\n	<div class=\"sitetable nestedlisting\">\n");
      stack1 = helpers.each.call(depth0, "thing", "in", "model.listings.comments.children", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.program(7, data),"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("	</div>\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/components/thumbnail-preview", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers.unless.call(depth0, "isNsfw", {"name":"unless","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"2":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("	<img ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'src': ("src")
      },"hashTypes":{'src': "ID"},"hashContexts":{'src': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(" width=\"70\" />\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1;
      stack1 = helpers['if'].call(depth0, "hasValidSrc", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      },"useData":true});
  });
define("ember-reddit/templates/components/time-ago", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("	");
      stack1 = helpers._triageMustache.call(depth0, "from", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\r\n");
      return buffer;
    },"3":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("	");
      stack1 = helpers._triageMustache.call(depth0, "ago", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\r\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1;
      stack1 = helpers['if'].call(depth0, "noSuffix", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.program(3, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      },"useData":true});
  });
define("ember-reddit/templates/components/vote-score", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("	<div class=\"score\">");
      stack1 = helpers._triageMustache.call(depth0, "displayScore", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("<div class=\"arrow up\"></div>\n");
      stack1 = helpers['if'].call(depth0, "showScore", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("<div class=\"arrow down\"></div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/partials/media-embed", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<div class=\"expando\">\r\n	");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.renderedMediaEmbed", {"name":"_triageMustache","hash":{
        'unescaped': ("true")
      },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/partials/self-text", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<div class=\"expando usertext\">\r\n	<div class=\"usertext-body md-container\">\r\n		");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.renderedSelfText", {"name":"_triageMustache","hash":{
        'unescaped': ("true")
      },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n	</div>\r\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/sidepanel", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("	<div class=\"spacer\">\r\n		<div class=\"titlebox\">\r\n			<h1 class=\"hover redditname\">\r\n				");
      stack1 = helpers._triageMustache.call(depth0, "model.data.display_name", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\r\n			</h1>\r\n\r\n			<span class=\"subscribe-button fancy-toggle-button toggle\">\r\n				<a href=\"javascript:void(0)\" class=\"option active add\" tabindex=\"100\">subscribe</a>\r\n				<a href=\"javascript:void(0)\" class=\"option remove\">unsubscribe</a>\r\n			</span>\r\n\r\n			<span class=\"subscriber\">\r\n				<span class=\"number\">");
      stack1 = helpers._triageMustache.call(depth0, "subscribersString", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\r\n				<span class=\"word\">readers</span> \r\n			</span>\r\n\r\n			<p class=\"users-online fuzzed\" title=\"logged-in users viewing this subreddit in the past 15 minutes\">\r\n				<span class=\"number\">~");
      stack1 = helpers._triageMustache.call(depth0, "activeAccountsString", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\r\n				<span class=\"word\">users here now</span> \r\n			</p>\r\n\r\n			<div class=\"usertext-body md-container\">\r\n				");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "renderedDescription", {"name":"_triageMustache","hash":{
        'unescaped': ("true")
      },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n			</div>\r\n\r\n			<div class=\"bottom\">\r\n				created by <a href=\"javascript:void(0);\">TODO</a>\r\n				<span class=\"userattrs\"></span>\r\n				<span class=\"age\">\r\n					a communitry for ");
      data.buffer.push(escapeExpression(((helpers['time-ago'] || (depth0 && depth0['time-ago']) || helperMissing).call(depth0, {"name":"time-ago","hash":{
        'noSuffix': (true),
        'datetime': ("model.data.created_utc")
      },"hashTypes":{'noSuffix': "BOOLEAN",'datetime': "ID"},"hashContexts":{'noSuffix': depth0,'datetime': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("\r\n				</span>\r\n			</div>\r\n\r\n			<div class=\"clear\"></div>\r\n		</div>\r\n	</div>\r\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("\r\n<div class=\"spacer\">\r\n	<form id=\"search\" action=\"#\" role=\"search\">\r\n		<input type=\"text\" name=\"q\" placeholder=\"search\" tabindex=\"20\">\r\n		<input type=\"submit\" tabindex=\"22\" value>\r\n		<div id=\"searchexpando\" class=\"infobar\" tabindex=\"20\">\r\n			<label>\r\n				<input type=\"checkbox\" name=\"restrict_sr\" tabindex=\"21\">\r\n				limit my search to ");
      stack1 = helpers._triageMustache.call(depth0, "model.data.url", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" \r\n			</label>\r\n			<div id=\"moresearchinfo\">\r\n			</div>\r\n			<p>\r\n				<a href=\"javascript:void(0)\" id=\"search_showmore\">advanced search: by author, subreddit...</a>\r\n			</p>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<div class=\"spacer\">\r\n	<div class=\"sidebox submit submit-link\">\r\n		<div class=\"morelink\">\r\n			<a href=\"javascript:void(0);\">Submit a new link</a>\r\n			<div class=\"nub\"></div>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<div class=\"spacer\">\r\n	<div class=\"sidebox submit submit-link\">\r\n		<div class=\"morelink\">\r\n			<a href=\"javascript:void(0);\">Submit a new text post</a>\r\n			<div class=\"nub\"></div>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n");
      stack1 = helpers['if'].call(depth0, "hasModel", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/subreddit", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      },"useData":true});
  });
define("ember-reddit/templates/subreddit/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("		");
      data.buffer.push(escapeExpression(((helpers.render || (depth0 && depth0.render) || helperMissing).call(depth0, "thing", "thing", {"name":"render","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data}))));
      data.buffer.push("\n");
      return buffer;
    },"3":function(depth0,helpers,partials,data) {
      data.buffer.push("		<p id=\"noresults\" class=\"error\">theredoesn't seem to be anything here</p>\n");
      },"5":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "isFrontpage", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(6, data),"inverse":this.program(9, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"6":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("					");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "application", ((helpers['query-params'] || (depth0 && depth0['query-params']) || helperMissing).call(depth0, {"name":"query-params","hash":{
        'before': ("model.listing.before"),
        'count': ("prevCount")
      },"hashTypes":{'before': "ID",'count': "ID"},"hashContexts":{'before': depth0,'count': depth0},"types":[],"contexts":[],"data":data})), {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(7, data),"inverse":this.noop,"types":["STRING","sexpr"],"contexts":[depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"7":function(depth0,helpers,partials,data) {
      data.buffer.push("‹ prev");
      },"9":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("					");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "subreddit", "currentSub", ((helpers['query-params'] || (depth0 && depth0['query-params']) || helperMissing).call(depth0, {"name":"query-params","hash":{
        'before': ("model.listing.before"),
        'count': ("prevCount")
      },"hashTypes":{'before': "ID",'count': "ID"},"hashContexts":{'before': depth0,'count': depth0},"types":[],"contexts":[],"data":data})), {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(7, data),"inverse":this.noop,"types":["STRING","ID","sexpr"],"contexts":[depth0,depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"11":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "isFrontpage", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(12, data),"inverse":this.program(15, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"12":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("					");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "application", ((helpers['query-params'] || (depth0 && depth0['query-params']) || helperMissing).call(depth0, {"name":"query-params","hash":{
        'after': ("model.listing.after"),
        'count': ("nextCount")
      },"hashTypes":{'after': "ID",'count': "ID"},"hashContexts":{'after': depth0,'count': depth0},"types":[],"contexts":[],"data":data})), {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(13, data),"inverse":this.noop,"types":["STRING","sexpr"],"contexts":[depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"13":function(depth0,helpers,partials,data) {
      data.buffer.push("next ›");
      },"15":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("					");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "subreddit", "currentSub", ((helpers['query-params'] || (depth0 && depth0['query-params']) || helperMissing).call(depth0, {"name":"query-params","hash":{
        'after': ("model.listing.after"),
        'count': ("nextCount")
      },"hashTypes":{'after': "ID",'count': "ID"},"hashContexts":{'after': depth0,'count': depth0},"types":[],"contexts":[],"data":data})), {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(13, data),"inverse":this.noop,"types":["STRING","ID","sexpr"],"contexts":[depth0,depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"17":function(depth0,helpers,partials,data) {
      data.buffer.push("random subreddit");
      },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("<div id=\"siteTable\" class=\"sitetable linklisting\">\n");
      stack1 = helpers.each.call(depth0, "thing", "in", "model.listing.children", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.program(3, data),"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n	<div class=\"nav-buttons\">\n		<span class=\"nextprev\">\n			view more:\n");
      stack1 = helpers['if'].call(depth0, "hasBefore", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "hasAfter", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(11, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("		</span>\n		<span class=\"next-suggestions\">\n			or try a ");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "subreddit", "random", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(17, data),"inverse":this.noop,"types":["STRING","STRING"],"contexts":[depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n		</span>\n	</div>\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/subreddit/related", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/t1row", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      data.buffer.push("				[+]\r\n");
      },"3":function(depth0,helpers,partials,data) {
      data.buffer.push("				[-]\r\n");
      },"5":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("			<a href=\"javascript:void(0);\" class=\"numchildren\">(");
      stack1 = helpers._triageMustache.call(depth0, "view.numChildren", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "view.plurarizeChild", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(")</a>\r\n");
      return buffer;
    },"7":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("		<div class=\"usertext-body md-container\">\r\n			");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.renderedBody", {"name":"_triageMustache","hash":{
        'unescaped': ("true")
      },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n		</div>\r\n\r\n		<ul class=\"flat-list buttons\">\r\n			<li class=\"first\">\r\n				");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "permalink", "comments", "subreddit", "id", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","ID"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("\r\n			</li>\r\n		</ul>\r\n");
      return buffer;
    },"9":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("			");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "t1row", {"name":"view","hash":{
        'currentSub': ("view.currentSub"),
        'context': ("child.data")
      },"hashTypes":{'currentSub': "ID",'context': "ID"},"hashContexts":{'currentSub': depth0,'context': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<p class=\"parent\"></p>\r\n");
      data.buffer.push(escapeExpression(((helpers['vote-score'] || (depth0 && depth0['vote-score']) || helperMissing).call(depth0, {"name":"vote-score","hash":{
        'showScore': (false),
        'likes': ("likes"),
        'score': ("score")
      },"hashTypes":{'showScore': "BOOLEAN",'likes': "ID",'score': "ID"},"hashContexts":{'showScore': depth0,'likes': depth0,'score': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("\r\n<div class=\"entry\">\r\n	<div class=\"tagline\">\r\n		<a href=\"javascript:void(0);\" class=\"expand\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleCollapse", {"name":"action","hash":{
        'target': ("view")
      },"hashTypes":{'target': "ID"},"hashContexts":{'target': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">\r\n");
      stack1 = helpers['if'].call(depth0, "view.isCollapsed", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.program(3, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("		</a>\r\n		");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "author", "user", "author", {"name":"link-to","hash":{
        'class': ("author")
      },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("\r\n		<span class=\"userattrs\"></span>\r\n		<span class=\"score\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleCollapse", {"name":"action","hash":{
        'target': ("view")
      },"hashTypes":{'target': "ID"},"hashContexts":{'target': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "score", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "view.plurarizePoint", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\r\n		<time>");
      data.buffer.push(escapeExpression(((helpers['time-ago'] || (depth0 && depth0['time-ago']) || helperMissing).call(depth0, {"name":"time-ago","hash":{
        'datetime': ("created_utc")
      },"hashTypes":{'datetime': "ID"},"hashContexts":{'datetime': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</time>\r\n		&nbsp;\r\n");
      stack1 = helpers['if'].call(depth0, "view.isCollapsed", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("	</div>\r\n\r\n");
      stack1 = helpers.unless.call(depth0, "view.isCollapsed", {"name":"unless","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(7, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</div>\r\n<div class=\"child\">\r\n	<div class=\"sitetable listing\">\r\n");
      stack1 = helpers.each.call(depth0, "child", "in", "view.children", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(9, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("	</div>\r\n</div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/t3row", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("			<span class=\"linkflairlabel\" ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'title': ("link_flair_text")
      },"hashTypes":{'title': "ID"},"hashContexts":{'title': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "link_flair_text", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\r\n");
      return buffer;
    },"3":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("		<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'class': (":expando-button :selftext view.isExpandoExpanded:expanded:collapsed")
      },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "expandExpando", {"name":"action","hash":{
        'target': ("view")
      },"hashTypes":{'target': "ID"},"hashContexts":{'target': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("></div>\r\n");
      return buffer;
    },"5":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("		<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'class': (":expando-button :video view.isExpandoExpanded:expanded:collapsed")
      },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "expandExpando", {"name":"action","hash":{
        'target': ("view")
      },"hashTypes":{'target': "ID"},"hashContexts":{'target': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("</div>\r\n");
      return buffer;
    },"7":function(depth0,helpers,partials,data) {
      data.buffer.push("			<li class=\"rounded nsfw-stamp stamp\">\r\n				<acronym title=\"Adult content: Not Safe For Work\">NSFW</acronym>\r\n			</li>\r\n");
      },"9":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers._triageMustache.call(depth0, "num_comments", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" comments");
      return buffer;
    },"11":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "view.isExpandoExpanded", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(12, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"12":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("			");
      data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "partials/self-text", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\r\n");
      return buffer;
    },"14":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "view.isExpandoExpanded", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(15, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"15":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("			");
      data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "partials/media-embed", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\r\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<p class=\"parent\"></p>\r\n<span class=\"rank\">");
      stack1 = helpers._triageMustache.call(depth0, "index", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\r\n");
      data.buffer.push(escapeExpression(((helpers['vote-score'] || (depth0 && depth0['vote-score']) || helperMissing).call(depth0, {"name":"vote-score","hash":{
        'likes': ("likes"),
        'score': ("score")
      },"hashTypes":{'likes': "ID",'score': "ID"},"hashContexts":{'likes': depth0,'score': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("\r\n");
      data.buffer.push(escapeExpression(((helpers['thumbnail-preview'] || (depth0 && depth0['thumbnail-preview']) || helperMissing).call(depth0, {"name":"thumbnail-preview","hash":{
        'isNsfw': ("over_18"),
        'src': ("thumbnail"),
        'url': ("url")
      },"hashTypes":{'isNsfw': "ID",'src': "ID",'url': "ID"},"hashContexts":{'isNsfw': depth0,'src': depth0,'url': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("\r\n<div class=\"entry\">\r\n	<p class=\"title\">\r\n		<a ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'href': ("url")
      },"hashTypes":{'href': "ID"},"hashContexts":{'href': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</a>\r\n");
      stack1 = helpers['if'].call(depth0, "view.hasLinkFlair", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("		<span class=\"domain\">(");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "domain", "domain", "domain", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push(")</span>\r\n	</p>\r\n");
      stack1 = helpers['if'].call(depth0, "view.hasSelfText", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(3, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "view.hasMediaEmbed", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("	<p class=\"tagline\">Submitted ");
      data.buffer.push(escapeExpression(((helpers['time-ago'] || (depth0 && depth0['time-ago']) || helperMissing).call(depth0, {"name":"time-ago","hash":{
        'datetime': ("created_utc")
      },"hashTypes":{'datetime': "ID"},"hashContexts":{'datetime': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push(" by ");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "author", "user", "author", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</p>\r\n	<ul class=\"flat-list buttons\">\r\n");
      stack1 = helpers['if'].call(depth0, "over_18", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(7, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("		<li class=\"first\">\r\n			");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "comments", "subreddit", "id", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(9, data),"inverse":this.noop,"types":["STRING","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\r\n		</li>\r\n		<li class=\"share\"></li>\r\n	</ul>\r\n");
      stack1 = helpers['if'].call(depth0, "view.hasSelfText", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(11, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "view.hasMediaEmbed", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(14, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</div>\r\n");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/tabmenu/comments", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<span class=\"hover pagename redditname\">\r\n	");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "currentSub", "subreddit.index", "currentSub", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("\r\n</span>\r\n<ul class=\"tabmenu\">\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "comments", "comments", "currentSub", "postThing.data.id", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","ID"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "related", "related", "currentSub", "postThing.data.id", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","ID"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n</ul>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/tabmenu/subreddit", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("<span class=\"hover pagename redditname\">\r\n	");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "currentSub", "subreddit.index", "currentSub", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("\r\n</span>\r\n<ul class=\"tabmenu\">\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "hot", "subreddit.index", "currentSub", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "new", "subreddit.sort", "currentSub", "new", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","STRING"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "rising", "subreddit.sort", "currentSub", "rising", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","STRING"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "controversial", "subreddit.sort", "currentSub", "controversial", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","STRING"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "top", "subreddit.sort", "currentSub", "top", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","STRING"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n	<li>");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "gilded", "subreddit.sort", "currentSub", "gilded", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID","STRING"],"contexts":[depth0,depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</li>\r\n</ul>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/thing", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("	");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "t1row", {"name":"view","hash":{
        'context': ("data")
      },"hashTypes":{'context': "ID"},"hashContexts":{'context': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("\r\n");
      return buffer;
    },"3":function(depth0,helpers,partials,data) {
      data.buffer.push("	\r\n");
      },"5":function(depth0,helpers,partials,data) {
      var escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("	");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "t3row", {"name":"view","hash":{
        'context': ("data")
      },"hashTypes":{'context': "ID"},"hashContexts":{'context': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("	\r\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "isT1", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "isT2", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(3, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "isT3", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "isT4", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(3, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      stack1 = helpers['if'].call(depth0, "isT5", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(3, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("<div class=\"clearleft\"></div>");
      return buffer;
    },"useData":true});
  });
define("ember-reddit/templates/user", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("		<li>\n			");
      stack1 = helpers._triageMustache.call(depth0, "item.kind", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" - ");
      stack1 = helpers._triageMustache.call(depth0, "item.data.id", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n		</li>\n");
      return buffer;
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      data.buffer.push("<ul>\n");
      stack1 = helpers.each.call(depth0, "item", "in", "model.children", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</ul>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"useData":true});
  });
define("ember-reddit/tests/adapters/about.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/about.js should pass jshint', function() { 
      ok(false, 'adapters/about.js should pass jshint.\nadapters/about.js: line 29, col 15, Missing semicolon.\nadapters/about.js: line 4, col 8, \'parseListing\' is defined but never used.\n\n2 errors'); 
    });
  });
define("ember-reddit/tests/adapters/comments.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/comments.js should pass jshint', function() { 
      ok(true, 'adapters/comments.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/adapters/subreddit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/subreddit.js should pass jshint', function() { 
      ok(false, 'adapters/subreddit.js should pass jshint.\nadapters/subreddit.js: line 3, col 8, \'thing\' is defined but never used.\n\n1 error'); 
    });
  });
define("ember-reddit/tests/adapters/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/user.js should pass jshint', function() { 
      ok(true, 'adapters/user.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/components/thumbnail-preview.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/thumbnail-preview.js should pass jshint', function() { 
      ok(true, 'components/thumbnail-preview.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/components/time-ago.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/time-ago.js should pass jshint', function() { 
      ok(true, 'components/time-ago.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/components/vote-score.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/vote-score.js should pass jshint', function() { 
      ok(true, 'components/vote-score.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/controllers/comments.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/comments.js should pass jshint', function() { 
      ok(true, 'controllers/comments.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/controllers/sidepanel.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/sidepanel.js should pass jshint', function() { 
      ok(true, 'controllers/sidepanel.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/controllers/subreddit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/subreddit.js should pass jshint', function() { 
      ok(true, 'controllers/subreddit.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/helpers');
    test('ember-reddit/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/helpers');
    test('ember-reddit/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests');
    test('ember-reddit/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/test-helper.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/adapters/about-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/adapters');
    test('ember-reddit/tests/unit/adapters/about-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/adapters/about-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/adapters/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/adapters');
    test('ember-reddit/tests/unit/adapters/application-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/adapters/application-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/adapters/comments-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/adapters');
    test('ember-reddit/tests/unit/adapters/comments-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/adapters/comments-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/adapters/subreddit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/adapters');
    test('ember-reddit/tests/unit/adapters/subreddit-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/adapters/subreddit-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/adapters/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/adapters');
    test('ember-reddit/tests/unit/adapters/user-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/adapters/user-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/components/thumbnail-preview-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/components');
    test('ember-reddit/tests/unit/components/thumbnail-preview-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/components/thumbnail-preview-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/components/time-ago-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/components');
    test('ember-reddit/tests/unit/components/time-ago-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/components/time-ago-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/components/vote-score-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/components');
    test('ember-reddit/tests/unit/components/vote-score-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/components/vote-score-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/controllers/comments-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/controllers');
    test('ember-reddit/tests/unit/controllers/comments-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/controllers/comments-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/controllers/sidepanel-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/controllers');
    test('ember-reddit/tests/unit/controllers/sidepanel-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/controllers/sidepanel-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/controllers/subreddit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/controllers');
    test('ember-reddit/tests/unit/controllers/subreddit-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/controllers/subreddit-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/helpers/format-number-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/helpers');
    test('ember-reddit/tests/unit/helpers/format-number-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/helpers/format-number-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/initializers/inject-store-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/initializers');
    test('ember-reddit/tests/unit/initializers/inject-store-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/initializers/inject-store-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/mixins/subreddit-route-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/mixins');
    test('ember-reddit/tests/unit/mixins/subreddit-route-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/mixins/subreddit-route-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/models/thing-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/models');
    test('ember-reddit/tests/unit/models/thing-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/models/thing-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes');
    test('ember-reddit/tests/unit/routes/application-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/application-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/comments-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes');
    test('ember-reddit/tests/unit/routes/comments-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/comments-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes');
    test('ember-reddit/tests/unit/routes/index-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/index-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/subreddit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes');
    test('ember-reddit/tests/unit/routes/subreddit-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/subreddit-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/subreddit/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes/subreddit');
    test('ember-reddit/tests/unit/routes/subreddit/index-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/subreddit/index-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/subreddit/related-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes/subreddit');
    test('ember-reddit/tests/unit/routes/subreddit/related-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/subreddit/related-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/subreddit/sort-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes/subreddit');
    test('ember-reddit/tests/unit/routes/subreddit/sort-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/subreddit/sort-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/routes/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/routes');
    test('ember-reddit/tests/unit/routes/user-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/routes/user-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/utils/calc-children-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/utils');
    test('ember-reddit/tests/unit/utils/calc-children-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/utils/calc-children-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/utils/decode-html-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/utils');
    test('ember-reddit/tests/unit/utils/decode-html-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/utils/decode-html-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/utils/parse-listing-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/utils');
    test('ember-reddit/tests/unit/utils/parse-listing-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/utils/parse-listing-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/views/t1row-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/views');
    test('ember-reddit/tests/unit/views/t1row-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/views/t1row-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/ember-reddit/tests/unit/views/t3row-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - ember-reddit/tests/unit/views');
    test('ember-reddit/tests/unit/views/t3row-test.js should pass jshint', function() { 
      ok(true, 'ember-reddit/tests/unit/views/t3row-test.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/helpers/format-number.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/format-number.js should pass jshint', function() { 
      ok(true, 'helpers/format-number.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/helpers/resolver", 
  ["ember/resolver","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("ember-reddit/tests/helpers/start-app", 
  ["ember","ember-reddit/app","ember-reddit/router","ember-reddit/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var App;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Router.reopen({
        location: 'none'
      });

      Ember.run(function() {
        App = Application.create(attributes);
        App.setupForTesting();
        App.injectTestHelpers();
      });

      App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

      return App;
    }
  });
define("ember-reddit/tests/initializers/inject-store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - initializers');
    test('initializers/inject-store.js should pass jshint', function() { 
      ok(true, 'initializers/inject-store.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/mixins/subreddit-route.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - mixins');
    test('mixins/subreddit-route.js should pass jshint', function() { 
      ok(false, 'mixins/subreddit-route.js should pass jshint.\nmixins/subreddit-route.js: line 24, col 33, \'transition\' is defined but never used.\nmixins/subreddit-route.js: line 24, col 26, \'model\' is defined but never used.\n\n2 errors'); 
    });
  });
define("ember-reddit/tests/models/store.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/store.js should pass jshint', function() { 
      ok(true, 'models/store.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/models/thing.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/thing.js should pass jshint', function() { 
      ok(true, 'models/thing.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(false, 'router.js should pass jshint.\nrouter.js: line 13, col 60, Missing semicolon.\n\n1 error'); 
    });
  });
define("ember-reddit/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(true, 'routes/application.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/comments.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/comments.js should pass jshint', function() { 
      ok(true, 'routes/comments.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/index.js should pass jshint', function() { 
      ok(true, 'routes/index.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/subreddit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/subreddit.js should pass jshint', function() { 
      ok(true, 'routes/subreddit.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/subreddit/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/subreddit');
    test('routes/subreddit/index.js should pass jshint', function() { 
      ok(true, 'routes/subreddit/index.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/subreddit/related.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/subreddit');
    test('routes/subreddit/related.js should pass jshint', function() { 
      ok(true, 'routes/subreddit/related.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/subreddit/sort.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/subreddit');
    test('routes/subreddit/sort.js should pass jshint', function() { 
      ok(true, 'routes/subreddit/sort.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/routes/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/user.js should pass jshint', function() { 
      ok(true, 'routes/user.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/test-helper", 
  ["ember-reddit/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

    QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
    var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
    document.getElementById('ember-testing-container').style.visibility = containerVisibility;
  });
define("ember-reddit/tests/unit/adapters/about-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('adapter:about', 'AboutAdapter', {
      // Specify the other units that are required for this test.
      // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var adapter = this.subject();
      ok(adapter);
    });
  });
define("ember-reddit/tests/unit/adapters/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('adapter:application', 'ApplicationAdapter', {
      // Specify the other units that are required for this test.
      // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var adapter = this.subject();
      ok(adapter);
    });
  });
define("ember-reddit/tests/unit/adapters/comments-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('adapter:comments', 'CommentsAdapter', {
      // Specify the other units that are required for this test.
      // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var adapter = this.subject();
      ok(adapter);
    });
  });
define("ember-reddit/tests/unit/adapters/subreddit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('adapter:subreddit', 'SubredditAdapter', {
      // Specify the other units that are required for this test.
      // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var adapter = this.subject();
      ok(adapter);
    });
  });
define("ember-reddit/tests/unit/adapters/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('adapter:user', 'UserAdapter', {
      // Specify the other units that are required for this test.
      // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var adapter = this.subject();
      ok(adapter);
    });
  });
define("ember-reddit/tests/unit/components/thumbnail-preview-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent('thumbnail-preview', 'ThumbnailPreviewComponent', {
      // specify the other units that are required for this test
      // needs: ['component:foo', 'helper:bar']
    });

    test('it renders', function() {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, 'preRender');

      // appends the component to the page
      this.append();
      equal(component._state, 'inDOM');
    });
  });
define("ember-reddit/tests/unit/components/time-ago-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent('time-ago', 'TimeAgoComponent', {
      // specify the other units that are required for this test
      // needs: ['component:foo', 'helper:bar']
    });

    test('it renders', function() {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, 'preRender');

      // appends the component to the page
      this.append();
      equal(component._state, 'inDOM');
    });
  });
define("ember-reddit/tests/unit/components/vote-score-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent('vote-score', 'VoteScoreComponent', {
      // specify the other units that are required for this test
      // needs: ['component:foo', 'helper:bar']
    });

    test('it renders', function() {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, 'preRender');

      // appends the component to the page
      this.append();
      equal(component._state, 'inDOM');
    });
  });
define("ember-reddit/tests/unit/controllers/comments-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:comments', 'CommentsController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("ember-reddit/tests/unit/controllers/sidepanel-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:sidepanel', 'SidepanelController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("ember-reddit/tests/unit/controllers/subreddit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('controller:subreddit', 'SubredditController', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    // Replace this with your real tests.
    test('it exists', function() {
      var controller = this.subject();
      ok(controller);
    });
  });
define("ember-reddit/tests/unit/helpers/format-number-test", 
  ["ember-reddit/helpers/format-number"],
  function(__dependency1__) {
    "use strict";
    var formatNumber = __dependency1__.formatNumber;

    module('FormatNumberHelper');

    // Replace this with your real tests.
    test('it works', function() {
      var result = formatNumber(42);
      ok(result);
    });
  });
define("ember-reddit/tests/unit/initializers/inject-store-test", 
  ["ember","ember-reddit/initializers/inject-store"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var initialize = __dependency2__.initialize;

    var container, application;

    module('InjectStoreInitializer', {
      setup: function() {
        Ember.run(function() {
          container = new Ember.Container();
          application = Ember.Application.create();
          application.deferReadiness();
        });
      }
    });

    // Replace this with your real tests.
    test('it works', function() {
      initialize(container, application);

      // you would normally confirm the results of the initializer here
      ok(true);
    });
  });
define("ember-reddit/tests/unit/mixins/subreddit-route-test", 
  ["ember","ember-reddit/mixins/subreddit-route"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var SubredditRouteMixin = __dependency2__["default"];

    module('SubredditRouteMixin');

    // Replace this with your real tests.
    test('it works', function() {
      var SubredditRouteObject = Ember.Object.extend(SubredditRouteMixin);
      var subject = SubredditRouteObject.create();
      ok(subject);
    });
  });
define("ember-reddit/tests/unit/models/thing-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel('thing', 'Thing', {
      // Specify the other units that are required for this test.
      needs: []
    });

    test('it exists', function() {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("ember-reddit/tests/unit/routes/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:application', 'ApplicationRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/comments-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:comments', 'CommentsRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:index', 'IndexRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/subreddit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:subreddit', 'SubredditRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/subreddit/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:subreddit/index', 'SubredditIndexRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/subreddit/related-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:subreddit/related', 'SubredditRelatedRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/subreddit/sort-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:subreddit/sort', 'SubredditSortRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/routes/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('route:user', 'UserRoute', {
      // Specify the other units that are required for this test.
      // needs: ['controller:foo']
    });

    test('it exists', function() {
      var route = this.subject();
      ok(route);
    });
  });
define("ember-reddit/tests/unit/utils/calc-children-test", 
  ["ember-reddit/utils/calc-children"],
  function(__dependency1__) {
    "use strict";
    var calcChildren = __dependency1__["default"];

    module('calcChildren');

    // Replace this with your real tests.
    test('it works', function() {
      var result = calcChildren();
      ok(result);
    });
  });
define("ember-reddit/tests/unit/utils/decode-html-test", 
  ["ember-reddit/utils/decode-html"],
  function(__dependency1__) {
    "use strict";
    var decodeHtml = __dependency1__["default"];

    module('decodeHtml');

    // Replace this with your real tests.
    test('it works', function() {
      var result = decodeHtml();
      ok(result);
    });
  });
define("ember-reddit/tests/unit/utils/parse-listing-test", 
  ["ember-reddit/utils/parse-listing"],
  function(__dependency1__) {
    "use strict";
    var parseListing = __dependency1__["default"];

    module('parseListing');

    // Replace this with your real tests.
    test('it works', function() {
      var result = parseListing();
      ok(result);
    });
  });
define("ember-reddit/tests/unit/views/t1row-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('view:t1row', 'T1rowView');

    // Replace this with your real tests.
    test('it exists', function() {
      var view = this.subject();
      ok(view);
    });
  });
define("ember-reddit/tests/unit/views/t3row-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor('view:t3row', 'T3rowView');

    // Replace this with your real tests.
    test('it exists', function() {
      var view = this.subject();
      ok(view);
    });
  });
define("ember-reddit/tests/utils/calc-children.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - utils');
    test('utils/calc-children.js should pass jshint', function() { 
      ok(true, 'utils/calc-children.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/utils/decode-html.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - utils');
    test('utils/decode-html.js should pass jshint', function() { 
      ok(true, 'utils/decode-html.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/utils/parse-listing.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - utils');
    test('utils/parse-listing.js should pass jshint', function() { 
      ok(true, 'utils/parse-listing.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/views/t1row.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/t1row.js should pass jshint', function() { 
      ok(true, 'views/t1row.js should pass jshint.'); 
    });
  });
define("ember-reddit/tests/views/t3row.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/t3row.js should pass jshint', function() { 
      ok(true, 'views/t3row.js should pass jshint.'); 
    });
  });
define("ember-reddit/utils/calc-children", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var calcChildren = function(thing) {
    	var total = 0;

    	if (thing && thing.get('children')) {
    		total += thing.get('children').length;

    		for (var i = 0; i < thing.get('children').length; i++) {

    			var childData = thing.get('children')[i].get('data');

    			if (childData.replies) {
    				total += calcChildren(childData.replies);
    			}
    		}
    	}

    	return total;
    };

    __exports__["default"] = calcChildren ;
  });
define("ember-reddit/utils/decode-html", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = function decodeHtml(html) {
    	return Ember.$('<div>').html(html).text();
    }
  });
define("ember-reddit/utils/parse-listing", 
  ["ember","ember-reddit/models/thing","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var thing = __dependency2__["default"];

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

    __exports__["default"] = parseListing;
  });
define("ember-reddit/views/t1row", 
  ["ember","ember-reddit/utils/calc-children","ember-reddit/utils/decode-html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var calcChildren = __dependency2__["default"];
    var decodeHtml = __dependency3__["default"];

    __exports__["default"] = Ember.View.extend({
    	templateName: 't1row',
    	classNames: ['t1', 'comment'],
    	classNameBindings: ['isCollapsed:collapsed:noncollapsed'],

    	isCollapsed: false,

    	renderedBody: Ember.computed('context.body_html', function() {
    		return decodeHtml(this.get('context.body_html'));
    	}),

    	actions: {
    		toggleCollapse: function() {
    			this.toggleProperty('isCollapsed');
    		}
    	},

    	hasChildren: Ember.computed('context.replies', function() {
    		return !!this.get('context.replies.children') && this.get('context.replies.children').length;
    	}),

    	children: Ember.computed('context.replies', function() {
    		return this.get('context.replies.children');
    	}),

    	numChildren: Ember.computed('context.replies', function() {
    		return calcChildren(this.get('context.replies'));
    	}),

    	plurarizeChild: Ember.computed('numChildren', function() {
    		return this.get('numChildren') === 1 ? 'child' : 'children';
    	}),

    	plurarizePoint: Ember.computed('context.score', function() {
    		return this.get('context.score') === 1 ? 'point' : 'points';
    	})
    });
  });
define("ember-reddit/views/t3row", 
  ["ember","ember-reddit/utils/decode-html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var decodeHtml = __dependency2__["default"];

    __exports__["default"] = Ember.View.extend({
    	templateName: 't3row',
    	classNames: ['t3', 'link'],
    	classNameBindings: ['hasLinkFlair:linkflair'],

    	hasSelfText: Ember.computed('context.selftext_html', function() {
    		return !!this.get('context.selftext_html');
    	}),

    	renderedSelfText: Ember.computed('context.selftext_html', function() {
    		return decodeHtml(this.get('context.selftext_html'));
    	}),

    	hasMediaEmbed: Ember.computed('context.media_embed', function() {
    		return !!this.get('context.media_embed').content;
    	}),

    	renderedMediaEmbed: Ember.computed('context.media_embed', function() {
    		return decodeHtml(this.get('context.media_embed').content);
    	}),

    	isExpandoExpanded: false,

    	hasLinkFlair: Ember.computed('context.link_flair_text', function() {
    		return !!this.get('context.link_flair_text');
    	}),

    	actions: {
    		expandExpando: function() {
    			this.toggleProperty('isExpandoExpanded');
    		}
    	}
    });
  });
/* jshint ignore:start */

define('ember-reddit/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-reddit';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("ember-reddit/tests/test-helper");
} else {
  require("ember-reddit/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
//# sourceMappingURL=ember-reddit.map