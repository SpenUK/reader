'use strict';

var model = require('../models/article.js');

module.exports = window.Backbone.Collection.extend({

  model: model,
  isLoading: false,
  tag: 'web-development',
  // initialize: function (options) {
  //  var collection = this;
  // 	options = (options || {});
  // },
  url: function(){
    return 'https://public-api.wordpress.com/rest/v1.1/read/tags/'+ this.tag +'/posts';
  },
  parse: function(response){
    return response.posts;
  }
});