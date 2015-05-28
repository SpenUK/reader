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