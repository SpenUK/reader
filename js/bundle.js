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

		console.log('get new');

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
		console.log('toRender', this.model);
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
		console.log('errors');
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
    console.log('updating Prev', options);
  	var $prev = this.$el.find('.go-prev');
  	if (options.link) {
  		$prev.removeClass('hide').attr('href', options.link);
  	} else {

  		$prev.addClass('hide').removeAttr('href');
  	}
  },
  updateUiNext: function(options){
    options = options || {};
    console.log('updating Next', options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvaGVscGVycy9maW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9oZWFkZXIuanMiLCJhcHAvanMvdmlld3MvbWFzdGVyLmpzIiwiYXBwL2pzL3ZpZXdzL3Jvb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXIuanMnKTtcbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy5qcycpO1xudmFyIGV4dGVuc2lvbnMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMuanMnKTtcblxudmFyIEFwcCA9IHtcblxuICB0ZW1wbGF0ZXM6IHRlbXBsYXRlcyxcbiAgZW50cnlQb2ludDogJy5hcHAnLFxuICBcbiAgLy8gU2V0IHVwIGZvciBjYWNoYWJsZSBCYWNrYm9uZSBjbGFzc2VzXG4gIHZpZXdzOiB7fSxcbiAgY29sbGVjdGlvbnM6IHt9LFxuICBtb2RlbHM6IHt9LFxuXG4gIGV4dGVuc2lvbnM6IGV4dGVuc2lvbnMsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcbiAgICB0aGlzLnZpZXdzLm1hc3RlciA9IG5ldyB0aGlzLmV4dGVuc2lvbnMudmlld3MubWFzdGVyKHtlbDogdGhpcy5lbnRyeVBvaW50fSk7XG4gICAgdGhpcy52aWV3cy5oZWFkZXIgPSBuZXcgdGhpcy5leHRlbnNpb25zLnZpZXdzLmhlYWRlcih7ZWw6ICdoZWFkZXInfSk7XG4gIFx0dGhpcy5yb3V0ZXIgPSBuZXcgcm91dGVyKHRoaXMpO1xuXG4gIH1cbn07XG4vLyBBc3NpZ25pbmcgQXBwIHRvIHRoZSBnbG9iYWwgKHdpbmRvdylcbmdsb2JhbC5BcHAgPSBBcHA7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvYXJ0aWNsZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG5cbiAgbW9kZWw6IG1vZGVsLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICB0YWc6ICd3ZWItZGV2ZWxvcG1lbnQnLFxuXG4gIC8vIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gIC8vICAgcmV0dXJuIHRoaXM7XG4gIC8vIH0sXG5cbiAgc2V0VGFnOiBmdW5jdGlvbih0YWcpIHtcbiAgICB0aGlzLnRhZyA9IHRhZztcbiAgICBnbG9iYWwuQXBwLmNvbGxlY3Rpb25zW3RoaXMudGFnXSA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdXJsOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAnaHR0cHM6Ly9wdWJsaWMtYXBpLndvcmRwcmVzcy5jb20vcmVzdC92MS4xL3JlYWQvdGFncy8nKyB0aGlzLnRhZyArJy9wb3N0cyc7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICByZXR1cm4gcmVzcG9uc2UucG9zdHM7XG4gIH0sXG5cbiAgZ2V0TmV4dE1vZGVsOiBmdW5jdGlvbihtb2RlbCl7XG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG4gICAgaWYgKGN1cnJlbnRJbmRleCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICByZXR1cm4gdGhpcy5hdCgoY3VycmVudEluZGV4ICsxID4gdGhpcy5sZW5ndGggLTEpPyAgZmFsc2UgOiBjdXJyZW50SW5kZXggKyAxKTtcbiAgfSxcblxuICBnZXRQcmV2TW9kZWw6IGZ1bmN0aW9uKG1vZGVsKXtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcblxuICAgIHJldHVybiB0aGlzLmF0KChjdXJyZW50SW5kZXggLTEgPCAwKSA/IGZhbHNlIDogY3VycmVudEluZGV4IC0gMSk7XG4gIH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbWFzdGVyVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvbWFzdGVyLmpzJyk7XG52YXIgaGVhZGVyVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvaGVhZGVyLmpzJyk7XG5cbnZhciByb290VmlldyA9IHJlcXVpcmUoJy4vdmlld3Mvcm9vdC5qcycpO1xudmFyIGFydGljbGVWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9hcnRpY2xlLmpzJyk7XG52YXIgYXJ0aWNsZXNWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9hcnRpY2xlcy5qcycpO1xuXG52YXIgYXJ0aWNsZXNDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9ucy9hcnRpY2xlcy5qcycpO1xuXG52YXIgYXJ0aWNsZU1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbHMvYXJ0aWNsZS5qcycpO1xuXG4vLyBNYWtpbmcgQmFja2JvbmUgY2xhc3MgZXh0ZW5zaW9ucyBhdmFpbGFibGUgdGhyb3VnaCBBcHAuZXh0ZW5zaW9uc1xuLy8gTWFpbmx5IGZvciB0ZXN0aW5nLCBidXQgYWxzbyBrZWVwcyB0aGUgYXBwIGxheW91dCBhIGxpdHRsZSBuZWF0ZXIuXG5cbm1vZHVsZS5leHBvcnRzID0geyBcblxuICB2aWV3czoge1xuICAgIG1hc3RlciAgICAgICAgICA6IG1hc3RlclZpZXcsXG4gICAgaGVhZGVyICAgICAgICAgIDogaGVhZGVyVmlldyxcbiAgXHRyb290IFx0XHRcdFx0XHRcdDogcm9vdFZpZXcsXG5cdFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZVZpZXcsXG5cdFx0YXJ0aWNsZXNcdFx0XHRcdDogYXJ0aWNsZXNWaWV3XG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgXHRhcnRpY2xlcyBcdFx0XHRcdDogYXJ0aWNsZXNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgbW9kZWxzOiB7XG4gIFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZU1vZGVsXG4gIH1cblxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhZykge1xuXHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblxuXHRyZXR1cm4gQXBwLmNvbGxlY3Rpb25zW3RhZ10gfHwgKG5ldyBBcHAuZXh0ZW5zaW9ucy5jb2xsZWN0aW9ucy5hcnRpY2xlcygpKS5zZXRUYWcodGFnKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBtYWluLmpzIGN1cnJlbnRseSBvbmx5IGhhcyB0d28gcmVzcG9uc2liaWxpdGllcyxcbi8vIHRvIHJlYWR5IEFwcCBieSBpbmNsdWRpbmcgaXQgYW5kIGluaXRpYWxpemluZyBpdCBhZnRlciBkb2N1bWVudCByZWFkeS5cblxucmVxdWlyZSgnLi9hcHAuanMnKTtcblxuJChkb2N1bWVudCkub24oJ3JlYWR5JywgZnVuY3Rpb24oKXtcblx0Z2xvYmFsLkFwcC5pbml0aWFsaXplKCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGlkQXR0cmlidXRlOiAnSUQnXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcgPSByZXF1aXJlKCcuL2hlbHBlcnMvZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnLmpzJyk7XG5cdFxubW9kdWxlLmV4cG9ydHMgPSAgd2luZG93LkJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuXHRyb3V0ZXM6IHtcblx0XHQnJzogJ3Jvb3QnLFxuXHRcdCc6dGFnJzogJ2FydGljbGVzJyxcblx0XHQnOnRhZy86c2x1Zyc6ICdhcnRpY2xlJ1xuXHR9LFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIEFwcCA9IGdsb2JhbC5BcHA7XG5cdFx0XG5cdFx0dGhpcy5vbigncm91dGU6cm9vdCcgLGZ1bmN0aW9uKCl7XG5cblx0XHRcdC8vIENyZWF0aW5nIGFuZCBjYWNoaW5nIHRoZSB2aWV3IGlmIGl0IGlzIG5vdCBhbHJlYWR5IGNhY2hlZFxuXHRcdFx0QXBwLnZpZXdzLnJvb3QgPSBBcHAudmlld3Mucm9vdCB8fCBuZXcgQXBwLmV4dGVuc2lvbnMudmlld3Mucm9vdCh7XG5cdFx0XHRcdGNvbnRhaW5lcjogQXBwLmVudHJ5UG9pbnRcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBUaGVuIHJlbmRlcmluZyB0aGUgdmlld1xuXHRcdFx0QXBwLnZpZXdzLnJvb3QucmVuZGVyKCk7XG5cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JvdXRlOmFydGljbGVzJyAsZnVuY3Rpb24odGFnKXtcblxuXHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcodGFnKTtcblxuXHRcdFx0dmFyIGNhY2hlTmFtZSA9IHRhZztcblxuXHRcdFx0QXBwLnZpZXdzW2NhY2hlTmFtZV0gPSAoQXBwLnZpZXdzW2NhY2hlTmFtZV0gfHwgbmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLmFydGljbGVzKHtcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbjogY29sbGVjdGlvblxuXHRcdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXS5yZW5kZXIoKTtcblxuXG5cdFx0fSk7XG5cblx0XHR0aGlzLm9uKCdyb3V0ZTphcnRpY2xlJyAsZnVuY3Rpb24odGFnLCBzbHVnKXtcblxuXHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBmaW5kT3JDcmVhdGVDb2xsZWN0aW9uQnlUYWcodGFnKTtcblxuXHRcdFx0dmFyIGNhY2hlTmFtZSA9IHRhZysnOicrc2x1ZztcblxuXHRcdFx0QXBwLnZpZXdzW2NhY2hlTmFtZV0gPSAoQXBwLnZpZXdzW2NhY2hlTmFtZV0gfHwgbmV3IEFwcC5leHRlbnNpb25zLnZpZXdzLmFydGljbGUoe1xuXHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb246IGNvbGxlY3Rpb24sXG5cdFx0XHRcdFx0XHRcdFx0c2x1Zzogc2x1Z1xuXHRcdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRBcHAudmlld3NbY2FjaGVOYW1lXS5yZW5kZXIoKTtcblxuXHRcdFx0XG5cdFx0fSk7XG5cblx0XHR3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xuXG5cdH1cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gKFxuW3tcblx0bmFtZTogJ2phdmFzY3JpcHQnXG59LHtcblx0bmFtZTogJ2JhY2tib25lLWpzJ1xufSx7XG5cdG5hbWU6ICdub2RlLWpzJ1xufSx7XG5cdG5hbWU6ICdpby1qcydcbn0se1xuXHRuYW1lOiAncnVieSdcbn0se1xuXHRuYW1lOiAncnVieS1vbi1yYWlscydcbn0se1xuXHRuYW1lOiAnZW1iZXItanMnXG59LHtcblx0bmFtZTogJ3JlYWN0LWpzJ1x0XG59XSk7IiwidmFyIGV4cG9ydHMgPSAoZnVuY3Rpb24gKCkgeyBcblxuIHZhciBIYW5kbGViYXJzID0gd2luZG93LkhhbmRsZWJhcnM7IFxuXG50aGlzW1wiSlNUXCJdID0gdGhpc1tcIkpTVFwiXSB8fCB7fTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGUtcHJldmlld1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIjxoMj5BcnRpY2xlIHByZXZpZXc8L2gyPlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGVcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiAgPGg0IGNsYXNzPVxcXCJlcnJvclxcXCI+T29wcyEgU29tZXRoaW5nIHdlbnQgd3JvbmchPC9oND5cXG4gIDxwIGNsYXNzPVxcXCJ0cnktYWdhaW5cXFwiPlRyeSBhZ2Fpbj88L3A+XFxuXFxuXCI7XG4gIH0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubG9hZGluZyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg0LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oNiwgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgICAgPGg0PkxvYWRpbmcuLi48L2g0PlxcblwiO1xuICB9LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmFydGljbGUgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNywgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDEzLCBkYXRhKSxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlxcblwiO1xufSxcIjdcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmFydGljbGUgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJ3aXRoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSg4LCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIiAgICAgIFx0PGRpdiBjbGFzcz1cXFwiYXJ0aWNsZV9fd3JhcHBlciBcIjtcbiAgc3RhY2sxID0gaGVscGVycy51bmxlc3MuY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zZWxlY3RlZCA6IGRlcHRoMCksIHtcIm5hbWVcIjpcInVubGVzc1wiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxcIj5cXG4gICAgICAgICAgPGFydGljbGUgY2xhc3M9XFxcImFydGljbGUgcGFwZXJcXFwiIGlkPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLnNsdWcgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNsdWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwic2x1Z1wiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYXJ0aWNsZV9faGVhZGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGgxPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvaDE+XFxuICAgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVxcXCJieS1saW5lIHRydW5jYXRlXFxcIj5CeTogXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF1dGhvciA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDExLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCIgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuVVJMIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5VUkwgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwiVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxpIGNsYXNzPVxcXCJmYSBmYS13b3JkcHJlc3NcXFwiIGFsdD1cXFwiVmlldyBhdCB3b3JkcHJlc3NcXFwiPjwvaT48L2E+XFxuICAgICAgICAgICAgICAgICAgPC9wPlxcblxcbiAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlX19jb250ZW50XFxcIj5cIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb250ZW50IHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb250ZW50IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImNvbnRlbnRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiPC9kaXY+XFxuICAgICAgICAgIDwvYXJ0aWNsZT5cXG4gICAgICAgIDwvZGl2PlxcblwiO1xufSxcIjlcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiBvdXQtb2YtZm9jdXNcIjtcbiAgfSxcIjExXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIiAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5pY2VfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmljZV9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5pY2VfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+IFxcblwiO1xufSxcIjEzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgICAgXHQ8aDI+QXJ0aWNsZSBub3QgZm91bmQ8L2gyPlxcblwiO1xuICB9LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazE7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5lcnJvcnMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IHJldHVybiBzdGFjazE7IH1cbiAgZWxzZSB7IHJldHVybiAnJzsgfVxuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGVzXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdDxoNCBjbGFzcz1cXFwiZXJyb3JcXFwiPk9vcHMhIFNvbWV0aGluZyB3ZW50IHdyb25nITwvaDQ+XFxuXHQ8cCBjbGFzcz1cXFwidHJ5LWFnYWluXFxcIj5UcnkgYWdhaW4/PC9wPlxcblxcblwiO1xuICB9LFwiM1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sb2FkaW5nIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDQsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDYsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdFx0PGg0PkxvYWRpbmcuLi48L2g0PlxcblwiO1xuICB9LFwiNlwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5tb2RlbHMgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oNywgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oMTQsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XFxuXCI7XG59LFwiN1wiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEsZGVwdGhzKSB7XG4gIHZhciBzdGFjazEsIGJ1ZmZlciA9IFwiXHRcdFx0PHVsIGNsYXNzPVxcXCJhcnRpY2xlcy1saXN0XFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubW9kZWxzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOCwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcdFx0XHQ8L3VsPlxcblwiO1xufSxcIjhcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hdHRyaWJ1dGVzIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oOSwgZGF0YSwgZGVwdGhzKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCI5XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBsYW1iZGE9dGhpcy5sYW1iZGEsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgYnVmZmVyID0gXCJcdFx0XHRcdFx0PGxpIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmcgcGFwZXJcXFwiPlxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XFxcImFydGljbGUtbGlzdGluZ19fY29udGFpbmVyXFxcIj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXV0aG9yIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMTAsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX2RldGFpbHNcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVxcXCJ0cnVuY2F0ZXJcXFwiPlxcblx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVxcXCJhcnRpY2xlLWxpc3RpbmdfX3RpdGxlIHRydW5jYXRlXFxcIiBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoZGVwdGhzWzJdICE9IG51bGwgPyBkZXB0aHNbMl0udGFnIDogZGVwdGhzWzJdKSwgZGVwdGgwKSlcbiAgICArIFwiL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT4gXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnNbJ3dpdGgnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmF1dGhvciA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEyLCBkYXRhLCBkZXB0aHMpLFwiaW52ZXJzZVwiOnRoaXMubm9vcCxcImRhdGFcIjpkYXRhfSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIlx0XHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHQ8L2xpPlxcblwiO1xufSxcIjEwXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5VUkwgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLlVSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJVUkxcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwiYXZhdGFyXFxcIiBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuYXZhdGFyX1VSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXZhdGFyX1VSTCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJhdmF0YXJfVVJMXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIik7XFxcIiBhbHQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmljZV9uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uaWNlX25hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmljZV9uYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+PC9kaXY+PC9hPlxcblwiO1xufSxcIjEyXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHRcdFx0XHRcdFx0XHRcdFx0PHAgY2xhc3M9XFxcImJ5LWxpbmUgdHJ1bmNhdGVcXFwiPkJ5OiA8YSBocmVmPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLlVSTCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuVVJMIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIlVSTFwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5pY2VfbmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmljZV9uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5pY2VfbmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCI8L2E+PC9wPlxcblwiO1xufSxcIjE0XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdFx0XHQ8aDI+Tm8gYXJ0aWNsZXMgZm91bmQ8L2gyPlxcblwiO1xuICB9LFwiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhLGRlcHRocykge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCI8aDI+UmVzdWx0cyBmb3IgJ1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGFnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGFnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIic8L2gyPlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuZXJyb3JzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiaWZcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDMsIGRhdGEsIGRlcHRocyksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyO1xufSxcInVzZURhdGFcIjp0cnVlLFwidXNlRGVwdGhzXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiaGVhZGVyXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwiZ3JpZC1jb250YWluZXIgaGVhZGVyX19jb250YWluZXJcXFwiPlxcblx0PGRpdiBjbGFzcz1cXFwiaGVhZGVyX19jb250ZW50XFxcIj5cXG5cXG5cdFx0PGEgY2xhc3M9XFxcImdvLXByZXYgaGlkZVxcXCI+XFxuXHRcdFx0PGkgY2xhc3M9XFxcImZhIGZhLWNoZXZyb24tbGVmdFxcXCI+PC9pPlxcblx0XHQ8L2E+XFxuXFxuXHRcdDxhIGNsYXNzPVxcXCJnby1uZXh0IGhpZGVcXFwiPlxcblx0XHRcdDxpIGNsYXNzPVxcXCJmYSBmYS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XFxuXHRcdDwvYT5cXG5cXG5cdFx0PG5hdiBjbGFzcz1cXFwiY29udHJvbHNcXFwiPlxcblx0XHRcdDxhIGhyZWY9XFxcIiNcXFwiPjxoMSBjbGFzcz1cXFwibG9nb1xcXCI+V1AgUmVhZGVyPC9oMT48L2E+XFxuXHRcdDwvbmF2Plxcblx0XHRcXG5cdDwvZGl2PlxcbjwvZGl2PlwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJyb290XCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG4gIHJldHVybiBcIlx0XHQ8bGk+XFxuXHRcdFx0PGEgaHJlZj1cXFwiIy9cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKGhlbHBlciA9IChoZWxwZXIgPSBoZWxwZXJzLm5hbWUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm5hbWUgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibmFtZVwiLFwiaGFzaFwiOnt9LFwiZGF0YVwiOmRhdGF9KSA6IGhlbHBlcikpKVxuICAgICsgXCJcXFwiPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT5cXG5cdFx0PC9saT5cXG5cIjtcbn0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCI8aDI+U3VnZ2VzdGVkIFRhZ3M8L2gyPlxcblxcbjx1bCBjbGFzcz1cXFwidGFnc1xcXCI+XFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRhZ3MgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJlYWNoXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCI8L3VsPlwiO1xufSxcInVzZURhdGFcIjp0cnVlfSk7XG4gcmV0dXJuIHRoaXNbJ0pTVCddO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0ZWw6ICc8YXJ0aWNsZT4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMuYXJ0aWNsZSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0dGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lciA/ICQob3B0aW9ucy5jb250YWluZXIpIDogZ2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIuJGVsO1xuXHRcdHRoaXMudGFnID0gb3B0aW9ucy50YWc7XG5cdFx0dGhpcy5zbHVnID0gb3B0aW9ucy5zbHVnO1xuXHRcdHRoaXMubW9kZWwgPSB0aGlzLmNvbGxlY3Rpb24uZmluZFdoZXJlKHtzbHVnOiBvcHRpb25zLnNsdWd9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayBwLnRyeS1hZ2FpbicgOiAndGhpcy5nZXROZXdSZWNvcmRzJ1xuXHR9LFxuXG5cdGdldE5ld1JlY29yZHM6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cdFx0dmFyIGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cblx0XHRjb25zb2xlLmxvZygnZ2V0IG5ldycpO1xuXG5cdFx0dmFyIGZyYWdtZW50ID0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQ7XG5cdFx0Y29sbGVjdGlvbi5mZXRjaCh7XG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBPbmx5IGNhbGwgcmVuZGVyIGlmIHRoZSB1cmwgZnJhZ21lbnQgaXMgdGhlIHNhbWUsIG90aGVyd2lzZSBhIHVzZXIgbWlnaHQgbmF2aWdhdGUgdG8gYW5vdGhlciByb3V0ZSxcbiAgICAgICAgLy8gYnV0IHRoZSByZW5kZXIgd291bGQgc3RpbGwgYmUgY2FsbGVkIGFuZCB0YWtlIGVmZmVjdC5cbiAgICAgICAgaWYgKGZyYWdtZW50ID09PSB3aW5kb3cuQmFja2JvbmUuaGlzdG9yeS5mcmFnbWVudCkge1xuXHRcdFx0XHRcdHZpZXcubW9kZWwgPSBjb2xsZWN0aW9uLmZpbmRXaGVyZSh7c2x1Zzogdmlldy5zbHVnfSk7XG5cdFx0XHRcdFx0dmlldy5yZW5kZXIoKTtcblx0XHRcdFx0XHR2aWV3LnRyaWdnZXJQcmV2QW5kTmV4dFVwZGF0ZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2aWV3LnJlbmRlckVycm9yKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9LFxuXG5cdHRvUmVuZGVyOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0Y29uc29sZS5sb2coJ3RvUmVuZGVyJywgdGhpcy5tb2RlbCk7XG5cdFx0dmFyIHRlbXBsYXRlRGF0YSA9IHRoaXMubW9kZWwgPyB7YXJ0aWNsZTogdGhpcy5tb2RlbC50b0pTT04oKX0gOiB7fTtcblxuXHRcdHRlbXBsYXRlRGF0YS5sb2FkaW5nID0gb3B0aW9ucy5sb2FkaW5nO1xuXHRcdHRlbXBsYXRlRGF0YS5lcnJvcnMgPSBvcHRpb25zLmVycm9ycztcblxuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGVtcGxhdGVEYXRhKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdmlldy5jb2xsZWN0aW9uO1xuXG5cdFx0Ly8gQ3VycmVudGx5IG9ubHkgZmV0Y2hpbmcgb24gcmVuZGVyIGlmIHRoZSBjb2xsZWN0aW9uIGlzIGVtcHR5LFxuICAgIC8vIHN1YnNlcXVlbnQgZmV0Y2hlcyBmb3IgbmV3IHJlY29yZHMgd291bGQgYmUgaGFuZGxlZCBzb21ld2hlcmUgb3RoZXIgdGhhbiBoZXJlXG5cdFx0aWYgKGNvbGxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuXG5cdFx0XHQvLyBUcmlnZ2VyaW5nIHRoZXNlIGV2ZW50cyB3aXRob3V0IGEgbGluayBwYXJhbSBjYXVzZXMgdGhlIGNvbXBvbmVudHMgdG8gYmUgaGlkZGVuXG5cdFx0XHR0aGlzLnRyaWdnZXJQcmV2QW5kTmV4dFVwZGF0ZXMoKTtcblxuXHRcdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKHtsb2FkaW5nOiB0cnVlfSkpO1xuXHRcdFx0dGhpcy5nZXROZXdSZWNvcmRzKCk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdC8vIFRyaWdnZXJpbmcgZXZlbnRzIHRoYXQgd2lsbCB1cGRhdGUgdWkgY29tcG9uZW50c1xuXHRcdHRoaXMudHJpZ2dlclByZXZBbmROZXh0VXBkYXRlcygpO1xuXHRcdC8vIHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVQcmV2Jywge2xpbms6IHRoaXMucHJldlJvdXRlKCl9KTtcblx0XHQvLyB3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlTmV4dCcsIHtsaW5rOiB0aGlzLm5leHRSb3V0ZSgpfSk7XG5cblx0XHR0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRyZW5kZXJFcnJvcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHR9LFxuXG5cdHRyaWdnZXJQcmV2QW5kTmV4dFVwZGF0ZXM6IGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZVByZXYnLCB7bGluazogdGhpcy5wcmV2Um91dGUoKX0pO1xuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVOZXh0Jywge2xpbms6IHRoaXMubmV4dFJvdXRlKCl9KTtcblx0fSxcblxuXHRnZXROZXh0TW9kZWw6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbi5nZXROZXh0TW9kZWwodGhpcy5tb2RlbCk7XG5cdH0sXG5cblx0Z2V0UHJldk1vZGVsOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZ2V0UHJldk1vZGVsKHRoaXMubW9kZWwpO1xuXHR9LFxuXG5cdG5leHRSb3V0ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgbW9kZWwgPSB0aGlzLmdldE5leHRNb2RlbCgpO1xuXHRcdHJldHVybiBtb2RlbD8gJyMvJysgdGhpcy5jb2xsZWN0aW9uLnRhZyArJy8nICsgbW9kZWwuZ2V0KCdzbHVnJykgOiBmYWxzZTtcblx0fSxcblxuXHRwcmV2Um91dGU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1vZGVsID0gdGhpcy5nZXRQcmV2TW9kZWwoKTtcblx0XHRyZXR1cm4gbW9kZWw/ICcjLycrIHRoaXMuY29sbGVjdGlvbi50YWcgKycvJyArIG1vZGVsLmdldCgnc2x1ZycpIDogZmFsc2U7XG5cdH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPHNlY3Rpb24+JyxcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLmFydGljbGVzLFxuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0dGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lciA/ICQob3B0aW9ucy5jb250YWluZXIpIDogZ2xvYmFsLkFwcC52aWV3cy5tYXN0ZXIuJGVsO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayBwLnRyeS1hZ2FpbicgOiAndGhpcy5nZXROZXdSZWNvcmRzJ1xuXHR9LFxuXHRnZXROZXdSZWNvcmRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG5cdFx0Ly8gdGFraW5nIHRoZSBjdXJyZW50IGZyYWdtZW50IHRvIGJlIGNoZWNrZWQgYWZ0ZXIgdGhlIGZldGNoLlxuXHRcdHZhciBmcmFnbWVudCA9IHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LmZyYWdtZW50O1xuXHRcdGNvbGxlY3Rpb24uZmV0Y2goe1xuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oKXtcblx0XHRcdFx0Ly8gT25seSBjYWxsIHJlbmRlciBpZiB0aGUgdXJsIGZyYWdtZW50IGlzIHRoZSBzYW1lLCBvdGhlcndpc2UgYSB1c2VyIG1pZ2h0IG5hdmlnYXRlIHRvIGFub3RoZXIgcm91dGUsXG5cdFx0XHRcdC8vIGJ1dCB0aGUgcmVuZGVyIHdvdWxkIHN0aWxsIGJlIGNhbGxlZCBhbmQgdGFrZSBlZmZlY3QuXG5cdFx0XHRcdGlmIChmcmFnbWVudCA9PT0gd2luZG93LkJhY2tib25lLmhpc3RvcnkuZnJhZ21lbnQpIHtcblx0XHRcdFx0XHR2aWV3LnJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZpZXcucmVuZGVyRXJyb3IoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH0sXG5cdHRvUmVuZGVyOiBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0dmFyIHZpZXcgPSB0aGlzO1xuXHRcdHZhciBjb2xsZWN0aW9uID0gdmlldy5jb2xsZWN0aW9uO1xuXG5cdFx0b3B0aW9ucy5tb2RlbHMgPSBjb2xsZWN0aW9uLm1vZGVscztcblx0XHRvcHRpb25zLnRhZyA9IGNvbGxlY3Rpb24udGFnO1xuXG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZShvcHRpb25zKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblxuXHRcdC8vIFRoaXMgaXMgcmVwZWF0ZWQgYmV0d2VlbiBhbGwgdmlld3MgY3VycmVudGx5IGFuZCBzbyBuZWVkcyBhIHJlZmFjdG9yXG5cdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoJ3VpOnVwZGF0ZVByZXYnKTtcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlTmV4dCcpO1xuXG5cdFx0Ly8gQ3VycmVudGx5IG9ubHkgZmV0Y2hpbmcgb24gcmVuZGVyIGlmIHRoZSBjb2xsZWN0aW9uIGlzIGVtcHR5LFxuXHRcdC8vIHN1YnNlcXVlbnQgZmV0Y2hlcyBmb3IgbmV3IHJlY29yZHMgd291bGQgYmUgaGFuZGxlZCBzb21ld2hlcmUgb3RoZXIgdGhhbiBoZXJlXG5cdFx0aWYgKGNvbGxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuXG5cdFx0XHR0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoe2xvYWRpbmc6IHRydWV9KSk7XG5cdFx0XHR0aGlzLmdldE5ld1JlY29yZHMoKTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlckVycm9yOiBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS5sb2coJ2Vycm9ycycpO1xuXHRcdHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcih7ZXJyb3JzOiB0cnVlfSkpO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpOyBcdCBcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLmhlYWRlcixcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0dGhpcy5zZXRMaXN0ZW5lcnMoKTtcblx0fSxcblx0dG9SZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHRoaXMudGVtcGxhdGUoKTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy4kZWwuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXHR9LFxuXHR1cGRhdGVVaVByZXY6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZyBQcmV2Jywgb3B0aW9ucyk7XG4gIFx0dmFyICRwcmV2ID0gdGhpcy4kZWwuZmluZCgnLmdvLXByZXYnKTtcbiAgXHRpZiAob3B0aW9ucy5saW5rKSB7XG4gIFx0XHQkcHJldi5yZW1vdmVDbGFzcygnaGlkZScpLmF0dHIoJ2hyZWYnLCBvcHRpb25zLmxpbmspO1xuICBcdH0gZWxzZSB7XG5cbiAgXHRcdCRwcmV2LmFkZENsYXNzKCdoaWRlJykucmVtb3ZlQXR0cignaHJlZicpO1xuICBcdH1cbiAgfSxcbiAgdXBkYXRlVWlOZXh0OiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zb2xlLmxvZygndXBkYXRpbmcgTmV4dCcsIG9wdGlvbnMpO1xuICBcdHZhciAkbmV4dCA9IHRoaXMuJGVsLmZpbmQoJy5nby1uZXh0Jyk7XG4gIFx0aWYgKG9wdGlvbnMubGluaykge1xuICBcdFx0JG5leHQucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hdHRyKCdocmVmJywgb3B0aW9ucy5saW5rKTtcbiAgXHR9IGVsc2Uge1xuICBcdFx0JG5leHQuYWRkQ2xhc3MoJ2hpZGUnKS5yZW1vdmVBdHRyKCdocmVmJyk7XG4gIFx0fVxuICB9LFxuXHRzZXRMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG5cdFx0Ly8gXG5cdFx0dGhpcy5saXN0ZW5Ubyh3aW5kb3cuQmFja2JvbmUsICd1aTp1cGRhdGVQcmV2JywgdGhpcy51cGRhdGVVaVByZXYpO1xuXHRcdHRoaXMubGlzdGVuVG8od2luZG93LkJhY2tib25lLCAndWk6dXBkYXRlTmV4dCcsIHRoaXMudXBkYXRlVWlOZXh0KTtcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdC8vIGV2ZW50czoge31cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xudmFyIHN1Z2dlc3RlZFRhZ3MgPSByZXF1aXJlKCcuLi9zdWdnZXN0ZWRUYWdzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPGRpdj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMucm9vdCxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIgPyAkKG9wdGlvbnMuY29udGFpbmVyKSA6IGdsb2JhbC5BcHAudmlld3MubWFzdGVyLiRlbDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHRvUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gVGhpcyBpcyByZXBlYXRlZCBiZXR3ZWVuIGFsbCB2aWV3cyBjdXJyZW50bHkgYW5kIHNvIG5lZWRzIGEgcmVmYWN0b3Jcblx0XHR3aW5kb3cuQmFja2JvbmUudHJpZ2dlcigndWk6dXBkYXRlUHJldicpO1xuXHRcdHdpbmRvdy5CYWNrYm9uZS50cmlnZ2VyKCd1aTp1cGRhdGVOZXh0Jyk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7dGFnczogc3VnZ2VzdGVkVGFnc30pKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5jb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7Il19
