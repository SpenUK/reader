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

			// this.container.html(this.toRender({loading: true}));
			global.App.views.master.renderToAppView( this, this.toRender({loading: true}));
			this.getNewRecords();

			return this;
		}

		// Triggering events that will update ui components
		this.triggerPrevAndNextUpdates();
		// window.Backbone.trigger('ui:updatePrev', {link: this.prevRoute()});
		// window.Backbone.trigger('ui:updateNext', {link: this.nextRoute()});

		// this.container.html(this.toRender());
		global.App.views.master.renderToAppView( this, this.toRender());

		return this;
	},

	renderError: function () {
		// this.container.html(this.toRender({errors: true}));
		global.App.views.master.renderToAppView( this, this.toRender({errors: true}));
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