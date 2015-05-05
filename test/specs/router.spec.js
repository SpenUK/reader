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