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

},{"./extensions.js":3,"./router.js":6,"./templates.js":7}],2:[function(require,module,exports){
'use strict';

var model = require('../models/article.js');

module.exports = window.Backbone.Collection.extend({

  model: model,
  isLoading: false,
  url: function(){
    return 'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ this.tag +'/posts';
  },
  parse: function(response){
    return response.posts;
  }
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
},{"./collections/articles.js":2,"./models/article.js":5,"./views/article.js":8,"./views/articles.js":9,"./views/root.js":10}],4:[function(require,module,exports){
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
var exports = (function () { 

 var Handlebars = window.Handlebars; 

this["JST"] = this["JST"] || {};

this["JST"]["article-preview"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Article preview</h2>";
  },"useData":true});

this["JST"]["article"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "	<h2>WP Article</h2>\n\n	<div class=\"wp-post__wrapper ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.selected : depth0), {"name":"unless","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n  <div class=\"click-block\"></div>\n  <article class=\"wp-post\" id=\""
    + escapeExpression(((helper = (helper = helpers.slug || (depth0 != null ? depth0.slug : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"slug","hash":{},"data":data}) : helper)))
    + "\">\n      <div class=\"wp-post__header\">\n        <h1>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n      </div>\n\n      <div class=\"wp-post__content\">";
  stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n\n  </article>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  return " out-of-focus";
  },"4":function(depth0,helpers,partials,data) {
  return "	<h2>Article not found</h2>\n\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.article : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});

this["JST"]["articles"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>WP Articles</h2>";
  },"useData":true});

this["JST"]["root"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h2>Root View</h2>";
  },"useData":true});
 return this['JST'];
})();

module.exports = exports;
},{}],8:[function(require,module,exports){
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
},{"../templates.js":7}],9:[function(require,module,exports){
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

	toRender: function () {
		return this.$el.html(this.template());
	},

	render: function(){
		// options = (options || {});

		this.$container.html(this.toRender());

		return this;
	}

});
},{"../templates.js":7}],10:[function(require,module,exports){
'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({
	
	el: '<div>',

	template: templates.root,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

		return this;
	},

	toRender: function () {
		return this.$el.html(this.template());
	},

	render: function(){

		this.$container.html(this.toRender());

		return this;
	}

});
},{"../templates.js":7}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzIiwiYXBwL2pzL2V4dGVuc2lvbnMuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9tb2RlbHMvYXJ0aWNsZS5qcyIsImFwcC9qcy9yb3V0ZXIuanMiLCJhcHAvanMvdGVtcGxhdGVzLmpzIiwiYXBwL2pzL3ZpZXdzL2FydGljbGUuanMiLCJhcHAvanMvdmlld3MvYXJ0aWNsZXMuanMiLCJhcHAvanMvdmlld3Mvcm9vdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlci5qcycpO1xudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzLmpzJyk7XG52YXIgZXh0ZW5zaW9ucyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy5qcycpO1xuXG52YXIgQXBwID0ge1xuXG4gIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICBlbnRyeVBvaW50OiAnYm9keSAuYXBwJyxcbiAgXG4gIC8vIFNldCB1cCBmb3IgY2FjaGFibGUgQmFja2JvbmUgY2xhc3Nlc1xuICB2aWV3czoge30sXG4gIGNvbGxlY3Rpb25zOiB7fSxcbiAgbW9kZWxzOiB7fSxcblxuICBleHRlbnNpb25zOiBleHRlbnNpb25zLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgLy8gdGhpcy52aWV3cy5tYXN0ZXIgPSBuZXcgdGhpcy5leHRlbnNpb25zLnZpZXdzLm1hc3RlcigpO1xuICBcdHRoaXMucm91dGVyID0gbmV3IHJvdXRlcih0aGlzKTtcbiAgfVxufTtcbi8vIEFzc2lnbmluZyBBcHAgdG8gdGhlIGdsb2JhbCAod2luZG93KVxuZ2xvYmFsLkFwcCA9IEFwcDsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcblxuICBtb2RlbDogbW9kZWwsXG4gIGlzTG9hZGluZzogZmFsc2UsXG4gIHVybDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJ2h0dHBzOi8vcHVibGljLWFwaS53b3JkcHJlc3MuY29tL3Jlc3QvdjEuMS9yZWFkL3RhZ3MvJysgdGhpcy50YWcgKycvcG9zdHMnO1xuICB9LFxuICBwYXJzZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHJldHVybiByZXNwb25zZS5wb3N0cztcbiAgfVxuICAvLyBqc29ucDogZmFsc2Vcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJvb3RWaWV3ID0gcmVxdWlyZSgnLi92aWV3cy9yb290LmpzJyk7XG52YXIgYXJ0aWNsZVZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGUuanMnKTtcbnZhciBhcnRpY2xlc1ZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlc0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb25zL2FydGljbGVzLmpzJyk7XG5cbnZhciBhcnRpY2xlTW9kZWwgPSByZXF1aXJlKCcuL21vZGVscy9hcnRpY2xlLmpzJyk7XG5cbi8vIE1ha2luZyBCYWNrYm9uZSBjbGFzcyBleHRlbnNpb25zIGF2YWlsYWJsZSB0aHJvdWdoIEFwcC5leHRlbnNpb25zXG4vLyBNYWlubHkgZm9yIHRlc3RpbmcsIGJ1dCBhbHNvIGtlZXBzIHRoZSBhcHAgbGF5b3V0IGEgbGl0dGxlIG5lYXRlci5cblxubW9kdWxlLmV4cG9ydHMgPSB7IFxuXG4gIHZpZXdzOiB7XG4gIFx0cm9vdCBcdFx0XHRcdFx0XHQ6IHJvb3RWaWV3LFxuXHRcdGFydGljbGUgXHRcdFx0XHQ6IGFydGljbGVWaWV3LFxuXHRcdGFydGljbGVzXHRcdFx0XHQ6IGFydGljbGVzVmlld1xuICB9LFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gIFx0YXJ0aWNsZXMgXHRcdFx0XHQ6IGFydGljbGVzQ29sbGVjdGlvblxuICB9LFxuXG4gIG1vZGVsczoge1xuICBcdGFydGljbGUgXHRcdFx0XHQ6IGFydGljbGVNb2RlbFxuICB9XG5cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBtYWluLmpzIGN1cnJlbnRseSBvbmx5IGhhcyB0d28gcmVzcG9uc2liaWxpdGllcyxcbi8vIHRvIHJlYWR5IEFwcCBieSBpbmNsdWRpbmcgaXQgYW5kIGluaXRpYWxpemluZyBpdCBhZnRlciBkb2N1bWVudCByZWFkeS5cblxucmVxdWlyZSgnLi9hcHAuanMnKTtcblxuJChkb2N1bWVudCkub24oJ3JlYWR5JywgZnVuY3Rpb24oKXtcblx0Z2xvYmFsLkFwcC5pbml0aWFsaXplKCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdFxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZykge1xuXHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblxuXHRBcHAuY29sbGVjdGlvbnNbdGFnXSA9IChcblx0XHRBcHAuY29sbGVjdGlvbnNbdGFnXSB8fCBuZXcgQXBwLmV4dGVuc2lvbnMuY29sbGVjdGlvbnMuYXJ0aWNsZXMoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBcdHRhZzogdGFnXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcblx0KTtcblxuXHRyZXR1cm4gQXBwLmNvbGxlY3Rpb25zW3RhZ107XG59XG5cdFxuXG5tb2R1bGUuZXhwb3J0cyA9ICB3aW5kb3cuQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cdHJvdXRlczoge1xuXHRcdCcnOiAncm9vdCcsXG5cdFx0Jzp0YWcnOiAnYXJ0aWNsZXMnLFxuXHRcdCc6dGFnLzpzbHVnJzogJ2FydGljbGUnXG5cdH0sXG5cblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgQXBwID0gZ2xvYmFsLkFwcDtcblx0XHRcblx0XHR0aGlzLm9uKCdyb3V0ZTpyb290JyAsZnVuY3Rpb24oKXtcblxuXHRcdFx0Ly8gQ3JlYXRpbmcgYW5kIGNhY2hpbmcgdGhlIHZpZXcgaWYgaXQgaXMgbm90IGFscmVhZHkgY2FjaGVkXG5cdFx0XHRBcHAudmlld3Mucm9vdCA9IEFwcC52aWV3cy5yb290IHx8IG5ldyBBcHAuZXh0ZW5zaW9ucy52aWV3cy5yb290KHtcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFRoZW4gcmVuZGVyaW5nIHRoZSB2aWV3XG5cdFx0XHRBcHAudmlld3Mucm9vdC5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZXMnICxmdW5jdGlvbih0YWcpe1xuXG5cdFx0XHR2YXIgY29sbGVjdGlvbiA9IGZpbmRPckNyZWF0ZUNvbGxlY3Rpb25CeVRhZyh0YWcpO1xuXG5cdFx0XHQvLyBOb3QgY2FjaGluZyB0aGUgdmlldy4gQ291bGQgYmUgYSBmdXR1cmUgY2hhbmdlIGlmIGhvbGRpbmcgc3RhdGUgZm9yIHJlLXZpc2l0c1xuXHRcdFx0Ly8gYmVjb21lcyBkZXNpcmFibGVcblx0XHRcdChuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZXMoe1xuXHRcdFx0XHRjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuXHRcdFx0XHRjb250YWluZXI6IEFwcC5lbnRyeVBvaW50XG5cdFx0XHR9KVxuXHRcdFx0Ly8gcmVuZGVyaW5nIGltbWVkaWF0ZWx5IGFmdGVyLCBrZWVwcyB0aGUgY2FsbHMgdG8gY2FjaGVkL25vbi1jYWNoZWQgdmlld3MgY29uc2lzdGFudFxuXHRcdFx0KS5yZW5kZXIoKTtcblxuXHRcdH0pO1xuXG5cdFx0dGhpcy5vbigncm91dGU6YXJ0aWNsZScgLGZ1bmN0aW9uKHRhZywgc2x1Zyl7XG5cblx0XHRcdHZhciBjb2xsZWN0aW9uID0gZmluZE9yQ3JlYXRlQ29sbGVjdGlvbkJ5VGFnKHRhZyk7XG5cdFx0XHQvLyBHZXQgdGhlIGZpcnN0IG1vZGVsIGluIHRoZSBjb2xsZWN0aW9uIHdpdGggYSBtYWN0aGluZyBzbHVnXG5cdFx0XHQvLyBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBubyBtYXRjaCwgd2hpY2ggdGhlIHZpZXcgd2lsbCBoYW5kbGVcblx0XHRcdHZhciBtb2RlbCA9IGNvbGxlY3Rpb24uZmluZFdoZXJlKHtzbHVnOiBzbHVnfSk7XG5cblx0XHRcdChuZXcgQXBwLmV4dGVuc2lvbnMudmlld3MuYXJ0aWNsZSh7XG5cdFx0XHRcdG1vZGVsOiBtb2RlbCxcblx0XHRcdFx0Y29udGFpbmVyOiBBcHAuZW50cnlQb2ludFxuXHRcdFx0fSlcblx0XHRcdCkucmVuZGVyKCk7XG5cdFx0XHRcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5CYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG5cblx0fVxufSk7IiwidmFyIGV4cG9ydHMgPSAoZnVuY3Rpb24gKCkgeyBcblxuIHZhciBIYW5kbGViYXJzID0gd2luZG93LkhhbmRsZWJhcnM7IFxuXG50aGlzW1wiSlNUXCJdID0gdGhpc1tcIkpTVFwiXSB8fCB7fTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGUtcHJldmlld1wiXSA9IEhhbmRsZWJhcnMudGVtcGxhdGUoe1wiY29tcGlsZXJcIjpbNixcIj49IDIuMC4wLWJldGEuMVwiXSxcIm1haW5cIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIjxoMj5BcnRpY2xlIHByZXZpZXc8L2gyPlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcImFydGljbGVcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcIjFcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHZhciBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgaGVscGVyTWlzc2luZz1oZWxwZXJzLmhlbHBlck1pc3NpbmcsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBidWZmZXIgPSBcIlx0PGgyPldQIEFydGljbGU8L2gyPlxcblxcblx0PGRpdiBjbGFzcz1cXFwid3AtcG9zdF9fd3JhcHBlciBcIjtcbiAgc3RhY2sxID0gaGVscGVycy51bmxlc3MuY2FsbChkZXB0aDAsIChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zZWxlY3RlZCA6IGRlcHRoMCksIHtcIm5hbWVcIjpcInVubGVzc1wiLFwiaGFzaFwiOnt9LFwiZm5cIjp0aGlzLnByb2dyYW0oMiwgZGF0YSksXCJpbnZlcnNlXCI6dGhpcy5ub29wLFwiZGF0YVwiOmRhdGF9KTtcbiAgaWYgKHN0YWNrMSAhPSBudWxsKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImNsaWNrLWJsb2NrXFxcIj48L2Rpdj5cXG4gIDxhcnRpY2xlIGNsYXNzPVxcXCJ3cC1wb3N0XFxcIiBpZD1cXFwiXCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChoZWxwZXIgPSAoaGVscGVyID0gaGVscGVycy5zbHVnIHx8IChkZXB0aDAgIT0gbnVsbCA/IGRlcHRoMC5zbHVnIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInNsdWdcIixcImhhc2hcIjp7fSxcImRhdGFcIjpkYXRhfSkgOiBoZWxwZXIpKSlcbiAgICArIFwiXFxcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJ3cC1wb3N0X19oZWFkZXJcXFwiPlxcbiAgICAgICAgPGgxPlwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMudGl0bGUgfHwgKGRlcHRoMCAhPSBudWxsID8gZGVwdGgwLnRpdGxlIDogZGVwdGgwKSkgIT0gbnVsbCA/IGhlbHBlciA6IGhlbHBlck1pc3NpbmcpLCh0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtcIm5hbWVcIjpcInRpdGxlXCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSkpXG4gICAgKyBcIjwvaDE+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cXFwid3AtcG9zdF9fY29udGVudFxcXCI+XCI7XG4gIHN0YWNrMSA9ICgoaGVscGVyID0gKGhlbHBlciA9IGhlbHBlcnMuY29udGVudCB8fCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuY29udGVudCA6IGRlcHRoMCkpICE9IG51bGwgPyBoZWxwZXIgOiBoZWxwZXJNaXNzaW5nKSwodHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7XCJuYW1lXCI6XCJjb250ZW50XCIsXCJoYXNoXCI6e30sXCJkYXRhXCI6ZGF0YX0pIDogaGVscGVyKSk7XG4gIGlmIChzdGFjazEgIT0gbnVsbCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIHJldHVybiBidWZmZXIgKyBcIjwvZGl2PlxcblxcbiAgPC9hcnRpY2xlPlxcbjwvZGl2PlxcblwiO1xufSxcIjJcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIiBvdXQtb2YtZm9jdXNcIjtcbiAgfSxcIjRcIjpmdW5jdGlvbihkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHJldHVybiBcIlx0PGgyPkFydGljbGUgbm90IGZvdW5kPC9oMj5cXG5cXG5cIjtcbiAgfSxcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB2YXIgc3RhY2sxLCBidWZmZXIgPSBcIlwiO1xuICBzdGFjazEgPSBoZWxwZXJzWydpZiddLmNhbGwoZGVwdGgwLCAoZGVwdGgwICE9IG51bGwgPyBkZXB0aDAuYXJ0aWNsZSA6IGRlcHRoMCksIHtcIm5hbWVcIjpcImlmXCIsXCJoYXNoXCI6e30sXCJmblwiOnRoaXMucHJvZ3JhbSgxLCBkYXRhKSxcImludmVyc2VcIjp0aGlzLnByb2dyYW0oNCwgZGF0YSksXCJkYXRhXCI6ZGF0YX0pO1xuICBpZiAoc3RhY2sxICE9IG51bGwpIHsgYnVmZmVyICs9IHN0YWNrMTsgfVxuICByZXR1cm4gYnVmZmVyICsgXCJcXG5cIjtcbn0sXCJ1c2VEYXRhXCI6dHJ1ZX0pO1xuXG50aGlzW1wiSlNUXCJdW1wiYXJ0aWNsZXNcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8aDI+V1AgQXJ0aWNsZXM8L2gyPlwiO1xuICB9LFwidXNlRGF0YVwiOnRydWV9KTtcblxudGhpc1tcIkpTVFwiXVtcInJvb3RcIl0gPSBIYW5kbGViYXJzLnRlbXBsYXRlKHtcImNvbXBpbGVyXCI6WzYsXCI+PSAyLjAuMC1iZXRhLjFcIl0sXCJtYWluXCI6ZnVuY3Rpb24oZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICByZXR1cm4gXCI8aDI+Um9vdCBWaWV3PC9oMj5cIjtcbiAgfSxcInVzZURhdGFcIjp0cnVlfSk7XG4gcmV0dXJuIHRoaXNbJ0pTVCddO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cblx0ZWw6ICc8YXJ0aWNsZT4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMuYXJ0aWNsZSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB0ZW1wbGF0ZURhdGEgPSB0aGlzLm1vZGVsID8ge2FydGljbGU6IHRoaXMubW9kZWwudG9KU09OKCl9IDoge307XG5cdFx0cmV0dXJuIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZURhdGEpKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5CYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cdFxuXHRlbDogJzxzZWN0aW9uPicsXG5cblx0dGVtcGxhdGU6IHRlbXBsYXRlcy5hcnRpY2xlcyxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXHRcdC8vIG9wdGlvbnMgPSAob3B0aW9ucyB8fCB7fSk7XG5cblx0XHR0aGlzLiRjb250YWluZXIuaHRtbCh0aGlzLnRvUmVuZGVyKCkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi4vdGVtcGxhdGVzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LkJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblx0XG5cdGVsOiAnPGRpdj4nLFxuXG5cdHRlbXBsYXRlOiB0ZW1wbGF0ZXMucm9vdCxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRvcHRpb25zID0gKG9wdGlvbnMgfHwge30pO1xuXHRcdHRoaXMuJGNvbnRhaW5lciA9ICQodGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcik7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR0b1JlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoKSk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpe1xuXG5cdFx0dGhpcy4kY29udGFpbmVyLmh0bWwodGhpcy50b1JlbmRlcigpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cbn0pOyJdfQ==
