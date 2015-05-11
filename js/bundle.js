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
		articles				: articlesView
  },

  collections: {
  	articles 				: articlesCollection
  },

  models: {
  	article 				: articleModel
  }

};
},{"./collections/articles.js":2,"./models/article.js":6,"./views/article.js":10,"./views/articles.js":11,"./views/header.js":12,"./views/master.js":13,"./views/root.js":14}],4:[function(require,module,exports){
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
	name: 'javascript'
},{
	name: 'backbone-js'
},{
	name: 'node-js'
},{
	name: 'io-js'
},{
	name: 'ruby'
},{
	name: 'ruby-on-rails'
},{
	name: 'ember-js'
},{
	name: 'react-js'	
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
  return "		<h4>Loading...</h4>\n";
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

this["JST"]["header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"grid-container header__container\">\n	<div class=\"header__content\">\n\n		<a class=\"go-prev hide\">\n			<i class=\"fa fa-chevron-left\"></i>\n		</a>\n\n		<a class=\"go-next hide\">\n			<i class=\"fa fa-chevron-right\"></i>\n		</a>\n\n		<nav class=\"controls\">\n			<a href=\"#\"><h1 class=\"logo\">WP Reader</h1></a>\n		</nav>\n		\n	</div>\n</div>";
},"useData":true});

this["JST"]["root"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<li>\n			<a href=\"#/"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n		</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<h2>Suggested Tags</h2>\n\n<ul class=\"tags\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tags : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>";
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

			this.container.html(this.toRender({loading: true}));
			this.getNewRecords();

			return this;
		}

		// Triggering events that will update ui components
		this.triggerPrevAndNextUpdates();
		// window.Backbone.trigger('ui:updatePrev', {link: this.prevRoute()});
		// window.Backbone.trigger('ui:updateNext', {link: this.nextRoute()});

		this.container.html(this.toRender());

		return this;
	},

	renderError: function () {
		this.container.html(this.toRender({errors: true}));
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

		// This is repeated between all views currently and so needs a refactor
		window.Backbone.trigger('ui:updatePrev');
		window.Backbone.trigger('ui:updateNext');

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

},{"../templates.js":9}],12:[function(require,module,exports){
'use strict';

var templates = require('../templates.js'); 	 

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
	setListeners: function(){
		// 
		this.listenTo(window.Backbone, 'ui:updatePrev', this.updateUiPrev);
		this.listenTo(window.Backbone, 'ui:updateNext', this.updateUiNext);
	}
});
},{"../templates.js":9}],13:[function(require,module,exports){
'use strict';

module.exports = window.Backbone.View.extend({
	// events: {}
});
},{}],14:[function(require,module,exports){
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
		// This is repeated between all views currently and so needs a refactor
		window.Backbone.trigger('ui:updatePrev');
		window.Backbone.trigger('ui:updateNext');
		
		return this.$el.html(this.template({tags: suggestedTags}));
	},

	render: function(){
		this.container.html(this.toRender());

		return this;
	}

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../suggestedTags":8,"../templates.js":9}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9oZWFkZXIuanMiLCJhcHAvanMvdmlld3MvbWFzdGVyLmpzIiwiYXBwL2pzL3ZpZXdzL3Jvb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlci5qcycpO1xudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJyk7XG52YXIgZXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy5qcycpO1xuXG52YXIgQXBwID0ge1xuXG4gIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICBlbnRyeVBvaW50OiAnLmFwcCcsXG4gIFxuICAvLyBTZXQgdXAgZm9yIGNhY2hhYmxlIEJhY2tib25lIGNsYXNzZXNcbiAgdmlld3M6IHt9LFxuICBjb2xsZWN0aW9uczoge30sXG4gIG1vZGVsczoge30sXG5cbiAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuICAgIHRoaXMudmlld3MubWFzdGVyID0gbmV3IHRoaXMuZXh0ZW5zaW9ucy52aWV3cy5tYXN0ZXIoe2VsOiB0aGlzLmVudHJ5UG9pbnR9KTtcbiAgICB0aGlzLnZpZXdzLmhlYWRlciA9IG5ldyB0aGlzLmV4dGVuc2lvbnMudmlld3MuaGVhZGVyKHtlbDogJ2hlYWRlcid9KTtcbiAgXHR0aGlzLnJvdXRlciA9IG5ldyByb3V0ZXIodGhpcyk7XG5cbiAgfVxufTtcbi8vIEFzc2lnbmluZyBBcHAgdG8gdGhlIGdsb2JhbCAod2luZG93KVxuZ2xvYmFsLkFwcCA9IEFwcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICBtb2RlbDogbW9kZWwsXG4gIGlzTG9hZGluZzogZmFsc2UsXG4gIHRhZzogJ3dlYi1kZXZlbG9wbWVudCcsXG5cbiAgLy8gaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgLy8gICByZXR1cm4gdGhpcztcbiAgLy8gfSxcblxuICBzZXRUYWc6IGZ1bmN0aW9uKHRhZykge1xuICAgIHRoaXMudGFnID0gdGFnO1xuICAgIGdsb2JhbC5BcHAuY29sbGVjdGlvbnNbdGhpcy50YWddID0gdGhpcztcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB1cmw6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICdodHRwczovL3B1YmxpYy1hcGkud29yZHByZXNzLmNvbS9yZXN0L3YxLjEvcmVhZC90YWdzLycrIHRoaXMudGFnICsnL3Bvc3RzJztcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHJldHVybiByZXNwb25zZS5wb3N0cztcbiAgfSxcblxuICBnZXROZXh0TW9kZWw6IGZ1bmN0aW9uKG1vZGVsKXtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcbiAgICBpZiAoY3VycmVudEluZGV4IDwgMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHJldHVybiB0aGlzLmF0KChjdXJyZW50SW5kZXggKzEgPiB0aGlzLmxlbmd0aCAtMSk/ICBmYWxzZSA6IGN1cnJlbnRJbmRleCArIDEpO1xuICB9LFxuXG4gIGdldFByZXZNb2RlbDogZnVuY3Rpb24obW9kZWwpe1xuICAgIHZhciBjdXJyZW50SW5kZXggPSB0aGlzLmluZGV4T2YobW9kZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuYXQoKGN1cnJlbnRJbmRleCAtMSA8IDApID8gZmFsc2UgOiBjdXJyZW50SW5kZXggLSAxKTtcbiAgfVxuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtYXN0ZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9tYXN0ZXIuanMnKTtcbnZhciBoZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9oZWFkZXIuanMnKTtcblxudmFyIHJvb3RWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9yb290LmpzJyk7XG52YXIgYXJ0aWNsZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGUuanMnKTtcbnZhciBhcnRpY2xlc1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlc0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlTW9kZWwgPSByZXF1aXJlKCcuL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbi8vIE1ha2luZyBCYWNrYm9uZSBjbGFzcyBleHRlbnNpb25zIGF2YWlsYWJsZSB0aHJvdWdoIEFwcC5leHRlbnNpb25zXG4vLyBNYWlubHkgZm9yIHRlc3RpbmcsIGJ1dCBhbHNvIGtlZXBzIHRoZSBhcHAgbGF5b3V0IGEgbGl0dGxlIG5lYXRlci5cblxubW9kdWxlLmV4cG9ydHMgPSB7IFxuXG4gIHZpZXdzOiB7XG4gICAgbWFzdGVyICAgICAgICAgIDogbWFzdGVyVmlldyxcbiAgICBoZWFkZXIgICAgICAgICAgOiBoZWFkZXJWaWV3LFxuICBcdHJvb3QgXHRcdFx0XHRcdFx0OiByb290Vmlldyxcblx0XHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlVmlldyxcblx0XHRhcnRpY2xlc1x0XHRcdFx0OiBhcnRpY2xlc1ZpZXdcbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICBcdGFydGljbGVzIFx0XHRcdFx0OiBhcnRpY2xlc0NvbGxlY3Rpb25cbiAgfSxcblxuICBtb2RlbHM6IHtcbiAgXHRhcnRpY2xlIFx0XHRcdFx0OiBhcnRpY2xlTW9kZWxcbiAgfVxuXG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFnKSB7XG5cdHZhciBBcHAgPSBnbG9iYWwuQXBwO1xuXG5cdHJldHVybiBBcHAuY29sbGVjdGlvbnNbdGFnXSB8fCAobmV3IEFwcC5leHRlbnNpb25zLmNvbGxlY3Rpb25zLmFydGljbGVzKCkpLnNldFRhZyh0YWcpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIG1haW4uanMgY3VycmVudGx5IG9ubHkgaGFzIHR3byByZXNwb25zaWJpbGl0aWVzLFxuLy8gdG8gcmVhZHkgQXBwIGJ5IGluY2x1ZGluZyBpdCBhbmQgaW5pdGlhbGl6aW5nIGl0IGFmdGVyIGRvY3VtZW50IHJlYWR5LlxuXG5yZXF1aXJlKCcuL2FwcC5qcycpO1xuXG4kKGRvY3VtZW50KS5vbigncmVhZHknLCBmdW5jdGlvbigpe1xuXHRnbG9iYWwuQXBwLmluaXRpYWxpemUoKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0aWRBdHRyaWJ1dGU6ICdJRCdcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyA9IHJlcXVpcmUoJy4vaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMnKTtcblx0XG5tb2R1bGUuZXhwb3J0cyA9ICB3aW5kb3cuQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdHJvdXRlczoge1xuXHRcdCcnOiAncm9vdCcsXG5cdFx0Jzp0YWcnOiAnYXJ0aWNsZXMnLFxuXHRcdCc6dGFnLzpzbHVnJzogJ2FydGljbGUnXG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblx0XHRcblx0XHR0aGlzLm9uKCdyb3V0ZTpyb290JyAsZnVuY3Rpb24oKXtcblxuXHRcdFx0Ly8gQ3JlYXRpbmcgYW5kIGNhY2hpbmcgdGhlIHZpZXcgaWYgaXQgaXMgbm90IGFscmVhZHkgY2FjaGVkXG5cdFx0XHRBcHAudmlld3Mucm9vdCA9IEFwcC52aWV3cy5yb290IHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5yb290KHtcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoZW4gcmVuZGVyaW5nIHRoZSB2aWV3XG5cdFx0XHRBcHAudmlld3Mucm9vdC5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZXMnICxmdW5jdGlvbih0YWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHR2YXIgY2FjaGVOYW1lID0gdGFnO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXSA9IChBcHAudmlld3NbY2FjaGVOYW1lXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZXMoe1xuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uXG5cdFx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdLnJlbmRlcigpO1xuXG5cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JvdXRlOmFydGljbGUnICxmdW5jdGlvbih0YWcsIHNsdWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHR2YXIgY2FjaGVOYW1lID0gdGFnKyc6JytzbHVnO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXSA9IChBcHAudmlld3NbY2FjaGVOYW1lXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZSh7XG5cdFx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvbixcblx0XHRcdFx0XHRcdFx0XHRzbHVnOiBzbHVnXG5cdFx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdEFwcC52aWV3c1tjYWNoZU5hbWVdLnJlbmRlcigpO1xuXG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cblx0fVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSAoXG5be1xuXHRuYW1lOiAnamF2YXNjcmlwdCdcbn0se1xuXHRuYW1lOiAnYmFja2JvbmUtanMnXG59LHtcblx0bmFtZTogJ25vZGUtanMnXG59LHtcblx0bmFtZTogJ2lvLWpzJ1xufSx7XG5cdG5hbWU6ICdydWJ5J1xufSx7XG5cdG5hbWU6ICdydWJ5LW9uLXJhaWxzJ1xufSx7XG5cdG5hbWU6ICdlbWJlci1qcydcbn0se1xuXHRuYW1lOiAncmVhY3QtanMnXHRcbn1dKTsiLCJ2YXIgZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7IFxuXG4gdmFyIEhhbmRsZWJhcnMgPSB3aW5kb3cuSGFuZGxlYmFyczsgXG5cbnRoaXNbXCJKU1RcIl0gPSB0aGlzW1wiSlNUXCJdIHx8IHt9O1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZS1wcmV2aWV3XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiPGgyPkFydGljbGUgcHJldmlldzwvaDI+XCI7XG4gIH0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZVwiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiMVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiICA8aDQgY2xhc3M9XFxcImVycm9yXFxcIj5Pb3BzISBTb21ldGhpbmcgd2VudCB3cm9uZyE8L2g0PlxcbiAgPHAgY2xhc3M9XFxcInRyeS1hZ2FpblxcXCI+VHJ5IGFnYWluPzwvcD5cXG5cXG5cIjtcbiAgfSxcIjNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sb2FkaW5nIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDQsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSg2LCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgICA8aDQ+TG9hZGluZy4uLjwvaDQ+XFxuXCI7XG4gIH0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXJ0aWNsZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMTMsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwiN1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXJ0aWNsZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDgsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXI7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIGJ1ZmZlciA9IFwiICAgICAgXHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX193cmFwcGVyIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLnVubGVzcy5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlbGVjdGVkIDogZGVwdGgwKSwge1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXFwiPlxcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cXFwiYXJ0aWNsZSBwYXBlclxcXCIgaWQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX19oZWFkZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8aDE+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aXRsZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9oMT5cXG4gICAgICAgICAgICAgICAgXFxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XFxcImJ5LWxpbmUgdHJ1bmNhdGVcXFwiPkJ5OiBcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGkgY2xhc3M9XFxcImZhIGZhLXdvcmRwcmVzc1xcXCIgYWx0PVxcXCJWaWV3IGF0IHdvcmRwcmVzc1xcXCI+PC9pPjwvYT5cXG4gICAgICAgICAgICAgICAgICA8L3A+XFxuXFxuICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFydGljbGVfX2NvbnRlbnRcXFwiPlwiO1xuICBzdGFjazEgPSAoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLmNvbnRlbnQgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmNvbnRlbnQgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiY29udGVudFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCI8L2Rpdj5cXG4gICAgICAgICAgPC9hcnRpY2xlPlxcbiAgICAgICAgPC9kaXY+XFxuXCI7XG59LFwiOVwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiIG91dC1vZi1mb2N1c1wiO1xuICB9LFwiMTFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuVVJMIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5VUkwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT4gXFxuXCI7XG59LFwiMTNcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgICBcdDxoMj5BcnRpY2xlIG5vdCBmb3VuZDwvaDI+XFxuXCI7XG4gIH0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMTtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmVycm9ycyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMywgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgcmV0dXJuIHN0YWNrMTsgfVxuICBlbHNlIHsgcmV0dXJuICcnOyB9XG4gIH0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZXNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0PGg0IGNsYXNzPVxcXCJlcnJvclxcXCI+T29wcyEgU29tZXRoaW5nIHdlbnQgd3JvbmchPC9oND5cXG5cdDxwIGNsYXNzPVxcXCJ0cnktYWdhaW5cXFwiPlRyeSBhZ2Fpbj88L3A+XFxuXFxuXCI7XG4gIH0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmxvYWRpbmcgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oNiwgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0XHQ8aDQ+TG9hZGluZy4uLjwvaDQ+XFxuXCI7XG4gIH0sXCI2XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm1vZGVscyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg3LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMucHJvZ3JhbSgxNCwgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcXG5cIjtcbn0sXCI3XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcdFx0XHQ8dWwgY2xhc3M9XFxcImFydGljbGVzLWxpc3RcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdDwvdWw+XFxuXCI7XG59LFwiOFwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF0dHJpYnV0ZXMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg5LCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGxhbWJkYT10aGlzLmxhbWJkYSwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBidWZmZXIgPSBcIlx0XHRcdFx0XHQ8bGkgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZyBwYXBlclxcXCI+XFxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cXFwiYXJ0aWNsZS1saXN0aW5nX19jb250YWluZXJcXFwiPlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdXRob3IgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxMCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fZGV0YWlsc1xcXCI+XFxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcInRydW5jYXRlclxcXCI+XFxuXHRcdFx0XHRcdFx0XHRcdFx0PGEgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fdGl0bGUgdHJ1bmNhdGVcXFwiIGhyZWY9XFxcIiMvXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24obGFtYmRhKChkZXB0aHNbMl0gIT0gbnVsbCA/IGRlcHRoc1syXS50YWcgOiBkZXB0aHNbMl0pLCBkZXB0aDApKVxuICAgICsgXCIvXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zbHVnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zbHVnIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInNsdWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj4gXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50aXRsZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGl0bGUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGl0bGVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPiBcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTIsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXHRcdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcdDwvbGk+XFxuXCI7XG59LFwiMTBcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48ZGl2IGNsYXNzPVxcXCJhdmF0YXJcXFwiIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5hdmF0YXJfVVJMIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdmF0YXJfVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImF2YXRhcl9VUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiKTtcXFwiIGFsdD1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uaWNlX25hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5pY2VfbmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuaWNlX25hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj48L2Rpdj48L2E+XFxuXCI7XG59LFwiMTJcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdFx0XHRcdFx0XHRcdFx0XHQ8cCBjbGFzcz1cXFwiYnktbGluZSB0cnVuY2F0ZVxcXCI+Qnk6IDxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuVVJMIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5VUkwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT48L3A+XFxuXCI7XG59LFwiMTRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0XHRcdDxoMj5ObyBhcnRpY2xlcyBmb3VuZDwvaDI+XFxuXCI7XG4gIH0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIjxoMj5SZXN1bHRzIGZvciAnXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy50YWcgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRhZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJ0YWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiJzwvaDI+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5lcnJvcnMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMywgZGF0YSwgZGVwdGhzKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXI7XG59LFwidXNlRGF0YVwiOnRydWUsXCJ1c2VEZXB0aHNcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJoZWFkZXJcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJncmlkLWNvbnRhaW5lciBoZWFkZXJfX2NvbnRhaW5lclxcXCI+XFxuXHQ8ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX2NvbnRlbnRcXFwiPlxcblxcblx0XHQ8YSBjbGFzcz1cXFwiZ28tcHJldiBoaWRlXFxcIj5cXG5cdFx0XHQ8aSBjbGFzcz1cXFwiZmEgZmEtY2hldnJvbi1sZWZ0XFxcIj48L2k+XFxuXHRcdDwvYT5cXG5cXG5cdFx0PGEgY2xhc3M9XFxcImdvLW5leHQgaGlkZVxcXCI+XFxuXHRcdFx0PGkgY2xhc3M9XFxcImZhIGZhLWNoZXZyb24tcmlnaHRcXFwiPjwvaT5cXG5cdFx0PC9hPlxcblxcblx0XHQ8bmF2IGNsYXNzPVxcXCJjb250cm9sc1xcXCI+XFxuXHRcdFx0PGEgaHJlZj1cXFwiI1xcXCI+PGgxIGNsYXNzPVxcXCJsb2dvXFxcIj5XUCBSZWFkZXI8L2gxPjwvYT5cXG5cdFx0PC9uYXY+XFxuXHRcdFxcblx0PC9kaXY+XFxuPC9kaXY+XCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcInJvb3RcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHRcdDxsaT5cXG5cdFx0XHQ8YSBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPlxcblx0XHQ8L2xpPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIjxoMj5TdWdnZXN0ZWQgVGFnczwvaDI+XFxuXFxuPHVsIGNsYXNzPVxcXCJ0YWdzXFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAudGFncyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvdWw+XCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcbiByZXR1cm4gdGhpc1snSlNUJ107XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRlbDogJzxhcnRpY2xlPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cdFx0dGhpcy50YWcgPSBvcHRpb25zLnRhZztcblx0XHR0aGlzLnNsdWcgPSBvcHRpb25zLnNsdWc7XG5cdFx0dGhpcy5tb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IG9wdGlvbnMuc2x1Z30pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0ZXZlbnRzOiB7XG5cdFx0J2NsaWNrIHAudHJ5LWFnYWluJyA6ICd0aGlzLmdldE5ld1JlY29yZHMnXG5cdH0sXG5cblx0Z2V0TmV3UmVjb3JkczogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuXHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdGNvbGxlY3Rpb24uZmV0Y2goe1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG4gICAgICAgIC8vIGJ1dCB0aGUgcmVuZGVyIHdvdWxkIHN0aWxsIGJlIGNhbGxlZCBhbmQgdGFrZSBlZmZlY3QuXG4gICAgICAgIGlmIChmcmFnbWVudCA9PT0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQpIHtcblx0XHRcdFx0XHR2aWV3Lm1vZGVsID0gY29sbGVjdGlvbi5maW5kV2hlcmUoe3NsdWc6IHZpZXcuc2x1Z30pO1xuXHRcdFx0XHRcdHZpZXcucmVuZGVyKCk7XG5cdFx0XHRcdFx0dmlldy50cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmlldy5yZW5kZXJFcnJvcigpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB0ZW1wbGF0ZURhdGEgPSB0aGlzLm1vZGVsID8ge2FydGljbGU6IHRoaXMubW9kZWwudG9KU09OKCl9IDoge307XG5cblx0XHR0ZW1wbGF0ZURhdGEubG9hZGluZyA9IG9wdGlvbnMubG9hZGluZztcblx0XHR0ZW1wbGF0ZURhdGEuZXJyb3JzID0gb3B0aW9ucy5lcnJvcnM7XG5cblx0XHRyZXR1cm4gdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRlbXBsYXRlRGF0YSkpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdC8vIEN1cnJlbnRseSBvbmx5IGZldGNoaW5nIG9uIHJlbmRlciBpZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSxcbiAgICAvLyBzdWJzZXF1ZW50IGZldGNoZXMgZm9yIG5ldyByZWNvcmRzIHdvdWxkIGJlIGhhbmRsZWQgc29tZXdoZXJlIG90aGVyIHRoYW4gaGVyZVxuXHRcdGlmIChjb2xsZWN0aW9uLmxlbmd0aCA8IDEpIHtcblxuXHRcdFx0Ly8gVHJpZ2dlcmluZyB0aGVzZSBldmVudHMgd2l0aG91dCBhIGxpbmsgcGFyYW0gY2F1c2VzIHRoZSBjb21wb25lbnRzIHRvIGJlIGhpZGRlblxuXHRcdFx0dGhpcy50cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzKCk7XG5cblx0XHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7bG9hZGluZzogdHJ1ZX0pKTtcblx0XHRcdHRoaXMuZ2V0TmV3UmVjb3JkcygpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyaW5nIGV2ZW50cyB0aGF0IHdpbGwgdXBkYXRlIHVpIGNvbXBvbmVudHNcblx0XHR0aGlzLnRyaWdnZXJQcmV2QW5kTmV4dFVwZGF0ZXMoKTtcblx0XHQvLyB3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlUHJldicsIHtsaW5rOiB0aGlzLnByZXZSb3V0ZSgpfSk7XG5cdFx0Ly8gd2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZU5leHQnLCB7bGluazogdGhpcy5uZXh0Um91dGUoKX0pO1xuXG5cdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0cmVuZGVyRXJyb3I6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2Vycm9yczogdHJ1ZX0pKTtcblx0fSxcblxuXHR0cmlnZ2VyUHJldkFuZE5leHRVcGRhdGVzOiBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVQcmV2Jywge2xpbms6IHRoaXMucHJldlJvdXRlKCl9KTtcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlTmV4dCcsIHtsaW5rOiB0aGlzLm5leHRSb3V0ZSgpfSk7XG5cdH0sXG5cblx0Z2V0TmV4dE1vZGVsOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZ2V0TmV4dE1vZGVsKHRoaXMubW9kZWwpO1xuXHR9LFxuXG5cdGdldFByZXZNb2RlbDogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmdldFByZXZNb2RlbCh0aGlzLm1vZGVsKTtcblx0fSxcblxuXHRuZXh0Um91dGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1vZGVsID0gdGhpcy5nZXROZXh0TW9kZWwoKTtcblx0XHRyZXR1cm4gbW9kZWw/ICcjLycrIHRoaXMuY29sbGVjdGlvbi50YWcgKycvJyArIG1vZGVsLmdldCgnc2x1ZycpIDogZmFsc2U7XG5cdH0sXG5cblx0cHJldlJvdXRlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtb2RlbCA9IHRoaXMuZ2V0UHJldk1vZGVsKCk7XG5cdFx0cmV0dXJuIG1vZGVsPyAnIy8nKyB0aGlzLmNvbGxlY3Rpb24udGFnICsnLycgKyBtb2RlbC5nZXQoJ3NsdWcnKSA6IGZhbHNlO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgPyAkKG9wdGlvbnMuY29udGFpbmVyKSA6IGdsb2JhbC5BcHAudmlld3MubWFzdGVyLiRlbDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRldmVudHM6IHtcblx0XHQnY2xpY2sgcC50cnktYWdhaW4nIDogJ3RoaXMuZ2V0TmV3UmVjb3Jkcydcblx0fSxcblx0Z2V0TmV3UmVjb3JkczogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuXHRcdC8vIHRha2luZyB0aGUgY3VycmVudCBmcmFnbWVudCB0byBiZSBjaGVja2VkIGFmdGVyIHRoZSBmZXRjaC5cblx0XHR2YXIgZnJhZ21lbnQgPSB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudDtcblx0XHRjb2xsZWN0aW9uLmZldGNoKHtcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdC8vIE9ubHkgY2FsbCByZW5kZXIgaWYgdGhlIHVybCBmcmFnbWVudCBpcyB0aGUgc2FtZSwgb3RoZXJ3aXNlIGEgdXNlciBtaWdodCBuYXZpZ2F0ZSB0byBhbm90aGVyIHJvdXRlLFxuXHRcdFx0XHQvLyBidXQgdGhlIHJlbmRlciB3b3VsZCBzdGlsbCBiZSBjYWxsZWQgYW5kIHRha2UgZWZmZWN0LlxuXHRcdFx0XHRpZiAoZnJhZ21lbnQgPT09IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50KSB7XG5cdFx0XHRcdFx0dmlldy5yZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9LFxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdG9wdGlvbnMubW9kZWxzID0gY29sbGVjdGlvbi5tb2RlbHM7XG5cdFx0b3B0aW9ucy50YWcgPSBjb2xsZWN0aW9uLnRhZztcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUob3B0aW9ucykpO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB2aWV3LmNvbGxlY3Rpb247XG5cblx0XHQvLyBUaGlzIGlzIHJlcGVhdGVkIGJldHdlZW4gYWxsIHZpZXdzIGN1cnJlbnRseSBhbmQgc28gbmVlZHMgYSByZWZhY3RvclxuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVQcmV2Jyk7XG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZU5leHQnKTtcblxuXHRcdC8vIEN1cnJlbnRseSBvbmx5IGZldGNoaW5nIG9uIHJlbmRlciBpZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSxcblx0XHQvLyBzdWJzZXF1ZW50IGZldGNoZXMgZm9yIG5ldyByZWNvcmRzIHdvdWxkIGJlIGhhbmRsZWQgc29tZXdoZXJlIG90aGVyIHRoYW4gaGVyZVxuXHRcdGlmIChjb2xsZWN0aW9uLmxlbmd0aCA8IDEpIHtcblxuXHRcdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKHtsb2FkaW5nOiB0cnVlfSkpO1xuXHRcdFx0dGhpcy5nZXROZXdSZWNvcmRzKCk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpOyBcdCBcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLmhlYWRlcixcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0dGhpcy5zZXRMaXN0ZW5lcnMoKTtcblx0fSxcblx0dG9SZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMudGVtcGxhdGUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXHR9LFxuXHR1cGRhdGVVaVByZXY6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIFx0dmFyICRwcmV2ID0gdGhpcy4kZWwuZmluZCgnLmdvLXByZXYnKTtcbiAgXHRpZiAob3B0aW9ucy5saW5rKSB7XG4gIFx0XHQkcHJldi5yZW1vdmVDbGFzcygnaGlkZScpLmF0dHIoJ2hyZWYnLCBvcHRpb25zLmxpbmspO1xuICBcdH0gZWxzZSB7XG4gIFx0XHQkcHJldi5hZGRDbGFzcygnaGlkZScpLnJlbW92ZUF0dHIoJ2hyZWYnKTtcbiAgXHR9XG4gIH0sXG4gIHVwZGF0ZVVpTmV4dDogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgXHR2YXIgJG5leHQgPSB0aGlzLiRlbC5maW5kKCcuZ28tbmV4dCcpO1xuICBcdGlmIChvcHRpb25zLmxpbmspIHtcbiAgXHRcdCRuZXh0LnJlbW92ZUNsYXNzKCdoaWRlJykuYXR0cignaHJlZicsIG9wdGlvbnMubGluayk7XG4gIFx0fSBlbHNlIHtcbiAgXHRcdCRuZXh0LmFkZENsYXNzKCdoaWRlJykucmVtb3ZlQXR0cignaHJlZicpO1xuICBcdH1cbiAgfSxcblx0c2V0TGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuXHRcdC8vIFxuXHRcdHRoaXMubGlzdGVuVG8od2luZG93LkJhY2tib25lLCAndWk6dXBkYXRlUHJldicsIHRoaXMudXBkYXRlVWlQcmV2KTtcblx0XHR0aGlzLmxpc3RlblRvKHdpbmRvdy5CYWNrYm9uZSwgJ3VpOnVwZGF0ZU5leHQnLCB0aGlzLnVwZGF0ZVVpTmV4dCk7XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHQvLyBldmVudHM6IHt9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMuanMnKTtcbnZhciBzdWdnZXN0ZWRUYWdzID0gcmVxdWlyZSgnLi4vc3VnZ2VzdGVkVGFncycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxkaXY+JyxcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLnJvb3QsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLmNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8gJChvcHRpb25zLmNvbnRhaW5lcikgOiBnbG9iYWwuQXBwLnZpZXdzLm1hc3Rlci4kZWw7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdC8vIFRoaXMgaXMgcmVwZWF0ZWQgYmV0d2VlbiBhbGwgdmlld3MgY3VycmVudGx5IGFuZCBzbyBuZWVkcyBhIHJlZmFjdG9yXG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZVByZXYnKTtcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlTmV4dCcpO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe3RhZ3M6IHN1Z2dlc3RlZFRhZ3N9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyJdfQ==
