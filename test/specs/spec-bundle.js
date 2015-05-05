(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./specs/router.spec.js');
},{"./specs/router.spec.js":2}],2:[function(require,module,exports){
describe('Routes', function(){

	describe('App Router', function(){

		console.log(window.App);
		// var router = App.router;

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
},{}]},{},[1]);
