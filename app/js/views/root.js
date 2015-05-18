'use strict';

var templates = require('../templates.js');
var suggestedTags = require('../suggestedTags');

module.exports = window.Backbone.View.extend({
	
	el: '<div>',

	events: {
		'submit form.search-var__form' : 'handleSearchForm'
	},

	template: templates.root,

	initialize: function(options){
		options = (options || {});
		this.container = options.container ? $(options.container) : global.App.views.master.$el;

		return this;
	},

	handleSearchForm: function(e){
		e.preventDefault();

		// val isn't so rubust - improve this.
		var val = $(e.target).find('input').val().trim();
		if (!val.length) { return false; }

		// Process val with regex? make sure that it's url safe.	
		window.Backbone.history.navigate(val.split(' ')[0].trim(), {trigger: true});
	},

	toRender: function () {
		// This is repeated between all views currently and so needs a refactor
		window.Backbone.trigger('ui:updatePrev');
		window.Backbone.trigger('ui:updateNext');
		

		return this.$el.html(this.template({tags: suggestedTags}));
	},

	render: function(){
		this.container.html(this.toRender());

		global.App.views.master.renderToAppView( this, this.toRender());

		return this;
	}

});