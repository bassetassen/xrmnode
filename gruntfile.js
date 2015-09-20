module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true
      },
      all: {
      	files: {
          src: ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
        }
      }
  	},

    mochaTest: {
      options: {
        reporter: 'dot'
      },
      unit: {
        src: ['test/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: ['lib/**/*.js', 'test/**/*.js'],
        tasks: [ 'jshint', 'mochaTest' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
