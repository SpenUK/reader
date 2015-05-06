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