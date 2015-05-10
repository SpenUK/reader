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

		it('should create and cache a new collection when a tag is given on the "articles" route', function(){
			App.router.trigger('route:articles', 'example-tag');
			expect(App.collections['example-tag']).toBeDefined();

			App.router.trigger('route:articles', 'another-example-tag');

			expect(App.collections['example-tag']).toBeDefined();
			expect(App.collections['another-example-tag']).toBeDefined();
		});

		it('should create and cache a new collection when a tag is given on the "article" route', function(){
			App.router.trigger('route:article', 'example-tag', 'example-article-slug');
			expect(App.collections['example-tag']).toBeDefined();

			App.router.trigger('route:article', 'example-tag', 'another-example-article-slug');

			expect(App.collections['example-tag']).toBeDefined();
			expect(App.collections['another-example-tag']).toBeDefined();
		});

		it('should create and cache a new view when a tag is given on the "articles" route', function(){
			App.router.trigger('route:articles', 'example-tag');
			expect(App.collections['example-tag']).toBeDefined();

			App.router.trigger('route:articles', 'another-example-tag');

			expect(App.collections['example-tag']).toBeDefined();
			expect(App.collections['another-example-tag']).toBeDefined();
		});

		it('should create and cache a new view when a tag is given on the "article" route', function(){
			App.router.trigger('route:article', 'example-tag', 'example-article-slug');
			expect(App.views['example-tag:example-article-slug']).toBeDefined();

			App.router.trigger('route:article', 'example-tag', 'another-example-article-slug');
			expect(App.views['example-tag:example-article-slug']).toBeDefined();
			expect(App.views['example-tag:another-example-article-slug']).toBeDefined();
		});
		
	});
});