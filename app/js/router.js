'use strict';

// var extensions = require('./extensions.js');

module.exports =  window.Backbone.Router.extend({
	routes: {
		'': 'root',
		':tag': 'articles',
		':tag/:slug': 'article'
	},

	initialize: function(){
		
		this.on('route:root' ,function(){
			console.log('root route');
		});

		this.on('route:articles' ,function(tag){
			console.log('tag route', {tag: tag});
		});

		this.on('route:article' ,function(tag, slug){
			console.log('article route', {tag: tag, slug: slug});
		});

		window.Backbone.history.start();

	}
});

// var collection = global.App.collections.spuds = (
// 				global.App.collections.spuds || new global.App.extensions.collections.spuds()
// 			);
// 			new extensions.views.spud({
// 				container: global.App.entryPoint,
// 				collection: collection,
// 				slug: slug
// 			});