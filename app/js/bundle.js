(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var router = require('./router.js');
var templates = require('./templates.js');
var extensions = require('./extensions.js');

var App = {

  templates: templates,
  entryPoint: 'body .app',
  
  // Set up for cachable Backbone classes
  views: {},
  collections: {},
  models: {},

  extensions: extensions,

  initialize: function(){
    // this.views.master = new this.extensions.views.master();
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

var rootView = require('./views/root.js');
var articleView = require('./views/article.js');
var articlesView = require('./views/articles.js');

var articlesCollection = require('./collections/articles.js');

var articleModel = require('./models/article.js');

// Making Backbone class extensions available through App.extensions
// Mainly for testing, but also keeps the app layout a little neater.

module.exports = { 

  views: {
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
},{"./collections/articles.js":2,"./models/article.js":6,"./views/article.js":10,"./views/articles.js":11,"./views/root.js":12}],4:[function(require,module,exports){
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
				collection: collection,
				container: App.entryPoint
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
				slug: slug,
				container: App.entryPoint
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
	name: 'backbonejs'
},{
	name: 'nodejs'
},{
	name: 'iojs'
},{
	name: 'ruby'
},{
	name: 'rubyonrails'
},{
	name: 'emberjs'
},{
	name: 'reactjs'	
}]);
},{}],9:[function(require,module,exports){
var exports = (function () { 

 var Handlebars = window.Handlebars; 

this["JST"] = this["JST"] || {};

this["JST"]["article-preview"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Article preview</h2>";
  },"useData":true});

this["JST"]["article"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <h4>Loading...</h4>\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(8, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"with","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    	<div class=\"article__wrapper ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"unless","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n        <article class=\"article\" id=\""
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"article__header\">\n              <h1>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n            </div>\n\n            <div class=\"article__content\">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n        </article>\n      </div>\n";
},"6":function(depth0,helpers,partials,data) {
  return " out-of-focus";
  },"8":function(depth0,helpers,partials,data) {
  return "  	<h2>Article not found</h2>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loading : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

this["JST"]["articles"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "	<h4>Loading...</h4>\n";
  },"3":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"if","hash":{},"fn":this.program(4, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	\n\n";
},"4":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "		<ul class=\"articles-list\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\n";
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "\n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.attributes : depth0), {"name":"with","hash":{},"fn":this.program(6, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"6":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "				<li class=\"article-listing\">\n					<div class=\"article-listing__container\">\n						<div class=\"avatar\" style=\"background-image: url("
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.author : depth0)) != null ? stack1.avatar_URL : stack1), depth0))
    + ");\"></div>\n						<div class=\"article-listing__details\">\n							<div class=\"truncater\">\n								<a class=\"article-listing__title truncate\" href=\"#/"
    + escapeExpression(lambda((depths[2] != null ? depths[2].tag : depths[2]), depth0))
    + "/"
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a> \n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.author : depth0), {"name":"with","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "							</div>\n						</div>\n					</div>\n				</li>\n				<hr>\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "									<p class=\"by-line truncate\">By: <a href=\""
    + escapeExpression(((helper = (helper = helpers.author_URL || (depth0 != null ? depth0.author_URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"author_URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\"></a>"
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<h2>Results for '"
    + escapeExpression(((helper = (helper = helpers.tag || (depth0 != null ? depth0.tag : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tag","hash":{},"data":data}) : helper)))
    + "'</h2>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loading : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(3, data, depths),"data":data});
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
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: '<article>',

	template: templates.article,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);
		this.tag = options.tag;
		this.slug = options.slug;
		this.model = this.collection.findWhere({slug: options.slug});

		return this;
	},

	toRender: function (options) {
		options = (options || {});
		var templateData = this.model ? {article: this.model.toJSON()} : {};

		templateData.loading = options.loading;

		return this.$el.html(this.template(templateData));
	},

	render: function(){
		var view = this;
		var collection = this.collection;

		// Currently only fetching on render if the collection is empty,
    // subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {

			this.$container.html(this.toRender({loading: true}));

			// taking the current fragment to be checked after the fetch.
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
		}
		this.$container.html(this.toRender());

		return this;
	},
	renderError: function (error) {
		this.$container.html(this.toRender({error: error}));
	}

});
},{"../templates.js":9}],11:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({
	
	el: '<section>',

	template: templates.articles,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

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
		var collection = this.collection;

		// Currently only fetching on render if the collection is empty,
		// subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {

			this.$container.html(this.toRender({loading: true}));

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
		}
		this.$container.html(this.toRender());

		return this;
	},
	renderError: function (error) {
		this.$container.html(this.toRender({error: error}));
	}

});
},{"../templates.js":9}],12:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');
var suggestedTags = require('../suggestedTags');

module.exports = window.Backbone.View.extend({
	
	el: '<div>',

	template: templates.root,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

		return this;
	},

	toRender: function () {
		return this.$el.html(this.template({tags: suggestedTags}));
	},

	render: function(){
		this.$container.html(this.toRender());

		return this;
	}

});
},{"../suggestedTags":8,"../templates.js":9}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9yb290LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXIuanMnKTtcbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpO1xudmFyIGV4dGVuc2lvbnMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMuanMnKTtcblxudmFyIEFwcCA9IHtcblxuICB0ZW1wbGF0ZXM6IHRlbXBsYXRlcyxcbiAgZW50cnlQb2ludDogJ2JvZHkgLmFwcCcsXG4gIFxuICAvLyBTZXQgdXAgZm9yIGNhY2hhYmxlIEJhY2tib25lIGNsYXNzZXNcbiAgdmlld3M6IHt9LFxuICBjb2xsZWN0aW9uczoge30sXG4gIG1vZGVsczoge30sXG5cbiAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIC8vIHRoaXMudmlld3MubWFzdGVyID0gbmV3IHRoaXMuZXh0ZW5zaW9ucy52aWV3cy5tYXN0ZXIoKTtcbiAgXHR0aGlzLnJvdXRlciA9IG5ldyByb3V0ZXIodGhpcyk7XG4gIH1cbn07XG4vLyBBc3NpZ25pbmcgQXBwIHRvIHRoZSBnbG9iYWwgKHdpbmRvdylcbmdsb2JhbC5BcHAgPSBBcHA7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvYXJ0aWNsZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cbiAgbW9kZWw6IG1vZGVsLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICB0YWc6ICd3ZWItZGV2ZWxvcG1lbnQnLFxuICAvLyBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAvLyAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuICAvLyBcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG4gIC8vIH0sXG4gIHVybDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJ2h0dHBzOi8vcHVibGljLWFwaS53b3JkcHJlc3MuY29tL3Jlc3QvdjEuMS9yZWFkL3RhZ3MvJysgdGhpcy50YWcgKycvcG9zdHMnO1xuICB9LFxuICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHJldHVybiByZXNwb25zZS5wb3N0cztcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm9vdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Jvb3QuanMnKTtcbnZhciBhcnRpY2xlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZS5qcycpO1xudmFyIGFydGljbGVzVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWxzL2FydGljbGUuanMnKTtcblxuLy8gTWFraW5nIEJhY2tib25lIGNsYXNzIGV4dGVuc2lvbnMgYXZhaWxhYmxlIHRocm91Z2ggQXBwLmV4dGVuc2lvbnNcbi8vIE1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28ga2VlcHMgdGhlIGFwcCBsYXlvdXQgYSBsaXR0bGUgbmVhdGVyLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXG5cbiAgdmlld3M6IHtcbiAgXHRyb290IFx0XHRcdFx0XHRcdDogcm9vdFZpZXcsXG5cdFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZVZpZXcsXG5cdFx0YXJ0aWNsZXNcdFx0XHRcdDogYXJ0aWNsZXNWaWV3XG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgXHRhcnRpY2xlcyBcdFx0XHRcdDogYXJ0aWNsZXNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgbW9kZWxzOiB7XG4gIFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZU1vZGVsXG4gIH1cblxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhZykge1xuXHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblxuXHRBcHAuY29sbGVjdGlvbnNbdGFnXSA9IChcblx0XHRBcHAuY29sbGVjdGlvbnNbdGFnXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMuY29sbGVjdGlvbnMuYXJ0aWNsZXMoKVxuXHQpO1xuXG5cdEFwcC5jb2xsZWN0aW9uc1t0YWddLnRhZyA9IHRhZztcblxuXHRyZXR1cm4gQXBwLmNvbGxlY3Rpb25zW3RhZ107XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLy8gbWFpbi5qcyBjdXJyZW50bHkgb25seSBoYXMgdHdvIHJlc3BvbnNpYmlsaXRpZXMsXG4vLyB0byByZWFkeSBBcHAgYnkgaW5jbHVkaW5nIGl0IGFuZCBpbml0aWFsaXppbmcgaXQgYWZ0ZXIgZG9jdW1lbnQgcmVhZHkuXG5cbnJlcXVpcmUoJy4vYXBwLmpzJyk7XG5cbiQoZG9jdW1lbnQpLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCl7XG5cdGdsb2JhbC5BcHAuaW5pdGlhbGl6ZSgpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXHRpZEF0dHJpYnV0ZTogJ0lEJ1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnID0gcmVxdWlyZSgnLi9oZWxwZXJzL2ZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZy5qcycpO1xuXHRcbm1vZHVsZS5leHBvcnRzID0gIHdpbmRvdy5CYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblx0cm91dGVzOiB7XG5cdFx0Jyc6ICdyb290Jyxcblx0XHQnOnRhZyc6ICdhcnRpY2xlcycsXG5cdFx0Jzp0YWcvOnNsdWcnOiAnYXJ0aWNsZSdcblx0fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuXHRcdHZhciBBcHAgPSBnbG9iYWwuQXBwO1xuXHRcdFxuXHRcdHRoaXMub24oJ3JvdXRlOnJvb3QnICxmdW5jdGlvbigpe1xuXG5cdFx0XHQvLyBDcmVhdGluZyBhbmQgY2FjaGluZyB0aGUgdmlldyBpZiBpdCBpcyBub3QgYWxyZWFkeSBjYWNoZWRcblx0XHRcdEFwcC52aWV3cy5yb290ID0gQXBwLnZpZXdzLnJvb3QgfHwgbmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLnJvb3Qoe1xuXHRcdFx0XHRjb250YWluZXI6IEFwcC5lbnRyeVBvaW50XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVGhlbiByZW5kZXJpbmcgdGhlIHZpZXdcblx0XHRcdEFwcC52aWV3cy5yb290LnJlbmRlcigpO1xuXG5cdFx0fSk7XG5cblx0XHR0aGlzLm9uKCdyb3V0ZTphcnRpY2xlcycgLGZ1bmN0aW9uKHRhZyl7XG5cblx0XHRcdHZhciBjb2xsZWN0aW9uID0gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZyk7XG5cblx0XHRcdC8vIE5vdCBjYWNoaW5nIHRoZSB2aWV3LiBDb3VsZCBiZSBhIGZ1dHVyZSBjaGFuZ2UgaWYgaG9sZGluZyBzdGF0ZSBmb3IgcmUtdmlzaXRzXG5cdFx0XHQvLyBiZWNvbWVzIGRlc2lyYWJsZVxuXHRcdFx0KG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5hcnRpY2xlcyh7XG5cdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sXG5cdFx0XHRcdGNvbnRhaW5lcjogQXBwLmVudHJ5UG9pbnRcblx0XHRcdH0pXG5cdFx0XHQvLyByZW5kZXJpbmcgaW1tZWRpYXRlbHkgYWZ0ZXIsIGtlZXBzIHRoZSBjYWxscyB0byBjYWNoZWQvbm9uLWNhY2hlZCB2aWV3cyBjb25zaXN0YW50XG5cdFx0XHQpLnJlbmRlcigpO1xuXG5cdFx0fSk7XG5cblx0XHR0aGlzLm9uKCdyb3V0ZTphcnRpY2xlJyAsZnVuY3Rpb24odGFnLCBzbHVnKXtcblxuXHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcodGFnKTtcblx0XHRcdC8vIEdldCB0aGUgZmlyc3QgbW9kZWwgaW4gdGhlIGNvbGxlY3Rpb24gd2l0aCBhIG1hY3RoaW5nIHNsdWdcblx0XHRcdC8vIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vIG1hdGNoLCB3aGljaCB0aGUgdmlldyB3aWxsIGhhbmRsZVxuXHRcdFx0KG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5hcnRpY2xlKHtcblx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbixcblx0XHRcdFx0c2x1Zzogc2x1Zyxcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSlcblx0XHRcdCkucmVuZGVyKCk7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cblx0fVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSAoXG5be1xuXHRuYW1lOiAnamF2YXNjcmlwdCdcbn0se1xuXHRuYW1lOiAnYmFja2JvbmVqcydcbn0se1xuXHRuYW1lOiAnbm9kZWpzJ1xufSx7XG5cdG5hbWU6ICdpb2pzJ1xufSx7XG5cdG5hbWU6ICdydWJ5J1xufSx7XG5cdG5hbWU6ICdydWJ5b25yYWlscydcbn0se1xuXHRuYW1lOiAnZW1iZXJqcydcbn0se1xuXHRuYW1lOiAncmVhY3RqcydcdFxufV0pOyIsInZhciBleHBvcnRzID0gKGZ1bmN0aW9uICgpIHsgXG5cbiB2YXIgSGFuZGxlYmFycyA9IHdpbmRvdy5IYW5kbGViYXJzOyBcblxudGhpc1tcIkpTVFwiXSA9IHRoaXNbXCJKU1RcIl0gfHwge307XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlLXByZXZpZXdcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8aDI+QXJ0aWNsZSBwcmV2aWV3PC9oMj5cIjtcbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgIDxoND5Mb2FkaW5nLi4uPC9oND5cXG5cIjtcbiAgfSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDQsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmFydGljbGUgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg1LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcIjVcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIiAgICBcdDxkaXYgY2xhc3M9XFxcImFydGljbGVfX3dyYXBwZXIgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMudW5sZXNzLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2VsZWN0ZWQgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ1bmxlc3NcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDYsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcXCI+XFxuICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cXFwiYXJ0aWNsZVxcXCIgaWQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXJ0aWNsZV9faGVhZGVyXFxcIj5cXG4gICAgICAgICAgICAgIDxoMT5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2gxPlxcbiAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFydGljbGVfX2NvbnRlbnRcXFwiPlwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmNvbnRlbnQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNvbnRlbnQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29udGVudFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCI8L2Rpdj5cXG4gICAgICAgIDwvYXJ0aWNsZT5cXG4gICAgICA8L2Rpdj5cXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgb3V0LW9mLWZvY3VzXCI7XG4gIH0sXCI4XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgIFx0PGgyPkFydGljbGUgbm90IGZvdW5kPC9oMj5cXG5cIjtcbiAgfSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubG9hZGluZyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMywgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgcmV0dXJuIHN0YWNrMTsgfVxuICBlbHNlIHsgcmV0dXJuICcnOyB9XG4gIH0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZXNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0PGg0PkxvYWRpbmcuLi48L2g0PlxcblwiO1xuICB9LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFxcblxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlx0XHQ8dWwgY2xhc3M9XFxcImFydGljbGVzLWxpc3RcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg1LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHQ8L3VsPlxcblwiO1xufSxcIjVcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdHRyaWJ1dGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNiwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBsYW1iZGE9dGhpcy5sYW1iZGEsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYnVmZmVyID0gXCJcdFx0XHRcdDxsaSBjbGFzcz1cXFwiYXJ0aWNsZS1saXN0aW5nXFxcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cXFwiYXJ0aWNsZS1saXN0aW5nX19jb250YWluZXJcXFwiPlxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImF2YXRhclxcXCIgc3R5bGU9XFxcImJhY2tncm91bmQtaW1hZ2U6IHVybChcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbihsYW1iZGEoKChzdGFjazEgPSAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSkgIT0gbnVsbCA/IHN0YWNrMS5hdmF0YXJfVVJMIDogc3RhY2sxKSwgZGVwdGgwKSlcbiAgICArIFwiKTtcXFwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fZGV0YWlsc1xcXCI+XFxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJ0cnVuY2F0ZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8YSBjbGFzcz1cXFwiYXJ0aWNsZS1saXN0aW5nX190aXRsZSB0cnVuY2F0ZVxcXCIgaHJlZj1cXFwiIy9cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbihsYW1iZGEoKGRlcHRoc1syXSAhPSBudWxsID8gZGVwdGhzWzJdLnRhZyA6IGRlcHRoc1syXSksIGRlcHRoMCkpXG4gICAgKyBcIi9cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnNsdWcgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNsdWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwic2x1Z1wiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+IFxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdXRob3IgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PC9saT5cXG5cdFx0XHRcdDxocj5cXG5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0XHRcdDxwIGNsYXNzPVxcXCJieS1saW5lIHRydW5jYXRlXFxcIj5CeTogPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5hdXRob3JfVVJMIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdXRob3JfVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImF1dGhvcl9VUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PC9hPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvcD5cXG5cIjtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxoMj5SZXN1bHRzIGZvciAnXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50YWcgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRhZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0YWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiJzwvaDI+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sb2FkaW5nIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcInVzZURhdGFcIjp0cnVlLFwidXNlRGVwdGhzXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wicm9vdFwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCJcdDxhIGhyZWY9XFxcIiMvXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+XFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiPGgyPlJvb3QgVmlldzwvaDI+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRhZ3MgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4gcmV0dXJuIHRoaXNbJ0pTVCddO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0ZWw6ICc8YXJ0aWNsZT4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMuYXJ0aWNsZSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cdFx0dGhpcy50YWcgPSBvcHRpb25zLnRhZztcblx0XHR0aGlzLnNsdWcgPSBvcHRpb25zLnNsdWc7XG5cdFx0dGhpcy5tb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IG9wdGlvbnMuc2x1Z30pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0dG9SZW5kZXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR2YXIgdGVtcGxhdGVEYXRhID0gdGhpcy5tb2RlbCA/IHthcnRpY2xlOiB0aGlzLm1vZGVsLnRvSlNPTigpfSA6IHt9O1xuXG5cdFx0dGVtcGxhdGVEYXRhLmxvYWRpbmcgPSBvcHRpb25zLmxvYWRpbmc7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRlbXBsYXRlRGF0YSkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cblx0XHQvLyBDdXJyZW50bHkgb25seSBmZXRjaGluZyBvbiByZW5kZXIgaWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHksXG4gICAgLy8gc3Vic2VxdWVudCBmZXRjaGVzIGZvciBuZXcgcmVjb3JkcyB3b3VsZCBiZSBoYW5kbGVkIHNvbWV3aGVyZSBvdGhlciB0aGFuIGhlcmVcblx0XHRpZiAoY29sbGVjdGlvbi5sZW5ndGggPCAxKSB7XG5cblx0XHRcdHRoaXMuJGNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cblx0XHRcdC8vIHRha2luZyB0aGUgY3VycmVudCBmcmFnbWVudCB0byBiZSBjaGVja2VkIGFmdGVyIHRoZSBmZXRjaC5cblx0XHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdFx0Y29sbGVjdGlvbi5mZXRjaCh7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG4gICAgICAgICAgLy8gYnV0IHRoZSByZW5kZXIgd291bGQgc3RpbGwgYmUgY2FsbGVkIGFuZCB0YWtlIGVmZmVjdC5cbiAgICAgICAgICBpZiAoZnJhZ21lbnQgPT09IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50KSB7XG5cdFx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IHZpZXcuc2x1Z30pO1xuXHRcdFx0XHRcdFx0dmlldy5yZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZpZXcucmVuZGVyRXJyb3IoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3I6IGVycm9yfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdG9wdGlvbnMubW9kZWxzID0gY29sbGVjdGlvbi5tb2RlbHM7XG5cdFx0b3B0aW9ucy50YWcgPSBjb2xsZWN0aW9uLnRhZztcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUob3B0aW9ucykpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cblx0XHQvLyBDdXJyZW50bHkgb25seSBmZXRjaGluZyBvbiByZW5kZXIgaWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHksXG5cdFx0Ly8gc3Vic2VxdWVudCBmZXRjaGVzIGZvciBuZXcgcmVjb3JkcyB3b3VsZCBiZSBoYW5kbGVkIHNvbWV3aGVyZSBvdGhlciB0aGFuIGhlcmVcblx0XHRpZiAoY29sbGVjdGlvbi5sZW5ndGggPCAxKSB7XG5cblx0XHRcdHRoaXMuJGNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cblx0XHRcdC8vIHRha2luZyB0aGUgY3VycmVudCBmcmFnbWVudCB0byBiZSBjaGVja2VkIGFmdGVyIHRoZSBmZXRjaC5cblx0XHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdFx0Y29sbGVjdGlvbi5mZXRjaCh7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG5cdFx0XHRcdFx0Ly8gYnV0IHRoZSByZW5kZXIgd291bGQgc3RpbGwgYmUgY2FsbGVkIGFuZCB0YWtlIGVmZmVjdC5cblx0XHRcdFx0XHRpZiAoZnJhZ21lbnQgPT09IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50KSB7XG5cdFx0XHRcdFx0XHR2aWV3LnJlbmRlcigpO1x0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3I6IGVycm9yfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xudmFyIHN1Z2dlc3RlZFRhZ3MgPSByZXF1aXJlKCcuLi9zdWdnZXN0ZWRUYWdzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPGRpdj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMucm9vdCxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe3RhZ3M6IHN1Z2dlc3RlZFRhZ3N9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuJGNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTsiXX0=
