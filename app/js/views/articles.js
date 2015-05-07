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
		var collection = this.collection;

		// Currently only fetching on render if the collection is empty,
		// subsequent fetches for new records would be handled somewhere other than here
		if (collection.length < 1) {

			this.$container.html(this.toRender({loading: true}));

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
		}
		this.$container.html(this.toRender());

		return this;
	},
	renderError: function (error) {
		this.$container.html(this.toRender({error: error}));
	}

});