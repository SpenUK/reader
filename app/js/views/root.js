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