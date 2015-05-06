'use strict';

function findOrCreateCollectionByTag(tag) {
	var App = global.App;

	App.collections[tag] = (
		App.collections[tag] || new App.extensions.collections.articles({
														 	tag: tag
														})
	);

	return App.collections[tag];
}
	

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
				collection: collection,
				container: App.entryPoint
			})
			// rendering immediately after, keeps the calls to cached/non-cached views consistant
			).render();

		});

		this.on('route:article' ,function(tag, slug){

			var collection = findOrCreateCollectionByTag(tag);
			// Get the first model in the collection with a macthing slug
			// Returns undefined if there is no match, which the view will handle
			var model = collection.findWhere({slug: slug});

			console.log(model);

			(new App.extensions.views.article({
				model: model,
				container: App.entryPoint
			})
			).render();
			
		});

		window.Backbone.history.start();

	}
});