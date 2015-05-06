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
		var models = collection.models;

		// if (options.fetch) {
		// 	this.collection.fetch({
		// 		success: function(){
		// 			view.render();
		// 		}
		// 	});	
		// };

		

		console.log(models);
		return this.$el.html(this.template({models: models, tag: collection.tag, length: models.length}));
	},

	render: function(){
		// options = (options || {});

		this.$container.html(this.toRender());

		return this;
	}

});