# WP Reader
Displays recent blog posts from wordpress by tag

### Uses:
* Wordpress REST API for resources
* Backbone for handling routes, views, models etc.
* Handlebars for templating
* Grunt for build tasks
* Browserify for composing the final JS bundle
* Jasmine for tests

## Running Locally
Assuming the dependancies are installed (Node, NPM, Grunt CLI) the app can be ran locally using the 'grunt serve' command after cloning.

## Build
The app can be built using the 'grunt export' command.
This will bundle the app out into the 'dist' directory - from there the app will word by opening 'index.html'.

## Publishing
If a remote git repository is configured at GitHub the exported app can be pushed to a 'gh-pages' branch (and thus served on GitHub) using the 'grunt publish' command.
This command will first run a number of tests and will not push live if any of those tests fail.

## Testing
Some basic testing is in place using Jasmine.

### Still to do:
* Improve the way the header's state is handled, currently the '<' & '>' buttons do not hide when routing away from the article view (which they should).
* Add a 'search' function
* Improve article content styling, this is all third party and as such the content & it's inline styling is more difficult to reliably style.

### Nice to haves:
* 'Zen mode' article reading (continous, distraction free scrolling with minimalist styling at full screen).