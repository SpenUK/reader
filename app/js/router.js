'use strict';

var findOrCreateCollectionByTag = require('./helpers/findOrCreateCollectionByTag.js');
	
module.exports =  window.Backbone.Router.extend({
	routes: {
		'': 'root',
		':tag': 'articles',
		':tag/:slug': 'article'
		// default route?
	},

	initialize: function(){
		var App = global.App;

		this.on('route', function(){
			// Every route change is to emit data, for now just the fragment so that breadcrumbs can be updated
			window.Backbone.trigger('ui:updateBreadcrumbs', {fragment: window.Backbone.history.fragment});
		});
		
		this.on('route:root' ,function(){

			// Creating and caching the view if it is not already cached
			App.views.root = App.views.root || new App.extensions.views.root({
				container: App.entryPoint
			});

			// Then rendering the view
			App.views.root.render();

		});

		this.on('route:articles' ,function(tag){

			var collection = findOrCreateCollectionByTag(tag);

			var cacheName = tag;

			App.views[cacheName] = (App.views[cacheName] || new App.extensions.views.articles({
							collection: collection
						}));

			App.views[cacheName].render();


		});

		this.on('route:article' ,function(tag, slug){

			var collection = findOrCreateCollectionByTag(tag);

			var cacheName = tag+':'+slug;

			App.views[cacheName] = (App.views[cacheName] || new App.extensions.views.article({
								collection: collection,
								slug: slug
						}));

			App.views[cacheName].render();

			
		});

		window.Backbone.history.start();

	}
});