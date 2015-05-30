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
		// default route?
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
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.program(16, data),"data":data});
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
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.URL : depth0), {"name":"if","hash":{},"fn":this.program(12, data),"inverse":this.program(14, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "                      \n";
},"12":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                        <a href=\""
    + escapeExpression(((helper = (helper = helpers.URL || (depth0 != null ? depth0.URL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"URL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "</a> \n";
},"14":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                        "
    + escapeExpression(((helper = (helper = helpers.nice_name || (depth0 != null ? depth0.nice_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nice_name","hash":{},"data":data}) : helper)))
    + "\n";
},"16":function(depth0,helpers,partials,data) {
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
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (data && data.first), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<div class=\"breadcrumbs__crumb tag-label "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n				<a class=\"truncate\" href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n			</div>\n\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n";
  stack1 = helpers.unless.call(depth0, (data && data.last), {"name":"unless","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<div class=\"breadcrumbs__crumb\">\n					<a class=\"truncate tag-label "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n				</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"breadcrumbs__container\"s>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.breadcrumbs : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});

this["JST"]["header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"grid-container header__container\">\n	<div class=\"header__content\">\n\n		<a class=\"go-prev hide\">\n			<i class=\"fa fa-chevron-left\"></i>\n		</a>\n\n		<a class=\"go-next hide\">\n			<i class=\"fa fa-chevron-right\"></i>\n		</a>\n\n		<nav class=\"navigation\" role=\"navigation\" style=\"height: 100%;\">\n			<a href=\"#\"><h1 class=\"logo\">WP Reader</h1></a>\n			<div class=\"breadcrumbs\"></div>\n		</nav>\n		\n	</div>\n</div>";
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

			this.renderLoading();
			this.getNewRecords();

			return this;
		}

		// Triggering events that will update ui components
		this.triggerPrevAndNextUpdates();

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

		options.breadcrumbs = this.breadcrumbs;

		console.log('rendering breadcrumbs');

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

  	console.log(crumbs);

  	crumbs = _.map(crumbs, function(crumb, i){
  		return {
  			title: crumb,
  			i: i,
  			link: '#/' + fragment.substring(0, fragment.indexOf(crumb) + crumb.length)
  		};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9icmVhZGNydW1icy5qcyIsImFwcC9qcy92aWV3cy9oZWFkZXIuanMiLCJhcHAvanMvdmlld3MvbWFzdGVyLmpzIiwiYXBwL2pzL3ZpZXdzL3Jvb3QuanMiLCJhcHAvanMvdmlld3Mvc2VhcmNoLWJhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlci5qcycpO1xudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJyk7XG52YXIgZXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy5qcycpO1xuXG52YXIgQXBwID0ge1xuXG4gIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICBlbnRyeVBvaW50OiAnLmFwcCcsXG4gIFxuICAvLyBTZXQgdXAgZm9yIGNhY2hhYmxlIEJhY2tib25lIGNsYXNzZXNcbiAgdmlld3M6IHt9LFxuICBjb2xsZWN0aW9uczoge30sXG4gIG1vZGVsczoge30sXG5cbiAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIHRoaXMudmlld3MubWFzdGVyID0gbmV3IHRoaXMuZXh0ZW5zaW9ucy52aWV3cy5tYXN0ZXIoe2VsOiB0aGlzLmVudHJ5UG9pbnR9KTtcbiAgICB0aGlzLnZpZXdzLmhlYWRlciA9IG5ldyB0aGlzLmV4dGVuc2lvbnMudmlld3MuaGVhZGVyKHtlbDogJ2hlYWRlcid9KTtcbiAgXHR0aGlzLnJvdXRlciA9IG5ldyByb3V0ZXIodGhpcyk7XG5cbiAgfVxufTtcbi8vIEFzc2lnbmluZyBBcHAgdG8gdGhlIGdsb2JhbCAod2luZG93KVxuZ2xvYmFsLkFwcCA9IEFwcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICBtb2RlbDogbW9kZWwsXG4gIGlzTG9hZGluZzogZmFsc2UsXG4gIHRhZzogJ3dlYi1kZXZlbG9wbWVudCcsXG5cbiAgLy8gaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgLy8gICByZXR1cm4gdGhpcztcbiAgLy8gfSxcblxuICBzZXRUYWc6IGZ1bmN0aW9uKHRhZykge1xuICAgIHRoaXMudGFnID0gdGFnO1xuICAgIGdsb2JhbC5BcHAuY29sbGVjdGlvbnNbdGhpcy50YWddID0gdGhpcztcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB1cmw6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICdodHRwczovL3B1YmxpYy1hcGkud29yZHByZXNzLmNvbS9yZXN0L3YxLjEvcmVhZC90YWdzLycrIHRoaXMudGFnICsnL3Bvc3RzJztcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHJldHVybiByZXNwb25zZS5wb3N0cztcbiAgfSxcblxuICBnZXROZXh0TW9kZWw6IGZ1bmN0aW9uKG1vZGVsKXtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcbiAgICBpZiAoY3VycmVudEluZGV4IDwgMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHJldHVybiB0aGlzLmF0KChjdXJyZW50SW5kZXggKzEgPiB0aGlzLmxlbmd0aCAtMSk/ICBmYWxzZSA6IGN1cnJlbnRJbmRleCArIDEpO1xuICB9LFxuXG4gIGdldFByZXZNb2RlbDogZnVuY3Rpb24obW9kZWwpe1xuICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmluZGV4T2YobW9kZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuYXQoKGN1cnJlbnRJbmRleCAtMSA8IDApID8gZmFsc2UgOiBjdXJyZW50SW5kZXggLSAxKTtcbiAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtYXN0ZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYXN0ZXIuanMnKTtcbnZhciBoZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9oZWFkZXIuanMnKTtcbnZhciBzZWFyY2hCYXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9zZWFyY2gtYmFyLmpzJyk7XG52YXIgYnJlYWRjcnVtYnNWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9icmVhZGNydW1icy5qcycpO1xuXG52YXIgcm9vdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Jvb3QuanMnKTtcbnZhciBhcnRpY2xlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZS5qcycpO1xudmFyIGFydGljbGVzVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWxzL2FydGljbGUuanMnKTtcblxuLy8gTWFraW5nIEJhY2tib25lIGNsYXNzIGV4dGVuc2lvbnMgYXZhaWxhYmxlIHRocm91Z2ggQXBwLmV4dGVuc2lvbnNcbi8vIE1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28ga2VlcHMgdGhlIGFwcCBsYXlvdXQgYSBsaXR0bGUgbmVhdGVyLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXG5cbiAgdmlld3M6IHtcbiAgICBtYXN0ZXIgICAgICAgICAgOiBtYXN0ZXJWaWV3LFxuICAgIGhlYWRlciAgICAgICAgICA6IGhlYWRlclZpZXcsXG4gIFx0cm9vdCBcdFx0XHRcdFx0XHQ6IHJvb3RWaWV3LFxuXHRcdGFydGljbGUgXHRcdFx0XHQ6IGFydGljbGVWaWV3LFxuXHRcdGFydGljbGVzXHRcdFx0XHQ6IGFydGljbGVzVmlldyxcbiAgICBzZWFyY2hCYXIgICAgICAgOiBzZWFyY2hCYXJWaWV3LFxuICAgIGJyZWFkY3J1bWJzICAgICA6IGJyZWFkY3J1bWJzVmlld1xuICB9LFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gIFx0YXJ0aWNsZXMgXHRcdFx0XHQ6IGFydGljbGVzQ29sbGVjdGlvblxuICB9LFxuXG4gIG1vZGVsczoge1xuICBcdGFydGljbGUgXHRcdFx0XHQ6IGFydGljbGVNb2RlbFxuICB9XG5cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YWcpIHtcblx0dmFyIEFwcCA9IGdsb2JhbC5BcHA7XG5cblx0cmV0dXJuIEFwcC5jb2xsZWN0aW9uc1t0YWddIHx8IChuZXcgQXBwLmV4dGVuc2lvbnMuY29sbGVjdGlvbnMuYXJ0aWNsZXMoKSkuc2V0VGFnKHRhZyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLy8gbWFpbi5qcyBjdXJyZW50bHkgb25seSBoYXMgdHdvIHJlc3BvbnNpYmlsaXRpZXMsXG4vLyB0byByZWFkeSBBcHAgYnkgaW5jbHVkaW5nIGl0IGFuZCBpbml0aWFsaXppbmcgaXQgYWZ0ZXIgZG9jdW1lbnQgcmVhZHkuXG5cbnJlcXVpcmUoJy4vYXBwLmpzJyk7XG5cbiQoZG9jdW1lbnQpLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCl7XG5cdGdsb2JhbC5BcHAuaW5pdGlhbGl6ZSgpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuXHRpZEF0dHJpYnV0ZTogJ0lEJ1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnID0gcmVxdWlyZSgnLi9oZWxwZXJzL2ZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZy5qcycpO1xuXHRcbm1vZHVsZS5leHBvcnRzID0gIHdpbmRvdy5CYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblx0cm91dGVzOiB7XG5cdFx0Jyc6ICdyb290Jyxcblx0XHQnOnRhZyc6ICdhcnRpY2xlcycsXG5cdFx0Jzp0YWcvOnNsdWcnOiAnYXJ0aWNsZSdcblx0XHQvLyBkZWZhdWx0IHJvdXRlP1xuXHR9LFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIEFwcCA9IGdsb2JhbC5BcHA7XG5cblx0XHR0aGlzLm9uKCdyb3V0ZScsIGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBFdmVyeSByb3V0ZSBjaGFuZ2UgaXMgdG8gZW1pdCBkYXRhLCBmb3Igbm93IGp1c3QgdGhlIGZyYWdtZW50IHNvIHRoYXQgYnJlYWRjcnVtYnMgY2FuIGJlIHVwZGF0ZWRcblx0XHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVCcmVhZGNydW1icycsIHtmcmFnbWVudDogd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnR9KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLm9uKCdyb3V0ZTpyb290JyAsZnVuY3Rpb24oKXtcblxuXHRcdFx0Ly8gQ3JlYXRpbmcgYW5kIGNhY2hpbmcgdGhlIHZpZXcgaWYgaXQgaXMgbm90IGFscmVhZHkgY2FjaGVkXG5cdFx0XHRBcHAudmlld3Mucm9vdCA9IEFwcC52aWV3cy5yb290IHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5yb290KHtcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoZW4gcmVuZGVyaW5nIHRoZSB2aWV3XG5cdFx0XHRBcHAudmlld3Mucm9vdC5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZXMnICxmdW5jdGlvbih0YWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHR2YXIgY2FjaGVOYW1lID0gdGFnO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXSA9IChBcHAudmlld3NbY2FjaGVOYW1lXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZXMoe1xuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdLnJlbmRlcigpO1xuXG5cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JvdXRlOmFydGljbGUnICxmdW5jdGlvbih0YWcsIHNsdWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHR2YXIgY2FjaGVOYW1lID0gdGFnKyc6JytzbHVnO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXSA9IChBcHAudmlld3NbY2FjaGVOYW1lXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZSh7XG5cdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRzbHVnOiBzbHVnXG5cdFx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdLnJlbmRlcigpO1xuXG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cblx0fVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSAoXG5be1xuXHRuYW1lOiAnamF2YXNjcmlwdCcsXG5cdGNvbG9yOiB7XG5cdFx0cjogJzI1NCcsXG5cdFx0ZzogJzIxOCcsXG5cdFx0YjogJzYyJ1xuXHR9XG59LHtcblx0bmFtZTogJ2JhY2tib25lLWpzJyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMCcsXG5cdFx0ZzogJzExMycsXG5cdFx0YjogJzE4MSdcblx0fVxufSx7XG5cdG5hbWU6ICdub2RlLWpzJyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMTI4Jyxcblx0XHRnOiAnMTg5Jyxcblx0XHRiOiAnMSdcblx0fVxufSx7XG5cdG5hbWU6ICdpby1qcycsXG5cdGNvbG9yOiB7XG5cdFx0cjogJzQxJyxcblx0XHRnOiAnNDAnLFxuXHRcdGI6ICc0MSdcblx0fVxufSx7XG5cdG5hbWU6ICdydWJ5Jyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMjA0Jyxcblx0XHRnOiAnNTInLFxuXHRcdGI6ICc0NSdcblx0fVxufSx7XG5cdG5hbWU6ICdydWJ5LW9uLXJhaWxzJyxcblx0Y29sb3I6IHtcblx0XHRyOiAnMTUyJyxcblx0XHRnOiAnMjYnLFxuXHRcdGI6ICczMydcblx0fVxufSx7XG5cdG5hbWU6ICdlbWJlci1qcycsXG5cdGNvbG9yOiB7XG5cdFx0cjogJzI0MicsXG5cdFx0ZzogJzU2Jyxcblx0XHRiOiAnMjQnXG5cdH1cbn0se1xuXHRuYW1lOiAncmVhY3QtanMnXHQsXG5cdGNvbG9yOiB7XG5cdFx0cjogJzk3Jyxcblx0XHRnOiAnMjE4Jyxcblx0XHRiOiAnMjUxJ1xuXHR9XG59XSk7IiwidmFyIGV4cG9ydHMgPSAoZnVuY3Rpb24gKCkgeyBcblxuIHZhciBIYW5kbGViYXJzID0gd2luZG93LkhhbmRsZWJhcnM7IFxuXG50aGlzW1wiSlNUXCJdID0gdGhpc1tcIkpTVFwiXSB8fCB7fTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGUtcHJldmlld1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIjxoMj5BcnRpY2xlIHByZXZpZXc8L2gyPlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGVcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgPGg0IGNsYXNzPVxcXCJlcnJvclxcXCI+T29wcyEgU29tZXRoaW5nIHdlbnQgd3JvbmchPC9oND5cXG4gIDxwIGNsYXNzPVxcXCJ0cnktYWdhaW5cXFwiPlRyeSBhZ2Fpbj88L3A+XFxuXFxuXCI7XG4gIH0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubG9hZGluZyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg0LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oNiwgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgICAgPGg0PjxpIGNsYXNzPVxcXCJmYSBmYS1zcGluIGZhLXJlZnJlc2hcXFwiPjwvaT4gTG9hZGluZy4uLjwvaDQ+XFxuXCI7XG4gIH0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXJ0aWNsZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMTYsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwiN1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXJ0aWNsZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDgsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXI7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIGJ1ZmZlciA9IFwiICAgICAgXHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX193cmFwcGVyIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLnVubGVzcy5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlbGVjdGVkIDogZGVwdGgwKSwge1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXFwiPlxcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cXFwiYXJ0aWNsZSBwYXBlclxcXCIgaWQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX19oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8aDE+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aXRsZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9oMT5cXG4gICAgICAgICAgICAgICAgXFxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XFxcImJ5LWxpbmUgdHJ1bmNhdGVcXFwiPkJ5OiBcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGkgY2xhc3M9XFxcImZhIGZhLXdvcmRwcmVzc1xcXCIgYWx0PVxcXCJWaWV3IGF0IHdvcmRwcmVzc1xcXCI+PC9pPjwvYT5cXG4gICAgICAgICAgICAgICAgICA8L3A+XFxuXFxuICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFydGljbGVfX2NvbnRlbnRcXFwiPlwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmNvbnRlbnQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNvbnRlbnQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29udGVudFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCI8L2Rpdj5cXG4gICAgICAgICAgPC9hcnRpY2xlPlxcbiAgICAgICAgPC9kaXY+XFxuXCI7XG59LFwiOVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiIG91dC1vZi1mb2N1c1wiO1xuICB9LFwiMTFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5VUkwgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTIsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgxNCwgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCIgICAgICAgICAgICAgICAgICAgICAgXFxuXCI7XG59LFwiMTJcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uaWNlX25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5pY2VfbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuaWNlX25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPiBcXG5cIjtcbn0sXCIxNFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgICAgICBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5pY2VfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmljZV9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5pY2VfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXG5cIjtcbn0sXCIxNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiICAgIFx0PGgyPkFydGljbGUgbm90IGZvdW5kPC9oMj5cXG5cIjtcbiAgfSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZXJyb3JzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgzLCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyByZXR1cm4gc3RhY2sxOyB9XG4gIGVsc2UgeyByZXR1cm4gJyc7IH1cbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlc1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiXHQ8aDQgY2xhc3M9XFxcImVycm9yXFxcIj5Pb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZyE8L2g0Plxcblx0PHAgY2xhc3M9XFxcInRyeS1hZ2FpblxcXCI+VHJ5IGFnYWluPzwvcD5cXG5cXG5cIjtcbiAgfSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubG9hZGluZyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg0LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhLCBkZXB0aHMpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwiNFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiXHRcdDxoND48aSBjbGFzcz1cXFwiZmEgZmEtc3BpbiBmYS1yZWZyZXNoXFxcIj48L2k+IExvYWRpbmcuLi48L2g0PlxcblwiO1xuICB9LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNywgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMTQsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XFxuXCI7XG59LFwiN1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXHRcdFx0PHVsIGNsYXNzPVxcXCJhcnRpY2xlcy1saXN0XFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubW9kZWxzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XHQ8L3VsPlxcblwiO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdHRyaWJ1dGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI5XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBsYW1iZGE9dGhpcy5sYW1iZGEsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYnVmZmVyID0gXCJcdFx0XHRcdFx0PGxpIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmcgcGFwZXJcXFwiPlxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fY29udGFpbmVyXFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTAsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX2RldGFpbHNcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJ0cnVuY2F0ZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX3RpdGxlIHRydW5jYXRlXFxcIiBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoZGVwdGhzWzJdICE9IG51bGwgPyBkZXB0aHNbMl0udGFnIDogZGVwdGhzWzJdKSwgZGVwdGgwKSlcbiAgICArIFwiL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT4gXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF1dGhvciA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEyLCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHQ8L2xpPlxcblwiO1xufSxcIjEwXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwiYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuYXZhdGFyX1VSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXZhdGFyX1VSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJhdmF0YXJfVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIik7XFxcIiBhbHQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9kaXY+PC9hPlxcblwiO1xufSxcIjEyXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XFxcImJ5LWxpbmUgdHJ1bmNhdGVcXFwiPkJ5OiA8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5pY2VfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmljZV9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5pY2VfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+PC9wPlxcblwiO1xufSxcIjE0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdFx0XHQ8aDI+Tm8gYXJ0aWNsZXMgZm91bmQ8L2gyPlxcblwiO1xuICB9LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8aDI+UmVzdWx0cyBmb3IgJ1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGFnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGFnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIic8L2gyPlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZXJyb3JzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcInVzZURhdGFcIjp0cnVlLFwidXNlRGVwdGhzXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYnJlYWRjcnVtYnNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkYXRhICYmIGRhdGEuZmlyc3QpLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMiwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDQsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXHRcdFxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdFx0PGRpdiBjbGFzcz1cXFwiYnJlYWRjcnVtYnNfX2NydW1iIHRhZy1sYWJlbCBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcblx0XHRcdFx0PGEgY2xhc3M9XFxcInRydW5jYXRlXFxcIiBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmxpbmsgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmxpbmsgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibGlua1wiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLnVubGVzcy5jYWxsKGRlcHRoMCwgKGRhdGEgJiYgZGF0YS5sYXN0KSwge1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg1LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI1XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0PGRpdiBjbGFzcz1cXFwiYnJlYWRjcnVtYnNfX2NydW1iXFxcIj5cXG5cdFx0XHRcdFx0PGEgY2xhc3M9XFxcInRydW5jYXRlIHRhZy1sYWJlbCBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnRpdGxlIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50aXRsZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0aXRsZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGluayB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubGluayA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJsaW5rXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aXRsZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPlxcblx0XHRcdFx0PC9kaXY+XFxuXCI7XG59LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiPGRpdiBjbGFzcz1cXFwiYnJlYWRjcnVtYnNfX2NvbnRhaW5lclxcXCJzPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5icmVhZGNydW1icyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvZGl2PlwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJoZWFkZXJcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJncmlkLWNvbnRhaW5lciBoZWFkZXJfX2NvbnRhaW5lclxcXCI+XFxuXHQ8ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX2NvbnRlbnRcXFwiPlxcblxcblx0XHQ8YSBjbGFzcz1cXFwiZ28tcHJldiBoaWRlXFxcIj5cXG5cdFx0XHQ8aSBjbGFzcz1cXFwiZmEgZmEtY2hldnJvbi1sZWZ0XFxcIj48L2k+XFxuXHRcdDwvYT5cXG5cXG5cdFx0PGEgY2xhc3M9XFxcImdvLW5leHQgaGlkZVxcXCI+XFxuXHRcdFx0PGkgY2xhc3M9XFxcImZhIGZhLWNoZXZyb24tcmlnaHRcXFwiPjwvaT5cXG5cdFx0PC9hPlxcblxcblx0XHQ8bmF2IGNsYXNzPVxcXCJuYXZpZ2F0aW9uXFxcIiByb2xlPVxcXCJuYXZpZ2F0aW9uXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiAxMDAlO1xcXCI+XFxuXHRcdFx0PGEgaHJlZj1cXFwiI1xcXCI+PGgxIGNsYXNzPVxcXCJsb2dvXFxcIj5XUCBSZWFkZXI8L2gxPjwvYT5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJicmVhZGNydW1ic1xcXCI+PC9kaXY+XFxuXHRcdDwvbmF2Plxcblx0XHRcXG5cdDwvZGl2PlxcbjwvZGl2PlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcInJvb3RcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdDxsaSBjbGFzcz1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXG5cdFx0XHQ8YSBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPlxcblx0XHQ8L2xpPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIjxzZWN0aW9uIGNsYXNzPVxcXCJzZWFyY2gtYmFyXFxcIj48L3NlY3Rpb24+XFxuXFxuPGgyPlN1Z2dlc3RlZCBUYWdzPC9oMj5cXG5cXG48dWwgY2xhc3M9XFxcInRhZ3NcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWdzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiPC91bD5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wic2VhcmNoLWJhclwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0PGRpdiBjbGFzcz1cXFwiZ3JpZC1jb250YWluZXJcXFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVxcXCJncmlkLXJvd1xcXCI+XFxuXHRcdFx0PGZvcm0gY2xhc3M9XFxcInNlYXJjaC1iYXJfX2Zvcm1cXFwiPlxcblx0XHRcdFx0PGxhYmVsIGZvcj1cXFwic2VhcmNoXFxcIj48aDI+U2VhcmNoIGJ5IHRhZzwvaDI+PC9sYWJlbD5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XFxcInNlYXJjaC1iYXJfX3dyYXBwZXJcXFwiPlxcblx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwic2VhcmNoLWJhcl9fc2VhcmNoLWlucHV0XFxcIiBuYW1lPVxcXCJzZWFyY2hcXFwiIHBsYWNlaG9sZGVyPVxcXCJFeGFtcGxlOiBKYXZhc2NyaXB0XFxcIj5cdFx0XHRcXG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJTZWFyY2hcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS1zZWFyY2hcXFwiPjwvaT48aSBjbGFzcz1cXFwiZmEgZmEtcmVmcmVzaCBmYS1zcGluXFxcIj48L2k+PC9idXR0b24+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Zvcm0+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiByZXR1cm4gdGhpc1snSlNUJ107XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRlbDogJzxhcnRpY2xlPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cdFx0dGhpcy50YWcgPSBvcHRpb25zLnRhZztcblx0XHR0aGlzLnNsdWcgPSBvcHRpb25zLnNsdWc7XG5cdFx0dGhpcy5tb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IG9wdGlvbnMuc2x1Z30pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrIHAudHJ5LWFnYWluJyA6ICd0aGlzLmdldE5ld1JlY29yZHMnXG5cdH0sXG5cblx0Z2V0TmV3UmVjb3JkczogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuXHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdGNvbGxlY3Rpb24uZmV0Y2goe1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG4gICAgICAgIC8vIGJ1dCB0aGUgcmVuZGVyIHdvdWxkIHN0aWxsIGJlIGNhbGxlZCBhbmQgdGFrZSBlZmZlY3QuXG4gICAgICAgIGlmIChmcmFnbWVudCA9PT0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQpIHtcblx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IHZpZXcuc2x1Z30pO1xuXHRcdFx0XHRcdHZpZXcucmVuZGVyKCk7XG5cdFx0XHRcdFx0dmlldy50cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmlldy5yZW5kZXJFcnJvcigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB0ZW1wbGF0ZURhdGEgPSB0aGlzLm1vZGVsID8ge2FydGljbGU6IHRoaXMubW9kZWwudG9KU09OKCl9IDoge307XG5cblx0XHR0ZW1wbGF0ZURhdGEubG9hZGluZyA9IG9wdGlvbnMubG9hZGluZztcblx0XHR0ZW1wbGF0ZURhdGEuZXJyb3JzID0gb3B0aW9ucy5lcnJvcnM7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRlbXBsYXRlRGF0YSkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdC8vIEN1cnJlbnRseSBvbmx5IGZldGNoaW5nIG9uIHJlbmRlciBpZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSxcbiAgICAvLyBzdWJzZXF1ZW50IGZldGNoZXMgZm9yIG5ldyByZWNvcmRzIHdvdWxkIGJlIGhhbmRsZWQgc29tZXdoZXJlIG90aGVyIHRoYW4gaGVyZVxuXHRcdGlmIChjb2xsZWN0aW9uLmxlbmd0aCA8IDEpIHtcblxuXHRcdFx0Ly8gVHJpZ2dlcmluZyB0aGVzZSBldmVudHMgd2l0aG91dCBhIGxpbmsgcGFyYW0gY2F1c2VzIHRoZSBjb21wb25lbnRzIHRvIGJlIGhpZGRlblxuXHRcdFx0dGhpcy50cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzKCk7XG5cblx0XHRcdHRoaXMucmVuZGVyTG9hZGluZygpO1xuXHRcdFx0dGhpcy5nZXROZXdSZWNvcmRzKCk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIFRyaWdnZXJpbmcgZXZlbnRzIHRoYXQgd2lsbCB1cGRhdGUgdWkgY29tcG9uZW50c1xuXHRcdHRoaXMudHJpZ2dlclByZXZBbmROZXh0VXBkYXRlcygpO1xuXG5cdFx0Z2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIucmVuZGVyVG9BcHBWaWV3KCB0aGlzLCB0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0cmVuZGVyTG9hZGluZzogZnVuY3Rpb24gKCkge1xuXHRcdGdsb2JhbC5BcHAudmlld3MubWFzdGVyLnJlbmRlclRvQXBwVmlldyggdGhpcywgdGhpcy50b1JlbmRlcih7bG9hZGluZzogdHJ1ZX0pKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0cmVuZGVyRXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci5yZW5kZXJUb0FwcFZpZXcoIHRoaXMsIHRoaXMudG9SZW5kZXIoe2Vycm9yczogdHJ1ZX0pKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzOiBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVQcmV2Jywge2xpbms6IHRoaXMucHJldlJvdXRlKCl9KTtcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlTmV4dCcsIHtsaW5rOiB0aGlzLm5leHRSb3V0ZSgpfSk7XG5cdH0sXG5cblx0Z2V0TmV4dE1vZGVsOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZ2V0TmV4dE1vZGVsKHRoaXMubW9kZWwpO1xuXHR9LFxuXG5cdGdldFByZXZNb2RlbDogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmdldFByZXZNb2RlbCh0aGlzLm1vZGVsKTtcblx0fSxcblxuXHRuZXh0Um91dGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1vZGVsID0gdGhpcy5nZXROZXh0TW9kZWwoKTtcblx0XHRyZXR1cm4gbW9kZWw/ICcjLycrIHRoaXMuY29sbGVjdGlvbi50YWcgKycvJyArIG1vZGVsLmdldCgnc2x1ZycpIDogZmFsc2U7XG5cdH0sXG5cblx0cHJldlJvdXRlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtb2RlbCA9IHRoaXMuZ2V0UHJldk1vZGVsKCk7XG5cdFx0cmV0dXJuIG1vZGVsPyAnIy8nKyB0aGlzLmNvbGxlY3Rpb24udGFnICsnLycgKyBtb2RlbC5nZXQoJ3NsdWcnKSA6IGZhbHNlO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgPyAkKG9wdGlvbnMuY29udGFpbmVyKSA6IGdsb2JhbC5BcHAudmlld3MubWFzdGVyLiRlbDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgcC50cnktYWdhaW4nIDogJ2dldE5ld1JlY29yZHMnXG5cdH0sXG5cdGdldE5ld1JlY29yZHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cblx0XHQvLyB0YWtpbmcgdGhlIGN1cnJlbnQgZnJhZ21lbnQgdG8gYmUgY2hlY2tlZCBhZnRlciB0aGUgZmV0Y2guXG5cdFx0dmFyIGZyYWdtZW50ID0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQ7XG5cdFx0Y29sbGVjdGlvbi5mZXRjaCh7XG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBPbmx5IGNhbGwgcmVuZGVyIGlmIHRoZSB1cmwgZnJhZ21lbnQgaXMgdGhlIHNhbWUsIG90aGVyd2lzZSBhIHVzZXIgbWlnaHQgbmF2aWdhdGUgdG8gYW5vdGhlciByb3V0ZSxcblx0XHRcdFx0Ly8gYnV0IHRoZSByZW5kZXIgd291bGQgc3RpbGwgYmUgY2FsbGVkIGFuZCB0YWtlIGVmZmVjdC5cblx0XHRcdFx0aWYgKGZyYWdtZW50ICE9PSB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0XHRpZiAoY29sbGVjdGlvbi5sZW5ndGgpIHtcblx0XHRcdFx0XHR2aWV3LnJlbmRlcigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZpZXcucmVuZGVyRXJyb3IoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9LFxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdG9wdGlvbnMubW9kZWxzID0gY29sbGVjdGlvbi5tb2RlbHM7XG5cdFx0b3B0aW9ucy50YWcgPSBjb2xsZWN0aW9uLnRhZztcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUob3B0aW9ucykpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB2aWV3LmNvbGxlY3Rpb247XG5cblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6Y2xlYXJQcmV2QW5kTmV4dCcpO1xuXG5cdFx0Ly8gQ3VycmVudGx5IG9ubHkgZmV0Y2hpbmcgb24gcmVuZGVyIGlmIHRoZSBjb2xsZWN0aW9uIGlzIGVtcHR5LFxuXHRcdC8vIHN1YnNlcXVlbnQgZmV0Y2hlcyBmb3IgbmV3IHJlY29yZHMgd291bGQgYmUgaGFuZGxlZCBzb21ld2hlcmUgb3RoZXIgdGhhbiBoZXJlXG5cdFx0aWYgKGNvbGxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuXHRcdFx0dGhpcy5yZW5kZXJMb2FkaW5nKCk7XG5cdFx0XHRcblx0XHRcdHRoaXMuZ2V0TmV3UmVjb3JkcygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdFx0Z2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIucmVuZGVyVG9BcHBWaWV3KCB0aGlzLCB0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlckxvYWRpbmc6IGZ1bmN0aW9uICgpIHtcblx0XHRnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci5yZW5kZXJUb0FwcFZpZXcoIHRoaXMsIHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlckVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0Z2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIucmVuZGVyVG9BcHBWaWV3KCB0aGlzLCB0aGlzLnRvUmVuZGVyKHtlcnJvcnM6IHRydWV9KSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLmJyZWFkY3J1bWJzLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cblx0XHR0aGlzLmJyZWFkY3J1bWJzID0gb3B0aW9ucy5icmVhZGNydW1icztcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGV2ZW50czoge1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblxuXHRcdG9wdGlvbnMuYnJlYWRjcnVtYnMgPSB0aGlzLmJyZWFkY3J1bWJzO1xuXG5cdFx0Y29uc29sZS5sb2coJ3JlbmRlcmluZyBicmVhZGNydW1icycpO1xuXG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKG9wdGlvbnMpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xudmFyICBfID0gd2luZG93Ll87XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5oZWFkZXIsXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdHRoaXMuc2V0TGlzdGVuZXJzKCk7XG5cdH0sXG5cdHRvUmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLnRlbXBsYXRlKCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuJGVsLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblx0fSxcblx0dXBkYXRlVWlQcmV2OiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBcdHZhciAkcHJldiA9IHRoaXMuJGVsLmZpbmQoJy5nby1wcmV2Jyk7XG4gIFx0aWYgKG9wdGlvbnMubGluaykge1xuICBcdFx0JHByZXYucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hdHRyKCdocmVmJywgb3B0aW9ucy5saW5rKTtcbiAgXHR9IGVsc2Uge1xuICBcdFx0JHByZXYuYWRkQ2xhc3MoJ2hpZGUnKS5yZW1vdmVBdHRyKCdocmVmJyk7XG4gIFx0fVxuICB9LFxuICB1cGRhdGVVaU5leHQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIFx0dmFyICRuZXh0ID0gdGhpcy4kZWwuZmluZCgnLmdvLW5leHQnKTtcbiAgXHRpZiAob3B0aW9ucy5saW5rKSB7XG4gIFx0XHQkbmV4dC5yZW1vdmVDbGFzcygnaGlkZScpLmF0dHIoJ2hyZWYnLCBvcHRpb25zLmxpbmspO1xuICBcdH0gZWxzZSB7XG4gIFx0XHQkbmV4dC5hZGRDbGFzcygnaGlkZScpLnJlbW92ZUF0dHIoJ2hyZWYnKTtcbiAgXHR9XG4gIH0sXG4gIHVwZGF0ZUJyZWFkY3J1bWJzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICBcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBcdHZhciBmcmFnbWVudCA9IG9wdGlvbnMuZnJhZ21lbnQucmVwbGFjZSgvXi0rfC0rJC9nLCAnJyk7IC8vIHRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgaHlwaGVuc1xuICBcdHZhciBjcnVtYnMgPSBfLmZpbHRlcihmcmFnbWVudC5zcGxpdCgnLycpLCBmdW5jdGlvbihzKXtcbiAgXHRcdHJldHVybiBzLmxlbmd0aDsgLy8gZW5zdXJpbmcgdGhhdCBubyAwIGxlbmd0aCBzdHJpbmdzIHBhc3MgdGhyb3VnaFxuICBcdH0pO1xuXG4gIFx0Y29uc29sZS5sb2coY3J1bWJzKTtcblxuICBcdGNydW1icyA9IF8ubWFwKGNydW1icywgZnVuY3Rpb24oY3J1bWIsIGkpe1xuICBcdFx0cmV0dXJuIHtcbiAgXHRcdFx0dGl0bGU6IGNydW1iLFxuICBcdFx0XHRpOiBpLFxuICBcdFx0XHRsaW5rOiAnIy8nICsgZnJhZ21lbnQuc3Vic3RyaW5nKDAsIGZyYWdtZW50LmluZGV4T2YoY3J1bWIpICsgY3J1bWIubGVuZ3RoKVxuICBcdFx0fTtcbiAgXHR9KTtcblxuICBcdChuZXcgZ2xvYmFsLkFwcC5leHRlbnNpb25zLnZpZXdzLmJyZWFkY3J1bWJzKHtcbiAgXHRcdGVsOiAnaGVhZGVyIC5icmVhZGNydW1icycsXG4gIFx0XHRicmVhZGNydW1iczogY3J1bWJzXG4gIFx0fSkpLnJlbmRlcigpO1xuXG4gIFx0cmV0dXJuIHRoaXM7XG4gIH0sXG5cdHNldExpc3RlbmVyczogZnVuY3Rpb24oKXtcblx0XHQvLyBcblx0XHR0aGlzLmxpc3RlblRvKHdpbmRvdy5CYWNrYm9uZSwgJ3VpOnVwZGF0ZVByZXYnLCB0aGlzLnVwZGF0ZVVpUHJldik7XG5cdFx0dGhpcy5saXN0ZW5Ubyh3aW5kb3cuQmFja2JvbmUsICd1aTp1cGRhdGVOZXh0JywgdGhpcy51cGRhdGVVaU5leHQpO1xuXHRcdHRoaXMubGlzdGVuVG8od2luZG93LkJhY2tib25lLCAndWk6Y2xlYXJQcmV2QW5kTmV4dCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnVwZGF0ZVVpUHJldigpO1xuXHRcdFx0dGhpcy51cGRhdGVVaU5leHQoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMubGlzdGVuVG8od2luZG93LkJhY2tib25lLCAndWk6dXBkYXRlQnJlYWRjcnVtYnMnLCB0aGlzLnVwZGF0ZUJyZWFkY3J1bWJzKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdHJlbmRlclRvQXBwVmlldzogZnVuY3Rpb24odmlldywgZWwpe1xuXHRcdHRoaXMuJGVsLmVtcHR5KCkuYXBwZW5kKGVsKTtcblx0XHR2aWV3LmRlbGVnYXRlRXZlbnRzKHZpZXcuZXZlbnRzKTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG52YXIgc3VnZ2VzdGVkVGFncyA9IHJlcXVpcmUoJy4uL3N1Z2dlc3RlZFRhZ3MnKTtcblxudmFyIFNlYXJjaEJhciA9IHJlcXVpcmUoJy4vc2VhcmNoLWJhci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxkaXY+JyxcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLnJvb3QsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTpjbGVhclByZXZBbmROZXh0Jyk7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHt0YWdzOiBzdWdnZXN0ZWRUYWdzfSkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHRnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci5yZW5kZXJUb0FwcFZpZXcoIHRoaXMsIHRoaXMudG9SZW5kZXIoKSk7XG5cblx0XHQobmV3IFNlYXJjaEJhcigpKS5yZW5kZXIoKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0ZWw6ICdzZWN0aW9uLnNlYXJjaC1iYXInLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXNbJ3NlYXJjaC1iYXInXSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0J3N1Ym1pdCBmb3JtLnNlYXJjaC1iYXJfX2Zvcm0nIDogJ2hhbmRsZVNlYXJjaCdcblx0fSxcblx0Ly8gVW5pbXBsZW1lbnRlZFxuXHQvLyBFdmVudDogJ2tleXVwIC5zZWFyY2gtYmFyX19zZWFyY2gtaW5wdXQnXG5cdGlucHV0RmluaXNoZWQ6IGZ1bmN0aW9uKCl7XG5cdFx0Y2xlYXJUaW1lb3V0KHRoaXMudHlwZVRpbWVvdXQpO1xuXHRcdHRoaXMudHlwZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBEZWxheWVkIGtleXVwIGZ1bmN0aW9uYWxpdHlcblx0XHR9LCAxMDAwKTtcblx0XHRcblx0fSxcblxuXHRoYW5kbGVTZWFyY2g6IGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIHZhbCBpc24ndCBzbyBydWJ1c3QgLSBpbXByb3ZlIHRoaXMuXG5cdFx0dmFyIHZhbCA9ICQoZS50YXJnZXQpLmZpbmQoJ2lucHV0JykudmFsKCkudHJpbSgpO1xuXHRcdGlmICghdmFsLmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdC8vIFByb2Nlc3MgdmFsIHdpdGggcmVnZXg/IG1ha2Ugc3VyZSB0aGF0IGl0J3MgdXJsIHNhZmUuXHRcblx0XHR3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSh2YWwuc3BsaXQoJyAnKVswXS50cmltKCksIHt0cmlnZ2VyOiB0cnVlfSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7Il19
