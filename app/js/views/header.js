'use strict';

var templates = require('../templates.js'); 	 

module.exports = window.Backbone.View.extend({
	template: templates.header,
	initialize: function () {
		this.render();
		this.setListeners();
	},
	toRender: function(){
		return this.template();
	},
	render: function () {
		this.$el.html(this.toRender());
	},
	updateUiPrev: function(options){
    options = options || {};

  	var $prev = this.$el.find('.go-prev');
  	if (options.link) {
  		$prev.removeClass('hide').attr('href', options.link);
  	} else {
  		$prev.addClass('hide').removeAttr('href');
  	}
  },
  updateUiNext: function(options){
    options = options || {};

  	var $next = this.$el.find('.go-next');
  	if (options.link) {
  		$next.removeClass('hide').attr('href', options.link);
  	} else {
  		$next.addClass('hide').removeAttr('href');
  	}
  },
	setListeners: function(){
		// 
		this.listenTo(window.Backbone, 'ui:updatePrev', this.updateUiPrev);
		this.listenTo(window.Backbone, 'ui:updateNext', this.updateUiNext);
	}
});