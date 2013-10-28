/*
 * grunt-clowncar
 * https://github.com/shiawuen/grunt-clowncar
 *
 * Copyright (c) 2013 Tan Shiaw Uen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    clowncar: {
      default_options: {
        files: { 'tmp/default_options/grunt.svg' : 'test/fixtures/grunt.jpg' },
      },
      custom_options: {
        options: {
          sizes: [50, 100]
        , quality: 75
        },
        files: { 'tmp/custom_options/grunt.svg' : 'test/fixtures/grunt.jpg' },
      },
      percent_sizes: {
        options: {
          sizes: ['50%', '45%']
        , quality: 75
        },
        files: { 'tmp/percent_sizes/grunt.svg' : 'test/fixtures/grunt.jpg'}
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'clowncar', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
