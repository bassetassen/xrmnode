module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    
    jshint: {
      options: {
        curly: true,
        globals: {
        },
        node: true,
        strict: true,
      },
    	files: {
        src: ['gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
      }
  	},
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};