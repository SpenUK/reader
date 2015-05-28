'use strict';

var templates = require('../templates.js');
var  _ = window._;

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
  updateBreadcrumbs: function (options) {
  	options = options || {};
  	var fragment = options.fragment.replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
  	var crumbs = _.filter(fragment.split('/'), function(s){
  		return s.length; // ensuring that no 0 length strings pass through
  	});

  	console.log(crumbs);

  	crumbs = _.map(crumbs, function(crumb, i){
  		return {
  			title: crumb,
  			i: i,
  			link: '#/' + fragment.substring(0, fragment.indexOf(crumb) + crumb.length)
  		};
  	});

  	(new global.App.extensions.views.breadcrumbs({
  		el: 'header .breadcrumbs',
  		breadcrumbs: crumbs
  	})).render();

  	return this;
  },
	setListeners: function(){
		// 
		this.listenTo(window.Backbone, 'ui:updatePrev', this.updateUiPrev);
		this.listenTo(window.Backbone, 'ui:updateNext', this.updateUiNext);
		this.listenTo(window.Backbone, 'ui:clearPrevAndNext', function(){
			this.updateUiPrev();
			this.updateUiNext();
		});

		this.listenTo(window.Backbone, 'ui:updateBreadcrumbs', this.updateBreadcrumbs);
	}
});