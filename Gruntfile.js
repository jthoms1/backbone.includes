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

        /**
         * Copy files into the production directory for use when published
         * - Will not copy css, js, templates because they are handled in other tasks
         */
        copy: {
            options: {
                basePath: "."
            },
            files: [
                {expand: true, cwd: '<%= dir.source %>', src: 'images/*', dest: '<%= dir.prod %>assets/'},
                {expand: true, cwd: '<%= dir.bower_components %>bootstrap/', src: 'fonts/*', dest: '<%= dir.prod %>'}
            ]
        },

        clean: {
            prod: {
                src: ['<%= dir.prod %>']
            }
        },

        notify: {
            watch: {
                options: {
                    message: 'Build successful'
                }
            }
        }
    };

    // Project configuration.
    grunt.initConfig(init);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-notify');

    /** default includes: compiling js templates, 
     *                    compiling/concating js files with requirejs
     *                    compiling less files
     *
     * default task is ran like this: $ grunt
     */
    grunt.registerTask('default', ['clean:prod', 'copy:prod']);

    /**
     * task includes: using jshint to lint js files
     *                using less to lint less files
     *
     * default task is ran like this: $ grunt lint-project
     */
    grunt.registerTask('lint-project', ['jshint']);

};
