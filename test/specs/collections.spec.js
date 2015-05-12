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

		describe('Getting Prev and Next models', function() {

			// beforeEach(function() {
			// 	var collection = new App.extensions.collections.articles();
			// 			collection.add(initialResponse);
			// });

			it('should return the prev model in it\'s set when given a model that it contains', function(){
				var collection = (new App.extensions.collections.articles()).setTag('example-tag');
				collection.add(initialResponse);

				var inputModel = collection.findWhere({ID : '00003'});
				var previousModel = collection.getPrevModel(inputModel);

				expect(previousModel.get('ID')).toBe('00002');

			});

			it('should return the next model in it\'s set when given a model that it contains', function(){
				var collection = (new App.extensions.collections.articles()).setTag('example-tag');
				collection.add(initialResponse);

				var inputModel = collection.findWhere({ID : '00003'});
				var previousModel = collection.getNextModel(inputModel);

				expect(previousModel.get('ID')).toBe('00004');

			});

			it('should return false when attempting to get the previous model if the input model is the first of the set', function(){
				var collection = (new App.extensions.collections.articles()).setTag('example-tag');
				collection.add(initialResponse);

				var inputModel = collection.findWhere({ID : '00001'});
				var previousModel = collection.getPrevModel(inputModel);

				expect(!!previousModel).toBe(false);

			});

			it('should return false when attempting to get the next model if the input model is the last of the set', function(){
				var collection = (new App.extensions.collections.articles()).setTag('example-tag');
				collection.add(initialResponse);

				var inputModel = collection.findWhere({ID : '00005'});
				var previousModel = collection.getNextModel(inputModel);

				expect(!!previousModel).toBe(false);

			});

			it('should take a model and return false if that model is not in it\'s set', function(){
				var collection = (new App.extensions.collections.articles()).setTag('example-tag');
				collection.add(initialResponse);

				var inputModel1 = collection.findWhere({ID : '00000'});
				var inputModel2 = collection.findWhere({ID : '00006'});
				var inputModel3 = collection.findWhere({ID : '12345'});

				expect(!!collection.getPrevModel(inputModel1)).toBe(false);
				expect(!!collection.getNextModel(inputModel1)).toBe(false);

				expect(!!collection.getPrevModel(inputModel2)).toBe(false);
				expect(!!collection.getNextModel(inputModel2)).toBe(false);

				expect(!!collection.getPrevModel(inputModel3)).toBe(false);
				expect(!!collection.getNextModel(inputModel3)).toBe(false);

			});	
			
		});

	});
});

