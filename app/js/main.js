'use strict';

require('./app.js');

console.log('main');

$(document).on('ready', function(){
	global.App.initialize();
});