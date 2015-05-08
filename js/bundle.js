(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var router = require('./router.js');
var templates = require('./templates.js');
var extensions = require('./extensions.js');

var App = {

  templates: templates,
  entryPoint: '.app',
  
  // Set up for cachable Backbone classes
  views: {},
  collections: {},
  models: {},

  extensions: extensions,

  initialize: function(){
    this.views.master = new this.extensions.views.master({el: this.entryPoint});
  	this.router = new router(this);

  }
};
// Assigning App to the global (window)
global.App = App;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./extensions.js":3,"./router.js":7,"./templates.js":9}],2:[function(require,module,exports){
'use strict';

var model = require('../models/article.js');

module.exports = window.Backbone.Collection.extend({

  model: model,
  isLoading: false,
  tag: 'web-development',
  // initialize: function (options) {
  //  var collection = this;
  // 	options = (options || {});
  // },
  url: function(){
    return 'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ this.tag +'/posts';
  },
  parse: function(response){
    return response.posts;
  }
});
},{"../models/article.js":6}],3:[function(require,module,exports){
'use strict';

var masterView = require('./views/master.js');
var rootView = require('./views/root.js');
var articleView = require('./views/article.js');
var articlesView = require('./views/articles.js');

var articlesCollection = require('./collections/articles.js');

var articleModel = require('./models/article.js');

// Making Backbone class extensions available through App.extensions
// Mainly for testing, but also keeps the app layout a little neater.

module.exports = { 

  views: {
    master          : masterView,
  	root 						: rootView,
		article 				: articleView,
		articles				: articlesView
  },

  collections: {
  	articles 				: articlesCollection
  },

  models: {
  	article 				: articleModel
  }

};
},{"./collections/articles.js":2,"./models/article.js":6,"./views/article.js":10,"./views/articles.js":11,"./views/master.js":12,"./views/root.js":13}],4:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function (tag) {
	var App = global.App;

	App.collections[tag] = (
		App.collections[tag] || new App.extensions.collections.articles()
	);

	App.collections[tag].tag = tag;

	return App.collections[tag];
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
'use strict';

// main.js currently only has two responsibilities,
// to ready App by including it and initializing it after document ready.

require('./app.js');

$(document).on('ready', function(){
	global.App.initialize();
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./app.js":1}],6:[function(require,module,exports){
'use strict';

module.exports = window.Backbone.Model.extend({
	idAttribute: 'ID'
});
},{}],7:[function(require,module,exports){
(function (global){
'use strict';

var findOrCreateCollectionByTag = require('./helpers/findOrCreateCollectionByTag.js');
	
module.exports =  window.Backbone.Router.extend({
	routes: {
		'': 'root',
		':tag': 'articles',
		':tag/:slug': 'article'
	},

	initialize: function(){
		var App = global.App;
		
		this.on('route:root' ,function(){

			// Creating and caching the view if it is not already cached
			App.views.root = App.views.root || new App.extensions.views.root({
				container: App.entryPoint
			});

			// Then rendering the view
			App.views.root.render();

		});

		this.on('route:articles' ,function(tag){

			var collection = findOrCreateCollectionByTag(tag);

			// Not caching the view. Could be a future change if holding state for re-visits
			// becomes desirable
			(new App.extensions.views.articles({
				collection: collection
			})
			// rendering immediately after, keeps the calls to cached/non-cached views consistant
			).render();

		});

		this.on('route:article' ,function(tag, slug){

			var collection = findOrCreateCollectionByTag(tag);
			// Get the first model in the collection with a macthing slug
			// Returns undefined if there is no match, which the view will handle
			(new App.extensions.views.article({
				collection: collection,
				slug: slug
			})
			).render();
			
		});

		window.Backbone.history.start();

	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./helpers/findOrCreateCollectionByTag.js":4}],8:[function(require,module,exports){
module.exports = (
[{
	name: 'javascript'
},{
	name: 'backbone.js'
},{
	name: 'node.js'
},{
	name: 'io.js'
},{
	name: 'ruby'
},{
	name: 'ruby-on-rails'
},{
	name: 'ember.js'
},{
	name: 'react.js'	
}]);
},{}],9:[function(require,module,exports){
var exports = (function () { 

 var Handlebars = window.Handlebars; 

this["JST"] = this["JST"] || {};

this["JST"]["article-preview"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Article preview</h2>";
  },"useData":true});

this["JST"]["article"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <h4 class=\"error\">Oops! Something went wrong!</h4>\n  <p class=\"try-again\">Try again?</p>\n\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loading : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"4":function(depth0,helpers,partials,data) {
  return "    <h4>Loading...</h4>\n";
  },"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.program(11, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"7":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"with","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"8":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "      	<div class=\"article__wrapper ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"unless","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n          <article class=\"article\" id=\""
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\">\n              <div class=\"article__header\">\n                <h1>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n              </div>\n\n              <div class=\"article__content\">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n          </article>\n        </div>\n";
},"9":function(depth0,helpers,partials,data) {
  return " out-of-focus";
  },"11":function(depth0,helpers,partials,data) {
  return "    	<h2>Article not found</h2>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.errors : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});

this["JST"]["articles"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "	<h4 class=\"error\">Oops! Something went wrong!</h4>\n	<p class=\"try-again\">Try again?</p>\n\n";
  },"3":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loading : depth0), {"name":"if","hash":{},"fn":this.program(4, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"4":function(depth0,helpers,partials,data) {
  return "		<h4>Loading...</h4>\n";
  },"6":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"if","hash":{},"fn":this.program(7, data, depths),"inverse":this.program(12, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		\n";
},"7":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "			<ul class=\"articles-list\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(8, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</ul>\n";
},"8":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "\n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.attributes : depth0), {"name":"with","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"9":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "					<li class=\"article-listing\">\n						<div class=\"article-listing__container\">\n							<div class=\"avatar\" style=\"background-image: url("
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.avatar_URL : stack1), depth0))
    + ");\"></div>\n							<div class=\"article-listing__details\">\n								<div class=\"truncater\">\n									<a class=\"article-listing__title truncate\" href=\"#/"
    + escapeExpression(lambda((depths[2] != null ? depths[2].tag : depths[2]), depth0))
    + "/"
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a> \n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.author : depth0), {"name":"with","hash":{},"fn":this.program(10, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "								</div>\n							</div>\n						</div>\n					</li>\n					<hr>\n";
},"10":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "										<p class=\"by-line truncate\">By: <a href=\""
    + escapeExpression(((helper = (helper = helpers.author_URL || (depth0 != null ? depth0.author_URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"author_URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "</a></p>\n";
},"12":function(depth0,helpers,partials,data) {
  return "			<h2>No articles found</h2>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<h2>Results for '"
    + escapeExpression(((helper = (helper = helpers.tag || (depth0 != null ? depth0.tag : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tag","hash":{},"data":data}) : helper)))
    + "'</h2>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.errors : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(3, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});

this["JST"]["root"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<a href=\"#/"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<h2>Root View</h2>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tags : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
 return this['JST'];
})();

module.exports = exports;
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: '<article>',

	template: templates.article,

	initialize: function (options) {
		options = (options || {});
		this.container = options.container ? $(options.container) : global.App.views.master.$el;
		this.tag = options.tag;
		this.slug = options.slug;
		this.model = this.collection.findWhere({slug: options.slug});

		return this;
	},
	events: {
		'click p.try-again' : 'this.getNewRecords'
	},
	getNewRecords: function () {
		var view = this;
		var collection = this.collection;

		console.log('get new');

		var fragment = window.Backbone.history.fragment;
		collection.fetch({
			success: function(){
				// Only call render if the url fragment is the same, otherwise a user might navigate to another route,
        // but the render would still be called and take effect.
        if (fragment === window.Backbone.history.fragment) {
					view.model = collection.findWhere({slug: view.slug});
					view.render();
				}
			},
			error: function(){
				view.renderError();
			}
		});

		return this;

	},
	toRender: function (options) {
		options = (options || {});
		var templateData = this.model ? {article: this.model.toJSON()} : {};

		templateData.loading = options.loading;
		templateData.errors = options.errors;

		return this.$el.html(this.template(templateData));
	},
	render: function () {
		var view = this;
		var collection = view.collection;

		// Currently only fetching on render if the collection is empty,
    // subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {

			this.container.html(this.toRender({loading: true}));
			this.getNewRecords();

			return this;
		}
		this.container.html(this.toRender());

		return this;
	},
	renderError: function () {
		this.container.html(this.toRender({errors: true}));
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../templates.js":9}],11:[function(require,module,exports){
(function (global){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({
	
	el: '<section>',

	template: templates.articles,

	initialize: function(options){
		options = (options || {});
		this.container = options.container ? $(options.container) : global.App.views.master.$el;

		return this;
	},
	events: {
		'click p.try-again' : 'this.getNewRecords'
	},
	getNewRecords: function () {
		var view = this;
		var collection = this.collection;

		// taking the current fragment to be checked after the fetch.
		var fragment = window.Backbone.history.fragment;
		collection.fetch({
			success: function(){
				// Only call render if the url fragment is the same, otherwise a user might navigate to another route,
				// but the render would still be called and take effect.
				if (fragment === window.Backbone.history.fragment) {
					view.render();
				}
			},
			error: function(){
				view.renderError();
			}
		});

		return this;

	},
	toRender: function (options) {
		options = (options || {});
		var view = this;
		var collection = view.collection;

		options.models = collection.models;
		options.tag = collection.tag;

		return this.$el.html(this.template(options));
	},

	render: function(){
		var view = this;
		var collection = view.collection;

		// Currently only fetching on render if the collection is empty,
		// subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {

			this.container.html(this.toRender({loading: true}));
			this.getNewRecords();

			return this;
		}
		this.container.html(this.toRender());

		return this;
	},
	renderError: function () {
		console.log('errors');
		this.container.html(this.toRender({errors: true}));
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../templates.js":9}],12:[function(require,module,exports){
'use strict';

module.exports = window.Backbone.View.extend({
	// events: {}
});
},{}],13:[function(require,module,exports){
(function (global){
'use strict';

var templates = require('../templates.js');
var suggestedTags = require('../suggestedTags');

module.exports = window.Backbone.View.extend({
	
	el: '<div>',

	template: templates.root,

	initialize: function(options){
		options = (options || {});
		this.container = options.container ? $(options.container) : global.App.views.master.$el;

		return this;
	},

	toRender: function () {
		return this.$el.html(this.template({tags: suggestedTags}));
	},

	render: function(){
		this.container.html(this.toRender());

		return this;
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../suggestedTags":8,"../templates.js":9}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9tYXN0ZXIuanMiLCJhcHAvanMvdmlld3Mvcm9vdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXIuanMnKTtcbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpO1xudmFyIGV4dGVuc2lvbnMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMuanMnKTtcblxudmFyIEFwcCA9IHtcblxuICB0ZW1wbGF0ZXM6IHRlbXBsYXRlcyxcbiAgZW50cnlQb2ludDogJy5hcHAnLFxuICBcbiAgLy8gU2V0IHVwIGZvciBjYWNoYWJsZSBCYWNrYm9uZSBjbGFzc2VzXG4gIHZpZXdzOiB7fSxcbiAgY29sbGVjdGlvbnM6IHt9LFxuICBtb2RlbHM6IHt9LFxuXG4gIGV4dGVuc2lvbnM6IGV4dGVuc2lvbnMsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnZpZXdzLm1hc3RlciA9IG5ldyB0aGlzLmV4dGVuc2lvbnMudmlld3MubWFzdGVyKHtlbDogdGhpcy5lbnRyeVBvaW50fSk7XG4gIFx0dGhpcy5yb3V0ZXIgPSBuZXcgcm91dGVyKHRoaXMpO1xuXG4gIH1cbn07XG4vLyBBc3NpZ25pbmcgQXBwIHRvIHRoZSBnbG9iYWwgKHdpbmRvdylcbmdsb2JhbC5BcHAgPSBBcHA7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvYXJ0aWNsZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cbiAgbW9kZWw6IG1vZGVsLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICB0YWc6ICd3ZWItZGV2ZWxvcG1lbnQnLFxuICAvLyBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAvLyAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuICAvLyBcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG4gIC8vIH0sXG4gIHVybDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJ2h0dHBzOi8vcHVibGljLWFwaS53b3JkcHJlc3MuY29tL3Jlc3QvdjEuMS9yZWFkL3RhZ3MvJysgdGhpcy50YWcgKycvcG9zdHMnO1xuICB9LFxuICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHJldHVybiByZXNwb25zZS5wb3N0cztcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFzdGVyVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFzdGVyLmpzJyk7XG52YXIgcm9vdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Jvb3QuanMnKTtcbnZhciBhcnRpY2xlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZS5qcycpO1xudmFyIGFydGljbGVzVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWxzL2FydGljbGUuanMnKTtcblxuLy8gTWFraW5nIEJhY2tib25lIGNsYXNzIGV4dGVuc2lvbnMgYXZhaWxhYmxlIHRocm91Z2ggQXBwLmV4dGVuc2lvbnNcbi8vIE1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28ga2VlcHMgdGhlIGFwcCBsYXlvdXQgYSBsaXR0bGUgbmVhdGVyLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXG5cbiAgdmlld3M6IHtcbiAgICBtYXN0ZXIgICAgICAgICAgOiBtYXN0ZXJWaWV3LFxuICBcdHJvb3QgXHRcdFx0XHRcdFx0OiByb290Vmlldyxcblx0XHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlVmlldyxcblx0XHRhcnRpY2xlc1x0XHRcdFx0OiBhcnRpY2xlc1ZpZXdcbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICBcdGFydGljbGVzIFx0XHRcdFx0OiBhcnRpY2xlc0NvbGxlY3Rpb25cbiAgfSxcblxuICBtb2RlbHM6IHtcbiAgXHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlTW9kZWxcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFnKSB7XG5cdHZhciBBcHAgPSBnbG9iYWwuQXBwO1xuXG5cdEFwcC5jb2xsZWN0aW9uc1t0YWddID0gKFxuXHRcdEFwcC5jb2xsZWN0aW9uc1t0YWddIHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy5jb2xsZWN0aW9ucy5hcnRpY2xlcygpXG5cdCk7XG5cblx0QXBwLmNvbGxlY3Rpb25zW3RhZ10udGFnID0gdGFnO1xuXG5cdHJldHVybiBBcHAuY29sbGVjdGlvbnNbdGFnXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBtYWluLmpzIGN1cnJlbnRseSBvbmx5IGhhcyB0d28gcmVzcG9uc2liaWxpdGllcyxcbi8vIHRvIHJlYWR5IEFwcCBieSBpbmNsdWRpbmcgaXQgYW5kIGluaXRpYWxpemluZyBpdCBhZnRlciBkb2N1bWVudCByZWFkeS5cblxucmVxdWlyZSgnLi9hcHAuanMnKTtcblxuJChkb2N1bWVudCkub24oJ3JlYWR5JywgZnVuY3Rpb24oKXtcblx0Z2xvYmFsLkFwcC5pbml0aWFsaXplKCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGlkQXR0cmlidXRlOiAnSUQnXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcgPSByZXF1aXJlKCcuL2hlbHBlcnMvZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnLmpzJyk7XG5cdFxubW9kdWxlLmV4cG9ydHMgPSAgd2luZG93LkJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuXHRyb3V0ZXM6IHtcblx0XHQnJzogJ3Jvb3QnLFxuXHRcdCc6dGFnJzogJ2FydGljbGVzJyxcblx0XHQnOnRhZy86c2x1Zyc6ICdhcnRpY2xlJ1xuXHR9LFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIEFwcCA9IGdsb2JhbC5BcHA7XG5cdFx0XG5cdFx0dGhpcy5vbigncm91dGU6cm9vdCcgLGZ1bmN0aW9uKCl7XG5cblx0XHRcdC8vIENyZWF0aW5nIGFuZCBjYWNoaW5nIHRoZSB2aWV3IGlmIGl0IGlzIG5vdCBhbHJlYWR5IGNhY2hlZFxuXHRcdFx0QXBwLnZpZXdzLnJvb3QgPSBBcHAudmlld3Mucm9vdCB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3Mucm9vdCh7XG5cdFx0XHRcdGNvbnRhaW5lcjogQXBwLmVudHJ5UG9pbnRcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBUaGVuIHJlbmRlcmluZyB0aGUgdmlld1xuXHRcdFx0QXBwLnZpZXdzLnJvb3QucmVuZGVyKCk7XG5cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JvdXRlOmFydGljbGVzJyAsZnVuY3Rpb24odGFnKXtcblxuXHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcodGFnKTtcblxuXHRcdFx0Ly8gTm90IGNhY2hpbmcgdGhlIHZpZXcuIENvdWxkIGJlIGEgZnV0dXJlIGNoYW5nZSBpZiBob2xkaW5nIHN0YXRlIGZvciByZS12aXNpdHNcblx0XHRcdC8vIGJlY29tZXMgZGVzaXJhYmxlXG5cdFx0XHQobmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLmFydGljbGVzKHtcblx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvblxuXHRcdFx0fSlcblx0XHRcdC8vIHJlbmRlcmluZyBpbW1lZGlhdGVseSBhZnRlciwga2VlcHMgdGhlIGNhbGxzIHRvIGNhY2hlZC9ub24tY2FjaGVkIHZpZXdzIGNvbnNpc3RhbnRcblx0XHRcdCkucmVuZGVyKCk7XG5cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JvdXRlOmFydGljbGUnICxmdW5jdGlvbih0YWcsIHNsdWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXHRcdFx0Ly8gR2V0IHRoZSBmaXJzdCBtb2RlbCBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIGEgbWFjdGhpbmcgc2x1Z1xuXHRcdFx0Ly8gUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm8gbWF0Y2gsIHdoaWNoIHRoZSB2aWV3IHdpbGwgaGFuZGxlXG5cdFx0XHQobmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLmFydGljbGUoe1xuXHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuXHRcdFx0XHRzbHVnOiBzbHVnXG5cdFx0XHR9KVxuXHRcdFx0KS5yZW5kZXIoKTtcblx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0d2luZG93LkJhY2tib25lLmhpc3Rvcnkuc3RhcnQoKTtcblxuXHR9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IChcblt7XG5cdG5hbWU6ICdqYXZhc2NyaXB0J1xufSx7XG5cdG5hbWU6ICdiYWNrYm9uZS5qcydcbn0se1xuXHRuYW1lOiAnbm9kZS5qcydcbn0se1xuXHRuYW1lOiAnaW8uanMnXG59LHtcblx0bmFtZTogJ3J1YnknXG59LHtcblx0bmFtZTogJ3J1Ynktb24tcmFpbHMnXG59LHtcblx0bmFtZTogJ2VtYmVyLmpzJ1xufSx7XG5cdG5hbWU6ICdyZWFjdC5qcydcdFxufV0pOyIsInZhciBleHBvcnRzID0gKGZ1bmN0aW9uICgpIHsgXG5cbiB2YXIgSGFuZGxlYmFycyA9IHdpbmRvdy5IYW5kbGViYXJzOyBcblxudGhpc1tcIkpTVFwiXSA9IHRoaXNbXCJKU1RcIl0gfHwge307XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlLXByZXZpZXdcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8aDI+QXJ0aWNsZSBwcmV2aWV3PC9oMj5cIjtcbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgIDxoNCBjbGFzcz1cXFwiZXJyb3JcXFwiPk9vcHMhIFNvbWV0aGluZyB3ZW50IHdyb25nITwvaDQ+XFxuICA8cCBjbGFzcz1cXFwidHJ5LWFnYWluXFxcIj5UcnkgYWdhaW4/PC9wPlxcblxcblwiO1xuICB9LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmxvYWRpbmcgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNCwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDYsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiICAgIDxoND5Mb2FkaW5nLi4uPC9oND5cXG5cIjtcbiAgfSxcIjZcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDcsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgxMSwgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCI4XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCIgICAgICBcdDxkaXYgY2xhc3M9XFxcImFydGljbGVfX3dyYXBwZXIgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMudW5sZXNzLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2VsZWN0ZWQgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ1bmxlc3NcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDksIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcXCI+XFxuICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVxcXCJhcnRpY2xlXFxcIiBpZD1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zbHVnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zbHVnIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInNsdWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFydGljbGVfX2hlYWRlclxcXCI+XFxuICAgICAgICAgICAgICAgIDxoMT5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2gxPlxcbiAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX19jb250ZW50XFxcIj5cIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb250ZW50IHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb250ZW50IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImNvbnRlbnRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiPC9kaXY+XFxuICAgICAgICAgIDwvYXJ0aWNsZT5cXG4gICAgICAgIDwvZGl2PlxcblwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiBvdXQtb2YtZm9jdXNcIjtcbiAgfSxcIjExXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgICAgXHQ8aDI+QXJ0aWNsZSBub3QgZm91bmQ8L2gyPlxcblwiO1xuICB9LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5lcnJvcnMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZXNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0PGg0IGNsYXNzPVxcXCJlcnJvclxcXCI+T29wcyEgU29tZXRoaW5nIHdlbnQgd3JvbmchPC9oND5cXG5cdDxwIGNsYXNzPVxcXCJ0cnktYWdhaW5cXFwiPlRyeSBhZ2Fpbj88L3A+XFxuXFxuXCI7XG4gIH0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmxvYWRpbmcgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oNiwgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0XHQ8aDQ+TG9hZGluZy4uLjwvaDQ+XFxuXCI7XG4gIH0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm1vZGVscyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgxMiwgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcXG5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcdFx0XHQ8dWwgY2xhc3M9XFxcImFydGljbGVzLWxpc3RcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdDwvdWw+XFxuXCI7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF0dHJpYnV0ZXMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGxhbWJkYT10aGlzLmxhbWJkYSwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBidWZmZXIgPSBcIlx0XHRcdFx0XHQ8bGkgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ1xcXCI+XFxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cXFwiYXJ0aWNsZS1saXN0aW5nX19jb250YWluZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cXFwiYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoKHN0YWNrMSA9IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdXRob3IgOiBkZXB0aDApKSAhPSBudWxsID8gc3RhY2sxLmF2YXRhcl9VUkwgOiBzdGFjazEpLCBkZXB0aDApKVxuICAgICsgXCIpO1xcXCI+PC9kaXY+XFxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX2RldGFpbHNcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJ0cnVuY2F0ZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX3RpdGxlIHRydW5jYXRlXFxcIiBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoZGVwdGhzWzJdICE9IG51bGwgPyBkZXB0aHNbMl0udGFnIDogZGVwdGhzWzJdKSwgZGVwdGgwKSlcbiAgICArIFwiL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT4gXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF1dGhvciA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEwLCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHQ8L2xpPlxcblx0XHRcdFx0XHQ8aHI+XFxuXCI7XG59LFwiMTBcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cXFwiYnktbGluZSB0cnVuY2F0ZVxcXCI+Qnk6IDxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuYXV0aG9yX1VSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yX1VSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJhdXRob3JfVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT48L3A+XFxuXCI7XG59LFwiMTJcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0XHRcdDxoMj5ObyBhcnRpY2xlcyBmb3VuZDwvaDI+XFxuXCI7XG4gIH0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxoMj5SZXN1bHRzIGZvciAnXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50YWcgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRhZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0YWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiJzwvaDI+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5lcnJvcnMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMywgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXI7XG59LFwidXNlRGF0YVwiOnRydWUsXCJ1c2VEZXB0aHNcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJyb290XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0PGEgaHJlZj1cXFwiIy9cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cXG5cIjtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCI8aDI+Um9vdCBWaWV3PC9oMj5cXG5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGFncyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiByZXR1cm4gdGhpc1snSlNUJ107XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRlbDogJzxhcnRpY2xlPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cdFx0dGhpcy50YWcgPSBvcHRpb25zLnRhZztcblx0XHR0aGlzLnNsdWcgPSBvcHRpb25zLnNsdWc7XG5cdFx0dGhpcy5tb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IG9wdGlvbnMuc2x1Z30pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayBwLnRyeS1hZ2FpbicgOiAndGhpcy5nZXROZXdSZWNvcmRzJ1xuXHR9LFxuXHRnZXROZXdSZWNvcmRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG5cdFx0Y29uc29sZS5sb2coJ2dldCBuZXcnKTtcblxuXHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdGNvbGxlY3Rpb24uZmV0Y2goe1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG4gICAgICAgIC8vIGJ1dCB0aGUgcmVuZGVyIHdvdWxkIHN0aWxsIGJlIGNhbGxlZCBhbmQgdGFrZSBlZmZlY3QuXG4gICAgICAgIGlmIChmcmFnbWVudCA9PT0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQpIHtcblx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IHZpZXcuc2x1Z30pO1xuXHRcdFx0XHRcdHZpZXcucmVuZGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmlldy5yZW5kZXJFcnJvcigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fSxcblx0dG9SZW5kZXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR2YXIgdGVtcGxhdGVEYXRhID0gdGhpcy5tb2RlbCA/IHthcnRpY2xlOiB0aGlzLm1vZGVsLnRvSlNPTigpfSA6IHt9O1xuXG5cdFx0dGVtcGxhdGVEYXRhLmxvYWRpbmcgPSBvcHRpb25zLmxvYWRpbmc7XG5cdFx0dGVtcGxhdGVEYXRhLmVycm9ycyA9IG9wdGlvbnMuZXJyb3JzO1xuXG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZURhdGEpKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdmlldy5jb2xsZWN0aW9uO1xuXG5cdFx0Ly8gQ3VycmVudGx5IG9ubHkgZmV0Y2hpbmcgb24gcmVuZGVyIGlmIHRoZSBjb2xsZWN0aW9uIGlzIGVtcHR5LFxuICAgIC8vIHN1YnNlcXVlbnQgZmV0Y2hlcyBmb3IgbmV3IHJlY29yZHMgd291bGQgYmUgaGFuZGxlZCBzb21ld2hlcmUgb3RoZXIgdGhhbiBoZXJlXG5cdFx0aWYgKGNvbGxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuXG5cdFx0XHR0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cdFx0XHR0aGlzLmdldE5ld1JlY29yZHMoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgPyAkKG9wdGlvbnMuY29udGFpbmVyKSA6IGdsb2JhbC5BcHAudmlld3MubWFzdGVyLiRlbDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgcC50cnktYWdhaW4nIDogJ3RoaXMuZ2V0TmV3UmVjb3Jkcydcblx0fSxcblx0Z2V0TmV3UmVjb3JkczogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuXHRcdC8vIHRha2luZyB0aGUgY3VycmVudCBmcmFnbWVudCB0byBiZSBjaGVja2VkIGFmdGVyIHRoZSBmZXRjaC5cblx0XHR2YXIgZnJhZ21lbnQgPSB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudDtcblx0XHRjb2xsZWN0aW9uLmZldGNoKHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vIE9ubHkgY2FsbCByZW5kZXIgaWYgdGhlIHVybCBmcmFnbWVudCBpcyB0aGUgc2FtZSwgb3RoZXJ3aXNlIGEgdXNlciBtaWdodCBuYXZpZ2F0ZSB0byBhbm90aGVyIHJvdXRlLFxuXHRcdFx0XHQvLyBidXQgdGhlIHJlbmRlciB3b3VsZCBzdGlsbCBiZSBjYWxsZWQgYW5kIHRha2UgZWZmZWN0LlxuXHRcdFx0XHRpZiAoZnJhZ21lbnQgPT09IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50KSB7XG5cdFx0XHRcdFx0dmlldy5yZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9LFxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdG9wdGlvbnMubW9kZWxzID0gY29sbGVjdGlvbi5tb2RlbHM7XG5cdFx0b3B0aW9ucy50YWcgPSBjb2xsZWN0aW9uLnRhZztcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUob3B0aW9ucykpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB2aWV3LmNvbGxlY3Rpb247XG5cblx0XHQvLyBDdXJyZW50bHkgb25seSBmZXRjaGluZyBvbiByZW5kZXIgaWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHksXG5cdFx0Ly8gc3Vic2VxdWVudCBmZXRjaGVzIGZvciBuZXcgcmVjb3JkcyB3b3VsZCBiZSBoYW5kbGVkIHNvbWV3aGVyZSBvdGhlciB0aGFuIGhlcmVcblx0XHRpZiAoY29sbGVjdGlvbi5sZW5ndGggPCAxKSB7XG5cblx0XHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7bG9hZGluZzogdHJ1ZX0pKTtcblx0XHRcdHRoaXMuZ2V0TmV3UmVjb3JkcygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlckVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ2Vycm9ycycpO1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHQvLyBldmVudHM6IHt9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMuanMnKTtcbnZhciBzdWdnZXN0ZWRUYWdzID0gcmVxdWlyZSgnLi4vc3VnZ2VzdGVkVGFncycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxkaXY+JyxcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLnJvb3QsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe3RhZ3M6IHN1Z2dlc3RlZFRhZ3N9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyJdfQ==
