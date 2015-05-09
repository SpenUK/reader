'use strict';

module.exports = function (grunt) {
  
  // Loading tasks Manually
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    test: 'test',
    jsfolder: '/js',
    sassfolder: '/styles/sass',
    cssfolder: '/styles/css',
  };

  grunt.initConfig({

    // Referencing globally defined configurable paths
    config: config,

    watch: {

      js: {
        files: ['<%= config.app %><% config.jsfolder %>/**/*.js'],
        tasks: ['browserify:server', 'jshint'],
        options: {
          livereload: true
        }
      },

      css: {
        files: ['<%= config.app %><% config.cssfolder %>/**/*.css'],
        options: {
          livereload: true
        }
      },

      gruntfile: {
        files: ['gruntfile.js']
      },

      hbs: {
        files: [
          '<%= config.app %>/templates/**/*.hbs', 
          '<%= config.app %>/templates/{,*/}*.handlebars'
        ],
        tasks: ['handlebars', 'concat:templates']
      },

      tests: {
        files: [
          '<%= config.test %>/**/*.js',
          '!<%= config.test %>/specs/spec-bundle.js'
        ],
        tasks: ['export', 'browserify:tests', 'jasmine']
      },

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    }, // watch end

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        base: 'app',
        hostname: 'localhost'
      },
      livereload: {
        options: {
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }

    }, // end connect (server)

    // Empties folders to start fresh
    clean: {
      dist: {
        options: {
          force: true
        },
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'gruntfile.js',
        '<%= config.app %>/js/**/*.js',
        '<%= config.app %>/js/{,*/}*.js',
        '!<%= config.app %>/js/vendor/**/*.*',
        '!<%= config.app %>/js/bundle.js',
        '!<%= config.app %>/js/templates.js' 
      ]
    }, 
    // lint end

    handlebars: {
        all: {
          options: {
            processName: function(filePath) {
              return filePath.replace('app/', '').replace('templates/', '').replace('modules/', '').replace('.hbs', '');
            },
            // wrapped: false
          },
          files: {
            '<%= config.app %>/js/templates.js': ['app/templates/**/*.hbs']
          } 
        }
    }, // handlbars end

    concat: {
      templates: {
        files: {

          '<%= config.app %>/js/templates.js': ['<%= config.app %>/js/templates.js', '<%= config.app %>/js/handlebars-helpers.js'],
        },
        options: {
            // relative path is rubbish - but will do for now.
          banner: 'var exports = (function () { \n\n var Handlebars = window.Handlebars; \n\n',
          footer: '\n return this[\'JST\'];\n})();\n\nmodule.exports = exports;'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            'images/**/*.*',
            '*.{ico,png,jpg,txt}',
            'CNAME',
            '*.{eot,svg,ttf,woff,otf}',
            'index.html',
            '{,*/}*.html',
            '!html/**/*.*',
            'assets/**/*.*',
            // 'js/**/*.js',
            'js/vendor/*.js',
            'js/bundle.js',
            'styles/**/*.css',
            'styles/fonts/{,*/}*.*',
            'styles/css/vendor/font-awesome-4.3.0/**/*.*'

          ]}
        ]
      }
    },

    jasmine: {
      sources: {
        src: '<%= config.dist %>/js/**/*.js'
      },
      options: {
        specs: ['test/specs/spec-bundle.js'],
        // helpers: 'helpers/*.js',
        vendor: [
          '<%= config.dist %>/js/vendor/jquery-1.11.2.min.js',
          '<%= config.dist %>/js/vendor/underscore.js',
          '<%= config.dist %>/js/vendor/backbone.js',
          '<%= config.dist %>/js/vendor/handlebars.js'
        
        ],
        timeout: 10000
      }
    },

    browserify: {
      server: {
        options: {
          browserifyOptions: {
             debug: true
          }
        },
        files: {
          '<%= config.app %>/js/bundle.js': ['<%= config.app %>/js/main.js'],
        }
      },
      dist: {
        files: {
          '<%= config.dist %>/js/bundle.js': ['<%= config.app %>/js/main.js'],
        }
      },
      tests: {
        files: {
          '<%= config.test %>/specs/spec-bundle.js': ['<%= config.test %>/local.js'],
        }
      },
      // serviceTests: {
      //   files: {
      //     '<%= config.test %>/specs/spec-bundle.js': ['<%= config.test %>/service.js'],
      //   }
      // }
    }

  });

  grunt.registerTask('serve', 'Start the front-end server', function(target){
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jshint',
      'connect:livereload',
      'watch'
    ]);
  }); // serve task end

  grunt.registerTask('build', [
    'clean:dist',
    'cssmin',
    'uglify',
    'copy:dist'
  ]);

  grunt.registerTask('export', [
    'clean:dist',
    'copy:dist'
  ]);

  grunt.registerTask('test', [
    'export', 
    'browserify:tests', 
    'jasmine'
  ]);

  grunt.registerTask('publish', [
    'test',
    'gh-pages'
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);

};