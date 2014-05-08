module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint : {
            files: ['Gruntfile.js', 'powernode.js'],
            options: {
                globals: {
                    console: true,
                    module: true
                }
            }
        },
        nodeunit: {
            all: ['test/*.js'],
            options: {
                reporter: 'junit',
                reporterOptions: {
                    output: 'outputdir'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'nodeunit']);
};
