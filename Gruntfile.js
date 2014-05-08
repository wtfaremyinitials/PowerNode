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
        },
        clean: {
            hooks: ['.git/hooks/pre-commit']
        },
        shell: {
            hooks: {
                command: 'cp git-hooks/pre-commit .git/hooks/'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    // Tasks
    grunt.registerTask('default', []);
    grunt.registerTask('test', ['jshint', 'nodeunit']);
    grunt.registerTask('setup', ['clean:hooks'], ['shell:hooks']);
};
