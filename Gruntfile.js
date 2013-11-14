/*global module:false*/

module.exports = function (grunt) {
    "use strict";

    var init = {
        dir: {
            bower_components:  grunt.file.readJSON('.bowerrc').directory + "/",
            prod:              'dist/',
            source:            'src/'
        },
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            default: {
                files: {
                    '<%= dir.prod %>backbone.includes.min.js': ['<%= dir.source %>backbone.includes.js']
                }
            }
        },

        jshint: {
            jshintrc: ".jshintrc"
        },

        clean: {
            src: ['<%= dir.prod %>']
        },

        qunit: {
            all: ['test/*.html']
        }
    };

    // Project configuration.
    grunt.initConfig(init);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    /** default includes: compiling js templates, 
     *                    compiling/concating js files with requirejs
     *                    compiling less files
     *
     * default task is ran like this: $ grunt
     */
    grunt.registerTask('default', ['clean', 'uglify']);

    /**
     * task includes: using jshint to lint js files
     *                using less to lint less files
     *
     * default task is ran like this: $ grunt lint-project
     */
    grunt.registerTask('lint-project', ['jshint']);

};
