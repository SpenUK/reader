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