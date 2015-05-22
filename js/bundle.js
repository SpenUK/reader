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
    this.views.header = new this.extensions.views.header({el: 'header'});
  	this.router = new router(this);

  }
};
// Assigning App to the global (window)
global.App = App;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./extensions.js":3,"./router.js":7,"./templates.js":9}],2:[function(require,module,exports){
(function (global){
'use strict';

var model = require('../models/article.js');

module.exports = window.Backbone.Collection.extend({

  model: model,
  isLoading: false,
  tag: 'web-development',

  // initialize: function(){
  //   return this;
  // },

  setTag: function(tag) {
    this.tag = tag;
    global.App.collections[this.tag] = this;
    return this;
  },

  url: function(){
    return 'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ this.tag +'/posts';
  },

  parse: function(response){
    return response.posts;
  },

  getNextModel: function(model){
    var currentIndex = this.indexOf(model);
    if (currentIndex < 0) { return false; }

    return this.at((currentIndex +1 > this.length -1)?  false : currentIndex + 1);
  },

  getPrevModel: function(model){
    var currentIndex = this.indexOf(model);

    return this.at((currentIndex -1 < 0) ? false : currentIndex - 1);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../models/article.js":6}],3:[function(require,module,exports){
'use strict';

var masterView = require('./views/master.js');
var headerView = require('./views/header.js');
var searchBarView = require('./views/search-bar.js');
var breadcrumbsView = require('./views/breadcrumbs.js');

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
    header          : headerView,
  	root 						: rootView,
		article 				: articleView,
		articles				: articlesView,
    searchBar       : searchBarView,
    breadcrumbs     : breadcrumbsView
  },

  collections: {
  	articles 				: articlesCollection
  },

  models: {
  	article 				: articleModel
  }

};
},{"./collections/articles.js":2,"./models/article.js":6,"./views/article.js":10,"./views/articles.js":11,"./views/breadcrumbs.js":12,"./views/header.js":13,"./views/master.js":14,"./views/root.js":15,"./views/search-bar.js":16}],4:[function(require,module,exports){
(function (global){
'use strict';

module.exports = function (tag) {
	var App = global.App;

	return App.collections[tag] || (new App.extensions.collections.articles()).setTag(tag);
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

		this.on('route', function(){
			// Every route change is to emit data, for now just the fragment so that breadcrumbs can be updated
			window.Backbone.trigger('ui:updateBreadcrumbs', {fragment: window.Backbone.history.fragment});
		});
		
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

			var cacheName = tag;

			App.views[cacheName] = (App.views[cacheName] || new App.extensions.views.articles({
							collection: collection
						}));

			App.views[cacheName].render();


		});

		this.on('route:article' ,function(tag, slug){

			var collection = findOrCreateCollectionByTag(tag);

			var cacheName = tag+':'+slug;

			App.views[cacheName] = (App.views[cacheName] || new App.extensions.views.article({
								collection: collection,
								slug: slug
						}));

			App.views[cacheName].render();

			
		});

		window.Backbone.history.start();

	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./helpers/findOrCreateCollectionByTag.js":4}],8:[function(require,module,exports){
module.exports = (
[{
	name: 'javascript',
	color: {
		r: '254',
		g: '218',
		b: '62'
	}
},{
	name: 'backbone-js',
	color: {
		r: '0',
		g: '113',
		b: '181'
	}
},{
	name: 'node-js',
	color: {
		r: '128',
		g: '189',
		b: '1'
	}
},{
	name: 'io-js',
	color: {
		r: '41',
		g: '40',
		b: '41'
	}
},{
	name: 'ruby',
	color: {
		r: '204',
		g: '52',
		b: '45'
	}
},{
	name: 'ruby-on-rails',
	color: {
		r: '152',
		g: '26',
		b: '33'
	}
},{
	name: 'ember-js',
	color: {
		r: '242',
		g: '56',
		b: '24'
	}
},{
	name: 'react-js'	,
	color: {
		r: '97',
		g: '218',
		b: '251'
	}
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
  return "    <h4><i class=\"fa fa-spin fa-refresh\"></i> Loading...</h4>\n";
  },"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.program(13, data),"data":data});
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
  buffer += "\">\n          <article class=\"article paper\" id=\""
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\">\n              <div class=\"article__header\">\n                <h1>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n                \n                  <p class=\"by-line truncate\">By: \n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.author : depth0), {"name":"with","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "                    <a href=\""
    + escapeExpression(((helper = (helper = helpers.URL || (depth0 != null ? depth0.URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\"><i class=\"fa fa-wordpress\" alt=\"View at wordpress\"></i></a>\n                  </p>\n\n              </div>\n\n              <div class=\"article__content\">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n          </article>\n        </div>\n";
},"9":function(depth0,helpers,partials,data) {
  return " out-of-focus";
  },"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                      <a href=\""
    + escapeExpression(((helper = (helper = helpers.URL || (depth0 != null ? depth0.URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "</a> \n";
},"13":function(depth0,helpers,partials,data) {
  return "    	<h2>Article not found</h2>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.errors : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

this["JST"]["articles"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "	<h4 class=\"error\">Oops! Something went wrong!</h4>\n	<p class=\"try-again\">Try again?</p>\n\n";
  },"3":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.loading : depth0), {"name":"if","hash":{},"fn":this.program(4, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"4":function(depth0,helpers,partials,data) {
  return "		<h4><i class=\"fa fa-spin fa-refresh\"></i> Loading...</h4>\n";
  },"6":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"if","hash":{},"fn":this.program(7, data, depths),"inverse":this.program(14, data, depths),"data":data});
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
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "					<li class=\"article-listing paper\">\n						<div class=\"article-listing__container\">\n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.author : depth0), {"name":"with","hash":{},"fn":this.program(10, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "							<div class=\"article-listing__details\">\n								<div class=\"truncater\">\n									<a class=\"article-listing__title truncate\" href=\"#/"
    + escapeExpression(lambda((depths[2] != null ? depths[2].tag : depths[2]), depth0))
    + "/"
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a> \n";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.author : depth0), {"name":"with","hash":{},"fn":this.program(12, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "								</div>\n							</div>\n						</div>\n					</li>\n";
},"10":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "							<a href=\""
    + escapeExpression(((helper = (helper = helpers.URL || (depth0 != null ? depth0.URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\"><div class=\"avatar\" style=\"background-image: url("
    + escapeExpression(((helper = (helper = helpers.avatar_URL || (depth0 != null ? depth0.avatar_URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"avatar_URL","hash":{},"data":data}) : helper)))
    + ");\" alt=\""
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "\"></div></a>\n";
},"12":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "										<p class=\"by-line truncate\">By: <a href=\""
    + escapeExpression(((helper = (helper = helpers.URL || (depth0 != null ? depth0.URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "</a></p>\n";
},"14":function(depth0,helpers,partials,data) {
  return "			<h2>No articles found</h2>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<h2>Results for '"
    + escapeExpression(((helper = (helper = helpers.tag || (depth0 != null ? depth0.tag : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tag","hash":{},"data":data}) : helper)))
    + "'</h2>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.errors : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(3, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true});

this["JST"]["breadcrumbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">title</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<span class=\"breadcrumbs__container\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.breadcrumbs : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>";
},"useData":true});

this["JST"]["header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"grid-container header__container\">\n	<div class=\"header__content\">\n\n		<a class=\"go-prev hide\">\n			<i class=\"fa fa-chevron-left\"></i>\n		</a>\n\n		<a class=\"go-next hide\">\n			<i class=\"fa fa-chevron-right\"></i>\n		</a>\n\n		<nav class=\"controls\">\n			<a href=\"#\"><h1 class=\"logo\">WP Reader</h1></a>\n		</nav>\n		\n	</div>\n</div>";
},"useData":true});

this["JST"]["root"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<li class=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n			<a href=\"#/"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n		</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<section class=\"search-bar\"></section>\n\n<h2>Suggested Tags</h2>\n\n<ul class=\"tags\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tags : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>";
},"useData":true});

this["JST"]["search-bar"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "	<div class=\"grid-container\">\n		<div class=\"grid-row\">\n			<form class=\"search-bar__form\">\n				<label for=\"search\"><h2>Search by tag</h2></label>\n				<div class=\"search-bar__wrapper\">\n						<input type=\"text\" class=\"search-bar__search-input\" name=\"search\" placeholder=\"Example: Javascript\">			\n						<button class=\"submit\" value=\"Search\"><i class=\"fa fa-search\"></i><i class=\"fa fa-refresh fa-spin\"></i></button>\n				</div>\n			</form>\n		</div>\n	</div>\n";
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

		var fragment = window.Backbone.history.fragment;
		collection.fetch({
			success: function(){
				// Only call render if the url fragment is the same, otherwise a user might navigate to another route,
        // but the render would still be called and take effect.
        if (fragment === window.Backbone.history.fragment) {
					view.model = collection.findWhere({slug: view.slug});
					view.render();
					view.triggerPrevAndNextUpdates();
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

			// Triggering these events without a link param causes the components to be hidden
			this.triggerPrevAndNextUpdates();

			// this.container.html(this.toRender({loading: true}));
			this.renderLoading();
			this.getNewRecords();

			return this;
		}

		// Triggering events that will update ui components
		this.triggerPrevAndNextUpdates();
		// window.Backbone.trigger('ui:updatePrev', {link: this.prevRoute()});
		// window.Backbone.trigger('ui:updateNext', {link: this.nextRoute()});

		// this.container.html(this.toRender());
		global.App.views.master.renderToAppView( this, this.toRender());

		return this;
	},

	renderLoading: function () {
		global.App.views.master.renderToAppView( this, this.toRender({loading: true}));
		return this;
	},
	renderError: function () {
		global.App.views.master.renderToAppView( this, this.toRender({errors: true}));
		return this;
	},

	triggerPrevAndNextUpdates: function(){
		window.Backbone.trigger('ui:updatePrev', {link: this.prevRoute()});
		window.Backbone.trigger('ui:updateNext', {link: this.nextRoute()});
	},

	getNextModel: function(){
		return this.collection.getNextModel(this.model);
	},

	getPrevModel: function(){
		return this.collection.getPrevModel(this.model);
	},

	nextRoute: function(){
		var model = this.getNextModel();
		return model? '#/'+ this.collection.tag +'/' + model.get('slug') : false;
	},

	prevRoute: function(){
		var model = this.getPrevModel();
		return model? '#/'+ this.collection.tag +'/' + model.get('slug') : false;
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
		'click p.try-again' : 'getNewRecords'
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
				if (fragment !== window.Backbone.history.fragment) { return false; }

				if (collection.length) {
					view.render();
				} else {
					view.renderError();
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

		window.Backbone.trigger('ui:clearPrevAndNext');

		// Currently only fetching on render if the collection is empty,
		// subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {
			this.renderLoading();
			
			this.getNewRecords();

			return this;
		}
		global.App.views.master.renderToAppView( this, this.toRender());

		return this;
	},
	renderLoading: function () {
		global.App.views.master.renderToAppView( this, this.toRender({loading: true}));
		return this;
	},
	renderError: function () {
		global.App.views.master.renderToAppView( this, this.toRender({errors: true}));
		return this;
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../templates.js":9}],12:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	template: templates.breadcrumbs,

	initialize: function(options){
		options = (options || {});

		this.breadcrumbs = options.breadcrumbs;

		return this;
	},

	events: {
	},

	render: function(options){
		options = (options || {});

		options.breadcrumbs = this.breadcrumbs

		this.$el.html(this.template(options));

		return this;
	}

});
},{"../templates.js":9}],13:[function(require,module,exports){
(function (global){
'use strict';

var templates = require('../templates.js');
var  _ = window._;

module.exports = window.Backbone.View.extend({
	template: templates.header,
	initialize: function () {
		this.render();
		this.setListeners();
	},
	toRender: function(){
		return this.template();
	},
	render: function () {
		this.$el.html(this.toRender());
	},
	updateUiPrev: function(options){
    options = options || {};

  	var $prev = this.$el.find('.go-prev');
  	if (options.link) {
  		$prev.removeClass('hide').attr('href', options.link);
  	} else {
  		$prev.addClass('hide').removeAttr('href');
  	}
  },
  updateUiNext: function(options){
    options = options || {};

  	var $next = this.$el.find('.go-next');
  	if (options.link) {
  		$next.removeClass('hide').attr('href', options.link);
  	} else {
  		$next.addClass('hide').removeAttr('href');
  	}
  },
  updateBreadcrumbs: function (options) {
  	options = options || {};
  	var fragment = options.fragment.replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
  	var crumbs = _.filter(fragment.split('/'), function(s){
  		return s.length; // ensuring that no 0 length strings pass through
  	});

  	(new global.App.extensions.views.breadcrumbs({
  		el: 'header .breadcrumbs',
  		breadcrumbs: crumbs
  	})).render();

  	return this;
  },
	setListeners: function(){
		// 
		this.listenTo(window.Backbone, 'ui:updatePrev', this.updateUiPrev);
		this.listenTo(window.Backbone, 'ui:updateNext', this.updateUiNext);
		this.listenTo(window.Backbone, 'ui:clearPrevAndNext', function(){
			this.updateUiPrev();
			this.updateUiNext();
		});

		this.listenTo(window.Backbone, 'ui:updateBreadcrumbs', this.updateBreadcrumbs);
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../templates.js":9}],14:[function(require,module,exports){
'use strict';

module.exports = window.Backbone.View.extend({
	renderToAppView: function(view, el){
		this.$el.empty().append(el);
		view.delegateEvents(view.events);
	}
});
},{}],15:[function(require,module,exports){
(function (global){
'use strict';

var templates = require('../templates.js');
var suggestedTags = require('../suggestedTags');

var SearchBar = require('./search-bar.js');

module.exports = window.Backbone.View.extend({
	
	el: '<div>',

	template: templates.root,

	initialize: function(options){
		options = (options || {});
		this.container = options.container ? $(options.container) : global.App.views.master.$el;

		return this;
	},

	toRender: function () {
		window.Backbone.trigger('ui:clearPrevAndNext');

		return this.$el.html(this.template({tags: suggestedTags}));
	},

	render: function(){
		// this.container.html(this.toRender());

		global.App.views.master.renderToAppView( this, this.toRender());

		(new SearchBar()).render();

		return this;
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../suggestedTags":8,"../templates.js":9,"./search-bar.js":16}],16:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: 'section.search-bar',

	template: templates['search-bar'],

	initialize: function(options){
		options = (options || {});

		return this;
	},

	events: {
		'submit form.search-bar__form' : 'handleSearch'
	},
	// Unimplemented
	// Event: 'keyup .search-bar__search-input'
	inputFinished: function(){
		clearTimeout(this.typeTimeout);
		this.typeTimeout = setTimeout(function(){
			// Delayed keyup functionality
		}, 1000);
		
	},

	handleSearch: function(e){
		e.preventDefault();

		// val isn't so rubust - improve this.
		var val = $(e.target).find('input').val().trim();
		if (!val.length) { return false; }

		// Process val with regex? make sure that it's url safe.	
		window.Backbone.history.navigate(val.split(' ')[0].trim(), {trigger: true});
	},

	render: function(options){
		options = (options || {});

		this.$el.html(this.template());

		return this;
	}

});
},{"../templates.js":9}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9icmVhZGNydW1icy5qcyIsImFwcC9qcy92aWV3cy9oZWFkZXIuanMiLCJhcHAvanMvdmlld3MvbWFzdGVyLmpzIiwiYXBwL2pzL3ZpZXdzL3Jvb3QuanMiLCJhcHAvanMvdmlld3Mvc2VhcmNoLWJhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXIuanMnKTtcbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpO1xudmFyIGV4dGVuc2lvbnMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMuanMnKTtcblxudmFyIEFwcCA9IHtcblxuICB0ZW1wbGF0ZXM6IHRlbXBsYXRlcyxcbiAgZW50cnlQb2ludDogJy5hcHAnLFxuICBcbiAgLy8gU2V0IHVwIGZvciBjYWNoYWJsZSBCYWNrYm9uZSBjbGFzc2VzXG4gIHZpZXdzOiB7fSxcbiAgY29sbGVjdGlvbnM6IHt9LFxuICBtb2RlbHM6IHt9LFxuXG4gIGV4dGVuc2lvbnM6IGV4dGVuc2lvbnMsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnZpZXdzLm1hc3RlciA9IG5ldyB0aGlzLmV4dGVuc2lvbnMudmlld3MubWFzdGVyKHtlbDogdGhpcy5lbnRyeVBvaW50fSk7XG4gICAgdGhpcy52aWV3cy5oZWFkZXIgPSBuZXcgdGhpcy5leHRlbnNpb25zLnZpZXdzLmhlYWRlcih7ZWw6ICdoZWFkZXInfSk7XG4gIFx0dGhpcy5yb3V0ZXIgPSBuZXcgcm91dGVyKHRoaXMpO1xuXG4gIH1cbn07XG4vLyBBc3NpZ25pbmcgQXBwIHRvIHRoZSBnbG9iYWwgKHdpbmRvdylcbmdsb2JhbC5BcHAgPSBBcHA7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvYXJ0aWNsZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cbiAgbW9kZWw6IG1vZGVsLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICB0YWc6ICd3ZWItZGV2ZWxvcG1lbnQnLFxuXG4gIC8vIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gIC8vICAgcmV0dXJuIHRoaXM7XG4gIC8vIH0sXG5cbiAgc2V0VGFnOiBmdW5jdGlvbih0YWcpIHtcbiAgICB0aGlzLnRhZyA9IHRhZztcbiAgICBnbG9iYWwuQXBwLmNvbGxlY3Rpb25zW3RoaXMudGFnXSA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdXJsOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAnaHR0cHM6Ly9wdWJsaWMtYXBpLndvcmRwcmVzcy5jb20vcmVzdC92MS4xL3JlYWQvdGFncy8nKyB0aGlzLnRhZyArJy9wb3N0cyc7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICByZXR1cm4gcmVzcG9uc2UucG9zdHM7XG4gIH0sXG5cbiAgZ2V0TmV4dE1vZGVsOiBmdW5jdGlvbihtb2RlbCl7XG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG4gICAgaWYgKGN1cnJlbnRJbmRleCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICByZXR1cm4gdGhpcy5hdCgoY3VycmVudEluZGV4ICsxID4gdGhpcy5sZW5ndGggLTEpPyAgZmFsc2UgOiBjdXJyZW50SW5kZXggKyAxKTtcbiAgfSxcblxuICBnZXRQcmV2TW9kZWw6IGZ1bmN0aW9uKG1vZGVsKXtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcblxuICAgIHJldHVybiB0aGlzLmF0KChjdXJyZW50SW5kZXggLTEgPCAwKSA/IGZhbHNlIDogY3VycmVudEluZGV4IC0gMSk7XG4gIH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFzdGVyVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFzdGVyLmpzJyk7XG52YXIgaGVhZGVyVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvaGVhZGVyLmpzJyk7XG52YXIgc2VhcmNoQmFyVmlldyA9IHJlcXVpcmUoJy4vdmlld3Mvc2VhcmNoLWJhci5qcycpO1xudmFyIGJyZWFkY3J1bWJzVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYnJlYWRjcnVtYnMuanMnKTtcblxudmFyIHJvb3RWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9yb290LmpzJyk7XG52YXIgYXJ0aWNsZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGUuanMnKTtcbnZhciBhcnRpY2xlc1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlc0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlTW9kZWwgPSByZXF1aXJlKCcuL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbi8vIE1ha2luZyBCYWNrYm9uZSBjbGFzcyBleHRlbnNpb25zIGF2YWlsYWJsZSB0aHJvdWdoIEFwcC5leHRlbnNpb25zXG4vLyBNYWlubHkgZm9yIHRlc3RpbmcsIGJ1dCBhbHNvIGtlZXBzIHRoZSBhcHAgbGF5b3V0IGEgbGl0dGxlIG5lYXRlci5cblxubW9kdWxlLmV4cG9ydHMgPSB7IFxuXG4gIHZpZXdzOiB7XG4gICAgbWFzdGVyICAgICAgICAgIDogbWFzdGVyVmlldyxcbiAgICBoZWFkZXIgICAgICAgICAgOiBoZWFkZXJWaWV3LFxuICBcdHJvb3QgXHRcdFx0XHRcdFx0OiByb290Vmlldyxcblx0XHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlVmlldyxcblx0XHRhcnRpY2xlc1x0XHRcdFx0OiBhcnRpY2xlc1ZpZXcsXG4gICAgc2VhcmNoQmFyICAgICAgIDogc2VhcmNoQmFyVmlldyxcbiAgICBicmVhZGNydW1icyAgICAgOiBicmVhZGNydW1ic1ZpZXdcbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICBcdGFydGljbGVzIFx0XHRcdFx0OiBhcnRpY2xlc0NvbGxlY3Rpb25cbiAgfSxcblxuICBtb2RlbHM6IHtcbiAgXHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlTW9kZWxcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFnKSB7XG5cdHZhciBBcHAgPSBnbG9iYWwuQXBwO1xuXG5cdHJldHVybiBBcHAuY29sbGVjdGlvbnNbdGFnXSB8fCAobmV3IEFwcC5leHRlbnNpb25zLmNvbGxlY3Rpb25zLmFydGljbGVzKCkpLnNldFRhZyh0YWcpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIG1haW4uanMgY3VycmVudGx5IG9ubHkgaGFzIHR3byByZXNwb25zaWJpbGl0aWVzLFxuLy8gdG8gcmVhZHkgQXBwIGJ5IGluY2x1ZGluZyBpdCBhbmQgaW5pdGlhbGl6aW5nIGl0IGFmdGVyIGRvY3VtZW50IHJlYWR5LlxuXG5yZXF1aXJlKCcuL2FwcC5qcycpO1xuXG4kKGRvY3VtZW50KS5vbigncmVhZHknLCBmdW5jdGlvbigpe1xuXHRnbG9iYWwuQXBwLmluaXRpYWxpemUoKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0aWRBdHRyaWJ1dGU6ICdJRCdcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyA9IHJlcXVpcmUoJy4vaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMnKTtcblx0XG5tb2R1bGUuZXhwb3J0cyA9ICB3aW5kb3cuQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdHJvdXRlczoge1xuXHRcdCcnOiAncm9vdCcsXG5cdFx0Jzp0YWcnOiAnYXJ0aWNsZXMnLFxuXHRcdCc6dGFnLzpzbHVnJzogJ2FydGljbGUnXG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblxuXHRcdHRoaXMub24oJ3JvdXRlJywgZnVuY3Rpb24oKXtcblx0XHRcdC8vIEV2ZXJ5IHJvdXRlIGNoYW5nZSBpcyB0byBlbWl0IGRhdGEsIGZvciBub3cganVzdCB0aGUgZnJhZ21lbnQgc28gdGhhdCBicmVhZGNydW1icyBjYW4gYmUgdXBkYXRlZFxuXHRcdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZUJyZWFkY3J1bWJzJywge2ZyYWdtZW50OiB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudH0pO1xuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMub24oJ3JvdXRlOnJvb3QnICxmdW5jdGlvbigpe1xuXG5cdFx0XHQvLyBDcmVhdGluZyBhbmQgY2FjaGluZyB0aGUgdmlldyBpZiBpdCBpcyBub3QgYWxyZWFkeSBjYWNoZWRcblx0XHRcdEFwcC52aWV3cy5yb290ID0gQXBwLnZpZXdzLnJvb3QgfHwgbmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLnJvb3Qoe1xuXHRcdFx0XHRjb250YWluZXI6IEFwcC5lbnRyeVBvaW50XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVGhlbiByZW5kZXJpbmcgdGhlIHZpZXdcblx0XHRcdEFwcC52aWV3cy5yb290LnJlbmRlcigpO1xuXG5cdFx0fSk7XG5cblx0XHR0aGlzLm9uKCdyb3V0ZTphcnRpY2xlcycgLGZ1bmN0aW9uKHRhZyl7XG5cblx0XHRcdHZhciBjb2xsZWN0aW9uID0gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZyk7XG5cblx0XHRcdHZhciBjYWNoZU5hbWUgPSB0YWc7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdID0gKEFwcC52aWV3c1tjYWNoZU5hbWVdIHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5hcnRpY2xlcyh7XG5cdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb25cblx0XHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0QXBwLnZpZXdzW2NhY2hlTmFtZV0ucmVuZGVyKCk7XG5cblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZScgLGZ1bmN0aW9uKHRhZywgc2x1Zyl7XG5cblx0XHRcdHZhciBjb2xsZWN0aW9uID0gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZyk7XG5cblx0XHRcdHZhciBjYWNoZU5hbWUgPSB0YWcrJzonK3NsdWc7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdID0gKEFwcC52aWV3c1tjYWNoZU5hbWVdIHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5hcnRpY2xlKHtcblx0XHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHNsdWc6IHNsdWdcblx0XHRcdFx0XHRcdH0pKTtcblxuXHRcdFx0QXBwLnZpZXdzW2NhY2hlTmFtZV0ucmVuZGVyKCk7XG5cblx0XHRcdFxuXHRcdH0pO1xuXG5cdFx0d2luZG93LkJhY2tib25lLmhpc3Rvcnkuc3RhcnQoKTtcblxuXHR9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IChcblt7XG5cdG5hbWU6ICdqYXZhc2NyaXB0Jyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMjU0Jyxcblx0XHRnOiAnMjE4Jyxcblx0XHRiOiAnNjInXG5cdH1cbn0se1xuXHRuYW1lOiAnYmFja2JvbmUtanMnLFxuXHRjb2xvcjoge1xuXHRcdHI6ICcwJyxcblx0XHRnOiAnMTEzJyxcblx0XHRiOiAnMTgxJ1xuXHR9XG59LHtcblx0bmFtZTogJ25vZGUtanMnLFxuXHRjb2xvcjoge1xuXHRcdHI6ICcxMjgnLFxuXHRcdGc6ICcxODknLFxuXHRcdGI6ICcxJ1xuXHR9XG59LHtcblx0bmFtZTogJ2lvLWpzJyxcblx0Y29sb3I6IHtcblx0XHRyOiAnNDEnLFxuXHRcdGc6ICc0MCcsXG5cdFx0YjogJzQxJ1xuXHR9XG59LHtcblx0bmFtZTogJ3J1YnknLFxuXHRjb2xvcjoge1xuXHRcdHI6ICcyMDQnLFxuXHRcdGc6ICc1MicsXG5cdFx0YjogJzQ1J1xuXHR9XG59LHtcblx0bmFtZTogJ3J1Ynktb24tcmFpbHMnLFxuXHRjb2xvcjoge1xuXHRcdHI6ICcxNTInLFxuXHRcdGc6ICcyNicsXG5cdFx0YjogJzMzJ1xuXHR9XG59LHtcblx0bmFtZTogJ2VtYmVyLWpzJyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMjQyJyxcblx0XHRnOiAnNTYnLFxuXHRcdGI6ICcyNCdcblx0fVxufSx7XG5cdG5hbWU6ICdyZWFjdC1qcydcdCxcblx0Y29sb3I6IHtcblx0XHRyOiAnOTcnLFxuXHRcdGc6ICcyMTgnLFxuXHRcdGI6ICcyNTEnXG5cdH1cbn1dKTsiLCJ2YXIgZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7IFxuXG4gdmFyIEhhbmRsZWJhcnMgPSB3aW5kb3cuSGFuZGxlYmFyczsgXG5cbnRoaXNbXCJKU1RcIl0gPSB0aGlzW1wiSlNUXCJdIHx8IHt9O1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZS1wcmV2aWV3XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiPGgyPkFydGljbGUgcHJldmlldzwvaDI+XCI7XG4gIH0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiICA8aDQgY2xhc3M9XFxcImVycm9yXFxcIj5Pb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZyE8L2g0PlxcbiAgPHAgY2xhc3M9XFxcInRyeS1hZ2FpblxcXCI+VHJ5IGFnYWluPzwvcD5cXG5cXG5cIjtcbiAgfSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sb2FkaW5nIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDQsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgICA8aDQ+PGkgY2xhc3M9XFxcImZhIGZhLXNwaW4gZmEtcmVmcmVzaFxcXCI+PC9pPiBMb2FkaW5nLi4uPC9oND5cXG5cIjtcbiAgfSxcIjZcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDcsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgxMywgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCI4XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCIgICAgICBcdDxkaXYgY2xhc3M9XFxcImFydGljbGVfX3dyYXBwZXIgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMudW5sZXNzLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2VsZWN0ZWQgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ1bmxlc3NcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDksIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcXCI+XFxuICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVxcXCJhcnRpY2xlIHBhcGVyXFxcIiBpZD1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zbHVnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zbHVnIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInNsdWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFydGljbGVfX2hlYWRlclxcXCI+XFxuICAgICAgICAgICAgICAgIDxoMT5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2gxPlxcbiAgICAgICAgICAgICAgICBcXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cXFwiYnktbGluZSB0cnVuY2F0ZVxcXCI+Qnk6IFxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdXRob3IgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtd29yZHByZXNzXFxcIiBhbHQ9XFxcIlZpZXcgYXQgd29yZHByZXNzXFxcIj48L2k+PC9hPlxcbiAgICAgICAgICAgICAgICAgIDwvcD5cXG5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXJ0aWNsZV9fY29udGVudFxcXCI+XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuY29udGVudCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29udGVudCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJjb250ZW50XCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvZGl2PlxcbiAgICAgICAgICA8L2FydGljbGU+XFxuICAgICAgICA8L2Rpdj5cXG5cIjtcbn0sXCI5XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgb3V0LW9mLWZvY3VzXCI7XG4gIH0sXCIxMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uaWNlX25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5pY2VfbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuaWNlX25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPiBcXG5cIjtcbn0sXCIxM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiICAgIFx0PGgyPkFydGljbGUgbm90IGZvdW5kPC9oMj5cXG5cIjtcbiAgfSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZXJyb3JzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgzLCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyByZXR1cm4gc3RhY2sxOyB9XG4gIGVsc2UgeyByZXR1cm4gJyc7IH1cbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlc1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiXHQ8aDQgY2xhc3M9XFxcImVycm9yXFxcIj5Pb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZyE8L2g0Plxcblx0PHAgY2xhc3M9XFxcInRyeS1hZ2FpblxcXCI+VHJ5IGFnYWluPzwvcD5cXG5cXG5cIjtcbiAgfSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubG9hZGluZyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg0LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhLCBkZXB0aHMpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiXHRcdDxoND48aSBjbGFzcz1cXFwiZmEgZmEtc3BpbiBmYS1yZWZyZXNoXFxcIj48L2k+IExvYWRpbmcuLi48L2g0PlxcblwiO1xuICB9LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNywgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMTQsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XFxuXCI7XG59LFwiN1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXHRcdFx0PHVsIGNsYXNzPVxcXCJhcnRpY2xlcy1saXN0XFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubW9kZWxzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XHQ8L3VsPlxcblwiO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdHRyaWJ1dGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI5XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBsYW1iZGE9dGhpcy5sYW1iZGEsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYnVmZmVyID0gXCJcdFx0XHRcdFx0PGxpIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmcgcGFwZXJcXFwiPlxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fY29udGFpbmVyXFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTAsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX2RldGFpbHNcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJ0cnVuY2F0ZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX3RpdGxlIHRydW5jYXRlXFxcIiBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoZGVwdGhzWzJdICE9IG51bGwgPyBkZXB0aHNbMl0udGFnIDogZGVwdGhzWzJdKSwgZGVwdGgwKSlcbiAgICArIFwiL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT4gXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF1dGhvciA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEyLCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHQ8L2xpPlxcblwiO1xufSxcIjEwXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwiYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuYXZhdGFyX1VSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXZhdGFyX1VSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJhdmF0YXJfVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIik7XFxcIiBhbHQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9kaXY+PC9hPlxcblwiO1xufSxcIjEyXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XFxcImJ5LWxpbmUgdHJ1bmNhdGVcXFwiPkJ5OiA8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5pY2VfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmljZV9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5pY2VfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+PC9wPlxcblwiO1xufSxcIjE0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdFx0XHQ8aDI+Tm8gYXJ0aWNsZXMgZm91bmQ8L2gyPlxcblwiO1xuICB9LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8aDI+UmVzdWx0cyBmb3IgJ1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGFnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGFnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIic8L2gyPlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZXJyb3JzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcInVzZURhdGFcIjp0cnVlLFwidXNlRGVwdGhzXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYnJlYWRjcnVtYnNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdDxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGluayB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubGluayA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJsaW5rXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+dGl0bGU8L2E+XFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiPHNwYW4gY2xhc3M9XFxcImJyZWFkY3J1bWJzX19jb250YWluZXJcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5icmVhZGNydW1icyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvc3Bhbj5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiaGVhZGVyXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwiZ3JpZC1jb250YWluZXIgaGVhZGVyX19jb250YWluZXJcXFwiPlxcblx0PGRpdiBjbGFzcz1cXFwiaGVhZGVyX19jb250ZW50XFxcIj5cXG5cXG5cdFx0PGEgY2xhc3M9XFxcImdvLXByZXYgaGlkZVxcXCI+XFxuXHRcdFx0PGkgY2xhc3M9XFxcImZhIGZhLWNoZXZyb24tbGVmdFxcXCI+PC9pPlxcblx0XHQ8L2E+XFxuXFxuXHRcdDxhIGNsYXNzPVxcXCJnby1uZXh0IGhpZGVcXFwiPlxcblx0XHRcdDxpIGNsYXNzPVxcXCJmYSBmYS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XFxuXHRcdDwvYT5cXG5cXG5cdFx0PG5hdiBjbGFzcz1cXFwiY29udHJvbHNcXFwiPlxcblx0XHRcdDxhIGhyZWY9XFxcIiNcXFwiPjxoMSBjbGFzcz1cXFwibG9nb1xcXCI+V1AgUmVhZGVyPC9oMT48L2E+XFxuXHRcdDwvbmF2Plxcblx0XHRcXG5cdDwvZGl2PlxcbjwvZGl2PlwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJyb290XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHQ8bGkgY2xhc3M9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuXHRcdFx0PGEgaHJlZj1cXFwiIy9cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cXG5cdFx0PC9saT5cXG5cIjtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCI8c2VjdGlvbiBjbGFzcz1cXFwic2VhcmNoLWJhclxcXCI+PC9zZWN0aW9uPlxcblxcbjxoMj5TdWdnZXN0ZWQgVGFnczwvaDI+XFxuXFxuPHVsIGNsYXNzPVxcXCJ0YWdzXFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGFncyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvdWw+XCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcInNlYXJjaC1iYXJcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdDxkaXYgY2xhc3M9XFxcImdyaWQtY29udGFpbmVyXFxcIj5cXG5cdFx0PGRpdiBjbGFzcz1cXFwiZ3JpZC1yb3dcXFwiPlxcblx0XHRcdDxmb3JtIGNsYXNzPVxcXCJzZWFyY2gtYmFyX19mb3JtXFxcIj5cXG5cdFx0XHRcdDxsYWJlbCBmb3I9XFxcInNlYXJjaFxcXCI+PGgyPlNlYXJjaCBieSB0YWc8L2gyPjwvbGFiZWw+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJzZWFyY2gtYmFyX193cmFwcGVyXFxcIj5cXG5cdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcInNlYXJjaC1iYXJfX3NlYXJjaC1pbnB1dFxcXCIgbmFtZT1cXFwic2VhcmNoXFxcIiBwbGFjZWhvbGRlcj1cXFwiRXhhbXBsZTogSmF2YXNjcmlwdFxcXCI+XHRcdFx0XFxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cXFwic3VibWl0XFxcIiB2YWx1ZT1cXFwiU2VhcmNoXFxcIj48aSBjbGFzcz1cXFwiZmEgZmEtc2VhcmNoXFxcIj48L2k+PGkgY2xhc3M9XFxcImZhIGZhLXJlZnJlc2ggZmEtc3BpblxcXCI+PC9pPjwvYnV0dG9uPlxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9mb3JtPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcblwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4gcmV0dXJuIHRoaXNbJ0pTVCddO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0ZWw6ICc8YXJ0aWNsZT4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMuYXJ0aWNsZSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0dGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lciA/ICQob3B0aW9ucy5jb250YWluZXIpIDogZ2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIuJGVsO1xuXHRcdHRoaXMudGFnID0gb3B0aW9ucy50YWc7XG5cdFx0dGhpcy5zbHVnID0gb3B0aW9ucy5zbHVnO1xuXHRcdHRoaXMubW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24uZmluZFdoZXJlKHtzbHVnOiBvcHRpb25zLnNsdWd9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayBwLnRyeS1hZ2FpbicgOiAndGhpcy5nZXROZXdSZWNvcmRzJ1xuXHR9LFxuXG5cdGdldE5ld1JlY29yZHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cblx0XHR2YXIgZnJhZ21lbnQgPSB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudDtcblx0XHRjb2xsZWN0aW9uLmZldGNoKHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vIE9ubHkgY2FsbCByZW5kZXIgaWYgdGhlIHVybCBmcmFnbWVudCBpcyB0aGUgc2FtZSwgb3RoZXJ3aXNlIGEgdXNlciBtaWdodCBuYXZpZ2F0ZSB0byBhbm90aGVyIHJvdXRlLFxuICAgICAgICAvLyBidXQgdGhlIHJlbmRlciB3b3VsZCBzdGlsbCBiZSBjYWxsZWQgYW5kIHRha2UgZWZmZWN0LlxuICAgICAgICBpZiAoZnJhZ21lbnQgPT09IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50KSB7XG5cdFx0XHRcdFx0dmlldy5tb2RlbCA9IGNvbGxlY3Rpb24uZmluZFdoZXJlKHtzbHVnOiB2aWV3LnNsdWd9KTtcblx0XHRcdFx0XHR2aWV3LnJlbmRlcigpO1xuXHRcdFx0XHRcdHZpZXcudHJpZ2dlclByZXZBbmROZXh0VXBkYXRlcygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZpZXcucmVuZGVyRXJyb3IoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH0sXG5cblx0dG9SZW5kZXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR2YXIgdGVtcGxhdGVEYXRhID0gdGhpcy5tb2RlbCA/IHthcnRpY2xlOiB0aGlzLm1vZGVsLnRvSlNPTigpfSA6IHt9O1xuXG5cdFx0dGVtcGxhdGVEYXRhLmxvYWRpbmcgPSBvcHRpb25zLmxvYWRpbmc7XG5cdFx0dGVtcGxhdGVEYXRhLmVycm9ycyA9IG9wdGlvbnMuZXJyb3JzO1xuXG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZURhdGEpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB2aWV3LmNvbGxlY3Rpb247XG5cblx0XHQvLyBDdXJyZW50bHkgb25seSBmZXRjaGluZyBvbiByZW5kZXIgaWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHksXG4gICAgLy8gc3Vic2VxdWVudCBmZXRjaGVzIGZvciBuZXcgcmVjb3JkcyB3b3VsZCBiZSBoYW5kbGVkIHNvbWV3aGVyZSBvdGhlciB0aGFuIGhlcmVcblx0XHRpZiAoY29sbGVjdGlvbi5sZW5ndGggPCAxKSB7XG5cblx0XHRcdC8vIFRyaWdnZXJpbmcgdGhlc2UgZXZlbnRzIHdpdGhvdXQgYSBsaW5rIHBhcmFtIGNhdXNlcyB0aGUgY29tcG9uZW50cyB0byBiZSBoaWRkZW5cblx0XHRcdHRoaXMudHJpZ2dlclByZXZBbmROZXh0VXBkYXRlcygpO1xuXG5cdFx0XHQvLyB0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cdFx0XHR0aGlzLnJlbmRlckxvYWRpbmcoKTtcblx0XHRcdHRoaXMuZ2V0TmV3UmVjb3JkcygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyaW5nIGV2ZW50cyB0aGF0IHdpbGwgdXBkYXRlIHVpIGNvbXBvbmVudHNcblx0XHR0aGlzLnRyaWdnZXJQcmV2QW5kTmV4dFVwZGF0ZXMoKTtcblx0XHQvLyB3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlUHJldicsIHtsaW5rOiB0aGlzLnByZXZSb3V0ZSgpfSk7XG5cdFx0Ly8gd2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZU5leHQnLCB7bGluazogdGhpcy5uZXh0Um91dGUoKX0pO1xuXG5cdFx0Ly8gdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXHRcdGdsb2JhbC5BcHAudmlld3MubWFzdGVyLnJlbmRlclRvQXBwVmlldyggdGhpcywgdGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci5yZW5kZXJUb0FwcFZpZXcoIHRoaXMsIHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlckVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0Z2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIucmVuZGVyVG9BcHBWaWV3KCB0aGlzLCB0aGlzLnRvUmVuZGVyKHtlcnJvcnM6IHRydWV9KSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0dHJpZ2dlclByZXZBbmROZXh0VXBkYXRlczogZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlUHJldicsIHtsaW5rOiB0aGlzLnByZXZSb3V0ZSgpfSk7XG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZU5leHQnLCB7bGluazogdGhpcy5uZXh0Um91dGUoKX0pO1xuXHR9LFxuXG5cdGdldE5leHRNb2RlbDogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmdldE5leHRNb2RlbCh0aGlzLm1vZGVsKTtcblx0fSxcblxuXHRnZXRQcmV2TW9kZWw6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbi5nZXRQcmV2TW9kZWwodGhpcy5tb2RlbCk7XG5cdH0sXG5cblx0bmV4dFJvdXRlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtb2RlbCA9IHRoaXMuZ2V0TmV4dE1vZGVsKCk7XG5cdFx0cmV0dXJuIG1vZGVsPyAnIy8nKyB0aGlzLmNvbGxlY3Rpb24udGFnICsnLycgKyBtb2RlbC5nZXQoJ3NsdWcnKSA6IGZhbHNlO1xuXHR9LFxuXG5cdHByZXZSb3V0ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgbW9kZWwgPSB0aGlzLmdldFByZXZNb2RlbCgpO1xuXHRcdHJldHVybiBtb2RlbD8gJyMvJysgdGhpcy5jb2xsZWN0aW9uLnRhZyArJy8nICsgbW9kZWwuZ2V0KCdzbHVnJykgOiBmYWxzZTtcblx0fVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHRcblx0ZWw6ICc8c2VjdGlvbj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMuYXJ0aWNsZXMsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrIHAudHJ5LWFnYWluJyA6ICdnZXROZXdSZWNvcmRzJ1xuXHR9LFxuXHRnZXROZXdSZWNvcmRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG5cdFx0Ly8gdGFraW5nIHRoZSBjdXJyZW50IGZyYWdtZW50IHRvIGJlIGNoZWNrZWQgYWZ0ZXIgdGhlIGZldGNoLlxuXHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdGNvbGxlY3Rpb24uZmV0Y2goe1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG5cdFx0XHRcdC8vIGJ1dCB0aGUgcmVuZGVyIHdvdWxkIHN0aWxsIGJlIGNhbGxlZCBhbmQgdGFrZSBlZmZlY3QuXG5cdFx0XHRcdGlmIChmcmFnbWVudCAhPT0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdFx0aWYgKGNvbGxlY3Rpb24ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmlldy5yZW5kZXIoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmlldy5yZW5kZXJFcnJvcigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fSxcblx0dG9SZW5kZXI6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB2aWV3LmNvbGxlY3Rpb247XG5cblx0XHRvcHRpb25zLm1vZGVscyA9IGNvbGxlY3Rpb24ubW9kZWxzO1xuXHRcdG9wdGlvbnMudGFnID0gY29sbGVjdGlvbi50YWc7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKG9wdGlvbnMpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdmlldy5jb2xsZWN0aW9uO1xuXG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOmNsZWFyUHJldkFuZE5leHQnKTtcblxuXHRcdC8vIEN1cnJlbnRseSBvbmx5IGZldGNoaW5nIG9uIHJlbmRlciBpZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSxcblx0XHQvLyBzdWJzZXF1ZW50IGZldGNoZXMgZm9yIG5ldyByZWNvcmRzIHdvdWxkIGJlIGhhbmRsZWQgc29tZXdoZXJlIG90aGVyIHRoYW4gaGVyZVxuXHRcdGlmIChjb2xsZWN0aW9uLmxlbmd0aCA8IDEpIHtcblx0XHRcdHRoaXMucmVuZGVyTG9hZGluZygpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmdldE5ld1JlY29yZHMoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHRcdGdsb2JhbC5BcHAudmlld3MubWFzdGVyLnJlbmRlclRvQXBwVmlldyggdGhpcywgdGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJMb2FkaW5nOiBmdW5jdGlvbiAoKSB7XG5cdFx0Z2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIucmVuZGVyVG9BcHBWaWV3KCB0aGlzLCB0aGlzLnRvUmVuZGVyKHtsb2FkaW5nOiB0cnVlfSkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdGdsb2JhbC5BcHAudmlld3MubWFzdGVyLnJlbmRlclRvQXBwVmlldyggdGhpcywgdGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5icmVhZGNydW1icyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdFx0dGhpcy5icmVhZGNydW1icyA9IG9wdGlvbnMuYnJlYWRjcnVtYnM7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRldmVudHM6IHtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cblx0XHRvcHRpb25zLmJyZWFkY3J1bWJzID0gdGhpcy5icmVhZGNydW1ic1xuXG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKG9wdGlvbnMpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xudmFyICBfID0gd2luZG93Ll87XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5oZWFkZXIsXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdHRoaXMuc2V0TGlzdGVuZXJzKCk7XG5cdH0sXG5cdHRvUmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLnRlbXBsYXRlKCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblx0fSxcblx0dXBkYXRlVWlQcmV2OiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBcdHZhciAkcHJldiA9IHRoaXMuJGVsLmZpbmQoJy5nby1wcmV2Jyk7XG4gIFx0aWYgKG9wdGlvbnMubGluaykge1xuICBcdFx0JHByZXYucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hdHRyKCdocmVmJywgb3B0aW9ucy5saW5rKTtcbiAgXHR9IGVsc2Uge1xuICBcdFx0JHByZXYuYWRkQ2xhc3MoJ2hpZGUnKS5yZW1vdmVBdHRyKCdocmVmJyk7XG4gIFx0fVxuICB9LFxuICB1cGRhdGVVaU5leHQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIFx0dmFyICRuZXh0ID0gdGhpcy4kZWwuZmluZCgnLmdvLW5leHQnKTtcbiAgXHRpZiAob3B0aW9ucy5saW5rKSB7XG4gIFx0XHQkbmV4dC5yZW1vdmVDbGFzcygnaGlkZScpLmF0dHIoJ2hyZWYnLCBvcHRpb25zLmxpbmspO1xuICBcdH0gZWxzZSB7XG4gIFx0XHQkbmV4dC5hZGRDbGFzcygnaGlkZScpLnJlbW92ZUF0dHIoJ2hyZWYnKTtcbiAgXHR9XG4gIH0sXG4gIHVwZGF0ZUJyZWFkY3J1bWJzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICBcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBcdHZhciBmcmFnbWVudCA9IG9wdGlvbnMuZnJhZ21lbnQucmVwbGFjZSgvXi0rfC0rJC9nLCAnJyk7IC8vIHRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgaHlwaGVuc1xuICBcdHZhciBjcnVtYnMgPSBfLmZpbHRlcihmcmFnbWVudC5zcGxpdCgnLycpLCBmdW5jdGlvbihzKXtcbiAgXHRcdHJldHVybiBzLmxlbmd0aDsgLy8gZW5zdXJpbmcgdGhhdCBubyAwIGxlbmd0aCBzdHJpbmdzIHBhc3MgdGhyb3VnaFxuICBcdH0pO1xuXG4gIFx0KG5ldyBnbG9iYWwuQXBwLmV4dGVuc2lvbnMudmlld3MuYnJlYWRjcnVtYnMoe1xuICBcdFx0ZWw6ICdoZWFkZXIgLmJyZWFkY3J1bWJzJyxcbiAgXHRcdGJyZWFkY3J1bWJzOiBjcnVtYnNcbiAgXHR9KSkucmVuZGVyKCk7XG5cbiAgXHRyZXR1cm4gdGhpcztcbiAgfSxcblx0c2V0TGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuXHRcdC8vIFxuXHRcdHRoaXMubGlzdGVuVG8od2luZG93LkJhY2tib25lLCAndWk6dXBkYXRlUHJldicsIHRoaXMudXBkYXRlVWlQcmV2KTtcblx0XHR0aGlzLmxpc3RlblRvKHdpbmRvdy5CYWNrYm9uZSwgJ3VpOnVwZGF0ZU5leHQnLCB0aGlzLnVwZGF0ZVVpTmV4dCk7XG5cdFx0dGhpcy5saXN0ZW5Ubyh3aW5kb3cuQmFja2JvbmUsICd1aTpjbGVhclByZXZBbmROZXh0JywgZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMudXBkYXRlVWlQcmV2KCk7XG5cdFx0XHR0aGlzLnVwZGF0ZVVpTmV4dCgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5saXN0ZW5Ubyh3aW5kb3cuQmFja2JvbmUsICd1aTp1cGRhdGVCcmVhZGNydW1icycsIHRoaXMudXBkYXRlQnJlYWRjcnVtYnMpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0cmVuZGVyVG9BcHBWaWV3OiBmdW5jdGlvbih2aWV3LCBlbCl7XG5cdFx0dGhpcy4kZWwuZW1wdHkoKS5hcHBlbmQoZWwpO1xuXHRcdHZpZXcuZGVsZWdhdGVFdmVudHModmlldy5ldmVudHMpO1xuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMuanMnKTtcbnZhciBzdWdnZXN0ZWRUYWdzID0gcmVxdWlyZSgnLi4vc3VnZ2VzdGVkVGFncycpO1xuXG52YXIgU2VhcmNoQmFyID0gcmVxdWlyZSgnLi9zZWFyY2gtYmFyLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPGRpdj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMucm9vdCxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgPyAkKG9wdGlvbnMuY29udGFpbmVyKSA6IGdsb2JhbC5BcHAudmlld3MubWFzdGVyLiRlbDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHRvUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOmNsZWFyUHJldkFuZE5leHQnKTtcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe3RhZ3M6IHN1Z2dlc3RlZFRhZ3N9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdC8vIHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdGdsb2JhbC5BcHAudmlld3MubWFzdGVyLnJlbmRlclRvQXBwVmlldyggdGhpcywgdGhpcy50b1JlbmRlcigpKTtcblxuXHRcdChuZXcgU2VhcmNoQmFyKCkpLnJlbmRlcigpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRlbDogJ3NlY3Rpb24uc2VhcmNoLWJhcicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlc1snc2VhcmNoLWJhciddLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRldmVudHM6IHtcblx0XHQnc3VibWl0IGZvcm0uc2VhcmNoLWJhcl9fZm9ybScgOiAnaGFuZGxlU2VhcmNoJ1xuXHR9LFxuXHQvLyBVbmltcGxlbWVudGVkXG5cdC8vIEV2ZW50OiAna2V5dXAgLnNlYXJjaC1iYXJfX3NlYXJjaC1pbnB1dCdcblx0aW5wdXRGaW5pc2hlZDogZnVuY3Rpb24oKXtcblx0XHRjbGVhclRpbWVvdXQodGhpcy50eXBlVGltZW91dCk7XG5cdFx0dGhpcy50eXBlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIERlbGF5ZWQga2V5dXAgZnVuY3Rpb25hbGl0eVxuXHRcdH0sIDEwMDApO1xuXHRcdFxuXHR9LFxuXG5cdGhhbmRsZVNlYXJjaDogZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Ly8gdmFsIGlzbid0IHNvIHJ1YnVzdCAtIGltcHJvdmUgdGhpcy5cblx0XHR2YXIgdmFsID0gJChlLnRhcmdldCkuZmluZCgnaW5wdXQnKS52YWwoKS50cmltKCk7XG5cdFx0aWYgKCF2YWwubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0Ly8gUHJvY2VzcyB2YWwgd2l0aCByZWdleD8gbWFrZSBzdXJlIHRoYXQgaXQncyB1cmwgc2FmZS5cdFxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKHZhbC5zcGxpdCgnICcpWzBdLnRyaW0oKSwge3RyaWdnZXI6IHRydWV9KTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cblx0XHR0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTsiXX0=
