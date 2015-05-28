'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	template: templates.breadcrumbs,

	initialize: function(options){
		options = (options || {});

		this.breadcrumbs = options.breadcrumbs;

		return this;
	},

	events: {
	},

	render: function(options){
		options = (options || {});

		options.breadcrumbs = this.breadcrumbs;

		console.log('rendering breadcrumbs');

		this.$el.html(this.template(options));

		return this;
	}

});