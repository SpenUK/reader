'use strict';

var templates = require('../templates.js');

console.log(typeof templates.header);

module.exports = window.Backbone.View.extend({
	// events: {}
	template: templates.header,
	initialize: function () {
		this.render();
	},
	toRender: function(){
		return this.template();
	},
	render: function () {
		this.$el.html(this.toRender());
	}
});