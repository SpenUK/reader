(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function randomID (length) {
	var a = new Array(length);

	for (var i = a.length - 1; i >= 0; i--) {
		a[i] = Math.floor(Math.random() * 9.99);
	};

	return a.join('');
};

function generateRecord (options) {
	options = (options || {});
	var ID = options.ID ? options.ID : randomID(4);

	return {
		'ID': ID,
		'title' : 'example title',
		'slug' : 'example slug',
		'global_ID' : ID
		// More fields should be added as needed for testing
	};
};

function generateRecords (options) {
	options = (options || {random: true, count: 20});
	var a;
	if (options.IDs) {
		a = options.IDs.map(function(ID){
			return generateRecord({ID: ID});
		});
	} else {
		a = new Array(options.count);

		for (var i = a.length - 1; i >= 0; i--) {
			a[i] = generateRecord({random: true});
		};
	};

	return a;
};

module.exports = {
	random: function (n) {
		var records = generateRecords({count: n, random: true});

		return {
			"date_range":{
				"before":"2015-04-17T11:12:02+00:00",
				"after":"2015-03-28T19:08:12-04:00"
			},
			"number":10,
			'posts': records
		};
	},
	withIDs: function (IDs) {
		var records = generateRecords({IDs: IDs});

		return {
			"date_range":{
				"before":"2015-04-17T11:12:02+00:00",
				"after":"2015-03-28T19:08:12-04:00"
			},
			"number":10,
			'posts': records
		};
	},
	generateRecord: generateRecord,
	generateRecords: generateRecords
};
},{}],2:[function(require,module,exports){
require('./specs/router.spec.js');
require('./specs/models.spec.js');
require('./specs/collections.spec.js');
// require('./specs/views.spec.js');
},{"./specs/collections.spec.js":3,"./specs/models.spec.js":4,"./specs/router.spec.js":5}],3:[function(require,module,exports){
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


},{"../helpers/articleMocker.js":1}],4:[function(require,module,exports){
// describe('Models', function(){

// 	describe('Article model', function(){
		
// 	});
// });
},{}],5:[function(require,module,exports){
describe('Routes', function(){

	describe('App Router', function(){

		it('should route to "root" when no path is supplied', function(){
			expect(App.router.routes['']).toEqual('root');
		});

		it('should route to "articles" when one path segment is supplied', function(){
			expect(App.router.routes[':tag']).toEqual('articles');
		});

		it('should route to "article" when a second path segment is supplied', function(){
			expect(App.router.routes[':tag/:slug']).toEqual('article');
		});
		
	});
});
},{}]},{},[2]);
