var articleMocker = require('../helpers/articleMocker.js');

var initialResponse = articleMocker.generateRecords({
	IDs: ['00001', '00002', '00003', '00004', '00005']
});

var partialyMatchingResponse = articleMocker.generateRecords({
	IDs: ['00001', '00002', '00003', '00006', '00007']
});

describe('Collections', function(){

	describe('Articles collection', function(){

		// beforeEach(function() {
		// 	var collection = new App.extensions.collections.articles();
		// });

		it('should initialize with no models', function () {
			var collection = new App.extensions.collections.articles();

			expect(collection.length).toEqual(0);
		});

		it('should add a number of models based on the response json', function(){
			var collection = new App.extensions.collections.articles();

			collection.add(initialResponse);
			expect(collection.length).toEqual(5);
		});

		it('should not add duplicate records', function(){

			var collection = new App.extensions.collections.articles();

			collection.add(initialResponse);
			expect(collection.length).toEqual(5);

			collection.add(partialyMatchingResponse);
			expect(collection.length).toEqual(7);

			collection.add(partialyMatchingResponse);
			expect(collection.length).toEqual(7);

		});

		it('should have a valid URL based on it\'s "tag" value', function(){
			var collection = new App.extensions.collections.articles();
			collection.tag = 'example-tag';

			expect(collection.url()).toEqual('https://public-api.wordpress.com/rest/v1.1/read/tags/example-tag/posts');
		});

		it('should use a default tag ("web-development") to form a valid URL if no tag is supplied', function(){
			var collection = new App.extensions.collections.articles();

			expect(collection.url()).toEqual('https://public-api.wordpress.com/rest/v1.1/read/tags/web-development/posts');
		});

		it('instances should be cached according to the instance\'s tag value', function(){
			var collection = new App.extensions.collections.articles();
			collection.setTag('example-tag');

			var collection = new App.extensions.collections.articles();
			collection.setTag('another-example-tag');

			expect(App.collections['example-tag']).toBeDefined();
			expect(App.collections['another-example-tag']).toBeDefined();
			
		});

	});
});

