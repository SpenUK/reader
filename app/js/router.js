'use strict';

var findOrCreateCollectionByTag = require('./helpers/findOrCreateCollectionByTag.js');
	
module.exports =  window.Backbone.Router.extend({
	routes: {
		'': 'root',
		':tag': 'articles',
		':tag/:slug': 'article'
	},

	initialize: function(){
		var App = global.App;
		
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

			// Not caching the view. Could be a future change if holding state for re-visits
			// becomes desirable
			(new App.extensions.views.articles({
				collection: collection
			})
			// rendering immediately after, keeps the calls to cached/non-cached views consistant
			).render();

		});

		this.on('route:article' ,function(tag, slug){

			var collection = findOrCreateCollectionByTag(tag);
			// Get the first model in the collection with a macthing slug
			// Returns undefined if there is no match, which the view will handle
			(new App.extensions.views.article({
				collection: collection,
				slug: slug
			})
			).render();
			
		});

		window.Backbone.history.start();

	}
});