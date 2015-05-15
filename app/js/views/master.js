'use strict';

module.exports = window.Backbone.View.extend({
	renderToAppView: function(view, el){
		this.$el.empty().append(el);
		view.delegateEvents(view.events);
	}
});