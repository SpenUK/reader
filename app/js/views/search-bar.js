'use strict';

var templates = require('../templates.js');

module.exports = window.Backbone.View.extend({

	el: 'section.search-bar',

	template: templates['search-bar'],

	initialize: function(options){
		options = (options || {});

		return this;
	},

	events: {
		'submit form.search-bar__form' : 'handleSearch'
	},
	// Unimplemented
	// Event: 'keyup .search-bar__search-input'
	inputFinished: function(){
		clearTimeout(this.typeTimeout);
		this.typeTimeout = setTimeout(function(){
			// Delayed keyup functionality
		}, 1000);
		
	},

	handleSearch: function(e){
		e.preventDefault();

		// val isn't so rubust - improve this.
		var val = $(e.target).find('input').val().trim();
		if (!val.length) { return false; }

		// Process val with regex? make sure that it's url safe.	
		window.Backbone.history.navigate(val.split(' ')[0].trim(), {trigger: true});
	},

	render: function(options){
		options = (options || {});

		this.$el.html(this.template());

		return this;
	}

});