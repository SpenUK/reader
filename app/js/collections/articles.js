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