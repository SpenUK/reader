'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: '<article>',

	template: templates.article,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);
		this.tag = options.tag;
		this.slug = options.slug;
		this.model = this.collection.findWhere({slug: options.slug});

		return this;
	},

	toRender: function (options) {
		options = (options || {});
		var templateData = this.model ? {article: this.model.toJSON()} : {};

		templateData.loading = options.loading;

		return this.$el.html(this.template(templateData));
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
						view.model = collection.findWhere({slug: view.slug});
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