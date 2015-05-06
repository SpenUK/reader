'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: '<article>',

	template: templates.article,

	initialize: function(options){
		options = (options || {});
		this.$container = $(this.container = options.container);

		return this;
	},

	toRender: function () {
		var templateData = this.model ? {article: this.model.toJSON()} : {};

		return this.$el.html(this.template(templateData));
	},

	render: function(){
		this.$container.html(this.toRender());

		return this;
	}

});