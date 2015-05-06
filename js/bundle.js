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

},{"./extensions.js":3,"./router.js":6,"./templates.js":8}],2:[function(require,module,exports){
'use strict';

var model = require('../models/article.js');
var defaultTag = 'webdevelopmet';

module.exports = window.Backbone.Collection.extend({

  model: model,
  isLoading: false,
  initialize: function (options) {
  	var collection = this;
  	options = (options || {});
  	this.tag = options.tag;

  	this.fetch({
  		success: function(){
  			// Triggering an event through Backbones eventing system - to be picked up by the view to re-render
  			window.Backbone.trigger( collection.tag + ':fetchResponse');
  		}
  	});
  },
  url: function(){
  	// A collection should not ever be made without taking 'tag' as an option, but to be safe a default is provided.
    return ( this.tag ?
    	'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ this.tag +'/posts' :
    	'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ defaultTag +'/posts'
    );
  },
  parse: function(response){
    return response.posts;
  }
  // wordpress 'read' endpoints don't need to be jsonp, some others do (unless auth'd)
  // jsonp: false
});
},{"../models/article.js":5}],3:[function(require,module,exports){
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
},{"./collections/articles.js":2,"./models/article.js":5,"./views/article.js":9,"./views/articles.js":10,"./views/root.js":11}],4:[function(require,module,exports){
(function (global){
'use strict';

// main.js currently only has two responsibilities,
// to ready App by including it and initializing it after document ready.

require('./app.js');

$(document).on('ready', function(){
	global.App.initialize();
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./app.js":1}],5:[function(require,module,exports){
'use strict';

module.exports = window.Backbone.Model.extend({
	idAttribute: 'ID'
});
},{}],6:[function(require,module,exports){
(function (global){
'use strict';

function findOrCreateCollectionByTag(tag) {
	var App = global.App;

	App.collections[tag] = (
		App.collections[tag] || new App.extensions.collections.articles({
														 	tag: tag
														})
	);

	return App.collections[tag];
}
	

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
			var model = collection.findWhere({slug: slug});

			(new App.extensions.views.article({
				model: model,
				container: App.entryPoint
			})
			).render();
			
		});

		window.Backbone.history.start();

	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var exports = (function () { 

 var Handlebars = window.Handlebars; 

this["JST"] = this["JST"] || {};

this["JST"]["article-preview"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Article preview</h2>";
  },"useData":true});

this["JST"]["article"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"with","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  	<h2>WP Article</h2>\n\n  	<div class=\"wp-post__wrapper ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n      <div class=\"click-block\"></div>\n      <article class=\"wp-post\" id=\""
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\">\n          <div class=\"wp-post__header\">\n            <h1>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n          </div>\n\n          <div class=\"wp-post__content\">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n\n      </article>\n    </div>\n";
},"3":function(depth0,helpers,partials,data) {
  return " out-of-focus";
  },"5":function(depth0,helpers,partials,data) {
  return "	<h2>Article not found</h2>\n\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(5, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});

this["JST"]["articles"] = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['with'].call(depth0, (depth0 != null ? depth0.attributes : depth0), {"name":"with","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data,depths) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "				<h4>model: <a href=\"#/"
    + escapeExpression(lambda((depths[2] != null ? depths[2].tag : depths[2]), depth0))
    + "/"
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\"> "
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "</a></h4>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<h2>WP Articles "
    + escapeExpression(((helper = (helper = helpers.tag || (depth0 != null ? depth0.tag : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tag","hash":{},"data":data}) : helper)))
    + " - "
    + escapeExpression(((helper = (helper = helpers.length || (depth0 != null ? depth0.length : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"length","hash":{},"data":data}) : helper)))
    + "</h2>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
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
},{}],9:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: '<article>',

	template: templates.article,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

		return this;
	},

	toRender: function () {
		var templateData = this.model ? {article: this.model.toJSON()} : {};

		return this.$el.html(this.template(templateData));
	},

	render: function(){
		this.$container.html(this.toRender());

		return this;
	}

});
},{"../templates.js":8}],10:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({
	
	el: '<section>',

	template: templates.articles,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

		var view = this;

		this.listenToOnce(window.Backbone, this.collection.tag + ':fetchResponse', view.render);

		return this;
	},

	toRender: function (options) {
		options = (options || {});
		var view = this;
		var collection = view.collection;
		var models = collection.models;

		console.log(models);
		return this.$el.html(this.template({models: models, tag: collection.tag, length: models.length}));
	},

	render: function(){
		// options = (options || {});
		this.$container.html(this.toRender());

		return this;
	}

});
},{"../templates.js":8}],11:[function(require,module,exports){
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
},{"../suggestedTags":7,"../templates.js":8}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvc3VnZ2VzdGVkVGFncy5qcyIsImFwcC9qcy90ZW1wbGF0ZXMuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZS5qcyIsImFwcC9qcy92aWV3cy9hcnRpY2xlcy5qcyIsImFwcC9qcy92aWV3cy9yb290LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlci5qcycpO1xudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJyk7XG52YXIgZXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy5qcycpO1xuXG52YXIgQXBwID0ge1xuXG4gIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICBlbnRyeVBvaW50OiAnYm9keSAuYXBwJyxcbiAgXG4gIC8vIFNldCB1cCBmb3IgY2FjaGFibGUgQmFja2JvbmUgY2xhc3Nlc1xuICB2aWV3czoge30sXG4gIGNvbGxlY3Rpb25zOiB7fSxcbiAgbW9kZWxzOiB7fSxcblxuICBleHRlbnNpb25zOiBleHRlbnNpb25zLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgLy8gdGhpcy52aWV3cy5tYXN0ZXIgPSBuZXcgdGhpcy5leHRlbnNpb25zLnZpZXdzLm1hc3RlcigpO1xuICBcdHRoaXMucm91dGVyID0gbmV3IHJvdXRlcih0aGlzKTtcbiAgfVxufTtcbi8vIEFzc2lnbmluZyBBcHAgdG8gdGhlIGdsb2JhbCAod2luZG93KVxuZ2xvYmFsLkFwcCA9IEFwcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9hcnRpY2xlLmpzJyk7XG52YXIgZGVmYXVsdFRhZyA9ICd3ZWJkZXZlbG9wbWV0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG4gIG1vZGVsOiBtb2RlbCxcbiAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgXHR2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG4gIFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcbiAgXHR0aGlzLnRhZyA9IG9wdGlvbnMudGFnO1xuXG4gIFx0dGhpcy5mZXRjaCh7XG4gIFx0XHRzdWNjZXNzOiBmdW5jdGlvbigpe1xuICBcdFx0XHQvLyBUcmlnZ2VyaW5nIGFuIGV2ZW50IHRocm91Z2ggQmFja2JvbmVzIGV2ZW50aW5nIHN5c3RlbSAtIHRvIGJlIHBpY2tlZCB1cCBieSB0aGUgdmlldyB0byByZS1yZW5kZXJcbiAgXHRcdFx0d2luZG93LkJhY2tib25lLnRyaWdnZXIoIGNvbGxlY3Rpb24udGFnICsgJzpmZXRjaFJlc3BvbnNlJyk7XG4gIFx0XHR9XG4gIFx0fSk7XG4gIH0sXG4gIHVybDogZnVuY3Rpb24oKXtcbiAgXHQvLyBBIGNvbGxlY3Rpb24gc2hvdWxkIG5vdCBldmVyIGJlIG1hZGUgd2l0aG91dCB0YWtpbmcgJ3RhZycgYXMgYW4gb3B0aW9uLCBidXQgdG8gYmUgc2FmZSBhIGRlZmF1bHQgaXMgcHJvdmlkZWQuXG4gICAgcmV0dXJuICggdGhpcy50YWcgP1xuICAgIFx0J2h0dHBzOi8vcHVibGljLWFwaS53b3JkcHJlc3MuY29tL3Jlc3QvdjEuMS9yZWFkL3RhZ3MvJysgdGhpcy50YWcgKycvcG9zdHMnIDpcbiAgICBcdCdodHRwczovL3B1YmxpYy1hcGkud29yZHByZXNzLmNvbS9yZXN0L3YxLjEvcmVhZC90YWdzLycrIGRlZmF1bHRUYWcgKycvcG9zdHMnXG4gICAgKTtcbiAgfSxcbiAgcGFyc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICByZXR1cm4gcmVzcG9uc2UucG9zdHM7XG4gIH1cbiAgLy8gd29yZHByZXNzICdyZWFkJyBlbmRwb2ludHMgZG9uJ3QgbmVlZCB0byBiZSBqc29ucCwgc29tZSBvdGhlcnMgZG8gKHVubGVzcyBhdXRoJ2QpXG4gIC8vIGpzb25wOiBmYWxzZVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcm9vdFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL3Jvb3QuanMnKTtcbnZhciBhcnRpY2xlVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZS5qcycpO1xudmFyIGFydGljbGVzVmlldyA9IHJlcXVpcmUoJy4vdmlld3MvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVzQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMvYXJ0aWNsZXMuanMnKTtcblxudmFyIGFydGljbGVNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWxzL2FydGljbGUuanMnKTtcblxuLy8gTWFraW5nIEJhY2tib25lIGNsYXNzIGV4dGVuc2lvbnMgYXZhaWxhYmxlIHRocm91Z2ggQXBwLmV4dGVuc2lvbnNcbi8vIE1haW5seSBmb3IgdGVzdGluZywgYnV0IGFsc28ga2VlcHMgdGhlIGFwcCBsYXlvdXQgYSBsaXR0bGUgbmVhdGVyLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXG5cbiAgdmlld3M6IHtcbiAgXHRyb290IFx0XHRcdFx0XHRcdDogcm9vdFZpZXcsXG5cdFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZVZpZXcsXG5cdFx0YXJ0aWNsZXNcdFx0XHRcdDogYXJ0aWNsZXNWaWV3XG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgXHRhcnRpY2xlcyBcdFx0XHRcdDogYXJ0aWNsZXNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgbW9kZWxzOiB7XG4gIFx0YXJ0aWNsZSBcdFx0XHRcdDogYXJ0aWNsZU1vZGVsXG4gIH1cblxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIG1haW4uanMgY3VycmVudGx5IG9ubHkgaGFzIHR3byByZXNwb25zaWJpbGl0aWVzLFxuLy8gdG8gcmVhZHkgQXBwIGJ5IGluY2x1ZGluZyBpdCBhbmQgaW5pdGlhbGl6aW5nIGl0IGFmdGVyIGRvY3VtZW50IHJlYWR5LlxuXG5yZXF1aXJlKCcuL2FwcC5qcycpO1xuXG4kKGRvY3VtZW50KS5vbigncmVhZHknLCBmdW5jdGlvbigpe1xuXHRnbG9iYWwuQXBwLmluaXRpYWxpemUoKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0aWRBdHRyaWJ1dGU6ICdJRCdcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZykge1xuXHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblxuXHRBcHAuY29sbGVjdGlvbnNbdGFnXSA9IChcblx0XHRBcHAuY29sbGVjdGlvbnNbdGFnXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMuY29sbGVjdGlvbnMuYXJ0aWNsZXMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBcdHRhZzogdGFnXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0KTtcblxuXHRyZXR1cm4gQXBwLmNvbGxlY3Rpb25zW3RhZ107XG59XG5cdFxuXG5tb2R1bGUuZXhwb3J0cyA9ICB3aW5kb3cuQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdHJvdXRlczoge1xuXHRcdCcnOiAncm9vdCcsXG5cdFx0Jzp0YWcnOiAnYXJ0aWNsZXMnLFxuXHRcdCc6dGFnLzpzbHVnJzogJ2FydGljbGUnXG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblx0XHRcblx0XHR0aGlzLm9uKCdyb3V0ZTpyb290JyAsZnVuY3Rpb24oKXtcblxuXHRcdFx0Ly8gQ3JlYXRpbmcgYW5kIGNhY2hpbmcgdGhlIHZpZXcgaWYgaXQgaXMgbm90IGFscmVhZHkgY2FjaGVkXG5cdFx0XHRBcHAudmlld3Mucm9vdCA9IEFwcC52aWV3cy5yb290IHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5yb290KHtcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoZW4gcmVuZGVyaW5nIHRoZSB2aWV3XG5cdFx0XHRBcHAudmlld3Mucm9vdC5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZXMnICxmdW5jdGlvbih0YWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHQvLyBOb3QgY2FjaGluZyB0aGUgdmlldy4gQ291bGQgYmUgYSBmdXR1cmUgY2hhbmdlIGlmIGhvbGRpbmcgc3RhdGUgZm9yIHJlLXZpc2l0c1xuXHRcdFx0Ly8gYmVjb21lcyBkZXNpcmFibGVcblx0XHRcdChuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZXMoe1xuXHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuXHRcdFx0XHRjb250YWluZXI6IEFwcC5lbnRyeVBvaW50XG5cdFx0XHR9KVxuXHRcdFx0Ly8gcmVuZGVyaW5nIGltbWVkaWF0ZWx5IGFmdGVyLCBrZWVwcyB0aGUgY2FsbHMgdG8gY2FjaGVkL25vbi1jYWNoZWQgdmlld3MgY29uc2lzdGFudFxuXHRcdFx0KS5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZScgLGZ1bmN0aW9uKHRhZywgc2x1Zyl7XG5cblx0XHRcdHZhciBjb2xsZWN0aW9uID0gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZyk7XG5cdFx0XHQvLyBHZXQgdGhlIGZpcnN0IG1vZGVsIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggYSBtYWN0aGluZyBzbHVnXG5cdFx0XHQvLyBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBtYXRjaCwgd2hpY2ggdGhlIHZpZXcgd2lsbCBoYW5kbGVcblx0XHRcdHZhciBtb2RlbCA9IGNvbGxlY3Rpb24uZmluZFdoZXJlKHtzbHVnOiBzbHVnfSk7XG5cblx0XHRcdChuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZSh7XG5cdFx0XHRcdG1vZGVsOiBtb2RlbCxcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSlcblx0XHRcdCkucmVuZGVyKCk7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cblx0fVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSAoXG5be1xuXHRuYW1lOiAnamF2YXNjcmlwdCdcbn0se1xuXHRuYW1lOiAnYmFja2JvbmVqcydcbn0se1xuXHRuYW1lOiAnbm9kZWpzJ1xufSx7XG5cdG5hbWU6ICdpb2pzJ1xufSx7XG5cdG5hbWU6ICdydWJ5J1xufSx7XG5cdG5hbWU6ICdydWJ5b25yYWlscydcbn0se1xuXHRuYW1lOiAnZW1iZXJqcydcbn0se1xuXHRuYW1lOiAncmVhY3RqcydcdFxufV0pOyIsInZhciBleHBvcnRzID0gKGZ1bmN0aW9uICgpIHsgXG5cbiB2YXIgSGFuZGxlYmFycyA9IHdpbmRvdy5IYW5kbGViYXJzOyBcblxudGhpc1tcIkpTVFwiXSA9IHRoaXNbXCJKU1RcIl0gfHwge307XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlLXByZXZpZXdcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8aDI+QXJ0aWNsZSBwcmV2aWV3PC9oMj5cIjtcbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG5cbnRoaXNbXCJKU1RcIl1bXCJhcnRpY2xlXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlwiO1xuICBzdGFjazEgPSBoZWxwZXJzWyd3aXRoJ10uY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5hcnRpY2xlIDogZGVwdGgwKSwge1wibmFtZVwiOlwid2l0aFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMiwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCIyXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgYnVmZmVyID0gXCIgIFx0PGgyPldQIEFydGljbGU8L2gyPlxcblxcbiAgXHQ8ZGl2IGNsYXNzPVxcXCJ3cC1wb3N0X193cmFwcGVyIFwiO1xuICBzdGFjazEgPSBoZWxwZXJzLnVubGVzcy5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnNlbGVjdGVkIDogZGVwdGgwKSwge1wibmFtZVwiOlwidW5sZXNzXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgzLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLm5vb3AsXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gXCJcXFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImNsaWNrLWJsb2NrXFxcIj48L2Rpdj5cXG4gICAgICA8YXJ0aWNsZSBjbGFzcz1cXFwid3AtcG9zdFxcXCIgaWQ9XFxcIlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIndwLXBvc3RfX2hlYWRlclxcXCI+XFxuICAgICAgICAgICAgPGgxPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvaDE+XFxuICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ3cC1wb3N0X19jb250ZW50XFxcIj5cIjtcbiAgc3RhY2sxID0gKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5jb250ZW50IHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5jb250ZW50IDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcImNvbnRlbnRcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiPC9kaXY+XFxuXFxuICAgICAgPC9hcnRpY2xlPlxcbiAgICA8L2Rpdj5cXG5cIjtcbn0sXCIzXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCIgb3V0LW9mLWZvY3VzXCI7XG4gIH0sXCI1XCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCJcdDxoMj5BcnRpY2xlIG5vdCBmb3VuZDwvaDI+XFxuXFxuXCI7XG4gIH0sXCJjb21waWxlclwiOls2LFwiPj0gMi4wLjAtYmV0YS4xXCJdLFwibWFpblwiOmZ1bmN0aW9uKGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLmFydGljbGUgOiBkZXB0aDApLCB7XCJuYW1lXCI6XCJpZlwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5wcm9ncmFtKDUsIGRhdGEpLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlciArIFwiXFxuXCI7XG59LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGVzXCJdID0gSGFuZGxlYmFycy50ZW1wbGF0ZSh7XCIxXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgYnVmZmVyID0gXCJcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snd2l0aCddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXR0cmlidXRlcyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcIndpdGhcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDIsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCIyXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIGhlbHBlciwgbGFtYmRhPXRoaXMubGFtYmRhLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbiwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3Npbmc7XG4gIHJldHVybiBcIlx0XHRcdFx0PGg0Pm1vZGVsOiA8YSBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKGxhbWJkYSgoZGVwdGhzWzJdICE9IG51bGwgPyBkZXB0aHNbMl0udGFnIDogZGVwdGhzWzJdKSwgZGVwdGgwKSlcbiAgICArIFwiL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuc2x1ZyB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuc2x1ZyA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJzbHVnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvYT48L2g0PlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSxkZXB0aHMpIHtcbiAgdmFyIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBoZWxwZXJNaXNzaW5nPWhlbHBlcnMuaGVscGVyTWlzc2luZywgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIGJ1ZmZlciA9IFwiPGgyPldQIEFydGljbGVzIFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGFnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWcgOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwidGFnXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIiAtIFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubGVuZ3RoIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5sZW5ndGggOiBkZXB0aDApKSAhPSBudWxsID8gaGVscGVyIDogaGVscGVyTWlzc2luZyksKHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge1wibmFtZVwiOlwibGVuZ3RoXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvaDI+XFxuXFxuXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLm1vZGVscyA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImVhY2hcIixcImhhc2hcIjp7fSxcImZuXCI6dGhpcy5wcm9ncmFtKDEsIGRhdGEsIGRlcHRocyksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZSxcInVzZURlcHRoc1wiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcInJvb3RcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGhlbHBlck1pc3Npbmc9aGVscGVycy5oZWxwZXJNaXNzaW5nLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcbiAgcmV0dXJuIFwiXHQ8YSBocmVmPVxcXCIjL1wiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMubmFtZSB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAubmFtZSA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJuYW1lXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIlxcXCI+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5uYW1lIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5uYW1lIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcIm5hbWVcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiPC9hPlxcblwiO1xufSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIjxoMj5Sb290IFZpZXc8L2gyPlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC50YWdzIDogZGVwdGgwKSwge1wibmFtZVwiOlwiZWFjaFwiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMSwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuIHJldHVybiB0aGlzWydKU1QnXTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0czsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG5cdGVsOiAnPGFydGljbGU+JyxcblxuXHR0ZW1wbGF0ZTogdGVtcGxhdGVzLmFydGljbGUsXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IChvcHRpb25zIHx8IHt9KTtcblx0XHR0aGlzLiRjb250YWluZXIgPSAkKHRoaXMuY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0dG9SZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdGVtcGxhdGVEYXRhID0gdGhpcy5tb2RlbCA/IHthcnRpY2xlOiB0aGlzLm1vZGVsLnRvSlNPTigpfSA6IHt9O1xuXG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZURhdGEpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHR2YXIgdmlldyA9IHRoaXM7XG5cblx0XHR0aGlzLmxpc3RlblRvT25jZSh3aW5kb3cuQmFja2JvbmUsIHRoaXMuY29sbGVjdGlvbi50YWcgKyAnOmZldGNoUmVzcG9uc2UnLCB2aWV3LnJlbmRlcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHZhciB2aWV3ID0gdGhpcztcblx0XHR2YXIgY29sbGVjdGlvbiA9IHZpZXcuY29sbGVjdGlvbjtcblx0XHR2YXIgbW9kZWxzID0gY29sbGVjdGlvbi5tb2RlbHM7XG5cblx0XHRjb25zb2xlLmxvZyhtb2RlbHMpO1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe21vZGVsczogbW9kZWxzLCB0YWc6IGNvbGxlY3Rpb24udGFnLCBsZW5ndGg6IG1vZGVscy5sZW5ndGh9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdC8vIG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xudmFyIHN1Z2dlc3RlZFRhZ3MgPSByZXF1aXJlKCcuLi9zdWdnZXN0ZWRUYWdzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPGRpdj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMucm9vdCxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe3RhZ3M6IHN1Z2dlc3RlZFRhZ3N9KSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuJGNvbnRhaW5lci5odG1sKHRoaXMudG9SZW5kZXIoKSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTsiXX0=
